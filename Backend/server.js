import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || 'gemini-1.5-flash,gemini-1.5-flash-8b')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const GENERATION_MAX_RETRIES = Number(process.env.GENERATION_MAX_RETRIES || 3);
const RETRY_BASE_DELAY_MS = Number(process.env.RETRY_BASE_DELAY_MS || 1200);
const recentGenerationCache = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createPromptFingerprint(prompt) {
  return crypto.createHash('sha256').update(String(prompt || '')).digest('hex');
}

function isRetryableProviderStatus(status) {
  return status === 429 || status === 503;
}

function buildModelSequence() {
  return Array.from(new Set([MODEL_NAME, ...FALLBACK_MODELS]));
}

function setCache(prompt, html) {
  const key = createPromptFingerprint(prompt);
  recentGenerationCache.set(key, {
    html,
    createdAt: Date.now(),
  });

  // Keep cache bounded in memory.
  if (recentGenerationCache.size > 100) {
    const oldestKey = recentGenerationCache.keys().next().value;
    if (oldestKey) recentGenerationCache.delete(oldestKey);
  }
}

function getCache(prompt) {
  const key = createPromptFingerprint(prompt);
  return recentGenerationCache.get(key) || null;
}

async function generateHtmlWithRetries(genAIClient, systemPrompt) {
  const models = buildModelSequence();
  let lastError = null;

  for (const modelName of models) {
    const model = genAIClient.getGenerativeModel({ model: modelName });

    for (let attempt = 1; attempt <= GENERATION_MAX_RETRIES; attempt += 1) {
      try {
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const html = response.text().replace(/```(html|jsx|javascript|js)\n?|```/g, '').trim();
        return { html, modelName };
      } catch (error) {
        lastError = error;
        const status = Number(error?.status) || 500;

        if (!isRetryableProviderStatus(status)) {
          throw error;
        }

        if (attempt < GENERATION_MAX_RETRIES) {
          const jitter = Math.floor(Math.random() * 250);
          const delay = RETRY_BASE_DELAY_MS * attempt + jitter;
          await sleep(delay);
        }
      }
    }
  }

  throw lastError || new Error('Generation failed after retries.');
}

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Generative AI client
const apiKey = process.env.API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// API endpoint to generate code
app.post('/api/generate', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({
        error: 'Missing API_KEY. Add a valid Google AI Studio key to Backend/.env and restart the backend.',
      });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // This prompt is a core part of the "no-code" solution.
    // It instructs the AI to generate a complete website without user code.
    const systemPrompt = `You are a professional web developer. A non-technical user wants to create a simple, modern, and responsive website. Based on their high-level description, generate a complete HTML file with embedded CSS (Tailwind CSS via CDN) and JavaScript. Do not include any external dependencies, imports, or boilerplate. The output should be a single HTML file that can be immediately opened in a browser. The user's request is: "${prompt}"`;

    try {
      const generated = await generateHtmlWithRetries(genAI, systemPrompt);
      setCache(prompt, generated.html);
      return res.json({ html: generated.html, model: generated.modelName });
    } catch (generationError) {
      const status = Number(generationError?.status) || 500;
      if (status === 429 || status === 503) {
        const cached = getCache(prompt);
        if (cached) {
          return res.json({
            html: cached.html,
            stale: true,
            message: 'Using a cached version while the AI provider is rate-limited.',
          });
        }
      }

      throw generationError;
    }

  } catch (error) {
    const status = Number(error?.status) || 500;
    const message = String(error?.message || 'Unknown AI provider error');
    const redactedMessage = message.replace(/api_key:[^\s'"\]}]+/g, 'api_key:[REDACTED]');

    let safeClientError = 'Failed to generate website from AI.';

    if (status === 403 && /CONSUMER_SUSPENDED|Permission denied/i.test(message)) {
      safeClientError = 'AI provider rejected your API key. Replace API_KEY in Backend/.env with an active key and restart the backend.';
    } else if (status === 401) {
      safeClientError = 'AI provider rejected your API key. Check API_KEY in Backend/.env and restart the backend.';
    } else if (status === 429) {
      safeClientError = 'AI provider rate limit reached. Please retry in a moment.';
    }

    // Avoid logging full provider error payloads that may include sensitive details.
    console.error('AI Generation Error:', {
      status,
      statusText: error?.statusText,
      message: redactedMessage,
    });

    res.status(500).json({ error: safeClientError });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});

