'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveCvToProfile(cvText: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Silakan login terlebih dahulu.' };
  }

  try {
    // Update kolom savedCvText di tabel User
    await prisma.user.update({
      where: { id: user.id },
      data: { savedCvText: cvText },
    });

    // Refresh halaman agar status "Tersimpan" langsung muncul
    revalidatePath('/profile');
    revalidatePath('/'); // Refresh halaman utama (form analyzer) juga
    return { success: true };
  } catch (error) {
    console.error('Gagal menyimpan CV:', error);
    return { success: false, error: 'Gagal menyimpan CV ke database.' };
  }
}

export async function deleteCvFromProfile() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { savedCvText: null },
    });
    revalidatePath('/profile');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus CV.' };
  }
}
