'use client';

import { useState, useRef, useEffect } from 'react';
import AnalysisResult from './AnalysisResult';
import { EvaluationResult } from '@/lib/evaluation/scorer.service';
import extractText from 'react-pdftotext';

export default function AnalyzerForm() {
  const defaultForm = {
    role: '',
    company: '',
    jobType: 'Full-time',
    jobDescription: '',
    cvText: '',
  };

  const [formData, setFormData] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [cvInputMode, setCvInputMode] = useState<'upload' | 'text'>('upload');
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ name: string; size: string } | null>(null);

  const [aiResult, setAiResult] = useState<EvaluationResult | null>(null);

  // Referensi (Ref) untuk menargetkan elemen HTML agar bisa di-scroll otomatis
  const resultRef = useRef<HTMLDivElement>(null);

  // Efek samping: Kalau aiResult berubah (hasil AI selesai), scroll otomatis ke bawah!
  useEffect(() => {
    if (aiResult && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100); // Jeda 100ms memberi waktu React menggambar UI-nya dulu
    }
  }, [aiResult]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({ role: '', company: '', jobType: '', jobDescription: '', cvText: '' });
    setAiResult(null);
    setUploadedFileInfo(null); // Bersihkan kotak file upload
    setCvInputMode('upload'); // Kembalikan ke tab upload secara default

    // Scroll kembali ke atas halaman dengan halus
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi tambahan agar tidak mengirim CV kosong
    if (!formData.cvText.trim()) {
      alert('Harap unggah PDF CV Anda atau paste teks CV terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    setAiResult(null); // Bersihkan hasil lama

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Tolong unggah file dengan format PDF.');
      return;
    }

    setIsUploadingPdf(true);

    try {
      const extractedText = await extractText(file);
      const cleanText = extractedText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

      setFormData((prev) => ({ ...prev, cvText: cleanText }));

      // Hitung ukuran file (KB) dan simpan infonya
      const sizeInKB = (file.size / 1024).toFixed(1);
      setUploadedFileInfo({ name: file.name, size: `${sizeInKB} KB` });
    } catch (error) {
      console.error('Gagal membaca PDF:', error);
      alert('File PDF ini tidak bisa dibaca (mungkin diproteksi atau berupa gambar hasil scan).');
    } finally {
      setIsUploadingPdf(false);
      e.target.value = ''; // Reset input agar bisa upload file lain
    }
  };

  const handleRemoveFile = () => {
    setUploadedFileInfo(null); // Hapus info UI
    setFormData((prev) => ({ ...prev, cvText: '' })); // Hapus teks CV di memori
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-10 p-4 md:p-8">
      {/* --- HERO SECTION: Penjelasan Web --- */}
      <div className="text-center flex flex-col gap-4 mt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          AI CV <span className="text-blue-600 dark:text-blue-500">Analyzer</span> & Optimizer
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          Tingkatkan peluang Anda lolos seleksi HRD. Masukkan deskripsi pekerjaan dan CV Anda, biarkan AI menemukan celah dan merombak CV Anda menggunakan metode STAR.
        </p>
        <div className="flex items-center justify-center gap-4 mt-2 text-sm text-foreground/50 font-medium">
          <span className="flex items-center gap-1">🔒 Privacy Secured</span>
          <span>•</span>
          <span className="flex items-center gap-1">⚡ Powered by Gemini AI</span>
        </div>
      </div>

      {/* --- FORM UTAMA --- */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full p-8 bg-background rounded-3xl shadow-xl border border-foreground/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground/80">Target Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              className="p-3.5 border border-foreground/20 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-background text-foreground transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground/80">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Google"
              className="p-3.5 border border-foreground/20 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-background text-foreground transition-all"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="jobType" className="text-sm font-bold text-foreground/80">
              Job Type
            </label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="p-3.5 border border-foreground/20 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-background text-foreground transition-all"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-foreground/80">Job Description (JD)</label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Paste kualifikasi dan deskripsi pekerjaan dari loker di sini..."
            className="p-4 border border-foreground/20 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px] bg-background text-foreground transition-all resize-y"
            required
          />
        </div>

        {/* --- INPUT CV (SISTEM TABS) --- */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-foreground/80">CV / Resume</label>

            {/* Tombol Tab Navigasi */}
            <div className="flex bg-foreground/5 p-1 rounded-lg border border-foreground/10">
              <button
                type="button"
                onClick={() => setCvInputMode('upload')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${cvInputMode === 'upload' ? 'bg-background shadow text-blue-600 dark:text-blue-400' : 'text-foreground/60 hover:text-foreground'}`}
              >
                📄 Upload PDF
              </button>
              <button
                type="button"
                onClick={() => setCvInputMode('text')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${cvInputMode === 'text' ? 'bg-background shadow text-blue-600 dark:text-blue-400' : 'text-foreground/60 hover:text-foreground'}`}
              >
                ✍️ Paste Text
              </button>
            </div>
          </div>

          {/* Konten Tab */}
          {cvInputMode === 'upload' ? (
            <div className="border-2 border-dashed border-foreground/20 rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-foreground/5 transition-all hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20">
              {/* Jika BUKAN sedang loading upload dan SUDAH ADA file */}
              {uploadedFileInfo && !isUploadingPdf ? (
                <div className="w-full flex items-center justify-between p-4 bg-background border border-foreground/10 rounded-xl shadow-sm animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">📄</div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-sm text-foreground line-clamp-1">{uploadedFileInfo.name}</span>
                      <span className="text-xs text-foreground/50 mt-0.5">{uploadedFileInfo.size}</span>
                    </div>
                  </div>

                  {/* Tombol X (Hapus) */}
                  <button type="button" onClick={handleRemoveFile} className="p-2 text-foreground/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Hapus file">
                    ✕
                  </button>
                </div>
              ) : (
                /* Jika BELUM ADA file ATAU sedang loading upload */
                <>
                  <div className="text-4xl opacity-80">📁</div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">Unggah file CV Anda</p>
                    <p className="text-xs text-foreground/60 mt-1">Hanya mendukung format PDF (Maks. 5MB).</p>
                  </div>

                  <input type="file" accept="application/pdf" id="pdf-upload" className="hidden" onChange={handleFileUpload} disabled={isUploadingPdf} />

                  <label
                    htmlFor="pdf-upload"
                    className={`cursor-pointer px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${
                      isUploadingPdf ? 'bg-zinc-200 text-zinc-500 cursor-wait dark:bg-zinc-800' : 'bg-foreground text-background hover:scale-105'
                    }`}
                  >
                    {isUploadingPdf ? '⏳ Mengekstrak Teks...' : 'Pilih File PDF'}
                  </label>
                </>
              )}
            </div>
          ) : (
            // UI Mode Paste Text
            <textarea
              name="cvText"
              value={formData.cvText}
              onChange={handleChange}
              placeholder="Paste seluruh isi teks CV Anda di sini..."
              className="p-4 border border-foreground/20 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[200px] bg-background text-foreground transition-all resize-y"
            />
          )}
        </div>

        {/* --- TOMBOL SUBMIT & RESET --- */}
        <div className="flex gap-4 mt-4">
          <button type="button" onClick={handleReset} disabled={isLoading} className="px-6 py-4 rounded-xl font-bold text-foreground/70 bg-foreground/5 hover:bg-foreground/10 transition-all disabled:opacity-50">
            Clear Form
          </button>

          <button
            type="submit"
            disabled={isLoading || isUploadingPdf}
            className={`flex-1 py-4 px-4 rounded-xl font-bold text-lg transition-all ${isLoading ? 'bg-blue-800 text-white/50 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 text-white'}`}
          >
            {isLoading ? 'Sedang Memproses...' : 'Analyze Application'}
          </button>
        </div>
      </form>

      {/* --- ANIMASI LOADING LAYAR PENUH (FULL-SCREEN OVERLAY) --- */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="max-w-md w-full p-10 flex flex-col items-center justify-center gap-6 bg-background rounded-3xl shadow-2xl border border-blue-500/30 animate-in zoom-in-95 duration-300">
            {/* Spinner */}
            <div className="relative flex justify-center items-center">
              <div className="absolute w-20 h-20 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-transparent border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
              <span className="absolute text-2xl">✨</span>
            </div>

            {/* Teks */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">Menganalisis CV...</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">Proses ini biasanya berlangsung selama 5 - 10 detik</p>
            </div>
          </div>
        </div>
      )}

      {/* --- HASIL ANALISIS --- */}
      {!isLoading && aiResult && (
        <div ref={resultRef} className="scroll-mt-8 w-full">
          {aiResult.isValidInput === false ? (
            <div className="p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl text-center">
              <span className="text-4xl mb-4 block">🚫</span>
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Input Tidak Valid</h3>
              <p className="text-foreground/80">Maaf, Job Description atau CV yang Anda masukkan terlalu singkat atau tidak masuk akal. Silakan masukkan data yang sebenarnya.</p>
            </div>
          ) : (
            <AnalysisResult data={aiResult} />
          )}
        </div>
      )}
    </div>
  );
}
