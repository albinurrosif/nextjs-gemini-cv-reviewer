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
      rewrittenCv: '# CV Fulan\nPengalaman yang luar biasa...',
    });

    // jalankan fungsinya
    const result = parseAndEvaluateAIOutput(validMockJSON);

    // 'harapkan' (expect) hasilnya sesuai!
    expect(result.isValidInput).toBe(true);
    expect(result.invalidReason).toBeUndefined();
    expect(result.matchScore).toBe(85);
    expect(result.strengths[0]).toBe('Bisa React');
    expect(result.rewrittenCv).toContain('CV Fulan');
  });

  // Skenario 2: Bagaimana jika AI LUPA mengirim Array dan malah ngirim String? (Type Safety)
  it('harus memberikan nilai default (fallback) jika AI mengirim tipe data yang salah', () => {
    const badTypeJSON = JSON.stringify({
      isValidInput: 'true', // Salah tipe (harus boolean)
      invalidReason: 123, // Salah tipe (harus string)
      matchScore: 'Delapan Puluh', // Salah tipe (harus number)
      strengths: 'Bisa React', // Salah tipe (harus Array)
      rewrittenCv: true, // Salah tipe (harus string)
    });

    const result = parseAndEvaluateAIOutput(badTypeJSON);

    // harapkan function cukup pintar untuk me-reset nilai yang ngawur jadi default
    expect(result.isValidInput).toBe(true); // Fallback ke true
    expect(result.invalidReason).toBeUndefined(); // Tidak ada
    expect(result.matchScore).toBe(0); // Fallback ke 0
    expect(Array.isArray(result.strengths)).toBe(true); // Fallback ke array kosong []
    expect(result.strengths.length).toBe(0);
    expect(result.rewrittenCv).toBeUndefined(); // Tidak ada
  });

  // Skenario 3: Bagaimana jika AI cuma membalas teks biasa (Bukan JSON)?
  it('harus menangani error gracefully jika AI mengirim teks biasa/markdown ngawur', () => {
    const gibberishText = 'Maaf, sebagai AI saya tidak bisa menganalisis ini karena...';

    const result = parseAndEvaluateAIOutput(gibberishText);

    // harapkan function masuk ke blok 'catch' dan mereturn objek error default
    expect(result.isValidInput).toBe(false);
    expect(result.matchScore).toBe(0);
    expect(result.strengths[0]).toContain('Gagal');
  });
});
