import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
  title: 'Up Ai - Transcrição de Áudio com Inteligência Artificial',
  description: 'Transforme seus arquivos de áudio em texto com precisão usando inteligência artificial. Plataforma de transcrição e análise de áudio com IA avançada. Experimente grátis!',
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
    'transcrição online',
    'IA para áudio',
  ],
  openGraph: {
    title: 'Up Ai - Transcrição de Áudio com Inteligência Artificial',
    description: 'Transforme seus arquivos de áudio em texto com precisão usando inteligência artificial. Experimente grátis!',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/logo-up-ai.png',
        width: 1024,
        height: 1024,
        alt: 'Up Ai - Transcrição de Áudio com IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Up Ai - Transcrição de Áudio com Inteligência Artificial',
    description: 'Transforme seus arquivos de áudio em texto com precisão usando inteligência artificial.',
    images: ['/logo-up-ai.png'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return <HomePageClient />
}
