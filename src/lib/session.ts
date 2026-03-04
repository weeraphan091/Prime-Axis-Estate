import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'pattaya-property-secret-change-in-production'
)
const COOKIE_NAME = 'pattaya_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export type SessionPayload = { userId: string; email: string }

export async function createSession(payload: SessionPayload): Promise<void> {
  const cookieStore = await cookies()
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${MAX_AGE}s`)
    .setIssuedAt()
    .sign(SECRET)
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    const userId = payload.userId as string
    const email = payload.email as string
    return userId && email ? { userId, email } : null
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
