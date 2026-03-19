import { GoogleGenerativeAI } from '@google/generative-ai';

import { parseAndEvaluateAIOutput, EvaluationResult } from '../evaluation/scorer.service';

// Kita ambil API Key dari environment variable (.env)
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeCV(jobData: any, cvText: string): Promise<EvaluationResult> {
  // =================================================================
  // 🛑 MODE PENGEMBANGAN (MOCKING) - MENGHEMAT QUOTA API
  // =================================================================

  // const mockRawText = `{
  //   "isValidInput": true,
  //   "matchScore": 72,
  //   "strengths": [
  //     "Keahlian JavaScript/TypeScript yang kuat, terbukti dari implementasi proyek KumpuLink.",
  //     "Portofolio proyek mandiri yang solid, mencakup pengembangan full-stack.",
  //     "Ketertarikan dan pengalaman langsung dengan AI tools melalui proyek PreApply."
  //   ],
  //   "missingSkills": [
  //     "Software testing practices",
  //     "Performance analysis",
  //     "Test case development"
  //   ],
  //   "tailoredSummary": "Lulusan Teknik Informatika dengan fokus pada pengembangan web full-stack, memiliki fondasi kuat dalam membangun RESTful APIs...",
  //   "tailoredExperiences": [
  //     {
  //       "name": "PT. PAL Indonesia",
  //       "role": "Academic Intern",
  //       "bullets": [
  //         "Berkoordinasi dengan tim operasional untuk memastikan alur kerja lancar.",
  //         "Mengembangkan prototipe sistem pelacakan inventaris menggunakan React."
  //       ]
  //     }
  //   ],
  //   "tailoredProjects": [
  //     {
  //       "name": "KumpuLink",
  //       "role": "Next.js, PostgreSQL",
  //       "bullets": [
  //         "Mengembangkan platform manajemen tautan menggunakan Next.js."
  //       ]
  //     }
  //   ],
  //   "tailoredProjects": [
  //     {
  //       "name": "KumpuLink",
  //       "role": "Next.js, PostgreSQL",
  //       "bullets": [
  //         "Mengembangkan platform manajemen tautan menggunakan Next.js."
  //       ]
  //     }
  //   ],
  //   "coverLetter": "Dear Hiring Manager,\\n\\nI am writing to express my strong interest in the Junior Software Engineer position at Tech Corp. With my background in full-stack development using Next.js and React...\\n\\nSincerely,\\nAlbi Nur Rosif",
  //   "interviewQuestions": [
  //     {
  //       "question": "Ceritakan tentang proyek KumpuLink Anda. Tantangan terbesar apa yang dihadapi?",
  //       "reason": "Untuk menggali kedalaman teknis dan kemampuan problem-solving Anda.",
  //       "sampleAnswer": "Situation: Ketika mengembangkan fitur analitik... Task: Saya harus melacak klik... Action: Saya mengimplementasikan... Result: Sistem berjalan tanpa latensi."
  //     }
  //   ]
  // }`;

  // // Langsung kembalikan mock data ini (seolah-olah ini dari AI)
  // // Tidak ada kuota API yang terpakai!
  // console.log('⚠️ Menggunakan MOCK DATA (Hemat Kuota AI)');

  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // return parseAndEvaluateAIOutput(mockRawText);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  // Prompt dasar (Nanti di Phase 3 kita akan buat ini lebih canggih dengan Evaluator)
  const prompt = `
    Role: Anda adalah Expert Tech Recruiter dan Professional CV Writer kelas dunia.
    Target Role: ${jobData.role} at ${jobData.company} (${jobData.jobType}).

    JOB DESCRIPTION:
    "${jobData.jobDescription}"

    CANDIDATE CV:
    "${cvText}"

    TASK:
    Lakukan analisis mendalam (Gap Analysis) dan tulis ulang konten CV agar sangat relevan dengan Job Description.
    
    🌍 ATURAN BAHASA (SANGAT PENTING):
    1. Bagian Analisis & Komentar (strengths, missingSkills, strategicAdvice, atsKeywords, magicBullets critique, interviewQuestions): WAJIB gunakan BAHASA INDONESIA yang ramah dan profesional.
    2. Bagian Konten CV & Surat Lamaran (tailoredSummary, tailoredExperiences, tailoredProjects, magicBullets rewrite, coverLetter): WAJIB MENGIKUTI BAHASA DARI JOB DESCRIPTION (Inggris atau Indonesia).

    ⚠️ ATURAN MUTLAK: JANGAN PERNAH mengarang fakta, skill, atau pengalaman yang tidak ada di CV asli kandidat!
    
    CRITICAL RULES FOR JSON OUTPUT:
    1. Respond ONLY with valid JSON.
    2. ALL keys must be enclosed in double quotes.
    3. Escape all double quotes inside the string values.

    You MUST respond in STRICT JSON format matching the exact keys below:

    {
      "isValidInput": <boolean: tulis "false" HANYA JIKA JD atau CV sangat tidak masuk akal, berupa teks acak/gibberish, atau terlalu pendek. Jika valid, tulis "true">,
      "matchScore": <number 0-100: Skor kecocokan ketat berdasarkan ATS keyword match>,
      "strengths": [
        "<string: Kekuatan kandidat DAN jelaskan MENGAPA ini relevan dengan JD>"
      ],
      "missingSkills": [
        "<string: Kelemahan/skill yang kurang DAN jelaskan dampaknya atau saran memperbaikinya>"
      ],
      "strategicAdvice": "<string: 1-2 paragraf 'Strategi Singkat' untuk lolos seleksi berdasarkan analisis di atas>",
      "atsKeywords": [
        "<string: Daftar 10-15 ATS Keywords (Skill teknis & soft skill) dari JD yang WAJIB ada di CV>"
      ],
      "magicBullets": [
        {
          "original": "<string: Kutip 1 kalimat pengalaman TERLEMAH dari CV asli kandidat>",
          "critique": "<string: Kritik tajam mengapa kalimat ini kurang menjual>",
          "rewrite": "<string: Tulis ulang kalimat tersebut menggunakan metode STAR dan Action Verbs>"
        }
      ],
      "tailoredSummary": "<string: Paragraf 'About Me' baru yang profesional dan antusias>",
      "tailoredExperiences": [
        {
          "name": "<string: Nama Perusahaan>",
          "role": "<string: Posisi/Jabatan>",
          "bullets": [
            "<string: Tulis ulang pengalaman menggunakan metode STAR & Action Verbs>"
          ]
        }
      ],
      "tailoredProjects": [
        {
          "name": "<string: Nama Project>",
          "role": "<string: Peran atau Tech Stack>",
          "bullets": [
            "<string: Tulis ulang deskripsi project menggunakan metode STAR. KOSONGKAN ARRAY INI [] jika tidak ada>"
          ]
        }
      ],
      "coverLetter": "<string: Surat lamaran lengkap. JANGAN gunakan markdown headers. Gunakan \\n untuk baris baru. Nada antusias dan Human Touch.>",
      "interviewQuestions": [
        {
          "question": "<string: WAJIB berikan total 4 pertanyaan (2 wajar + 2 JEBAKAN) berdasarkan CV>",
          "reason": "<string: Jelaskan apa jebakannya atau mengapa HRD menanyakan ini>",
          "sampleAnswer": "<string: Contoh jawaban gaya bercerita (Storytelling) menggunakan pengalaman NYATA di CV>"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);

    const rawText = result.response.text();

    const finalResult = parseAndEvaluateAIOutput(rawText);

    return finalResult;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate AI response');
  }
}
