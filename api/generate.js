import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `You are a professional web developer. A non-technical user wants to create a simple, modern, and responsive website. Based on their high-level description, generate a complete HTML file with embedded CSS (Tailwind CSS via CDN) and JavaScript. Do not include any external dependencies, imports, or boilerplate. The output should be a single HTML file that can be immediately opened in a browser. The user's request is: "${prompt}"`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const generatedHtml = response.text().replace(/```(html|jsx|javascript|js)\n?|```/g, '').trim();

    res.status(200).json({ html: generatedHtml });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate website from AI." });
  }
}
