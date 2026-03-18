export interface TailoredItem {
  role: string;
  company: string;
  improvedBullets: string[];
}

export interface EvaluationResult {
  matchScore: number;
  strengths: string[];
  missingSkills: string[];

  tailoredSummary: string;
  tailoredExperiences: TailoredItem[];
  tailoredProjects: TailoredItem[];
}

export function parseAndEvaluateAIOutput(rawOutput: string): EvaluationResult {
  try {
    // 1. Bersihkan teks dari markdown (agar aman di-parse)
    const cleanedOutput = rawOutput
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

      console.log('=== RAW JSON DARI GEMINI ===');
      console.log(cleanedOutput);
      console.log('============================');
    // 2. Ubah string menjadi Object JavaScript
    const parsedData = JSON.parse(cleanedOutput);

    // 3. Validasi: Kita pastikan bentuknya sesuai Interface
    // Jika AI lupa mengirim array, kita amankan dengan fallback [] (array kosong)
    const evaluation: EvaluationResult = {
      matchScore: typeof parsedData.matchScore === 'number' ? parsedData.matchScore : 0,
      strengths: Array.isArray(parsedData.strengths) ? parsedData.strengths : [],
      missingSkills: Array.isArray(parsedData.missingSkills) ? parsedData.missingSkills : [],

      tailoredSummary: typeof parsedData.tailoredSummary === 'string' ? parsedData.tailoredSummary : '',
      tailoredExperiences: Array.isArray(parsedData.tailoredExperiences) ? parsedData.tailoredExperiences : [],
      tailoredProjects: Array.isArray(parsedData.tailoredProjects) ? parsedData.tailoredProjects : [],
    };

    return evaluation;
  } catch (error) {
    console.error('Gagal melakukan parsing JSON dari AI:', error);
    // Jika AI membalas teks biasa (bukan JSON) atau error
    return {
      matchScore: 0,
      strengths: ['Gagal menganalisis kekuatan.'],
      missingSkills: ['Gagal menganalisis kekurangan.'],
      tailoredSummary: '',
      tailoredExperiences: [],
      tailoredProjects: [],
    };
  }
}
