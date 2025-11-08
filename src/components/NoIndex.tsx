'use client';

import { useEffect } from 'react';

/**
 * Componente para adicionar meta tags noindex, nofollow
 * Previne que bots e mecanismos de busca indexem a página
 * 
 * Uso: Adicione <NoIndex /> no início do componente da página
 */
export function NoIndex() {
  useEffect(() => {
    // Remove meta tags existentes para evitar duplicatas
    const existingRobots = document.querySelector('meta[name="robots"]');
    const existingGoogle = document.querySelector('meta[name="googlebot"]');
    
    if (existingRobots) {
      existingRobots.remove();
    }
    if (existingGoogle) {
      existingGoogle.remove();
    }

    // Adiciona meta tag robots com noindex, nofollow
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow, noarchive, nosnippet';
    document.head.appendChild(metaRobots);

    // Adiciona meta tag específica para Google
    const metaGoogle = document.createElement('meta');
    metaGoogle.name = 'googlebot';
    metaGoogle.content = 'noindex, nofollow';
    document.head.appendChild(metaGoogle);

    // Cleanup ao desmontar
    return () => {
      const robotsTag = document.querySelector('meta[name="robots"][content="noindex, nofollow, noarchive, nosnippet"]');
      const googleTag = document.querySelector('meta[name="googlebot"][content="noindex, nofollow"]');
      if (robotsTag) {
        robotsTag.remove();
      }
      if (googleTag) {
        googleTag.remove();
      }
    };
  }, []);

  return null;
}

