/**
 * เก็บสถานะสมาชิก (จำลอง) — ใช้ localStorage
 * เมื่อมี API จริงให้เปลี่ยนไปใช้ session/cookie
 */
const STORAGE_KEY = 'pattaya_member'

export type Member = {
  email: string
  name?: string
  phone?: string
}

export function setMember(data: Member): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function getMember(): Member | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Member
    return data?.email ? data : null
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return getMember() !== null
}

export function clearMember(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {}
}
