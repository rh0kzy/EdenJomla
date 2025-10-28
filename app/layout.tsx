import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EdenJomla - Perfume Factures',
  description: 'Calculate and manage perfume invoices',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>{children}</body>
    </html>
  )
}
