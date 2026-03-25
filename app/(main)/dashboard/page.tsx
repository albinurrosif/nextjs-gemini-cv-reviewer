import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Review } from '@prisma/client';
import SyncPendingReview from '@/components/SyncPendingReview';

// --- SHADCN & ICONS IMPORT ---
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, BuildingIcon, BriefcaseIcon, ChevronRightIcon, PlusIcon, FileTextIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userReviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  // Fungsi pembantu untuk memberi warna badge berdasarkan skor
  const getScoreBadge = (score: number, isGeneral: boolean) => {
    const text = isGeneral ? `${score}/100 Skor` : `${score}% Match`;

    if (score >= 75) return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">{text}</Badge>;
    if (score >= 50) return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20">{text}</Badge>;
    return <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">{text}</Badge>;
  };

  return (
    <main className="min-h-screen bg-background text-foreground py-8 px-4 md:py-12 md:px-8">
      <SyncPendingReview />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* --- HEADER DASHBOARD --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Riwayat</h1>
            <p className="text-muted-foreground mt-1 text-sm">Anda memiliki {userReviews.length} dokumen CV yang telah dianalisis.</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <PlusIcon className="w-4 h-4" /> Analisis CV Baru
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/">🎯 Analisis Loker (CV vs JD)</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/general">🔍 Cek Skor ATS Umum</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* --- STATE KOSONG (Kalo belum ada riwayat) --- */}
        {userReviews.length === 0 ? (
          <Card className="border-dashed bg-muted/10">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="p-4 bg-muted rounded-full">
                <FileTextIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Belum ada riwayat analisis</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">Mulai tingkatkan peluang lolos HRD dengan membandingkan CV Anda dengan kualifikasi pekerjaan.</p>
              </div>
              <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 w-full sm:w-auto">
                <PlusIcon className="w-4 h-4" /> Mulai Analisis Pertama Anda
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/">🎯 Analisis Loker (CV vs JD)</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/general">🔍 Cek Skor ATS Umum</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userReviews.map((review: Review) => {
              // --- PENGKONDISIAN VISUAL KARTU ---
              const isGeneral = review.jobType === 'General';

              return (
                <Card
                  key={review.id}
                  // Jika General, beri efek border biru (primary) yang tipis
                  className={`flex flex-col h-full hover:shadow-md transition-all border-border/50 hover:border-border relative overflow-hidden ${isGeneral ? 'border-primary/30 bg-primary/5' : ''}`}
                >
                  {/* Garis penanda khusus untuk General Analysis */}
                  {isGeneral && <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>}

                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5">
                        <CardTitle className="text-lg leading-tight line-clamp-2" title={review.role}>
                          {isGeneral ? 'Skor CV ATS' : review.role}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 font-medium">
                          {isGeneral ? <FileTextIcon className="w-3.5 h-3.5 shrink-0 text-primary" /> : <BuildingIcon className="w-3.5 h-3.5 shrink-0" />}
                          <span className="line-clamp-1" title={review.company}>
                            {isGeneral ? 'General Audit' : review.company}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="shrink-0 pt-0.5">{getScoreBadge(review.matchScore, isGeneral)}</div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 pb-4">
                    <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                      {!isGeneral && (
                        <div className="flex items-center gap-2">
                          <BriefcaseIcon className="w-4 h-4 shrink-0 opacity-70" />
                          <span>{review.jobType}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 shrink-0 opacity-70" />
                        <span>{new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-border/50 mt-auto">
                    <Button variant={isGeneral ? 'default' : 'ghost'} className="w-full justify-between hover:bg-muted/50 text-foreground" asChild>
                      <Link href={`/dashboard/${review.id}`}>
                        Lihat Rapor
                        <ChevronRightIcon className="w-4 h-4 opacity-70" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
