'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

/**
 * Authenticate a user using the provided FormData and navigate based on the result.
 *
 * Attempts to sign in with the `email` and `password` fields from `formData`. On authentication error, redirects to `/error`; on success, revalidates the root layout and redirects to `/`.
 *
 * @param formData - A FormData object containing `email` and `password`
 */
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

/**
 * Registers a new user using the provided form data and navigates to the app root on success.
 *
 * Attempts to create an account with the `email` and `password` fields from `formData`. On success it revalidates the root layout and redirects to `/`. On error it logs the failure message and stops without redirecting.
 *
 * @param formData - A FormData object containing `email` and `password` entries
 */
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
