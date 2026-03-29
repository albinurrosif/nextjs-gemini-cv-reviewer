import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://preapply.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Blokir bot Google agar tidak mengindeks halaman privat/API
      disallow: ['/dashboard', '/profile', '/api/', '/auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
