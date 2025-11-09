import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós - Up Ai',
  description: 'Conheça a Up Ai, empresa de tecnologia focada em democratizar o acesso à inteligência artificial para transcrição e análise de áudio. Nossa missão, visão e valores.',
  keywords: [
    'sobre up ai',
    'empresa transcrição áudio',
    'história up ai',
    'missão up ai',
    'tecnologia transcrição',
    'IA transcrição',
  ],
  openGraph: {
    title: 'Sobre Nós - Up Ai',
    description: 'Conheça a Up Ai, empresa de tecnologia focada em transcrição de áudio com inteligência artificial',
    url: '/about',
    type: 'website',
    images: [
      {
        url: '/logo-up-ai.png',
        width: 1024,
        height: 1024,
        alt: 'Up Ai - Sobre Nós',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre Nós - Up Ai',
    description: 'Conheça a Up Ai, empresa de tecnologia focada em transcrição de áudio com IA',
    images: ['/logo-up-ai.png'],
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


