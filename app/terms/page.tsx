import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

export default function TermsOfService() {
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
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2">Ketentuan Layanan (Terms of Service)</h1>
          <p className="text-muted-foreground">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Penerimaan Syarat</h2>
          <p className="text-muted-foreground leading-relaxed">
            Penggunaan layanan PreApply berarti kamu menyetujui Syarat dan Ketentuan ini. Jika kamu tidak setuju dengan bagian mana pun dari syarat ini, silakan hentikan penggunaan layanan kami.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Sifat Layanan (AI Disclaimer)</h2>
          <p className="text-muted-foreground leading-relaxed">
            PreApply adalah alat bantu berbasis AI untuk memberikan saran pada CV-mu. Kami <strong>tidak menjamin</strong> bahwa kamu pasti akan diterima kerja atau lolos seleksi perusahaan. Hasil analisis AI bisa saja tidak 100% akurat dan
            tetap memerlukan tinjauan manual. Tanggung jawab penuh atas penggunaan saran berada di tangan pengguna.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Penggunaan yang Wajar (Fair Use)</h2>
          <p className="text-muted-foreground leading-relaxed">
            Kamu setuju untuk tidak menyalahgunakan layanan ini, termasuk namun tidak terbatas pada: mengirimkan spam, mencoba membobol sistem keamanan (hacking), atau melakukan rekayasa balik (reverse engineering) pada sistem analisis AI
            kami.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Perubahan Layanan</h2>
          <p className="text-muted-foreground leading-relaxed">
            Kami berhak mengubah, menangguhkan, atau menghentikan layanan (atau bagian mana pun darinya) kapan saja tanpa pemberitahuan sebelumnya. Kami juga dapat memperbarui syarat dan ketentuan ini seiring berjalannya waktu.
          </p>
        </section>
      </div>
    </main>
  );
}
