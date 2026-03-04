import { MetadataRoute } from 'next'
import { getSiteUrl } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/login', '/register'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api/', '/login', '/register'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
