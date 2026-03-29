import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import ProfileManager from '@/components/ProfileManager';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Cek apakah user sudah punya CV tersimpan di database
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { savedCvText: true },
  });

  const hasSavedCv = !!userData?.savedCvText;

  // Ekstrak data diri dari Google OAuth / Email
  const email = user.email || '';
  const fullName = user.user_metadata?.full_name || 'Pengguna PreApply';
  const avatarUrl = user.user_metadata?.avatar_url || '';

  return (
    <main className="min-h-[calc(100vh-80px)] bg-background text-foreground py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan Profil</h1>
          <p className="text-muted-foreground mt-1">Kelola data personal dan simpan CV-mu sebagai default.</p>
        </div>

        {/* Kirim data tambahan ke Component */}
        <ProfileManager hasSavedCv={hasSavedCv} email={email} fullName={fullName} avatarUrl={avatarUrl} />
      </div>
    </main>
  );
}
