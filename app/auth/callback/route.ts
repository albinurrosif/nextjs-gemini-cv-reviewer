import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // Ambil URL dan tiket (code) dari URL yang dikirim Google
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // Jika ada parameter 'next', arahkan ke sana (default: /dashboard)
  const nextParam = searchParams.get('next');
  // Validate next is a relative path to prevent open redirect
  const next = nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/dashboard';

  if (code) {
    // Siapkan brankas cookies
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // TUKAR TIKET DENGAN SESI LOGIN!
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Jika berhasil, silakan masuk!
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('Auth Callback Error:', error.message);
    }
  }

  // Jika tidak ada tiket atau gagal, tendang kembali ke halaman login dengan pesan error
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
