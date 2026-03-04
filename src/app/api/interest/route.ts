import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const LINE_PUSH_URL = 'https://api.line.me/v2/bot/message/push'
const LINE_NOTIFY_URL = 'https://notify-api.line.me/api/notify'

function buildMessageText(body: Record<string, unknown>): string {
  const {
    propertyId,
    propertyTitle,
    name,
    phone,
    email,
    interestType,
    contactWhen,
    viewWhen,
    message,
  } = body
  const lines = [
    '🏠 สนใจทรัพย์',
    propertyTitle ? `รายการ: ${propertyTitle}` : '',
    propertyId ? `ID: ${propertyId}` : '',
    '---',
    `ชื่อ: ${name || '-'}`,
    `โทร: ${phone || '-'}`,
    `อีเมล: ${email || '-'}`,
    `สนใจ: ${interestType === 'view' ? 'นัดชม' : 'สอบถามเพิ่ม'}`,
    contactWhen ? `เวลาสะดวกให้ติดต่อ: ${contactWhen}` : '',
    viewWhen ? `อยากนัดชมเมื่อ: ${viewWhen}` : '',
    message ? `หมายเหตุ: ${message}` : '',
  ]
  return lines.filter(Boolean).join('\n')
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const text = buildMessageText(body)

    const now = new Date().toISOString().slice(0, 19)

    // บันทึกลีดใน DB ก่อน (ถ้า DB ล้มไม่ให้ล้มทั้ง request)
    try {
      await prisma.lead.create({
        data: {
          propertyId: String(body.propertyId ?? ''),
          propertyTitle: body.propertyTitle ? String(body.propertyTitle) : null,
          name: String(body.name ?? ''),
          phone: String(body.phone ?? ''),
          email: String(body.email ?? ''),
          interestType: body.interestType ? String(body.interestType) : null,
          contactWhen: body.contactWhen ? String(body.contactWhen) : null,
          viewWhen: body.viewWhen ? String(body.viewWhen) : null,
          message: body.message ? String(body.message) : null,
          status: 'new',
          createdAt: now,
          updatedAt: now,
        },
      })
    } catch (e) {
      console.error('[Interest] Lead save failed:', e)
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
    const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim()
    if (telegramToken && telegramChatId) {
      const res = await fetch(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text,
            disable_web_page_preview: true,
          }),
        }
      )
      if (res.ok) {
        return NextResponse.json({ sent: true, via: 'telegram' })
      }
      console.error('[Telegram]', res.status, await res.text())
    }

    const channelToken = process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim()
    const agentUserId = process.env.LINE_AGENT_USER_ID?.trim()
    if (channelToken && agentUserId) {
      const res = await fetch(LINE_PUSH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${channelToken}`,
        },
        body: JSON.stringify({
          to: agentUserId,
          messages: [{ type: 'text', text }],
        }),
      })
      if (res.ok) {
        return NextResponse.json({ sent: true, via: 'line' })
      }
      console.error('[LINE]', res.status, await res.text())
    }

    const notifyToken = process.env.LINE_NOTIFY_TOKEN?.trim()
    if (notifyToken) {
      const form = new URLSearchParams()
      form.set('message', text)
      const res = await fetch(LINE_NOTIFY_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${notifyToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      })
      if (res.ok) {
        return NextResponse.json({ sent: true, via: 'line' })
      }
    }

    return NextResponse.json({
      sent: false,
      reason: 'no_channel',
      hint: 'ยังไม่ได้ตั้งค่า Telegram หรือ Line ใน Environment Variables',
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed', sent: false }, { status: 500 })
  }
}
