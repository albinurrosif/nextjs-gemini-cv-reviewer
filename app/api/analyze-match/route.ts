import { NextResponse } from 'next/server';
import { analyzeCV } from '@/lib/ai/gemini.service';
import { checkRateLimit } from '@/lib/ratelimit';

export async function POST(req: Request) {
  try {
    // 1. Ambil IP Address User (Di Vercel, IP ada di header 'x-forwarded-for')
    // Jika tidak ada (di localhost), pakai '127.0.0.1'
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';

    // 2. Cek Rate Limit
    const { success } = await checkRateLimit(ip);

    // 3. Jika melebihi batas (spam), status 429 (Too Many Requests)
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak permintaan. Silakan coba lagi dalam 1 menit.',
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { role, company, jobType, jobDescription, cvText } = body;

    if (!role || !company || !jobType || !jobDescription || !cvText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Langsung panggil Gemini (Tanpa cek Auth/Database)
    const aiResult = await analyzeCV(body, cvText);

    // 2. Langsung kembalikan ke UI Frontend
    return NextResponse.json({ success: true, data: aiResult });
  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
