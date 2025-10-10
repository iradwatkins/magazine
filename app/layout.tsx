import { SessionProvider } from './providers'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stepperslife Magazine',
  description: 'Community content platform for Chicago Steppin articles, stories, and news',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </SessionProvider>
  )
}
