// lib/ai/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

import { parseAndEvaluateAIOutput, EvaluationResult } from '../evaluation/scorer.service';

// Kita ambil API Key dari environment variable (.env)
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeCV(jobData: any, cvText: string): Promise<EvaluationResult> {
  // =================================================================
  // 🛑 MODE PENGEMBANGAN (MOCKING) - MENGHEMAT QUOTA API
  // =================================================================

  // Kita simpan JSON sempurna yang kamu dapatkan tadi di dalam variabel
  const mockRawText = `{
    "matchScore": 72,
    "strengths": [
      "Keahlian JavaScript/TypeScript yang kuat, terbukti dari implementasi proyek KumpuLink.",
      "Portofolio proyek mandiri yang solid, mencakup pengembangan full-stack.",
      "Ketertarikan dan pengalaman langsung dengan AI tools melalui proyek PreApply."
    ],
    "missingSkills": [
      "Software testing practices",
      "Performance analysis",
      "Test case development"
    ],
    "tailoredSummary": "Lulusan Teknik Informatika dengan fokus pada pengembangan web full-stack, memiliki fondasi kuat dalam membangun RESTful APIs...",
    "tailoredExperiences": [
      {
        "name": "PT. PAL Indonesia",
        "role": "Academic Intern",
        "bullets": [
          "Berkoordinasi dengan tim operasional untuk memastikan alur kerja lancar.",
          "Mengembangkan prototipe sistem pelacakan inventaris menggunakan React."
        ]
      }
    ],
    "tailoredProjects": [
      {
        "name": "KumpuLink",
        "role": "Next.js, PostgreSQL",
        "bullets": [
          "Mengembangkan platform manajemen tautan menggunakan Next.js."
        ]
      }
    ]
  }`;

  // Langsung kembalikan mock data ini (seolah-olah ini dari AI)
  // Tidak ada kuota API yang terpakai!
  console.log('⚠️ Menggunakan MOCK DATA (Hemat Kuota AI)');
  return parseAndEvaluateAIOutput(mockRawText);

  // const model = genAI.getGenerativeModel({
  //   model: 'gemini-2.5-flash',
  //   generationConfig: {
  //     responseMimeType: 'application/json',
  //   },
  // });

  // // Prompt dasar (Nanti di Phase 3 kita akan buat ini lebih canggih dengan Evaluator)
  // const prompt = `
  //   Role: Expert Tech Recruiter & CV Writer.
  //   Target Role: ${jobData.role} at ${jobData.company} (${jobData.jobType}).

  //   JOB DESCRIPTION:
  //   "${jobData.jobDescription}"

  //   CANDIDATE CV:
  //   "${cvText}"

  //   TASK:
  //   Perform a comprehensive gap analysis and rewrite the CV content to match the Job Description.
  //   DO NOT invent facts or add experiences the candidate does not have.

  //   You MUST respond in STRICT JSON format matching the exact keys below:

  //   {
  //     "matchScore": <number 0-100 based on CV relevance to JD>,
  //     "strengths": [
  //       "<string: Tuliskan 2-3 kekuatan kandidat dalam BAHASA INDONESIA>"
  //     ],
  //     "missingSkills": [
  //       "<string: Tuliskan skill/keyword ATS yang ada di JD tapi TIDAK ADA di CV>"
  //     ],
  //     "tailoredSummary": "<string: Buatkan paragraf 'About Me'/Summary baru yang profesional (Bahasa Inggris/Indo sesuai JD)>",
  //     "tailoredExperiences": [
  //       {
  //         "name": "<string: Nama Perusahaan>",
  //         "role": "<string: Posisi/Jabatan>",
  //         "bullets": [
  //           "<string: Tulis ulang pengalaman menggunakan STAR method & Action Verbs agar relevan dengan loker>"
  //         ]
  //       }
  //     ],
  //     "tailoredProjects": [
  //       {
  //         "name": "<string: Nama Project>",
  //         "role": "<string: Peran atau Tech Stack>",
  //         "bullets": [
  //           "<string: Tulis ulang deskripsi project menggunakan STAR method. Jika CV tidak memiliki project, KOSONGKAN ARRAY INI []>"
  //         ]
  //       }
  //     ]
  //   }
  // `;

  // try {
  //   const result = await model.generateContent(prompt);

  //   const rawText = result.response.text();

  //   const finalResult = parseAndEvaluateAIOutput(rawText);

  //   return finalResult
  // } catch (error) {
  //   console.error('Gemini API Error:', error);
  //   throw new Error('Failed to generate AI response');
  // }
}
