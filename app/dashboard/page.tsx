import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function DashboardPage() {
  // 1. Ambil token
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. AMBIL DATA DARI DATABASE (PRISMA)
  // Ambil semua review HANYA milik user ini, urutkan dari yang paling baru
  const userReviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  // 3. TAMPILKAN KE LAYAR (UI)
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Dashboard */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Anda</h1>
          <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + Analisis CV Baru
          </Link>
        </div>

        <p className="mb-6 text-gray-600">Total riwayat analisis: {userReviews.length}</p>

        {/* Daftar Kartu Riwayat */}
        {userReviews.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-lg shadow border border-gray-200">
            <p className="text-gray-500">Anda belum memiliki riwayat analisis CV.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {userReviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow border border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{review.role}</h2>
                  <p className="text-gray-600">
                    {review.company} • {review.jobType}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Dianalisis pada: {new Date(review.createdAt).toLocaleDateString('id-ID')}</p>
                </div>

                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-2xl font-bold text-blue-600">Skor: {review.matchScore}</div>
                  <Link href={`/dashboard/${review.id}`} className="text-sm text-blue-500 underline hover:text-blue-700">
                    Lihat Detail
                  </Link>{' '}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
