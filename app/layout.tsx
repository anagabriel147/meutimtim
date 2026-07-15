import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Exo_2, Playfair_Display, Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

/* Geometric sans-serif — brand headings ("BOXEN BOLD" style) */
const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-exo2',
})

/* Classic elegant serif — slogans / premium subtitles ("BemboStd Bold" style) */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'TimTim — O seu caminho para o brinde perfeito.',
  description:
    'Meu TimTim: O seu caminho para o brinde perfeito. Conecte contratantes, fornecedores e assessores para eventos inesquecíveis.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#111111',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${poppins.variable} ${exo2.variable} ${playfair.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
