import { NextResponse } from 'next/server';
import { analyzeCV } from '@/lib/ai/gemini.service';

export async function POST(req: Request) {
  try {
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
