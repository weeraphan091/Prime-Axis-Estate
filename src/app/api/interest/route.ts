import { NextResponse } from 'next/server'

const LINE_PUSH_URL = 'https://api.line.me/v2/bot/message/push'
const LINE_NOTIFY_URL = 'https://notify-api.line.me/api/notify' // ยุติบริการ 31 มี.ค. 2568

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
    const body = await request.json()
    const text = buildMessageText(body)

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
      const errText = await res.text()
      console.error('[Telegram]', res.status, errText)
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
      const errText = await res.text()
      console.error('[LINE Messaging API]', res.status, errText)
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
      const errText = await res.text()
      console.error('[Line Notify]', res.status, errText)
    }

    return NextResponse.json({ sent: false })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed', sent: false }, { status: 500 })
  }
}
