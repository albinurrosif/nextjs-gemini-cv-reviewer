import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-border bg-muted/20 text-center text-sm text-muted-foreground mt-auto">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
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
            <Link href="/" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
