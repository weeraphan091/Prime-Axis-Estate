import { getSiteUrl, SITE_NAME, DEFAULT_DESCRIPTION } from '@/config/site'

export function JsonLdOrganization() {
  const base = getSiteUrl()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    url: base,
    areaServed: { '@type': 'City', name: 'พัทยา', containedInPlace: { '@type': 'Country', name: 'ประเทศไทย' } },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${base}/listings?q={search_term}` },
      'query-input': 'required name=search_term',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
