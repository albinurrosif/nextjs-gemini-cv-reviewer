'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { EvaluationResult } from '@/lib/evaluation/scorer.service';

export async function saveReviewAction(formData: { role: string; company: string; jobType: string }, aiResult: EvaluationResult) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Silakan login terlebih dahulu untuk menyimpan riwayat.' };
  }

  try {
    await prisma.review.create({
      data: {
        userId: user.id,
        role: formData.role,
        company: formData.company,
        jobType: formData.jobType,
        matchScore: aiResult.matchScore,
        resultJson: JSON.stringify(aiResult),
      },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Gagal menyimpan:', error);
    return { success: false, error: 'Gagal menyimpan ke database. Coba lagi.' };
  }
}
