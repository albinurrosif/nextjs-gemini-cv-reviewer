'use client';

import { useState } from 'react';

export default function AnalyzerForm() {
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    jobType: 'Full-time',
    jobDescription: '',
    cvText: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAiResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setAiResult(result.data);
      } else {
        alert('Gagal menganalisis: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full p-8 bg-background rounded-2xl shadow-lg border border-foreground/10">
        <div className="border-b border-foreground/10 pb-4">
          <h2 className="text-2xl font-bold text-foreground">Detail Lamaran</h2>
          <p className="text-sm text-foreground/60">Masukkan informasi lowongan dan CV Anda untuk dianalisis.</p>
        </div>

        {/* Baris Pertama: Role, Company, Job Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground/80">Target Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              className="p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-background text-foreground"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground/80">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google"
              className="p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-background text-foreground"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="jobType" className="text-sm font-semibold text-foreground/80">
              Job Type
            </label>
            <select id="jobType" name="jobType" value={formData.jobType} onChange={handleChange} className="p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-background text-foreground">
              <option value="" disabled>
                Select job type
              </option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
        </div>

        {/* Input Job Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground/80">Job Description</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Paste Job Description lengkap di sini..."
            className="p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px] bg-background text-foreground"
            required
          />
        </div>

        {/* Input CV Text */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground/80">CV / Resume Text (Sementara menggunakan teks)</label>
          <textarea
            name="cvText"
            value={formData.cvText}
            onChange={handleChange}
            placeholder="Paste isi teks CV Anda di sini..."
            className="p-3 border border-foreground/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[200px] bg-background text-foreground"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl transition-colors disabled:bg-blue-800 disabled:text-white/50 text-lg">
          {isLoading ? 'Menganalisis dengan AI...' : 'Analyze Application'}
        </button>
      </form>

      {/* Menampilkan Hasil dari AI (Ini yang terpotong sebelumnya) */}
      {aiResult && (
        <div className="p-8 bg-background rounded-2xl shadow-lg border border-foreground/10 mt-4">
          <h3 className="text-xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">Hasil Analisis AI</h3>
          <div className="whitespace-pre-wrap text-foreground/90 font-mono text-sm">{aiResult}</div>
        </div>
      )}
    </div>
  );
}
