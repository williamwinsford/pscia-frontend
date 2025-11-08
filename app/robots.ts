import { MetadataRoute } from 'next'

// Função auxiliar para obter URL base (server-side)
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NODE_ENV === 'production') {
    // Em produção, deve ser configurado via NEXT_PUBLIC_SITE_URL
    return 'http://localhost:3000';
  }
  return 'http://localhost:3000';
};

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/contact',
          '/pricing',
          '/privacy',
          '/terms',
          '/cookies',
          '/login',
          '/register',
        ],
        disallow: [
          '/dashboard',
          '/upload',
          '/history',
          '/transcription/',
          '/notifications',
          '/profile',
          '/templates',
          '/analytics',
          '/chat',
          '/api/',
          '/_next/',
          '/static/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

