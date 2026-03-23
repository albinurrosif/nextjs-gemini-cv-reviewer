import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import AnalyzeForm from '@/components/AnalyzerForm';

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex-1 w-full flex flex-col items-center py-6 px-4 md:py-12 md:px-8">
      <AnalyzeForm />
    </main>
  );
}
