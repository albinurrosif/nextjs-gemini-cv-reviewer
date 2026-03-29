import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-border bg-muted/20 text-center text-sm text-muted-foreground mt-auto">
      <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} PreApply V2. Built with Next.js & Gemini AI.</p>

        <div className="flex items-center gap-4">
          <p>
            Developed by{' '}
            <a href="https://github.com/albinurrosif" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
              Albi Nur Rosif
            </a>
          </p>
          <span className="hidden md:inline text-border">|</span>
          <div className="flex gap-3 text-xs">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
