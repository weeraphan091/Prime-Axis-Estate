import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { canAccessSettings } from '@/lib/admin-auth'
import { agentContact } from '@/config/contact'

/** GET อ่านข้อมูลติดต่อสาธารณะ — อนุญาต cache ช่วงสั้น */
export const revalidate = 300

const DEFAULT_ID = 'default'

export type ContactData = {
  name: string
  phone: string
  email: string
  address: string
  line: string
  whatsapp: string
  wechat: string
  telegram: string
}

const defaultContact: ContactData = {
  name: agentContact.name,
  phone: agentContact.phone,
  email: agentContact.email,
  address: agentContact.address,
  line: agentContact.line,
  whatsapp: agentContact.whatsapp,
  wechat: agentContact.wechat,
  telegram: agentContact.telegram,
}

export async function GET() {
  try {
    const row = await prisma.contactSettings.findUnique({
      where: { id: DEFAULT_ID },
    })
    if (!row) {
      return NextResponse.json(defaultContact)
    }
    return NextResponse.json({
      name: row.name,
      phone: row.phone,
      email: row.email,
      address: row.address,
      line: row.line,
      whatsapp: row.whatsapp,
      wechat: row.wechat,
      telegram: row.telegram,
    })
  } catch {
    return NextResponse.json(defaultContact)
  }
}

export async function PUT(request: Request) {
  const ok = await canAccessSettings()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = (await request.json()) as ContactData
    const updatedAt = new Date().toISOString().slice(0, 19)
    await prisma.contactSettings.upsert({
      where: { id: DEFAULT_ID },
      create: {
        id: DEFAULT_ID,
        name: body.name ?? defaultContact.name,
        phone: body.phone ?? defaultContact.phone,
        email: body.email ?? defaultContact.email,
        address: body.address ?? defaultContact.address,
        line: body.line ?? defaultContact.line,
        whatsapp: body.whatsapp ?? defaultContact.whatsapp,
        wechat: body.wechat ?? defaultContact.wechat,
        telegram: body.telegram ?? defaultContact.telegram,
        updatedAt,
      },
      update: {
        name: body.name ?? undefined,
        phone: body.phone ?? undefined,
        email: body.email ?? undefined,
        address: body.address ?? undefined,
        line: body.line ?? undefined,
        whatsapp: body.whatsapp ?? undefined,
        wechat: body.wechat ?? undefined,
        telegram: body.telegram ?? undefined,
        updatedAt,
      },
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[settings/contact] PUT error:', e)
    const message = e instanceof Error ? e.message : 'Failed to save'
    return NextResponse.json(
      { error: 'Failed to save', detail: process.env.NODE_ENV === 'development' ? message : undefined },
      { status: 500 }
    )
  }
}
