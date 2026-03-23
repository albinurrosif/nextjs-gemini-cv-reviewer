// File: app/page.tsx
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import AnalyzeForm from '@/components/AnalyzerForm';
import Footer from '@/components/Footer';
import { logout } from './login/actions';

export default async function Home() {
  // 1. Ambil kotak cookies
  const cookieStore = await cookies();
  // 2. Berikan ke Satpam Supabase
  const supabase = createClient(cookieStore);

  // 3. Tanyakan ke Satpam: "Siapa user yang sedang bawa token ini?"
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">PreApply v2 - AI CV Reviewer</h1>

        {/* 4. Logika UI: Jika user ada (login), sapa dia. Jika tidak, suruh login. */}
        {user ? (
          <div className="mb-8 p-4 bg-green-100 rounded-lg text-center relative">
            <p className="text-green-800 mb-2">
              Selamat datang, <strong>{user.email}</strong>!
            </p>
            <p className="text-sm text-green-700 mb-4">Hasil review CV Anda akan otomatis tersimpan di database.</p>
            {/* Form kecil untuk memanggil Server Action Logout */}
            <form action={logout}>
              <button type="submit" className="text-sm text-red-600 underline hover:text-red-800">
                Keluar (Logout)
              </button>
            </form>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-yellow-100 rounded-lg text-center">
            <p className="text-yellow-800 mb-2">
              Anda sedang dalam <strong>Mode Tamu (Teaser)</strong>.
            </p>
            <p className="text-sm text-yellow-700 mb-4">Login untuk menyimpan Master CV dan riwayat review.</p>
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Login / Sign Up Sekarang
            </Link>
          </div>
        )}

        <div className="flex-grow py-10">
          <AnalyzeForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
