// lib/ai/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Kita ambil API Key dari environment variable (.env)
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeCV(jobData: any, cvText: string) {
  // Menggunakan model yang sama dengan versi Python kamu
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Prompt dasar (Nanti di Phase 3 kita akan buat ini lebih canggih dengan Evaluator)
  const prompt = `
    Role: Expert Recruiter & CV Writer.
    Target Role: ${jobData.role} at ${jobData.company} (${jobData.jobType}).

    JOB DESCRIPTION:
    "${jobData.jobDescription}"

    CANDIDATE CV:
    "${cvText}"

    TASK:
    Analyze the CV against the job description and provide a brief gap analysis and match score.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate AI response');
  }
}
