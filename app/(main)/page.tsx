import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon, FileTextIcon, TargetIcon, CheckCircle2Icon } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-32 md:pt-40 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
          <Badge className="mb-6" variant="outline">
            AI CV Analyzer
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
            Lolos Filter HRD dengan <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">CV yang Relevan</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Gunakan AI untuk me-review format CV dan menemukan gap skill berdasarkan deskripsi pekerjaan asli. Buat CV-mu lebih menonjol di mata sistem ATS dan rekruter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="h-12 px-8 text-base font-medium rounded-full w-full sm:w-auto" asChild>
              <Link href="/login">
                Mulai Gratis <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium rounded-full w-full sm:w-auto" asChild>
              <Link href="#features">Pelajari Fitur</Link>
            </Button>
          </div>
        </div>

        {/*GRADIENT*/}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-muted/30"></div>
      </section>

      {/* --- OUR PRODUCTS --- */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Pilih Jenis Analisis</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Sesuaikan metode review CV dengan tahap pencarian kerjamu saat ini.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Kartu Produk 1 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors bg-background">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <TargetIcon className="w-32 h-32" />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TargetIcon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Analisis Lowongan (CV vs Loker)</CardTitle>
                <CardDescription className="text-base mt-2">Masukkan Job Description dari perusahaan incaran. AI akan membandingkannya dengan CV-mu untuk mencari kata kunci dan keahlian yang terlewat.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500" /> Cek Gap Skill
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500" /> Draf Cover Letter
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500" /> Prediksi Pertanyaan Interview
                  </li>
                </ul>
                <Button className="w-full" variant="secondary" asChild>
                  <Link href="/match">Mulai Analisis</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Kartu Produk 2 */}
            <Card className="relative overflow-hidden border-2 hover:border-emerald-500/50 transition-colors bg-background">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <FileTextIcon className="w-32 h-32" />
              </div>
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <FileTextIcon className="w-6 h-6 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl">Review CV ATS</CardTitle>
                <CardDescription className="text-base mt-2">Lakukan review cepat pada format, tata bahasa, dan penggunaan kata kerja di CV-mu agar lebih sesuai dengan standar sistem ATS global.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500" /> Estimasi Skor ATS (0-100)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500" /> Koreksi Tata Bahasa
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2Icon className="w-4 h-4 text-emerald-500" /> Saran Format STAR
                  </li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/general">Mulai Review</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}