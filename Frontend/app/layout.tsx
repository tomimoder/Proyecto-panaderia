import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { OrderProvider } from '@/context/OrderContext'
import { Sidebar } from '@/components/Sidebar'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Dulce Momento - Sistema de Pedidos',
  description: 'Sistema de gestión de pedidos para pastelería',
  generator: '',
  icons: {
    icon: [
      {
        url: '/cake.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/cake.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/cake.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/cake.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <OrderProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-64">
              <div className="container mx-auto px-4 py-8 pt-16 lg:pt-8">
                {children}
              </div>
            </main>
          </div>
        </OrderProvider>
      </body>
    </html>
  )
}
