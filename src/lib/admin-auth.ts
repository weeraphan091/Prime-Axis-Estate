import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'admin_session'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export function getAdminPassword(): string {
  return ADMIN_PASSWORD
}

export function isAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = `token_${Date.now()}_${Math.random().toString(36).slice(2)}`
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}

export async function hasAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) return false
  return token.startsWith('token_')
}
