import AnalyzeForm from '@/components/AnalyzerForm';

export default async function Home() {
  return (
    <main className="flex-1 w-full flex flex-col items-center py-6 px-4 md:py-12 md:px-8">
      <AnalyzeForm />
    </main>
  );
}
