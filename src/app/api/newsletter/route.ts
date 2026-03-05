import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const now = new Date().toISOString().slice(0, 19)
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email, createdAt: now },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[Newsletter]', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
