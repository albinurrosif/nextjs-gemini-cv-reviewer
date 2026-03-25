import GeneralAnalyzerForm from '@/components/GeneralAnalyzerForm';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Cek Skor ATS CV | PreApply',
  description: 'Audit CV Anda secara umum berdasarkan standar ATS global.',
};

export default async function GeneralAnalysisPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileCvText: string | null = null;

  if (user) {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { savedCvText: true },
    });
    profileCvText = userData?.savedCvText || null;
  }

  return (
    <main className="flex-1 w-full flex flex-col items-center py-6 px-4 md:py-12 md:px-8">
      {/* Trik key yang sama persis seperti halaman Home untuk mencegah bug saat logout */}
      <GeneralAnalyzerForm key={user ? user.id : 'guest'} profileCvText={profileCvText} isLoggedIn={!!user} />
    </main>
  );
}
