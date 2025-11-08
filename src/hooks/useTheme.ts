'use client';

import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('light');

  // Carregar o tema salvo do localStorage ao montar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    if (savedTheme && ['light', 'dark', 'high-contrast'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  // Aplicar o tema ao documento quando o componente monta ou o tema muda
  useEffect(() => {
    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  // Salvar o tema no localStorage e aplicar no documento
  const changeTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return {
    theme,
    changeTheme,
  };
}

