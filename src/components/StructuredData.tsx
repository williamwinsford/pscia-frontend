'use client';

import { getSiteUrl } from '@/lib/config';

// Obter URL base (client-side)
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return getSiteUrl();
};

// Structured data base para organização
export const getOrganizationSchema = () => {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Up Ai',
    url: baseUrl,
    logo: `${baseUrl}/logo-up-ai.png`,
    description: 'Plataforma de transcrição de áudio com inteligência artificial',
    sameAs: [
      // Adicione links de redes sociais aqui quando disponíveis
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contato@upai.com', // Atualize com o email real
    },
  };
};

// Structured data para página inicial
export const getHomePageSchema = () => {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Up Ai',
    url: baseUrl,
    description: 'Transforme seus arquivos de áudio em texto com precisão usando inteligência artificial',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};
