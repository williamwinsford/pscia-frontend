import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planos e Preços - Up Ai',
  description: 'Escolha o plano ideal para suas necessidades de transcrição de áudio. Planos flexíveis com preços transparentes. Comece grátis e escale conforme necessário.',
  keywords: [
    'preços transcrição áudio',
    'planos up ai',
    'preço transcrição IA',
    'planos mensais',
    'preços acessíveis',
    'transcrição barata',
  ],
  openGraph: {
    title: 'Planos e Preços - Up Ai',
    description: 'Escolha o plano ideal para suas necessidades de transcrição de áudio com preços transparentes',
    url: '/pricing',
    type: 'website',
    images: [
      {
        url: '/logo-up-ai.png',
        width: 1024,
        height: 1024,
        alt: 'Up Ai - Planos e Preços',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planos e Preços - Up Ai',
    description: 'Escolha o plano ideal para suas necessidades de transcrição de áudio',
    images: ['/logo-up-ai.png'],
  },
  alternates: {
    canonical: '/pricing',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

