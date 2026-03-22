/**
 * URL ที่ตั้งค่าใน next.config (remotePatterns / domains) — ใช้ next/image ได้
 */
export function shouldUseNextImage(src: string): boolean {
  if (!src || src.startsWith('data:') || src.startsWith('/')) return false
  try {
    const { hostname } = new URL(src)
    if (hostname === 'placehold.co') return true
    if (hostname.endsWith('.supabase.co')) return true
    return false
  } catch {
    return false
  }
}
