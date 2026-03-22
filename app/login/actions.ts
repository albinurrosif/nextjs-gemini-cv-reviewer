'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  // Membuat cookie store
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Mengambil data dari form
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Memanggil Supabase untuk Login
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Kalau gagal (password salah, dll), kembali ke halaman error (bisa dikustom nanti)
    redirect('/error');
  }

  // Kalau sukses, arahkan ke halaman utama (atau dashboard nanti)
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  // Membuat cookie store
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  // Memanggil Supabase untuk Daftar Akun Baru
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    // KITA GANTI AGAR MENCETAK KE TERMINAL
    console.log('❌ LOGIN GAGAL:', error.message);
    return; // Berhenti di sini, jangan redirect dulu
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
