'use client';

import { useActionState } from 'react';
import { login, signup, type ActionState } from './actions';

// State awal: tidak ada error
const initialState: ActionState = { error: null };

export default function LoginPage() {
  // Hook ini akan mengeksekusi fungsi di server dan menangkap hasilnya (state)
  const [loginState, loginAction] = useActionState(login, initialState);
  const [signupState, signupAction] = useActionState(signup, initialState);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Masuk ke PreApply</h2>

        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input id="email" name="email" type="email" required className="text-gray-700 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input id="password" name="password" type="password" required className="text-gray-700 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {/* Tombol memanggil action yang dihasilkan oleh useActionState */}
            <button formAction={loginAction} className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700">
              Log in
            </button>
            <button formAction={signupAction} className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50">
              Sign up
            </button>
          </div>
        </form>

        {/* Tempat menampilkan error jika login gagal */}
        {loginState?.error && <p className="mt-4 text-center text-sm font-medium text-red-500">Login Gagal: {loginState.error}</p>}

        {/* Tempat menampilkan error jika signup gagal */}
        {signupState?.error && <p className="mt-4 text-center text-sm font-medium text-red-500">Daftar Gagal: {signupState.error}</p>}
      </div>
    </div>
  );
}
