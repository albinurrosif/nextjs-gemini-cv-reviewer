'use client';

import { useState } from 'react';
import extractText from 'react-pdftotext';
import { saveCvToProfile, deleteCvFromProfile } from '@/app/actions/profile';
import { toast } from 'sonner';

// Shadcn UI & Icons
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileTextIcon, CheckCircle2Icon, Trash2Icon, UploadCloudIcon, UserCircleIcon } from 'lucide-react';

interface ProfileManagerProps {
  hasSavedCv: boolean;
  email: string;
  fullName: string;
  avatarUrl: string;
}

export default function ProfileManager({ hasSavedCv, email, fullName, avatarUrl }: ProfileManagerProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Harap upload file dalam format PDF.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Mengekstrak teks dari PDF...');

    try {
      // Ekstrak teks dari PDF
      const extractedText = await extractText(file);
      const cleanText = extractedText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

      // Panggil Server Action untuk simpan ke Database
      const res = await saveCvToProfile(cleanText);
      if (!res.success) {
        toast.error(res.error, { id: toastId });
      } else {
        toast.success('CV berhasil diekstrak dan disimpan!', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal membaca PDF. Pastikan file tidak diproteksi password.', { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input file
    }
  };

  const handleDelete = async () => {
    if (confirm('Yakin ingin menghapus CV utama dari profil?')) {
      const res = await deleteCvFromProfile();
      if (res.success) {
        toast.success('CV berhasil dihapus.');
      } else {
        toast.error('Gagal menghapus CV.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* --- KARTU INFO USER --- */}
      <Card className="border-border shadow-sm">
        <CardContent className="flex items-center gap-6 p-6">
          {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-primary/20 shadow-sm" /> : <UserCircleIcon className="w-16 h-16 text-muted-foreground opacity-50" />}
          <div>
            <h2 className="text-xl font-bold">{fullName}</h2>
            <p className="text-muted-foreground">{email}</p>
          </div>
        </CardContent>
      </Card>

      {/* --- KARTU UPLOAD CV PDF --- */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileTextIcon className="w-6 h-6 text-primary" />
            CV Utama
          </CardTitle>
          <CardDescription>Simpan CV-mu di sini agar tidak perlu upload ulang setiap kali mengecek loker baru.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {hasSavedCv ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6 flex flex-col items-center text-center space-y-3">
              <CheckCircle2Icon className="w-12 h-12 text-emerald-500" />
              <div>
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 text-lg">CV Aktif Tersimpan</h3>
                <p className="text-sm text-emerald-600/80 dark:text-emerald-500/80 mt-1">CV ini akan menjadi opsi utama secara otomatis saat mengecek kecocokan.</p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleDelete} className="mt-4 gap-2">
                <Trash2Icon className="w-4 h-4" /> Hapus CV
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-4 bg-muted/10 hover:bg-muted/30 transition-colors">
              <UploadCloudIcon className="w-10 h-10 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Upload PDF CV-mu</p>
                <p className="text-xs text-muted-foreground mt-1">Hanya format PDF (Maks. 5MB).</p>
              </div>

              <input type="file" accept="application/pdf" id="cv-upload-profile" className="hidden" onChange={handleFileUpload} disabled={isUploading} />

              <Button asChild disabled={isUploading}>
                <label htmlFor="cv-upload-profile" className="cursor-pointer">
                  {isUploading ? 'Mengekstrak & Menyimpan...' : 'Pilih File PDF'}
                </label>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
