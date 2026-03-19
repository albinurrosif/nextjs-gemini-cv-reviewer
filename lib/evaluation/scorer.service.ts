export interface TailoredItem {
  role: string;
  name: string;
  bullets: string[];
}

export interface InterviewPrep {
  question: string;
  reason: string;
  sampleAnswer: string;
}

export interface EvaluationResult {
  isValidInput: boolean;
  matchScore: number;
  strengths: string[];
  missingSkills: string[];
  strategicAdvice: string;
  atsKeywords: string[];
  magicBullets: {
    original: string;
    critique: string;
    rewrite: string;
  }[];

  tailoredSummary: string;
  tailoredExperiences: TailoredItem[];
  tailoredProjects: TailoredItem[];
  coverLetter: string;
  interviewQuestions: InterviewPrep[];
}

export function parseAndEvaluateAIOutput(rawOutput: string): EvaluationResult {
  try {
    // 1. Bersihkan teks dari markdown (agar aman di-parse)
    const cleanedOutput = rawOutput
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // 2. Ubah string menjadi Object JavaScript
    const parsedData = JSON.parse(cleanedOutput);

    // 3. Validasi: Kita pastikan bentuknya sesuai Interface
    // Jika AI lupa mengirim array, kita amankan dengan fallback [] (array kosong)
    const evaluation: EvaluationResult = {
      isValidInput: typeof parsedData.isValidInput === 'boolean' ? parsedData.isValidInput : true,
      matchScore: typeof parsedData.matchScore === 'number' ? parsedData.matchScore : 0,
      strengths: Array.isArray(parsedData.strengths) ? parsedData.strengths : [],
      missingSkills: Array.isArray(parsedData.missingSkills) ? parsedData.missingSkills : [],
      strategicAdvice: typeof parsedData.strategicAdvice === 'string' ? parsedData.strategicAdvice : '',
      atsKeywords: Array.isArray(parsedData.atsKeywords) ? parsedData.atsKeywords : [],
      magicBullets: Array.isArray(parsedData.magicBullets) ? parsedData.magicBullets : [],

      tailoredSummary: typeof parsedData.tailoredSummary === 'string' ? parsedData.tailoredSummary : '',
      tailoredExperiences: Array.isArray(parsedData.tailoredExperiences) ? parsedData.tailoredExperiences : [],
      tailoredProjects: Array.isArray(parsedData.tailoredProjects) ? parsedData.tailoredProjects : [],
      coverLetter: typeof parsedData.coverLetter === 'string' ? parsedData.coverLetter : '',
      interviewQuestions: Array.isArray(parsedData.interviewQuestions) ? parsedData.interviewQuestions : [],
    };

    return evaluation;
  } catch (error) {
    console.error('Gagal melakukan parsing JSON dari AI:', error);
    // Jika AI membalas teks biasa (bukan JSON) atau error
    return {
      isValidInput: false,
      matchScore: 0,
      strengths: ['Gagal menganalisis kekuatan.'],
      missingSkills: ['Gagal menganalisis kekurangan.'],
      strategicAdvice: '',
      atsKeywords: [],
      magicBullets: [],
      tailoredSummary: '',
      tailoredExperiences: [],
      tailoredProjects: [],
      coverLetter: '',
      interviewQuestions: [],
    };
  }
}
