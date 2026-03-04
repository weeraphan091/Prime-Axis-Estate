import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, phone } = body
    if (!email?.trim() || !password || !name?.trim()) {
      return NextResponse.json(
        { error: 'กรุณากรอก อีเมล รหัสผ่าน และชื่อ' },
        { status: 400 }
      )
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'รหัสผ่านอย่างน้อย 6 ตัว' },
        { status: 400 }
      )
    }
    const emailNorm = email.trim().toLowerCase()
    const existing = await prisma.user.findUnique({
      where: { email: emailNorm },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'อีเมลนี้มีการสมัครแล้ว' },
        { status: 400 }
      )
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const now = new Date().toISOString().slice(0, 19)
    const user = await prisma.user.create({
      data: {
        email: emailNorm,
        passwordHash,
        name: name.trim(),
        phone: phone?.trim() || null,
        createdAt: now,
        updatedAt: now,
      },
    })
    await createSession({ userId: user.id, email: user.email })
    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'สมัครไม่สำเร็จ' }, { status: 500 })
  }
}
