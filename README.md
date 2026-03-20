# 🎯 PreApply v2 — AI Job Analyzer (Next.js Edition)

A modern, production-ready web application to analyze CVs against job descriptions using Google Gemini AI. 

[**Try the Live App Here**](https://preapply.vercel.app)

This project is a massive upgrade from V1, transitioning from a Python script to a full-fledged SaaS architecture using Next.js 16. It focuses on using Large Language Models (LLM) with strict JSON output parsing to perform gap analysis, provide actionable insights, and generate tailored content using the STAR method.

### 🚀 Key Features

* **📊 Smart Gap Analysis:** Instantly scores CV relevance based on ATS keywords and identifies missing skills.
* **✨ CV Improvement (STAR Method):** Critiques weak experience bullets and rewrites them into impactful, data-driven achievements.
* **✉️ Cover Letter Draft:** Generates a ready-to-send, highly tailored cover letter based on the specific job type (Full-time, Internship, etc.).
* **🛡️ Enterprise-Grade Reliability:** Implements strict backend validation, type-safe API routing, and AI hallucination mitigation via robust JSON parsing.

### 🌟 Additional Feature (DevOps & Engineering)

* **🤖 CI/CD & AI Code Review:** This repository is integrated with a professional Git Flow. It uses **GitHub Actions** for automated Unit Testing (Vitest) and Linting (ESLint 9) on every Pull Request. It is also guarded by **CodeRabbit AI** for automated code reviews and PR summarization.

### 🛠️ Tech Stack

* **Frontend & Backend:** Next.js 16 (App Router, API Routes)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **AI Engine:** Google Gemini 2.5 Flash (`@google/generative-ai`)
* **Testing & Quality:** Vitest, ESLint (Flat Config)
* **Deployment:** Vercel

### 📦 How to Run Locally

**1. Clone the repository**
```bash
git clone https://github.com/albinurrosif/nextjs-gemini-cv-reviewer.git
cd nextjs-gemini-cv-reviewer
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup Secrets** Create a `.env.local` file in the root directory:
```bash
# Required for the main feature (Analysis)
GEMINI_API_KEY="YOUR_GOOGLE_API_KEY"
```

**4. Run the App**
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### ⚙️ Engineering Setup (CI/CD & Testing)

To utilize the automated testing and linting locally before pushing to GitHub:

**1. Run Linter:**
Checks for code quality and formatting issues.
```bash
npm run lint
```

**2. Run Unit Tests:**
Ensures the business logic and AI output parsers are working correctly.
```bash
npm run test
```

### 👨‍💻 Author

**Albi Nur Rosif**
[Portfolio](albinur.vercel.app) | [GitHub](https://github.com/albinurrosif) | [LinkedIn](https://www.linkedin.com/in/albi-nur/)

© 2026 PreApply.