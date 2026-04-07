import { GoogleGenerativeAI } from '@google/generative-ai';

import { parseAndEvaluateAIOutput, EvaluationResult } from '../evaluation/scorer.service';

export interface JobDataInput {
  role: string;
  company: string;
  jobType: string;
  jobDescription: string;
}

// ambil API Key dari environment variable (.env)
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Set timeout global untuk semua request ke Gemini (45 detik)
const abortController = new AbortController();
const timeoutId = setTimeout(() => abortController.abort(), 45000);

export async function analyzeCV(jobData: JobDataInput, cvText: string): Promise<EvaluationResult> {
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

  const prompt = `
    Role: Anda adalah Tech Recruiter dan ATS Specialist yang empatik dan realistis. Sesuaikan standar penilaian, kritik, dan gaya bahasa Anda dengan level pengalaman yang tertera di CV kandidat (mulai dari Fresh Graduate hingga Senior).
    Target Role: ${jobData.role} at ${jobData.company} (${jobData.jobType}).

    JOB DESCRIPTION:
    "${jobData.jobDescription}"

    CANDIDATE CV:
    "${cvText}"

    TASK:
    Lakukan analisis mendalam (Gap Analysis) dan tulis ulang konten CV agar sangat relevan dengan Job Description.
    
    🌍 ATURAN BAHASA (SANGAT PENTING):
    1. Bagian Analisis & Komentar (strengths, missingSkills, strategicAdvice, atsKeywords, magicBullets critique, interviewQuestions): WAJIB gunakan BAHASA INDONESIA yang ramah dan profesional.
    2. Bagian Konten CV & Surat Lamaran (tailoredSummary, tailoredExperiences, tailoredProjects, magicBullets rewrite, coverLetter): WAJIB MENGIKUTI BAHASA DARI JOB DESCRIPTION.

    ⚠️ ATURAN MUTLAK: JANGAN PERNAH mengarang fakta, skill, atau pengalaman yang tidak ada di CV asli kandidat!
    
    CRITICAL RULES FOR JSON OUTPUT:
    1. Respond ONLY with valid JSON.
    2. ALL keys must be enclosed in double quotes.
    3. Escape all double quotes inside the string values.

    You MUST respond in STRICT JSON format matching the exact keys below:

    {
      "isValidInput": <boolean: tulis "false" HANYA JIKA JD atau CV sangat tidak masuk akal, berupa teks acak/gibberish, atau terlalu pendek. Jika valid, tulis "true">,
      "invalidReason": "<string: KOSONGKAN jika valid. Jika invalid, jelaskan DENGAN SPESIFIK apa yang salah.'>",
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
          "question": "<string: Berikan 4 pertanyaan interview yang PALING MUNGKIN DITANYAKAN HRD/User berdasarkan kecocokan CV ini dengan lowongan. Sesuaikan tingkat kesulitannya dengan level pengalaman kandidat (fresher vs senior)>",
          "reason": "<string: Jelaskan secara singkat mengapa pewawancara menanyakan hal ini>",
          "sampleAnswer": "<string: Contoh cara menjawab yang baik dan natural (gunakan pengalaman nyata yang ada di CV)>"
        }
      ],
    }
  `;

  try {
    // Kirim prompt ke Gemini API
    const result = await model.generateContent(prompt, {
      signal: abortController.signal,
    });

    // Jika sudah dapat respons, batalkan timeout untuk mencegah abort yang tidak perlu
    clearTimeout(timeoutId);

    const rawText = result.response.text();

    const finalResult = parseAndEvaluateAIOutput(rawText);

    return finalResult;
  } catch (error) {
    // Tangani error timeout secara khusus
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Gemini API Timeout: Request dibatalkan setelah 45 detik.');
      throw new Error('Request Timeout: Server AI terlalu lambat merespons.');
    }
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate AI response');
  }
}

export async function analyzeGeneralCV(cvText: string): Promise<EvaluationResult> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const prompt = `
    Role: Anda adalah Tech Recruiter dan ATS Specialist yang empatik dan realistis. Sesuaikan standar penilaian, kritik, dan gaya bahasa Anda dengan level pengalaman yang tertera di CV kandidat (mulai dari Fresh Graduate hingga Senior).
    Tugas: Lakukan audit ATS secara UMUM pada CV berikut dan tulis ulang seluruh isinya menjadi lebih menjual.

    CANDIDATE CV:
    "${cvText}"

    🌍 ATURAN BAHASA (SANGAT PENTING):
    1. Bagian Rapor & Komentar (invalidReason, strengths, missingSkills, strategicAdvice, interviewQuestions): WAJIB gunakan BAHASA INDONESIA.
    2. Bagian "rewrittenCv": WAJIB MENGIKUTI BAHASA ASLI DARI CV KANDIDAT (Jika CV asli bahasa Inggris, tulis ulang dalam bahasa Inggris. Jika Indonesia, gunakan Indonesia).

    CRITICAL RULES FOR JSON OUTPUT:
    1. Respond ONLY with valid JSON.
    2. ALL keys must be enclosed in double quotes.
    3. Untuk key yang tidak relevan dengan analisis umum (seperti coverLetter, tailoredExperiences), biarkan KOSONG (string kosong "" atau array kosong []).

    You MUST respond in STRICT JSON format matching the exact keys below:
    {
      "isValidInput": <boolean: false HANYA JIKA CV sangat tidak masuk akal atau berisi teks acak/gibberish>,
      "invalidReason": "<string: Kosongkan jika valid. Jika invalid, jelaskan DENGAN SPESIFIK apa yang salah.>",
      "matchScore": <number 0-100: Skor ATS secara umum (Beri skor rendah jika tidak ada metrik/angka)>,
      "strengths": ["<string: 3-4 Kekuatan dari CV asli>"],
      "missingSkills": ["<string: 3-4 Kelemahan format atau isi CV (Kritik tajam tapi membangun)>"],
      "strategicAdvice": "<string: 2 paragraf saran untuk merombak CV asli>",
      "atsKeywords": [],
      "magicBullets": [],
      "tailoredSummary": "",
      "tailoredExperiences": [],
      "tailoredProjects": [],
      "coverLetter": "",
      "interviewQuestions": [
        {
          "question": "<string: Berikan 3 pertanyaan interview fundamental/dasar yang hampir pasti ditanyakan HRD saat melihat CV ini. Fokus pada validasi skill atau pengalaman yang tertulis>",
          "reason": "<string: Apa yang sebenarnya ingin dicari tahu oleh HRD dari pertanyaan ini?>",
          "sampleAnswer": "<string: Contoh formula jawaban yang terstruktur dan meyakinkan>"
        }
      ],
      "rewrittenCv": "<string: TULIS ULANG SELURUH CV ASLI KE DALAM TEKS MARKDOWN YANG RAPI DAN RAMAH ATS. Gunakan Action Verbs. Ubah poin pengalaman menjadi format STAR. (INGAT ATURAN BAHASA NO.2)>"
    }
  `;

  try {
    const result = await model.generateContent(prompt, {
      signal: abortController.signal,
    });

    clearTimeout(timeoutId);
    const rawText = result.response.text();
    return parseAndEvaluateAIOutput(rawText);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Gemini API Timeout: Request dibatalkan setelah 45 detik.');
      throw new Error('Request Timeout: Server AI terlalu lambat merespons.');
    }
    console.error('Gemini API Error (General):', error);
    throw new Error('Failed to generate AI response');
  }
}
