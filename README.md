# 🔍 ErrorLens AI

> **Instant, intelligent debugging assistant powered by Gemini AI and heuristic analysis.**  
> Transform cryptic stack traces, compiler errors, and runtime crashes into crystal-clear explanations and step-by-step code fixes.

[![Live Demo](https://img.shields.io/badge/Live_Demo-error--lens--ai.vercel.app-00dfa2?style=for-the-badge&logo=vercel&logoColor=white)](https://error-lens-ai.vercel.app/)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%26_Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285f4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🌐 Live Deployment

🚀 **Try it live here:** **[https://error-lens-ai.vercel.app/](https://error-lens-ai.vercel.app/)**

---

## 📸 Overview

Debugging complex compiler errors, stack traces, and framework warnings can consume hours of developer time. **ErrorLens AI** simplifies this process: paste any error log or snippet, and receive an instant breakdown of:
- **Root Cause Analysis**: What actually went wrong in plain, developer-friendly language.
- **Fixed Code & Diff**: Ready-to-copy code corrections tailored to your snippet.
- **Actionable Steps**: Bulletproof prevention tips and best practices.
- **Interactive Follow-Up**: Ask contextual questions and chat directly about the diagnosed error.

---

## ✨ Features

- 🧠 **Dual-Engine Diagnosis**:
  - **Gemini AI Engine**: High-accuracy, contextual reasoning powered by Google Gemini.
  - **Heuristic Rule Engine**: Instant offline fallback detecting dozens of common patterns across JS/TS, Python, Rust, Go, Java, and SQL.
- 🎯 **Automatic Language & Framework Detection**: Detects JavaScript, TypeScript, Python, C/C++, Java, Go, Rust, React, Next.js, and more from error traces.
- 🔑 **Bring Your Own Key (BYOK)**: Add your own Gemini API key in the UI for higher rate limits, or use the pre-configured server backend.
- 💬 **Interactive Follow-up Chat**: Dive deeper into specific lines, request alternative solutions, or ask how to reproduce and test the fix.
- 🕒 **Persistent History**: Saves past diagnoses locally in your browser so you never lose previous debugging sessions.
- ⚡ **Preset Error Playground**: Jump right in with pre-loaded real-world errors (Null pointers, CORS errors, React hooks violations, async/await pitfalls).
- 🎨 **Modern Developer UI**: Clean glassmorphism styling, syntax-highlighted code blocks, one-click copy buttons, and responsive layout built with Vite & Lucide icons.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 with Vite
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Custom Design System with Glassmorphism & Dark Mode)

### **Backend**
- **Runtime**: Node.js & Express
- **AI Integration**: `@google/generative-ai` (Google Gemini API)
- **Deployment & Serverless**: Vercel Serverless Functions (`/api` handler)

---

## 📁 Project Structure

```text
errorlens-ai/
├── api/                  # Vercel Serverless Function entry point
│   └── index.js          # Express app wrapper for Vercel
├── client/               # Frontend React Application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Modular UI components (ApiKeyModal, DiagnosisView, etc.)
│   │   ├── utils/        # Helper utilities & API callers
│   │   ├── App.jsx       # Main application component
│   │   ├── index.css     # Global theme & typography styles
│   │   └── main.jsx      # React DOM entry
│   ├── index.html        # HTML template
│   ├── package.json      # Client dependencies
│   └── vite.config.js    # Vite configuration & dev proxy
├── server/               # Local Express Backend
│   ├── routes/           # API routes (/api/explain, /api/health)
│   ├── services/         # Heuristic engine, AI service & pattern matchers
│   ├── app.js            # Express application setup & middleware
│   └── index.js          # Local server runner (port 5000)
├── vercel.json           # Vercel deployment routing configuration
├── package.json          # Root orchestration scripts & server dependencies
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- A **Google Gemini API Key** (optional if using local heuristics, get one free at [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/errorlens-ai.git
cd errorlens-ai
```

### 2. Install Dependencies
Install dependencies for both root (backend) and client:

```bash
# Install root/backend dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 3. Set Up Environment Variables (Optional)
Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```
> *Note: Users can also supply their own Gemini API key directly in the web app UI.*

### 4. Run Locally
Run both client and server concurrently with a single command:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

Alternatively, run them in separate terminals:
```bash
# Terminal 1 - Backend Server
npm run dev:server

# Terminal 2 - Frontend Client
npm run dev:client
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

