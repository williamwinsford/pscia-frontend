import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Up Ai',
  description: 'Faça login na sua conta Up Ai e acesse sua plataforma de transcrição de áudio com inteligência artificial. Acesse suas transcrições e análises.',
  keywords: [
    'login up ai',
    'entrar conta',
    'acessar plataforma',
    'login transcrição',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Login - Up Ai',
    description: 'Faça login na sua conta Up Ai e acesse sua plataforma de transcrição de áudio',
    url: '/login',
    type: 'website',
    images: [
      {
        url: '/logo-up-ai.png',
        width: 1024,
        height: 1024,
        alt: 'Up Ai - Login',
      },
    ],
  },
  alternates: {
    canonical: '/login',
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

