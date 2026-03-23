import Link from 'next/link';
import { ModeToggle } from './ModeToggle';
import { logout } from '@/app/login/actions';
import { Button } from '@/components/ui/button';

export default function Navbar({ user }: { user: any }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-5xl flex h-14 items-center justify-between px-4 md:px-8">
        {/* KIRI: Logo & Link Utama */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-1">
            <span className="text-blue-600 dark:text-blue-500">Pre</span>Apply
          </Link>

          {/* Navigasi Tengah (Sembunyi di HP, Muncul di Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              CV vs JD (Spesifik)
            </Link>
            <Link href="/general" className="hover:text-foreground transition-colors">
              CV ATS (Umum)
            </Link>
          </nav>
        </div>

        {/* KANAN: Akun & Dark Mode */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground hidden md:block">{user.email}</span>
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
