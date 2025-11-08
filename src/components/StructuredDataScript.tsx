'use client';

import { useEffect } from 'react';
import { getSiteUrl } from '@/lib/config';

// Obter URL base (client-side)
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return getSiteUrl();
};

export function StructuredDataScript() {
  useEffect(() => {
    const baseUrl = getBaseUrl();
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Up Ai',
      url: baseUrl,
      logo: `${baseUrl}/logo-up-ai.png`,
      description: 'Plataforma de transcrição de áudio com inteligência artificial',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'contato@upai.com',
      },
    };

    // Remove script existente se houver
    const existingScript = document.getElementById('organization-schema');
    if (existingScript) {
      existingScript.remove();
    }

    // Adiciona o script de structured data
    const script = document.createElement('script');
    script.id = 'organization-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(organizationSchema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('organization-schema');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return null;
}

