import { NextResponse } from 'next/server'
import { hasAdminSession } from '@/lib/admin-auth'

export async function POST(request: Request) {
  const ok = await hasAdminSession()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { token } = await request.json()
    const t = typeof token === 'string' ? token.trim() : ''
    if (!t) {
      return NextResponse.json({ error: 'กรุณาใส่ Bot Token' }, { status: 400 })
    }
    const res = await fetch(
      `https://api.telegram.org/bot${t}/getUpdates`,
      { method: 'GET' }
    )
    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json(
        { error: 'Token ไม่ถูกต้อง หรือเครือข่ายผิดพลาด', detail: err },
        { status: 400 }
      )
    }
    const data = (await res.json()) as {
      ok?: boolean
      result?: Array<{
        message?: { chat?: { id?: number; type?: string; username?: string } }
      }>
    }
    const chats = new Map<number, string>()
    for (const u of data.result || []) {
      const chat = u.message?.chat
      if (chat?.id != null) {
        const label = chat.username ? `@${chat.username}` : `Chat ${chat.type || ''}`
        chats.set(chat.id, label)
      }
    }
    const chatIds = Array.from(chats.entries()).map(([id, label]) => ({ id, label }))
    if (chatIds.length === 0) {
      return NextResponse.json({
        chatIds: [],
        hint: 'ยังไม่มีข้อความในบอท — ให้ส่งข้อความใดๆ (เช่น สวัสดี) ให้บอทของคุณใน Telegram แล้วกดปุ่ม "ดึง Chat ID" อีกครั้ง',
      })
    }
    return NextResponse.json({ chatIds })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
