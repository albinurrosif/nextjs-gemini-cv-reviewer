import { describe, it, expect } from 'vitest';
import { parseAndEvaluateAIOutput } from '../scorer.service';

// 'describe' adalah untuk mengelompokkan skenario test
describe('Scorer Service - parseAndEvaluateAIOutput', () => {
  // Skenario 1: Bagaimana jika AI merespons dengan format JSON yang SEMPURNA?
  it('harus berhasil mem-parsing JSON yang valid dan lengkap', () => {
    const validMockJSON = JSON.stringify({
      isValidInput: true,
      matchScore: 85,
      strengths: ['Bisa React'],
      missingSkills: ['Belum bisa Node.js'],
      strategicAdvice: 'Belajar Node.js',
      atsKeywords: ['React', 'Frontend'],
      magicBullets: [],
      tailoredSummary: 'Saya programmer handal',
      tailoredExperiences: [],
      tailoredProjects: [],
      coverLetter: 'Halo HRD...',
      interviewQuestions: [],
    });

    // Kita jalankan fungsinya
    const result = parseAndEvaluateAIOutput(validMockJSON);

    // Kita 'harapkan' (expect) hasilnya sesuai!
    expect(result.isValidInput).toBe(true);
    expect(result.matchScore).toBe(85);
    expect(result.strengths[0]).toBe('Bisa React');
  });

  // Skenario 2: Bagaimana jika AI LUPA mengirim Array dan malah ngirim String? (Type Safety)
  it('harus memberikan nilai default (fallback) jika AI mengirim tipe data yang salah', () => {
    const badTypeJSON = JSON.stringify({
      isValidInput: 'true', // Salah tipe (harus boolean)
      matchScore: 'Delapan Puluh', // Salah tipe (harus number)
      strengths: 'Bisa React', // Salah tipe (harus Array)
    });

    const result = parseAndEvaluateAIOutput(badTypeJSON);

    // Kita harapkan fungsi kita cukup pintar untuk me-reset nilai yang ngawur jadi default
    expect(result.isValidInput).toBe(true); // Fallback ke true
    expect(result.matchScore).toBe(0); // Fallback ke 0
    expect(Array.isArray(result.strengths)).toBe(true); // Fallback ke array kosong []
    expect(result.strengths.length).toBe(0);
  });

  // Skenario 3: Bagaimana jika AI cuma membalas teks biasa (Bukan JSON)?
  it('harus menangani error gracefully jika AI mengirim teks biasa/markdown ngawur', () => {
    const gibberishText = 'Maaf, sebagai AI saya tidak bisa menganalisis ini karena...';

    const result = parseAndEvaluateAIOutput(gibberishText);

    // Kita harapkan fungsi kita masuk ke blok 'catch' dan mereturn objek error default
    expect(result.isValidInput).toBe(false);
    expect(result.matchScore).toBe(0);
    expect(result.strengths[0]).toContain('Gagal');
  });
});
