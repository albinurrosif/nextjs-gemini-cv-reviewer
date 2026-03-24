import Link from 'next/link';
import { ModeToggle } from './ModeToggle';
import { logout } from '@/app/(auth)/login/actions';
import { Button } from '@/components/ui/button';
import { type User } from '@supabase/supabase-js';

// --- IMPORT DROPDOWN & ICON ---
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserCircleIcon, LayoutDashboardIcon, LogOutIcon } from 'lucide-react';

export default function Navbar({ user }: { user: User | null }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-5xl flex h-14 items-center justify-between px-4 md:px-8">
        {/* KIRI: Logo & Link Utama */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-1">
            <span className="text-primary">Pre</span>Apply
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
        <div className="flex items-center gap-2 md:gap-4">
          <ModeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircleIcon className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Akun Saya</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile" className="flex items-center w-full">
                    <UserCircleIcon className="mr-2 h-4 w-4" />
                    <span>Profil Saya</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard" className="flex items-center w-full">
                    <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer text-destructive focus:text-destructive">
                  <form action={logout} className="w-full">
                    <button type="submit" className="flex items-center w-full">
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
