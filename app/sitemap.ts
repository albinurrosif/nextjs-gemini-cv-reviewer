import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Ganti URL ini dengan domain aslimu
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://preapply.vercel.app';

  return [
    {
      url: baseUrl, // Beranda Utama
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0, // Prioritas tertinggi
    },
    {
      url: `${baseUrl}/match`, // Halaman Cek Spesifik
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/general`, // Halaman Cek Umum
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`, // Halaman Login
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
