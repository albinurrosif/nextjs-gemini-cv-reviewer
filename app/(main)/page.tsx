import AnalyzeForm from '@/components/AnalyzerForm';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  let profileCvText: string | null = null;

  // Jika user login, ambil teks CV-nya dari database
  if (user) {
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { savedCvText: true },
    });
    profileCvText = userData?.savedCvText || null;
  }

  return (
    <main className="flex-1 w-full flex flex-col items-center py-6 px-4 md:py-12 md:px-8">
      <AnalyzeForm profileCvText={profileCvText} />
    </main>
  );
}