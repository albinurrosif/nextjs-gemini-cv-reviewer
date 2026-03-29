import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import GeneralAnalysisResult from '@/components/GeneralAnalysisResult';

// --- IMPORT KOMPONEN UI & IKON ---
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, BuildingIcon, BriefcaseIcon, CalendarIcon } from 'lucide-react';
import AnalysisResult from '@/components/MatchAnalysisResult';

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Cek Auth
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Ambil data spesifik berdasarkan ID di URL
  const { id } = await params;

  const review = await prisma.review.findUnique({
    where: {
      id: id,
      userId: user.id,
    },
  });

  // Jika data tidak ditemukan atau bukan milik user ini, tendang ke dashboard
  if (!review) {
    redirect('/dashboard');
  }

  // 3. Bongkar JSON hasil AI dari database
  let aiData;
  try {
    aiData = JSON.parse(review.resultJson);
  } catch (error) {
    console.error(error);
    return <div className="p-8 text-destructive text-center mt-20 font-bold">Error: Data JSON rusak.</div>;
  }

  // 4. Tampilkan Detailnya
  return (
    <main className="min-h-screen bg-background text-foreground py-8 px-4 md:py-12 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* --- TOMBOL KEMBALI --- */}
        <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-foreground">
          <Link href="/dashboard">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Link>
        </Button>

        {/* --- HEADER INFO LOWONGAN / UMUM --- */}
        <div className="space-y-4 border-b pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{review.jobType === 'General' ? 'Audit Skor ATS CV' : review.role}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {review.jobType !== 'General' && (
              <>
                <div className="flex items-center gap-1.5">
                  <BuildingIcon className="w-4 h-4 shrink-0" />
                  <span className="font-medium text-foreground">{review.company}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BriefcaseIcon className="w-4 h-4 shrink-0" />
                  <span>{review.jobType}</span>
                </div>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 shrink-0" />
              <span>{new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* --- HASIL AI --- */}
        <div className="pt-2">{review.jobType === 'General' ? <GeneralAnalysisResult data={aiData} /> : <AnalysisResult data={aiData} />}</div>
      </div>
    </main>
  );
}
