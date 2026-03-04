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
      return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }
    await setAdminSession(session)
    return NextResponse.json({ ok: true, user: { email: session.email, name: session.name, role: session.role } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
