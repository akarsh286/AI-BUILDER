<div align="center">

# 🤖 AI Builder

### *Zero to Launch — Full-Stack Websites from a Single Sentence*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br/>

> **Describe your dream website. Watch it build itself.**
> AI Builder turns plain-English prompts into complete, production-ready HTML/CSS/JS websites — no coding required.

</div>

---

## ✨ What is AI Builder?

AI Builder is a **no-code, AI-powered web application** that lets anyone — developers, designers, or first-time founders — generate a fully functional website in seconds by simply describing what they want. Powered by **Google Gemini 2.0 Flash**, it synthesises clean, responsive HTML with embedded Tailwind CSS and JavaScript, then renders a live preview right in the browser.

No templates. No drag-and-drop limitations. Just describe it and ship it.

---

## 🚀 Key Features

| Feature | Description |
|---|---|
| ✏️ **Prompt-to-Website** | Type a natural-language description and receive a complete, self-contained HTML page in seconds |
| 👁️ **Live Preview** | Instantly see and interact with the generated website inside a sandboxed iframe — no download needed |
| 🎨 **Responsive & Modern** | Every generated site uses Tailwind CSS via CDN, so it looks great on any device |
| 🚀 **One-Click Deploy** | Integrated deployment pipeline to push directly to Vercel *(coming soon)* |
| 🧭 **Project Dashboard** | Manage your generated projects, browse templates, and track analytics |
| 📱 **Mobile-Friendly UI** | Fully responsive sidebar and layout, optimised for all screen sizes |
| 🔮 **Extensible Architecture** | Modular React components and a clean Express API make it easy to extend |

---

## 🛠️ Tech Stack

### Frontend
- **[React 19](https://react.dev/)** — Component-based UI
- **[Vite 7](https://vite.dev/)** — Lightning-fast dev server & bundler
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first styling
- **[React Icons](https://react-icons.github.io/react-icons/)** — Icon library

### Backend
- **[Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/)** — REST API server
- **[Google Generative AI SDK](https://ai.google.dev/)** — Gemini 2.0 Flash for code synthesis
- **[dotenv](https://github.com/motdotla/dotenv)** — Environment variable management

### Infrastructure
- **[Vercel](https://vercel.com/)** — Hosting & serverless deployment

---

## 📸 Screenshots

> *Add a screenshot or GIF demo here to bring the README to life!*
> Example: `![AI Builder Demo](./docs/demo.gif)`

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) **v18+**
- [npm](https://www.npmjs.com/) **v9+**
- A **[Google AI Studio](https://aistudio.google.com/)** API key (free tier available)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/akarsh286/AI-BUILDER.git
cd AI-BUILDER
```

**2. Install Backend dependencies**

```bash
cd Backend
npm install
```

**3. Install Frontend dependencies**

```bash
cd ../Frontend
npm install
```

---

### Environment Variables

Create a `.env` file inside the `Backend/` directory:

```env
# Backend/.env
API_KEY=your_google_gemini_api_key_here
PORT=3001
```

> 🔑 Get your free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

---

### Running Locally

**Start the Backend server** (in one terminal):

```bash
cd Backend
node server.js
# ✅ Server is listening on http://localhost:3001
```

**Start the Frontend dev server** (in another terminal):

```bash
cd Frontend
npm run dev
# ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser and start building! 🎉

---

## 📁 Project Structure

```
AI-BUILDER/
├── Backend/
│   ├── server.js          # Express API — handles /api/generate
│   └── .env               # Environment variables (not committed)
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UIGenerator.jsx   # Main prompt form + live preview
│   │   │   ├── Preview.jsx       # Sandboxed iframe renderer
│   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   └── DeployButton.jsx  # Deploy action (coming soon)
│   │   ├── App.jsx               # Root layout & routing
│   │   └── main.jsx              # React entry point
│   ├── vite.config.js
│   └── package.json
│
├── vercel.json            # Vercel deployment config
└── README.md
```

---

## 🔌 API Reference

### `POST /api/generate`

Generates a complete HTML website from a natural-language prompt.

**Request body:**

```json
{
  "prompt": "A dark-themed personal portfolio with a hero section, skills grid, and contact form"
}
```

**Response:**

```json
{
  "html": "<!DOCTYPE html>..."
}
```

**Error response:**

```json
{
  "error": "Prompt is required."
}
```

---

## 🗺️ Roadmap

- [x] Prompt-to-HTML generation with Gemini 2.0 Flash
- [x] Live in-browser preview
- [x] Responsive dashboard UI
- [ ] One-click Vercel deployment
- [ ] Project save & history
- [ ] Custom tag system (`#ecommerce`, `#dashboard`, `#portfolio`)
- [ ] AI chat assistant for iterative refinement
- [ ] Database schema visualiser
- [ ] Role-based access control
- [ ] Extension marketplace

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a **Pull Request**

Please open an [issue](https://github.com/akarsh286/AI-BUILDER/issues) first for major changes to discuss what you'd like to change.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by [akarsh286](https://github.com/akarsh286)

⭐ **Star this repo** if AI Builder saved you time or inspired you!

</div>
