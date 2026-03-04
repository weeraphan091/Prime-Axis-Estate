import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body
    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      )
    }
    const emailNorm = email.trim().toLowerCase()
    const user = await prisma.user.findUnique({
      where: { email: emailNorm },
    })
    if (!user) {
      return NextResponse.json(
        { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json(
        { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }
    await createSession({ userId: user.id, email: user.email })
    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'เข้าสู่ระบบไม่สำเร็จ' }, { status: 500 })
  }
}
