import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const COOKIE_NAME = 'pattaya_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecret(): Uint8Array {
  const raw = process.env.SESSION_SECRET
  if (!raw && process.env.NODE_ENV === 'production') {
    throw new Error('[session] SESSION_SECRET is required in production — set it in Vercel env vars')
  }
  return new TextEncoder().encode(raw || 'dev-only-secret-do-not-use-in-production')
}

export type SessionPayload = { userId: string; email: string }

export async function createSession(payload: SessionPayload): Promise<void> {
  const cookieStore = await cookies()
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${MAX_AGE}s`)
    .setIssuedAt()
    .sign(getSecret())
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
    const { payload } = await jwtVerify(token, getSecret())
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
