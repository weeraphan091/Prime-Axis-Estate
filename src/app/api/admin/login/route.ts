import { NextResponse } from 'next/server'
import { verifyAdminCredentials, setAdminSession } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email?.trim() || !password) {
      return NextResponse.json({ error: 'กรุณากรอกอีเมลและรหัสผ่าน' }, { status: 400 })
    }
    const session = await verifyAdminCredentials(email.trim(), password)
    if (!session) {
      await new Promise((r) => setTimeout(r, 2000))
      return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }
    const ok = await setAdminSession(session)
    if (!ok) {
      return NextResponse.json(
        { error: 'ระบบยังไม่ได้ตั้งค่า ADMIN_SESSION_SECRET หรือ SESSION_SECRET (อย่างน้อย 32 ตัวอักษร) ใน .env' },
        { status: 503 }
      )
    }
    return NextResponse.json({ ok: true, user: { email: session.email, name: session.name, role: session.role } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
