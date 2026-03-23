'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

// 1. [BARU] buat "Buku Tamu" baru agar TypeScript mengizinkan indicatorColor
interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps // 2. Gunakan Buku Tamu baru di sini
>(({ className, value, indicatorColor, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref} className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)} {...props}>
    <ProgressPrimitive.Indicator
      // 3. Masukkan warna kustomnya di sini
      className={cn('h-full w-full flex-1 transition-all', indicatorColor || 'bg-primary')}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
