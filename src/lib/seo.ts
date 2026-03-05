import { getSiteUrl } from '@/config/site'
import { locales, localeHreflang } from '@/config/i18n'

/**
 * สร้าง canonical + hreflang alternates สำหรับ Next.js metadata
 * @param locale  - locale ปัจจุบัน เช่น 'th'
 * @param subpath - เส้นทางหลัง locale เช่น '/listings' หรือ '/listings/abc123'
 */
export function buildAlternates(locale: string, subpath: string = '') {
  const base = getSiteUrl()
  const suffix = subpath.startsWith('/') ? subpath : subpath ? `/${subpath}` : ''
  return {
    canonical: `${base}/${locale}${suffix}`,
    languages: {
      ...Object.fromEntries(
        locales.map((loc) => [localeHreflang[loc], `${base}/${loc}${suffix}`])
      ),
      'x-default': `${base}/th${suffix}`,
    },
  }
}

/** สร้าง JSON-LD BreadcrumbList */
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
