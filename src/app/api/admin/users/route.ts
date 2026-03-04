import { NextResponse } from 'next/server'
import { canManageAdminUsers } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/** รายการบัญชีผู้ใช้หลังบ้าน — เฉพาะ admin */
export async function GET() {
  const ok = await canManageAdminUsers()
  if (!ok) {
    return NextResponse.json({ error: 'ไม่มีสิทธิ์' }, { status: 403 })
  }
  try {
    const list = await prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    })
    return NextResponse.json(list)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'โหลดรายการไม่สำเร็จ' }, { status: 500 })
  }
}

/** สร้างบัญชีผู้ใช้หลังบ้าน (พนักงาน) — เฉพาะ admin */
export async function POST(request: Request) {
  const ok = await canManageAdminUsers()
  if (!ok) {
    return NextResponse.json({ error: 'ไม่มีสิทธิ์' }, { status: 403 })
  }
  try {
    const body = await request.json()
    const { email, password, name, role } = body
    const emailNorm = (email || '').trim().toLowerCase()
    if (!emailNorm || !password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลและรหัสผ่าน (อย่างน้อย 6 ตัว)' },
        { status: 400 }
      )
    }
    const existing = await prisma.adminUser.findUnique({ where: { email: emailNorm } })
    if (existing) {
      return NextResponse.json({ error: 'อีเมลนี้มีในระบบแล้ว' }, { status: 400 })
    }
    const roleVal = role === 'admin' ? 'admin' : 'staff'
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const now = new Date().toISOString().slice(0, 19)
    const user = await prisma.adminUser.create({
      data: {
        email: emailNorm,
        passwordHash,
        name: (name || emailNorm).trim() || emailNorm,
        role: roleVal,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      select: { id: true, email: true, name: true, role: true, isActive: true, createdAt: true },
    })
    return NextResponse.json(user)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'สร้างบัญชีไม่สำเร็จ' }, { status: 500 })
  }
}
