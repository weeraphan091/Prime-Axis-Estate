import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { ContactProvider } from '@/context/ContactContext'
import { AuthProvider } from '@/context/AuthContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PRIME AXIS ESTATE | นายหน้าอสังหา ขาย-เช่า ฝากขายฝากเช่า',
  description:
    'PRIME AXIS ESTATE ค้นหาคอนโด บ้าน วิลล่า ที่ดิน ขาย-เช่า หรือฝากขาย-ฝากเช่าทรัพย์กับเรา',
  keywords: 'นายหน้าอสังหา, อสังหาริมทรัพย์, ขายคอนโด, เช่าบ้าน, ฝากขาย, Prime Axis Estate',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <ContactProvider>
            <FavoritesProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </FavoritesProvider>
          </ContactProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
