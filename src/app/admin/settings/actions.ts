'use server'

import { prisma } from '@/lib/prisma'
import { canAccessSettings } from '@/lib/admin-auth'
import { agentContact } from '@/config/contact'

const DEFAULT_ID = 'default'

export type ContactFormData = {
  name: string
  phone: string
  email: string
  address: string
  line: string
  whatsapp: string
  wechat: string
  telegram: string
}

const defaults = {
  name: agentContact.name,
  phone: agentContact.phone,
  email: agentContact.email,
  address: agentContact.address,
  line: agentContact.line,
  whatsapp: agentContact.whatsapp,
  wechat: agentContact.wechat,
  telegram: agentContact.telegram,
}

export async function saveContactSettings(data: ContactFormData): Promise<{ ok: true } | { ok: false; error: string }> {
  const allowed = await canAccessSettings()
  if (!allowed) {
    return { ok: false, error: 'Unauthorized' }
  }
  try {
    const updatedAt = new Date().toISOString().slice(0, 19)
    const name = (data.name ?? '').trim() || defaults.name
    const phone = (data.phone ?? '').trim() || defaults.phone
    const email = (data.email ?? '').trim() || defaults.email
    const address = (data.address ?? '').trim() || defaults.address
    const line = (data.line ?? '').trim() || defaults.line
    const whatsapp = (data.whatsapp ?? '').trim() || defaults.whatsapp
    const wechat = (data.wechat ?? '').trim() || defaults.wechat
    const telegram = (data.telegram ?? '').trim() || defaults.telegram

    await prisma.contactSettings.upsert({
      where: { id: DEFAULT_ID },
      create: {
        id: DEFAULT_ID,
        name,
        phone,
        email,
        address,
        line,
        whatsapp,
        wechat,
        telegram,
        updatedAt,
      },
      update: {
        name,
        phone,
        email,
        address,
        line,
        whatsapp,
        wechat,
        telegram,
        updatedAt,
      },
    })
    return { ok: true }
  } catch (e) {
    console.error('[settings] saveContactSettings error:', e)
    const message = e instanceof Error ? e.message : 'Failed to save'
    return { ok: false, error: message }
  }
}
