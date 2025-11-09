import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato - Up Ai',
  description: 'Entre em contato com a equipe Up Ai. Estamos prontos para ajudar com suas dúvidas sobre transcrição de áudio, planos, suporte técnico e parcerias.',
  keywords: [
    'contato up ai',
    'suporte transcrição',
    'fale conosco',
    'atendimento up ai',
    'suporte técnico',
    'contato empresa',
  ],
  openGraph: {
    title: 'Contato - Up Ai',
    description: 'Entre em contato com a equipe Up Ai. Estamos prontos para ajudar com suas dúvidas',
    url: '/contact',
    type: 'website',
    images: [
      {
        url: '/logo-up-ai.png',
        width: 1024,
        height: 1024,
        alt: 'Up Ai - Contato',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contato - Up Ai',
    description: 'Entre em contato com a equipe Up Ai',
    images: ['/logo-up-ai.png'],
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


