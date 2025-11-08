import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { StructuredDataScript } from '@/components/StructuredDataScript'

import { getSiteUrl } from '@/lib/config';

// Obter URL base do ambiente
const getBaseUrl = () => {
  return getSiteUrl();
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'Up Ai - Transcrição de Áudio com Inteligência Artificial',
    template: '%s | Up Ai',
  },
  description: 'Transforme seus arquivos de áudio em texto com precisão usando inteligência artificial. Plataforma de transcrição e análise de áudio com IA avançada.',
  keywords: [
    'transcrição de áudio',
    'transcrição com IA',
    'inteligência artificial',
    'conversão de áudio para texto',
    'transcrição automática',
    'análise de áudio',
    'whisper',
    'speech to text',
    'transcrição em português',
  ],
  authors: [{ name: 'Up Ai' }],
  creator: 'Up Ai',
  publisher: 'Up Ai',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo-up-ai.png', sizes: '1024x1024', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/logo-up-ai.png', sizes: '1024x1024', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Up Ai - AI-powered audio transcription and analysis',
    description: 'Transforme seus arquivos de áudio em texto com precisão usando inteligência artificial',
    url: getBaseUrl(),
    siteName: 'Up Ai',
    images: [
      {
        url: '/logo-up-ai.png',
        width: 1024,
        height: 1024,
        alt: 'Up Ai Logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Up Ai - AI-powered audio transcription and analysis',
    description: 'Transforme seus arquivos de áudio em texto com precisão usando inteligência artificial',
    images: ['/logo-up-ai.png'],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <StructuredDataScript />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}