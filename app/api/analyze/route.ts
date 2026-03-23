import { NextResponse } from 'next/server';
import { analyzeCV } from '@/lib/ai/gemini.service';

// --- [BARU] IMPORT UNTUK AUTH & DATABASE ---
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Terima data dari Form UI
    const body = await req.json();
    const { role, company, jobType, jobDescription, cvText } = body;

    // 2. Validasi sederhana
    if (!role || !company || !jobType || !jobDescription || !cvText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // --- [BARU] 3. CEK IDENTITAS USER ---
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 4. Kirim ke Gemini (Kode lamamu, tidak berubah)
    const aiResult = await analyzeCV(body, cvText);

    // --- [BARU] 5. SIMPAN KE DATABASE (JIKA LOGIN) ---
    if (user) {
      try {
        await prisma.review.create({
          data: {
            userId: user.id, // Menyambungkan hasil ini dengan user yang sedang login
            role: role, // Posisi yang dilamar
            company: company,
            jobType: jobType, // Perusahaan yang dilamar
            matchScore: aiResult.matchScore, // Skor kecocokan

            // Simpan seluruh JSON hasil AI ke dalam satu kolom
            resultJson: JSON.stringify(aiResult),
          },
        });
        console.log('✅ Berhasil menyimpan riwayat review ke database!');
      } catch (dbError) {
        // Kita tangkap error DB di sini agar jika DB mati, user tetap bisa melihat hasil AI di layarnya
        console.error('❌ Gagal menyimpan ke database:', dbError);
      }
    } else {
      console.log('⚠️ User tamu (Guest). Hasil review tidak disimpan ke database.');
    }

    // 6. Kembalikan hasil ke frontend
    return NextResponse.json({ success: true, data: aiResult });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
