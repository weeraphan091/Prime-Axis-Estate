/**
 * แปลข้อความระหว่าง ไทย/อังกฤษ/จีน/รัสเซีย (ใช้ MyMemory API ฟรี)
 * ใช้ตอนบันทึกทรัพย์ — รองรับเจ้าของกรอกเป็นภาษาใดก็ได้ แล้วแปลไปทุกภาษาที่เว็บใช้
 */

const MYMEMORY_BASE = 'https://api.mymemory.translated.net/get'
const MAX_BYTES = 500

/** ภาษาที่ใช้กรอกชื่อ/รายละเอียด (และภาษาที่เว็บแสดง) */
export type ContentLang = 'th' | 'en' | 'zh' | 'ru'

const MYMEMORY_CODE: Record<ContentLang, string> = {
  th: 'th',
  en: 'en',
  zh: 'zh-CN',
  ru: 'ru',
}

const ALL_LANGS: ContentLang[] = ['th', 'en', 'zh', 'ru']

function byteLength(str: string): number {
  return new TextEncoder().encode(str).length
}

/** แบ่งข้อความเป็นส่วนๆ ไม่เกิน MAX_BYTES ต่อส่วน */
function chunkText(text: string, maxBytes: number = MAX_BYTES - 50): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  if (byteLength(trimmed) <= maxBytes) return [trimmed]
  const chunks: string[] = []
  let current = ''
  const parts = trimmed.split(/(?<=[.\n。！？!?])\s*|\n+/)
  for (const part of parts) {
    if (byteLength(part) > maxBytes) {
      if (current) {
        chunks.push(current.trim())
        current = ''
      }
      for (let i = 0; i < part.length; ) {
        let end = i + Math.floor(maxBytes / 3)
        if (end > part.length) end = part.length
        chunks.push(part.slice(i, end))
        i = end
      }
      continue
    }
    const next = current ? current + '\n' + part : part
    if (byteLength(next) <= maxBytes) {
      current = next
    } else {
      if (current) chunks.push(current.trim())
      current = part
    }
  }
  if (current) chunks.push(current.trim())
  return chunks
}

async function translateChunk(
  chunk: string,
  fromLang: ContentLang,
  toLang: ContentLang
): Promise<string> {
  if (!chunk.trim() || fromLang === toLang) return chunk
  const fromCode = MYMEMORY_CODE[fromLang]
  const toCode = MYMEMORY_CODE[toLang]
  const langpair = `${fromCode}|${toCode}`
  const url = `${MYMEMORY_BASE}?q=${encodeURIComponent(chunk)}&langpair=${langpair}`
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    const translated = data?.responseData?.translatedText
    if (typeof translated === 'string' && translated.trim()) return translated.trim()
  } catch {
    // ignore
  }
  return chunk
}

/** แปลข้อความจากภาษาหนึ่งไปอีกภาษาหนึ่ง */
export async function translateText(
  text: string,
  fromLang: ContentLang,
  toLang: ContentLang
): Promise<string> {
  const t = (text ?? '').trim()
  if (!t || fromLang === toLang) return t
  const chunks = chunkText(t)
  if (chunks.length === 0) return ''
  const results = await Promise.all(
    chunks.map((c) => translateChunk(c, fromLang, toLang))
  )
  return results.join('\n\n').trim() || t
}

export type TranslatedContent = {
  title: string
  titleEn: string
  titleZh: string
  titleRu: string
  description: string
  descriptionEn: string
  descriptionZh: string
  descriptionRu: string
}

/**
 * แปลชื่อและรายละเอียดจากภาษาที่กรอก (sourceLang) เป็น th, en, zh, ru ทั้งหมด
 * - title/description ใน DB ใช้สำหรับ locale ไทย
 * - titleEn/descriptionEn สำหรับอังกฤษ ฯลฯ
 */
export async function translatePropertyContent(
  title: string,
  description: string,
  sourceLang: ContentLang = 'th'
): Promise<TranslatedContent> {
  const t = (title ?? '').trim()
  const d = (description ?? '').trim()
  const empty = {
    title: '',
    titleEn: '',
    titleZh: '',
    titleRu: '',
    description: '',
    descriptionEn: '',
    descriptionZh: '',
    descriptionRu: '',
  }
  if (!t && !d) return empty

  const getTranslations = async (original: string, isTitle: boolean) => {
    const results: Record<ContentLang, string> = {
      th: sourceLang === 'th' ? original : await translateText(original, sourceLang, 'th'),
      en: sourceLang === 'en' ? original : await translateText(original, sourceLang, 'en'),
      zh: sourceLang === 'zh' ? original : await translateText(original, sourceLang, 'zh'),
      ru: sourceLang === 'ru' ? original : await translateText(original, sourceLang, 'ru'),
    }
    return results
  }

  const [titleLangs, descLangs] = await Promise.all([
    t ? getTranslations(t, true) : Promise.resolve({ th: '', en: '', zh: '', ru: '' as ContentLang }),
    d ? getTranslations(d, false) : Promise.resolve({ th: '', en: '', zh: '', ru: '' as ContentLang }),
  ])

  return {
    title: titleLangs.th || t,
    titleEn: titleLangs.en || t,
    titleZh: titleLangs.zh || t,
    titleRu: titleLangs.ru || t,
    description: descLangs.th || d,
    descriptionEn: descLangs.en || d,
    descriptionZh: descLangs.zh || d,
    descriptionRu: descLangs.ru || d,
  }
}
