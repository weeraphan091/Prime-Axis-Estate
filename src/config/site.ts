/** URL หลักของเว็บ — ใช้ใน canonical, sitemap, Open Graph */
export function getSiteUrl(): string {
  if (typeof process.env.NEXT_PUBLIC_SITE_URL === 'string' && process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  return 'https://pattayaestatehub.com'
}

export const SITE_NAME = 'Pattaya Estate Hub'
export const DEFAULT_DESCRIPTION =
  'Pattaya Estate Hub นายหน้าอสังหาริมทรัพย์พัทยา ค้นหาคอนโด บ้าน วิลล่า ที่ดิน ขาย-เช่า ฝากขายฝากเช่า'
