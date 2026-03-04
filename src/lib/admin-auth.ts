import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const ADMIN_COOKIE = 'admin_session'
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || process.env.SESSION_SECRET || 'admin-secret-change-in-production'
)
const JWT_EXP = '7d'

export type AdminSession = {
  id: string
  email: string
  name: string
  role: 'admin' | 'staff'
}

export async function verifyAdminCredentials(email: string, password: string): Promise<AdminSession | null> {
  const emailNorm = email.trim().toLowerCase()
  let admin: { id: string; email: string; name: string; role: string; passwordHash: string; isActive: boolean } | null = null
  try {
    admin = await prisma.adminUser.findUnique({
      where: { email: emailNorm },
    })
  } catch {
    // ตาราง AdminUser ยังไม่มี (ยังไม่ได้รัน migration) — ไม่ให้ crash
    return null
  }
  if (!admin || !admin.isActive) return null
  const ok = await bcrypt.compare(password, admin.passwordHash)
  if (!ok) return null
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role as 'admin' | 'staff',
  }
}

export async function setAdminSession(session: AdminSession): Promise<void> {
  const cookieStore = await cookies()
  const token = await new SignJWT({
    id: session.id,
    email: session.email,
    name: session.name,
    role: session.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXP)
    .sign(JWT_SECRET)
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

export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const email = String(payload.email ?? '')
    const name = String(payload.name ?? payload.email ?? '')
    return {
      id: String(payload.id ?? ''),
      email,
      name: name || email,
      role: (payload.role === 'admin' ? 'admin' : 'staff') as 'admin' | 'staff',
    }
  } catch {
    return null
  }
}

export async function hasAdminSession(): Promise<boolean> {
  const admin = await getCurrentAdmin()
  return admin !== null
}

/** เฉพาะ role admin ถึงเข้า settings ได้ */
export async function canAccessSettings(): Promise<boolean> {
  const admin = await getCurrentAdmin()
  return admin?.role === 'admin'
}

/** เฉพาะ role admin ถึงจัดการบัญชีผู้ใช้หลังบ้านได้ */
export async function canManageAdminUsers(): Promise<boolean> {
  const admin = await getCurrentAdmin()
  return admin?.role === 'admin'
}
