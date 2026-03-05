import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getSiteUrl } from '@/config/site'
import { buildBreadcrumbJsonLd } from '@/lib/seo'

type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items, locale }: { items: Crumb[]; locale: string }) {
  const base = getSiteUrl()
  const jsonLdItems = items.map((item) => ({
    name: item.label,
    url: item.href
      ? `${base}${item.href.startsWith('/') ? item.href : `/${item.href}`}`
      : `${base}/${locale}`,
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbJsonLd(jsonLdItems)) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-stone-500 mb-4">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-400" />}
              {item.href && i < items.length - 1 ? (
                <Link href={item.href} className="hover:text-primary-600 transition">
                  {item.label}
                </Link>
              ) : (
                <span className={i === items.length - 1 ? 'text-stone-700 font-medium' : ''}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
