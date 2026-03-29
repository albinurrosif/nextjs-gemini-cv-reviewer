import { type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export async function proxy(request: NextRequest) {
  // Ini akan mengecek token user di setiap halaman
  return await createClient(request);
}

export const config = {
  matcher: [
    /*
     * Match semua request paths KECUALI untuk:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, dll.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
