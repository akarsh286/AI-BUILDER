import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// API endpoint to generate code
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // This prompt is a core part of the "no-code" solution.
    // It instructs the AI to generate a complete website without user code.
    const systemPrompt = `You are a professional web developer. A non-technical user wants to create a simple, modern, and responsive website. Based on their high-level description, generate a complete HTML file with embedded CSS (Tailwind CSS via CDN) and JavaScript. Do not include any external dependencies, imports, or boilerplate. The output should be a single HTML file that can be immediately opened in a browser. The user's request is: "${prompt}"`;
    
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const generatedHtml = response.text().replace(/```(html|jsx|javascript|js)\n?|```/g, '').trim();

    res.json({ html: generatedHtml });

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate website from AI." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is listening on http://localhost:${PORT}`);
});
