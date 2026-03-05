import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()
  const disallow = [
    '/admin', '/admin/',
    '/api/',
    '/login', '/register',
    '/*/login', '/*/register',
    '/favorites', '/*/favorites',
    '/compare', '/*/compare',
    '/my-listings', '/*/my-listings',
  ]
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      { userAgent: 'Googlebot', allow: '/', disallow },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
