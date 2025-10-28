import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EdenJomla - Perfume Factures',
  description: 'Calculate and manage perfume invoices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
