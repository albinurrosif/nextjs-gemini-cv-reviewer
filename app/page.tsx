import AnalyzerForm from '@/components/AnalyzerForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Konten Utama */}
      <main className="flex-grow py-10">
        <AnalyzerForm />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-foreground/10 text-center text-sm text-foreground/60 mt-10">
        <p>© {new Date().getFullYear()} PreApply V2. Built with Next.js & Gemini AI.</p>
        <p className="mt-1">
          Developed by{' '}
          <a href="#" className="font-bold text-blue-500 hover:underline">
            Albi Nur Rosif
          </a>
        </p>
      </footer>
    </div>
  );
}
