import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// Karena ini di dalam folder [id], bisa menangkap 'id' dari URL
export default async function ReviewDetailPage({ params }: { params: { id: string } }) {
  // 1. Cek Auth
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Ambil data spesifik berdasarkan ID di URL
  const { id } = await params; // Next.js 15+ mewajibkan params di-await

  const review = await prisma.review.findUnique({
    where: {
      id: id,
      userId: user.id,
    },
  });

  // Jika data tidak ditemukan, tendang ke dashboard
  if (!review) {
    redirect('/dashboard');
  }

  // 3. Bongkar JSON
  let aiData;
  try {
    aiData = JSON.parse(review.resultJson);
  } catch (e) {
    return <div className="p-8 text-red-500">Error: Data JSON rusak.</div>;
  }

  // 4. Tampilkan Detailnya
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Kembali ke Dashboard
        </Link>

        <div className="bg-white p-8 rounded-lg shadow border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{review.role}</h1>
          <p className="text-lg text-gray-600 mb-6">
            {review.company} • {review.jobType}
          </p>

          <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50 rounded-lg">
            <div className="text-4xl font-extrabold text-blue-600">{review.matchScore}</div>
            <div className="text-blue-800 font-medium">ATS Match Score</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bagian Kekuatan */}
            <div>
              <h3 className="text-xl font-bold text-green-700 mb-3">Kekuatan CV Anda</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {aiData.strengths?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Bagian Kelemahan */}
            <div>
              <h3 className="text-xl font-bold text-red-700 mb-3">Kekurangan / Gap</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {aiData.missingSkills?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Saran Strategis</h3>
            <p className="text-gray-700 leading-relaxed bg-gray-100 p-4 rounded">{aiData.strategicAdvice}</p>
          </div>

          {/* Kamu bisa menambahkan bagian Cover Letter dan Pertanyaan Interview di sini nanti! */}
        </div>
      </div>
    </main>
  );
}
