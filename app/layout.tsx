// FILE: /app/layout.tsx
import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Kavya Parmar — Game Dev · AI Engineer · Creative Technologist',
  description: 'Teenage developer from India building games, AI tools, and cinematic web experiences.',
  openGraph: {
    title: 'Kavya Parmar',
    description: 'Game Dev · AI Engineer · Creative Technologist',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise antialiased">
        {children}
      </body>
    </html>
  )
}
