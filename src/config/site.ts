/** URL หลักของเว็บ — ใช้ใน canonical, sitemap, Open Graph (ใส่ใน .env เป็น NEXT_PUBLIC_SITE_URL) */
export function getSiteUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (typeof process.env.VERCEL_URL === 'string' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'https://primeaxisestate.com'
}

export const SITE_NAME = 'PRIME AXIS ESTATE'
export const DEFAULT_DESCRIPTION =
  'PRIME AXIS ESTATE นายหน้าอสังหาริมทรัพย์พัทยา ค้นหาคอนโด บ้าน วิลล่า ที่ดิน ขาย-เช่า ฝากขายฝากเช่า'
