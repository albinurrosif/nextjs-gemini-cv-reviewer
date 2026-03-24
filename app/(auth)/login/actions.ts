'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export type ActionState = {
  error: string | null;
};

export async function login(
  prevState: ActionState | null, // Wajib ada untuk useActionState
  formData: FormData,
): Promise<ActionState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return { error: 'Email dan password wajib diisi.' }; // Kembalikan error ke UI
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const data = { email, password };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // Kembalikan pesan error asli dari Supabase ke UI
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(
  prevState: ActionState | null, // Wajib ada untuk useActionState
  formData: FormData,
): Promise<ActionState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return { error: 'Email dan password wajib diisi.' };
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const data = { email, password };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function logout() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Hapus token dari Supabase & Cookies
  await supabase.auth.signOut();

  // Refresh halaman utama
  revalidatePath('/', 'layout');
  redirect('/');
}
