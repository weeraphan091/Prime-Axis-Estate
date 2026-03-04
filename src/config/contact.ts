/**
 * ข้อมูลติดต่อนายหน้า (เรา) — แก้ไขเบอร์/ไอดีตรงนี้แล้วจะอัปเดตทั้งเว็บ
 */
export const agentContact = {
  name: 'PRIME AXIS ESTATE',
  phone: '038-xxx-xxx',
  email: 'contact@primeaxisestate.com',
  address: 'พัทยา ชลบุรี',
  /** Line OA ID ต้องมี @ เช่น @187umoiw */
  line: '@187umoiw',
  /** เบอร์สำหรับ WhatsApp (ใส่เฉพาะตัวเลข เช่น 66812345678) */
  whatsapp: '66812345678',
  /** WeChat ID */
  wechat: 'pattayaproperty',
  /** Telegram username (ไม่ต้องใส่ @) หรือลิงก์ t.me/xxx */
  telegram: 'pattayaproperty',
} as const

export function getLineUrl(): string {
  const id = agentContact.line
  if (id.startsWith('http')) return id
  return id.startsWith('@') ? `https://line.me/ti/p/${id}` : `https://line.me/ti/p/~${id}`
}

export function getWhatsAppUrl(): string {
  const num = agentContact.whatsapp.replace(/\D/g, '')
  return `https://wa.me/${num}`
}

export function getTelegramUrl(): string {
  const u = agentContact.telegram.replace('@', '')
  if (u.startsWith('http')) return u
  return `https://t.me/${u}`
}
