import { NextResponse } from 'next/server';
import { analyzeGeneralCV } from '@/lib/ai/gemini.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cvText } = body;

    if (!cvText) {
      return NextResponse.json({ error: 'Missing CV Text' }, { status: 400 });
    }

    // 1. Panggil Service Gemini
    const aiResult = await analyzeGeneralCV(cvText);

    // 2. Kembalikan ke UI Frontend
    return NextResponse.json({ success: true, data: aiResult });
  } catch (error) {
    console.error('API Route Error (General):', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
