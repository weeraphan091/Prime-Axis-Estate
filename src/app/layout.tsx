import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { ContactProvider } from '@/context/ContactContext'
import { AuthProvider } from '@/context/AuthContext'
import { JsonLdOrganization } from '@/components/JsonLdOrganization'
import { NavigationProgress } from '@/components/NavigationProgress'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { HtmlLangSync } from '@/components/HtmlLangSync'
import { LocaleProvider } from '@/context/LocaleContext'
import { defaultLocale } from '@/config/i18n'
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
    'Pattaya Estate Hub',
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
    images: [
      {
        url: `${siteUrl}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Pattaya Real Estate`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | นายหน้าอสังหา พัทยา`,
    description: DEFAULT_DESCRIPTION,
    images: [`${siteUrl}/og-default.jpg`],
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
    <html lang="th" className={`${dmSans.variable} ${dmSerif.variable}`} suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <>
            <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="anonymous" />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <HtmlLangSync />
        <GoogleAnalytics />
        <JsonLdOrganization />
        {/*
          Default locale สำหรับ route ที่ไม่ได้อยู่ใต้ app/[locale] (เช่น /contact, /list-your-property)
          หน้าใต้ [locale]/layout จะมี LocaleProvider ชั้นใน override ตาม params
        */}
        <LocaleProvider locale={defaultLocale}>
          <AuthProvider>
            <ContactProvider>
              <FavoritesProvider>
                <NavigationProgress />
                {children}
              </FavoritesProvider>
            </ContactProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
