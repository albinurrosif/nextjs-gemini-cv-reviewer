# PreApply v2 — AI-Powered CV & ATS Analyzer

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-blue?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Supabase](https://img.shields.io/badge/Supabase-Database_&_Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Rate_Limiter-FF2E54?style=for-the-badge&logo=redis)](https://upstash.com/)

A modern, production-minded web application designed to help job seekers bypass the ATS (Applicant Tracking System) filter. It analyzes CVs, identifies skill gaps against specific job descriptions, and rewrites experiences using the STAR method—all powered by Google Gemini AI.

[**✨ Try the Live App Here**](https://preapply.vercel.app)

_(Note: This is a major architectural upgrade from V1, transitioning from a simple Python script into a full-stack Next.js web application with a focus on System Design, CI/CD, and robust error handling)._

---

## 🚀 Key Features

- **📊 Dual-Mode Analysis:** \* **General ATS Check:** Audits your CV format, highlights strengths, and rewrites the entire document into an ATS-friendly Markdown format.
  - **Targeted Match Analyzer:** Compares your CV against a specific Job Description to find missing keywords and generate a tailored Cover Letter.
- **🪄 Magic Bullets (STAR Method):** The AI scans for the weakest bullet points in your CV, roasts them (constructively!), and rewrites them using the data-driven STAR (Situation, Task, Action, Result) method.
- **🎤 Smart Interview Prep:** Generates behavioral and "trap" interview questions based on the gaps found in your CV, complete with HR reasoning and sample answers.
- **🔐 Profile Vault & Guest Mode:** Sign in via Google OAuth (Supabase) to save your master CV. Not logged in? The app uses smart LocalStorage to save your history and syncs it automatically once you sign in.

---

## 🧠 System Design & Engineering Highlights

As a side project built with scalability in mind, PreApply V2 implements several industry-standard architectural patterns:

- **🛡️ Fail-Open Rate Limiting:** Protected AI endpoints using Upstash Redis (Max 3 req/min). Implemented a fail-open strategy so the app remains functional even if the Redis server goes down, preventing a Single Point of Failure (SPOF).
- **🛑 Graceful AI Fallbacks:** LLMs can hallucinate. The Scorer Service uses strict Type-Safe parsing to catch malformed JSONs or plain text responses from Gemini, falling back to safe default values without crashing the UI.
- **⏱️ Request Timeouts:** Implemented AbortController on Gemini API calls to sever connections exceeding 45 seconds, preventing infinite loading and Vercel serverless function timeouts.
- **🤖 Automated QA & AI Code Review:** Enforced Git Flow with GitHub Actions. Every PR is checked by Vitest (Unit Tests), ESLint (Flat Config), and reviewed by CodeRabbit AI before merging.
- **📈 SEO & Analytics:** Fully optimized with dynamic sitemap.ts, robots.ts, and privacy-first tracking via Vercel Web Analytics.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS, Shadcn UI, Framer Motion
- **Backend:** Next.js API Routes, Prisma ORM
- **Database & Auth:** Supabase (PostgreSQL, Google OAuth)
- **AI Engine:** Google Gemini 2.5 Flash (@google/generative-ai)
- **Utilities:** react-pdftotext (Client-side PDF parsing to reduce server load)

---

## 📦 How to Run Locally

Want to test it out on your machine? Follow these steps:

**1. Clone the repository**

```bash
git clone https://github.com/albinurrosif/nextjs-gemini-cv-reviewer.git
cd nextjs-gemini-cv-reviewer
```

**2. Install dependencies**

```bash
npm install
```

**3. Setup Environment Variables (Create a .env.local file in the root directory)**
```env
# [REQUIRED] AI Engine
GEMINI_API_KEY="your_google_gemini_api_key"

# [REQUIRED] Database & Auth
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
DATABASE_URL="your_prisma_postgres_url"
DIRECT_URL="your_prisma_direct_url"

# [OPTIONAL] Rate Limiter (The app will bypass this if left empty)
UPSTASH_REDIS_REST_URL="your_upstash_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"
```

**4. Run Prisma Generate & Start the App**

```bash
   npx prisma generate
   npm run dev
```

Open http://localhost:3000 in your browser.

---

## 👨‍💻 Author

**Albi Nur Rosif**
[Portfolio](https://albinur.vercel.app) | [GitHub](https://github.com/albinurrosif) | [LinkedIn](https://www.linkedin.com/in/albi-nur/)

_Built with excessive amounts of coffee. © 2026 PreApply._

---
