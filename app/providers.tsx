'use client';

import { ThemeProvider } from '../src/theme/ThemeProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { I18nProvider } from '@/contexts/I18nContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}