import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

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

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // This prompt is a core part of the "no-code" solution.
    // It instructs the AI to generate a complete website without user code.
    const systemPrompt = `You are a professional web developer. A non-technical user wants to create a simple, modern, and responsive website. Based on their high-level description, generate a complete HTML file with embedded CSS (Tailwind CSS via CDN) and JavaScript. Do not include any external dependencies, imports, or boilerplate. The output should be a single HTML file that can be immediately opened in a browser. The user's request is: "${prompt}"`;
    
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const generatedHtml = response.text().replace(/```(html|jsx|javascript|js)\n?|```/g, '').trim();

    res.json({ html: generatedHtml });

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
