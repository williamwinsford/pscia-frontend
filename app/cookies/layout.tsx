import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies - Up Ai',
  description: 'Política de Cookies da Up Ai. Entenda como utilizamos cookies e tecnologias similares em nossa plataforma de transcrição de áudio.',
  keywords: [
    'política cookies',
    'cookies up ai',
    'uso cookies',
    'tecnologias rastreamento',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Política de Cookies - Up Ai',
    description: 'Política de Cookies da Up Ai. Entenda como utilizamos cookies em nossa plataforma',
    url: '/cookies',
    type: 'website',
    images: [
      {
        url: '/logo-up-ai.png',
        width: 1024,
        height: 1024,
        alt: 'Up Ai - Política de Cookies',
      },
    ],
  },
  alternates: {
    canonical: '/cookies',
  },
}

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


