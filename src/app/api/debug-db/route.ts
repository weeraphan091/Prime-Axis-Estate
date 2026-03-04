import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * ใช้ดู error จริงของ DB บน Vercel
 * เปิด https://your-site.vercel.app/api/debug-db จะได้ JSON { ok, error?, message? }
 */
export async function GET() {
  const hasDbUrl = !!process.env.DATABASE_URL
  const urlPreview = hasDbUrl
    ? process.env.DATABASE_URL!.replace(/:[^:@]+@/, ':****@').slice(0, 60) + '...'
    : '(empty)'

  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({
      ok: true,
      message: 'Database connection OK',
      hasDbUrl,
      urlPreview,
    })
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    return NextResponse.json(
      {
        ok: false,
        error: err.message,
        name: err.name,
        hasDbUrl,
        urlPreview,
      },
      { status: 500 }
    )
  }
}
