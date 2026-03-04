import { NextResponse } from 'next/server'
import { isAdminPassword, setAdminSession } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    if (!password || !isAdminPassword(password)) {
      return NextResponse.json({ error: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }
    await setAdminSession()
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
