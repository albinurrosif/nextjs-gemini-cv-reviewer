import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

/**
 * Initializes a Supabase client for the incoming request and enforces per-request user token checks.
 *
 * @param request - The Next.js request used to initialize the client
 * @returns The initialized Supabase client tied to the given request
 */
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
