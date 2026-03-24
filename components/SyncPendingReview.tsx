'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { saveReviewAction } from '@/app/actions/review';
import { toast } from 'sonner'; // <-- Import Sonner

export default function SyncPendingReview() {
  const router = useRouter();
  const hasSynced = useRef(false); // Mencegah fungsi berjalan 2x (sifat React StrictMode)

  useEffect(() => {
    if (hasSynced.current) return;

    const pendingData = localStorage.getItem('pendingReview');

    if (pendingData) {
      hasSynced.current = true; // Tandai bahwa sedang dikerjakan

      try {
        const { formData, aiResult } = JSON.parse(pendingData);

        // Gunakan toast.promise dari Sonner!
        toast.promise(
          saveReviewAction(formData, aiResult).then((res) => {
            if (res.success) {
              localStorage.removeItem('pendingReview');
              router.refresh();
              return 'Sukses';
            } else {
              throw new Error(res.error);
            }
          }),
          {
            loading: 'Menyinkronkan hasil analisis Anda...',
            success: 'Berhasil! Data telah disimpan ke Dashboard.',
            error: 'Gagal menyinkronkan data.',
          },
        );
      } catch (error) {
        console.error('Gagal menyinkronkan data tamu', error);
        localStorage.removeItem('pendingReview');
      }
    }
  }, [router]);

  return null;
}
