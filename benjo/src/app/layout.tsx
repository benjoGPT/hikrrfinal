import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Benjo Hike Tracker',
  description: 'Track your hiking adventures, summits, and mountain memories.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
