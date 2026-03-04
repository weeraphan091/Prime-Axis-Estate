import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const VIEW_COOKIE_PREFIX = 'pv_'
const VIEW_COOKIE_MAX_AGE = 60 * 60 * 24 // 24 ชม. นับครั้งเดียวต่อ browser ต่อรายการ

/** บันทึกการดูหน้ารายการ (นับ view) — เรียกจากหน้ารายละเอียด, ไม่ต้องล็อกอิน */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const p = await prisma.property.findUnique({
      where: { id },
      select: { id: true, viewCount: true, status: true },
    })
    if (!p || p.status !== 'published') return NextResponse.json({ ok: false }, { status: 404 })

    const cookieStore = await cookies()
    const seen = cookieStore.get(VIEW_COOKIE_PREFIX + id)?.value
    if (seen === '1') {
      return NextResponse.json({ ok: true, viewCount: (p.viewCount ?? 0) })
    }

    await prisma.property.update({
      where: { id },
      data: { viewCount: (p.viewCount ?? 0) + 1 },
    })
    const res = NextResponse.json({ ok: true, viewCount: (p.viewCount ?? 0) + 1 })
    res.cookies.set(VIEW_COOKIE_PREFIX + id, '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: VIEW_COOKIE_MAX_AGE,
      path: '/',
    })
    return res
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
