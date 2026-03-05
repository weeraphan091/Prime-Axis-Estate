import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const LINE_PUSH_URL = 'https://api.line.me/v2/bot/message/push'
const LINE_NOTIFY_URL = 'https://notify-api.line.me/api/notify'

function buildMessage(body: Record<string, string>): string {
  return [
    '📩 ข้อความจากหน้าติดต่อเรา',
    '---',
    `ชื่อ: ${body.name || '-'}`,
    `อีเมล: ${body.email || '-'}`,
    body.phone ? `โทร: ${body.phone}` : '',
    '---',
    body.message || '(ไม่มีข้อความ)',
  ].filter(Boolean).join('\n')
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const text = buildMessage(body)
    const now = new Date().toISOString().slice(0, 19)

    try {
      await prisma.lead.create({
        data: {
          propertyId: '',
          propertyTitle: 'ติดต่อจากหน้า Contact',
          name: body.name,
          phone: body.phone || '',
          email: body.email,
          interestType: 'inquiry',
          message: body.message,
          status: 'new',
          createdAt: now,
          updatedAt: now,
        },
      })
    } catch (e) {
      console.error('[Contact] Lead save failed:', e)
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
    const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim()
    if (telegramToken && telegramChatId) {
      const res = await fetch(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: telegramChatId, text, disable_web_page_preview: true }),
        }
      )
      if (res.ok) return NextResponse.json({ sent: true, via: 'telegram' })
      console.error('[Telegram]', res.status, await res.text())
    }

    const channelToken = process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim()
    const agentUserId = process.env.LINE_AGENT_USER_ID?.trim()
    if (channelToken && agentUserId) {
      const res = await fetch(LINE_PUSH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${channelToken}` },
        body: JSON.stringify({ to: agentUserId, messages: [{ type: 'text', text }] }),
      })
      if (res.ok) return NextResponse.json({ sent: true, via: 'line' })
      console.error('[LINE]', res.status, await res.text())
    }

    const notifyToken = process.env.LINE_NOTIFY_TOKEN?.trim()
    if (notifyToken) {
      const form = new URLSearchParams()
      form.set('message', text)
      const res = await fetch(LINE_NOTIFY_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${notifyToken}`, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString(),
      })
      if (res.ok) return NextResponse.json({ sent: true, via: 'line' })
    }

    return NextResponse.json({ sent: false, reason: 'no_channel' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
