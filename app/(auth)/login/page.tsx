'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { login, signup, type ActionState } from './actions';
import { createClient } from '@/utils/supabase/client';

// --- SHADCN IMPORTS ---
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import { Toast } from 'radix-ui';
import { toast } from 'sonner';

const initialState: ActionState = { error: null };

export default function LoginPage() {
  const [loginState, loginAction] = useActionState(login, initialState);
  const [signupState, signupAction] = useActionState(signup, initialState);

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Melempar user ke auth/callback setelah dari Google
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      console.error('Error Google Auth:', error.message);
      toast.error('Gagal terhubung dengan Google.');
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Masuk ke PreApply</CardTitle>
          <CardDescription>Masukkan email dan password untuk mengakses dashboard.</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="nama@email.com" required className="bg-background" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" name="password" type="password" required className="bg-background" />
            </div>

            {/* Error Messages */}
            {loginState?.error && <p className="text-sm font-medium text-destructive text-center bg-destructive/10 p-2 rounded-md">Login Gagal: {loginState.error}</p>}
            {signupState?.error && <p className="text-sm font-medium text-destructive text-center bg-destructive/10 p-2 rounded-md">Daftar Gagal: {signupState.error}</p>}

            <div className="mt-2 flex flex-col gap-3">
              <Button formAction={loginAction} className="w-full font-semibold">
                Masuk
              </Button>
              <Button formAction={signupAction} variant="outline" className="w-full">
                Daftar Akun Baru
              </Button>
            </div>
          </form>

          {/* --- TOMBOL GOOGLE --- */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Atau lanjutkan dengan</span>
              </div>
            </div>

            <Button onClick={handleGoogleLogin} variant="secondary" className="w-full mt-4 gap-2" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Dengan mendaftar, kamu menyetujui +{' '}
            <Link href="/terms" className="underline hover:text-primary">
              Ketentuan Layanan
            </Link>{' '}
            dan{' '}
            <Link href="/privacy" className="underline hover:text-primary">
              Kebijakan Privasi
            </Link>{' '}
            kami.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
