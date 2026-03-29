import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PreApply | Cek Kecocokan CV & Standar ATS Berbasis AI',
  description: 'Audit CV-mu menggunakan AI. Dapatkan skor ATS, temukan gap dengan lowongan kerja, dan buat draft CV yang lebih menjual dalam hitungan detik.',

  verification: {
    google: 'FMrUmPZzKPul48fYnMY8yGvJbZC5hJpp7v1vQ-mjfow',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextTopLoader color="var(--primary)" showSpinner={false} />
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
