import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Cek apakah env vars ada (agar tidak error saat build/dev lokal tanpa redis)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Inisialisasi Redis HANYA jika kredensial tersedia
const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

// Konfigurasi Rate Limiter: Maksimal 3 request per 1 menit per IP
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(3, '1 m'), // 3 request per 1 minute
      analytics: true, // Opsional: Untuk melihat statistik di dashboard Upstash
    })
  : null;

export async function checkRateLimit(ip: string) {
  // 1. FAIL-OPEN: Jika kredensial belum diset (misal lupa pasang .env), biarkan lewat!
  if (!ratelimit) {
    console.warn('⚠️ Rate limiter tidak aktif (Env vars Upstash belum diset). Bypass...');
    return { success: true };
  }

  try {
    // 2. Eksekusi pengecekan ke Redis
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);
    return { success, limit, remaining, reset };
  } catch (error) {
    // 3. FAIL-OPEN: JIKA REDIS DOWN ATAU TIMEOUT, TETAP IZINKAN USER MASUK!
    console.error('🔴 Upstash Redis Error, mem-bypass rate limiter:', error);
    return { success: true };
  }
}
