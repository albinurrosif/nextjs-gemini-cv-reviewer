import { NextResponse } from 'next/server';
import { analyzeCV } from '@/lib/ai/gemini.service';

export async function POST(req: Request) {
  try {
    // 1. Terima data dari Form UI
    const body = await req.json();
    const { role, company, jobType, jobDescription, cvText } = body;

    // 2. Validasi sederhana
    if (!role || !company || !jobType || !jobDescription || !cvText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. Kirim ke Gemini
    const aiResult = await analyzeCV(body, cvText);

    // 4. Kembalikan hasil ke frontend
    return NextResponse.json({ success: true, data: aiResult });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
