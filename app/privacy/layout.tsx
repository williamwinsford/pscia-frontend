import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade - Up Ai',
  description: 'Política de Privacidade da Up Ai. Saiba como coletamos, usamos, compartilhamos e protegemos suas informações pessoais em nossa plataforma de transcrição de áudio.',
  keywords: [
    'política privacidade',
    'privacidade dados',
    'LGPD',
    'proteção dados',
    'privacidade up ai',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Política de Privacidade - Up Ai',
    description: 'Política de Privacidade da Up Ai. Saiba como protegemos suas informações pessoais',
    url: '/privacy',
    type: 'website',
    images: [
      {
        url: '/logo-up-ai.png',
        width: 1024,
        height: 1024,
        alt: 'Up Ai - Política de Privacidade',
      },
    ],
  },
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


