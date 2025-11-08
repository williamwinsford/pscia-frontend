import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso - Up Ai',
  description: 'Termos de Uso da plataforma Up Ai. Leia nossos termos e condições de uso do serviço de transcrição de áudio com inteligência artificial.',
  keywords: [
    'termos de uso',
    'condições uso',
    'termos serviço',
    'contrato up ai',
    'regras uso',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Termos de Uso - Up Ai',
    description: 'Termos de Uso da plataforma Up Ai. Leia nossos termos e condições de uso',
    url: '/terms',
    type: 'website',
    images: [
      {
        url: '/logo-up-ai.png',
        width: 1024,
        height: 1024,
        alt: 'Up Ai - Termos de Uso',
      },
    ],
  },
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

