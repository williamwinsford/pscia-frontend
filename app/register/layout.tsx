import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cadastro - Up Ai',
  description: 'Crie sua conta gratuita na Up Ai e comece a transcrever seus arquivos de áudio com inteligência artificial. Cadastro rápido e fácil.',
  keywords: [
    'cadastro up ai',
    'criar conta',
    'registro gratuito',
    'cadastro transcrição',
    'conta grátis',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Cadastro - Up Ai',
    description: 'Crie sua conta gratuita na Up Ai e comece a transcrever seus arquivos de áudio com IA',
    url: '/register',
    type: 'website',
    images: [
      {
        url: '/logo-up-ai.png',
        width: 1024,
        height: 1024,
        alt: 'Up Ai - Cadastro',
      },
    ],
  },
  alternates: {
    canonical: '/register',
  },
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

