'use client';

import { useState, useRef, useEffect } from 'react';
import AnalysisResult from './MatchAnalysisResult';
import { EvaluationResult } from '@/lib/evaluation/scorer.service';
import extractText from 'react-pdftotext';
import { saveReviewAction } from '@/app/actions/review';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// --- IMPORT KOMPONEN SHADCN ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AnalyzerForm({ profileCvText = null, isLoggedIn = false }: { profileCvText?: string | null; isLoggedIn?: boolean }) {
  const router = useRouter();
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
  // default jika punya CV
  const [cvInputMode, setCvInputMode] = useState<'upload' | 'text' | 'profile'>(profileCvText ? 'profile' : 'upload');
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ name: string; size: string } | null>(null);

  const [aiResult, setAiResult] = useState<EvaluationResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (aiResult && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [aiResult]);

  // Memaksa form untuk menelan teks dari profil saat halaman pertama kali dimuat
  useEffect(() => {
    if (profileCvText && cvInputMode === 'profile') {
      setFormData((prev) => ({ ...prev, cvText: profileCvText }));
    }
  }, [profileCvText, cvInputMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTabChange = (mode: 'upload' | 'text' | 'profile') => {
    setCvInputMode(mode);
    if (mode === 'profile' && profileCvText) {
      setFormData((prev) => ({ ...prev, cvText: profileCvText }));
      setUploadedFileInfo(null);
    } else {
      setFormData((prev) => ({ ...prev, cvText: '' }));
      setUploadedFileInfo(null);
    }
  };

  const handleReset = () => {
    setFormData(defaultForm);
    setAiResult(null);
    setUploadedFileInfo(null);
    setCvInputMode('upload');
    setIsSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cvText.trim()) {
      toast('Harap unggah PDF CV Anda, paste teks, atau gunakan CV profil!');
      return;
    }

    setIsLoading(true);
    setAiResult(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/analyze-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setAiResult(result.data);
      } else {
        toast('Gagal menganalisis: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast('Tolong unggah file dengan format PDF.');
      return;
    }

    setIsUploadingPdf(true);

    try {
      const extractedText = await extractText(file);
      const cleanText = extractedText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

      setFormData((prev) => ({ ...prev, cvText: cleanText }));
      const sizeInKB = (file.size / 1024).toFixed(1);
      setUploadedFileInfo({ name: file.name, size: `${sizeInKB} KB` });
    } catch (error) {
      console.error('Gagal membaca PDF:', error);
      toast('File PDF ini tidak bisa dibaca (mungkin diproteksi atau berupa gambar hasil scan).');
    } finally {
      setIsUploadingPdf(false);
      e.target.value = '';
    }
  };

  const handleRemoveFile = () => {
    setUploadedFileInfo(null);
    setFormData((prev) => ({ ...prev, cvText: '' }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-10 p-4 md:py-12">
      {/* --- HERO SECTION --- */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">AI CV Analyzer</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Cek kecocokan CV-mu dengan kriteria loker incaran. Temukan gap skill dan dapatkan saran perbaikan instan.</p>
      </div>

      {/* --- FORM CARD (SHADCN) --- */}
      <Card className="shadow-lg border-muted">
        <CardHeader className="bg-muted/30 pb-6">
          <CardTitle className="text-xl">Detail Lamaran</CardTitle>
          <CardDescription>Masukkan detail posisi dan perusahaan yang dituju.</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* GRID 3 KOLOM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role">Target Role</Label>
                <Input id="role" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Engineer" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Google" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select value={formData.jobType} onValueChange={(value) => setFormData({ ...formData, jobType: value })}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Pilih tipe pekerjaan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* JOB DESCRIPTION */}
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description (JD)</Label>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                placeholder="Paste kualifikasi dan deskripsi pekerjaan dari loker di sini..."
                className="min-h-[120px] resize-y"
                required
              />
            </div>

            {/* CV INPUT SECTION */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Pilih Sumber CV</Label>
                <div className="flex bg-muted p-1 rounded-md overflow-x-auto">
                  {/* TAB 1: CV PROFIL (Hanya muncul jika punya profil) */}
                  {profileCvText && (
                    <button
                      type="button"
                      onClick={() => handleTabChange('profile')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all whitespace-nowrap ${cvInputMode === 'profile' ? 'bg-background shadow-sm text-emerald-600 dark:text-emerald-500' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      ✨ CV Profil
                    </button>
                  )}

                  {/* TAB 2: UPLOAD PDF */}
                  <button
                    type="button"
                    onClick={() => handleTabChange('upload')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all whitespace-nowrap ${cvInputMode === 'upload' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Upload PDF Baru
                  </button>

                  {/* TAB 3: PASTE TEXT */}
                  <button
                    type="button"
                    onClick={() => handleTabChange('text')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all whitespace-nowrap ${cvInputMode === 'text' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Paste Text
                  </button>
                </div>
              </div>

              {/* RENDER KONTEN BERDASARKAN TAB */}
              {cvInputMode === 'profile' ? (
                <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-lg p-6 flex items-center justify-between gap-4 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🔐</span>
                    <div>
                      <p className="font-semibold text-emerald-700 dark:text-emerald-400">CV Master Aktif</p>
                      <p className="text-sm text-emerald-600/80 dark:text-emerald-500/80">Teks CV utama dari profilmu akan digunakan untuk analisis ini.</p>
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" asChild className="shrink-0">
                    <Link href="/profile">Edit CV</Link>
                  </Button>
                </div>
              ) : cvInputMode === 'upload' ? (
                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-muted/20 hover:bg-muted/40 transition-colors animate-in fade-in">
                  {uploadedFileInfo && !isUploadingPdf ? (
                    <div className="w-full flex items-center justify-between p-3 bg-background border rounded-md shadow-sm gap-2">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xl shrink-0">📄</span>
                        <div className="flex flex-col min-w-0 w-full">
                          <span className="font-medium text-sm truncate">{uploadedFileInfo.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">{uploadedFileInfo.size}</span>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile} className="text-destructive hover:bg-destructive/10 shrink-0">
                        Hapus
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <p className="font-medium">Upload PDF CV-mu</p>
                        <p className="text-xs text-muted-foreground mt-1">Hanya format PDF (Maks. 5MB).</p>
                      </div>
                      <input type="file" accept="application/pdf" id="pdf-upload" className="hidden" onChange={handleFileUpload} disabled={isUploadingPdf} />
                      <Button asChild variant={isUploadingPdf ? 'secondary' : 'default'} disabled={isUploadingPdf}>
                        <label htmlFor="pdf-upload" className="cursor-pointer">
                          {isUploadingPdf ? 'Mengekstrak Teks...' : 'Pilih File PDF'}
                        </label>
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <Textarea name="cvText" value={formData.cvText} onChange={handleChange} placeholder="Paste seluruh isi teks CV-mu di sini..." className="min-h-[150px] animate-in fade-in" />
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading} className="w-1/3">
                Reset
              </Button>
              <Button type="submit" disabled={isLoading || isUploadingPdf} className="w-2/3">
                {isLoading ? 'Menganalisis...' : 'Cek Kecocokan CV'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* --- OVERLAY LOADING --- */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-sm shadow-xl animate-in zoom-in-95">
            <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-4">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="font-semibold text-lg">Menganalisis CV...</p>
                <p className="text-sm text-muted-foreground mt-1">AI sedang membandingkan CV dengan kriteria loker.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- HASIL ANALISIS --- */}
      {!isLoading && aiResult && (
        <div ref={resultRef} className="scroll-mt-8 w-full animate-in fade-in slide-in-from-bottom-4">
          {aiResult.isValidInput === false ? (
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="pt-6 text-center">
                <span className="text-4xl mb-2 block">🚫</span>
                <h3 className="text-lg font-bold text-destructive">Input Tidak Valid</h3>
                <p className="text-sm text-muted-foreground mt-1">{aiResult.invalidReason || 'Deskripsi pekerjaan atau CV terlalu singkat/tidak masuk akal.'}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Output AI */}
              <AnalysisResult data={aiResult} />

              {/* TOMBOL SIMPAN MANUAL */}
              <Card className="border-border bg-muted/20 mt-4 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">Simpan hasil review ini ke riwayat agar bisa diakses kembali.</div>
                <Button
                  onClick={async () => {
                    // --- JIKA TAMU (GUEST) ---
                    if (!isLoggedIn) {
                      localStorage.setItem('pendingReview', JSON.stringify({ formData, aiResult }));
                      toast.info('Hasil akan disimpan', {
                        description: 'Silakan masuk untuk menyimpannya secara permanen.',
                      });
                      router.push('/login');
                      return;
                    }

                    // --- JIKA SUDAH LOGIN ---
                    setIsSaving(true);
                    const res = await saveReviewAction(formData, aiResult);
                    setIsSaving(false);
                    if (res.success) {
                      setIsSaved(true);
                    } else {
                      toast.error(res.error);
                    }
                  }}
                  disabled={isSaving || isSaved}
                  className="w-full sm:w-auto font-bold"
                >
                  {isSaving ? '⏳ Menyimpan...' : isSaved ? '✅ Tersimpan di Riwayat' : '💾 Simpan ke Riwayat'}
                </Button>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
