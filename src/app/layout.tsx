import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { ContactProvider } from '@/context/ContactContext'
import { AuthProvider } from '@/context/AuthContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { JsonLdOrganization } from '@/components/JsonLdOrganization'
import { NavigationProgress } from '@/components/NavigationProgress'
import { getSiteUrl, SITE_NAME, DEFAULT_DESCRIPTION } from '@/config/site'

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

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} | นายหน้าอสังหา พัทยา ขาย-เช่า ฝากขายฝากเช่า`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    'นายหน้าอสังหา',
    'อสังหาริมทรัพย์พัทยา',
    'ขายคอนโดพัทยา',
    'เช่าบ้านพัทยา',
    'ฝากขายฝากเช่า',
    'Prime Axis Estate',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | นายหน้าอสังหา พัทยา ขาย-เช่า ฝากขายฝากเช่า`,
    description: DEFAULT_DESCRIPTION,
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | นายหน้าอสังหา พัทยา`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: siteUrl },
  verification: {
    // ใส่ค่าเมื่อมี: google: 'xxx', yandex: 'xxx'
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <JsonLdOrganization />
        <AuthProvider>
          <ContactProvider>
            <FavoritesProvider>
              <NavigationProgress />
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
