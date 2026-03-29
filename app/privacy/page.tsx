import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="container max-w-3xl mx-auto py-12 px-4 md:px-6 min-h-screen">
      <Button variant="ghost" asChild className="-ml-4 mb-6">
        <Link href="/">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>
      </Button>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">Kebijakan Privasi (Privacy Policy)</h1>
          <p className="text-muted-foreground">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Informasi yang Kami Kumpulkan</h2>
          <p className="text-muted-foreground leading-relaxed">
            Saat menggunakan PreApply, kami mengumpulkan informasi dasar melalui layanan autentikasi (Google OAuth atau Email) seperti nama dan alamat email. Kami juga menyimpan teks CV dan Job Description yang di-upload murni
            untuk keperluan riwayat analisis di dashboard-mu.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
          <p className="text-muted-foreground leading-relaxed">
            Data teks CV dan loker diproses menggunakan API dari Google Gemini (AI) semata-mata untuk menghasilkan analisis, skor ATS, dan prediksi Interview. Kami <strong>tidak menjual</strong> datamu kepada pihak ketiga
            atau pengiklan mana pun.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Keamanan Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            Datamu disimpan dengan aman menggunakan infrastruktur Supabase dengan standar keamanan industri. Namun, perlu diingat bahwa tidak ada transmisi data di internet yang 100% aman dari celah keamanan.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Penghapusan Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            Jika kamu memiliki pertanyaan tentang Kebijakan Privasi ini, atau ingin meminta penghapusan akun beserta seluruh riwayat CV-mu dari database kami secara permanen, silakan hubungi developer kami melalui link yang tersedia di Footer.
          </p>
        </section>
      </div>
    </main>
  );
}