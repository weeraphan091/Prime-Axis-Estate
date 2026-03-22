/**
 * แปลข้อความระหว่าง ไทย/อังกฤษ/จีน/รัสเซีย (ใช้ MyMemory API ฟรี)
 * ใช้ตอนบันทึกทรัพย์ — รองรับเจ้าของกรอกเป็นภาษาใดก็ได้ แล้วแปลไปทุกภาษาที่เว็บใช้
 */

import { pattayaZones, getZoneLabel } from '@/config/zones'

const MYMEMORY_BASE = 'https://api.mymemory.translated.net/get'
const MAX_BYTES = 500

/** cache ข้อความสั้น ๆ ระหว่างรัน request เดียวกัน / หลาย field */
const translationCache = new Map<string, string>()
const MAX_CACHE_ENTRIES = 600

function cacheKey(fromLang: ContentLang, toLang: ContentLang, chunk: string): string {
  return `${fromLang}>${toLang}::${chunk}`
}

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
  const key = cacheKey(fromLang, toLang, chunk)
  const hit = translationCache.get(key)
  if (hit !== undefined) return hit

  const fromCode = MYMEMORY_CODE[fromLang]
  const toCode = MYMEMORY_CODE[toLang]
  const langpair = `${fromCode}|${toCode}`
  const url = `${MYMEMORY_BASE}?q=${encodeURIComponent(chunk)}&langpair=${langpair}`
  try {
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    const translated = data?.responseData?.translatedText
    if (typeof translated === 'string' && translated.trim()) {
      const out = translated.trim()
      if (translationCache.size >= MAX_CACHE_ENTRIES) {
        const firstKey = translationCache.keys().next().value
        if (firstKey !== undefined) translationCache.delete(firstKey)
      }
      translationCache.set(key, out)
      return out
    }
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
  featuresEn: string[]
  featuresZh: string[]
  featuresRu: string[]
  locationEn: string
  locationZh: string
  locationRu: string
}

async function translateToAll(
  original: string,
  sourceLang: ContentLang
): Promise<Record<ContentLang, string>> {
  if (!original.trim()) return { th: '', en: '', zh: '', ru: '' }
  return {
    th: sourceLang === 'th' ? original : await translateText(original, sourceLang, 'th'),
    en: sourceLang === 'en' ? original : await translateText(original, sourceLang, 'en'),
    zh: sourceLang === 'zh' ? original : await translateText(original, sourceLang, 'zh'),
    ru: sourceLang === 'ru' ? original : await translateText(original, sourceLang, 'ru'),
  }
}

/**
 * แปลชื่อสถานที่โดยใช้ dictionary (zones) ก่อน
 * ถ้าตรงกับโซนที่รู้จัก → ใช้ชื่อที่ถูกต้อง ไม่ส่งไปแปลผ่าน API
 * ถ้าโลเคชั่นมีส่วนที่ไม่รู้จักก็คงไว้เป็นทับศัพท์เดิม (ไม่แปลมั่ว)
 */
function translateLocationByDict(
  location: string,
  targetLang: ContentLang
): string {
  if (!location.trim()) return ''
  let result = location
  for (const zone of pattayaZones) {
    if (result.includes(zone.label) || result.includes(zone.slug)) {
      const translated = getZoneLabel(zone, targetLang)
      result = result.replace(zone.label, translated)
      if (zone.slug !== zone.label) {
        result = result.replace(zone.slug, translated)
      }
    }
  }
  return result
}

/**
 * สร้าง dictionary ชื่อสถานที่ทั้งภาษาไทยและภาษาอื่น
 * เพื่อให้สามารถ protect ชื่อเหล่านี้ไม่ให้ถูกแปลมั่ว
 */
function buildPlaceNameDict(): { pattern: string; translations: Record<ContentLang, string> }[] {
  const entries: { pattern: string; translations: Record<ContentLang, string> }[] = []
  for (const z of pattayaZones) {
    entries.push({
      pattern: z.label,
      translations: { th: z.label, en: z.labelEn, zh: z.labelZh, ru: z.labelRu },
    })
  }
  const extras: Record<string, Record<ContentLang, string>> = {
    'พัทยา': { th: 'พัทยา', en: 'Pattaya', zh: '芭堤雅', ru: 'Паттайя' },
    'ชลบุรี': { th: 'ชลบุรี', en: 'Chonburi', zh: '春武里', ru: 'Чонбури' },
    'กรุงเทพฯ': { th: 'กรุงเทพฯ', en: 'Bangkok', zh: '曼谷', ru: 'Бангкок' },
    'กรุงเทพ': { th: 'กรุงเทพ', en: 'Bangkok', zh: '曼谷', ru: 'Бангкок' },
    'ภูเก็ต': { th: 'ภูเก็ต', en: 'Phuket', zh: '普吉岛', ru: 'Пхукет' },
    'อู่ตะเภา': { th: 'อู่ตะเภา', en: 'U-Tapao', zh: '乌塔堡', ru: 'У-Тапао' },
    'วงศ์อมาตย์': { th: 'วงศ์อมาตย์', en: 'Wongamat', zh: '黄艾玛', ru: 'Вонгамат' },
    'นาจอมเทียน': { th: 'นาจอมเทียน', en: 'Na Jomtien', zh: '纳中天', ru: 'На Джомтьен' },
    'Pattaya Estate Hub': { th: 'Pattaya Estate Hub', en: 'Pattaya Estate Hub', zh: 'Pattaya Estate Hub', ru: 'Pattaya Estate Hub' },
  }
  for (const [pattern, translations] of Object.entries(extras)) {
    if (!entries.some((e) => e.pattern === pattern)) {
      entries.push({ pattern, translations })
    }
  }
  entries.sort((a, b) => b.pattern.length - a.pattern.length)
  return entries
}

const PLACE_DICT = buildPlaceNameDict()

/**
 * แปลข้อความยาว (เช่น บล็อก) พร้อมป้องกันชื่อสถานที่ไม่ให้ถูกแปลมั่ว
 * 1. แทนที่ชื่อสถานที่ด้วย placeholder
 * 2. แปลข้อความ
 * 3. ใส่ชื่อที่ถูกต้องในภาษาเป้าหมายกลับคืน
 */
async function translateWithPlaceProtection(
  text: string,
  fromLang: ContentLang,
  toLang: ContentLang
): Promise<string> {
  if (!text.trim() || fromLang === toLang) return text

  const found: { placeholder: string; targetName: string; sourceName: string }[] = []
  let masked = text
  let idx = 0

  for (const entry of PLACE_DICT) {
    const { pattern, translations } = entry
    const sourceName = translations[fromLang] || pattern
    const targetName = translations[toLang] || pattern

    const names = [sourceName, pattern].filter(Boolean)
    for (const name of names) {
      if (masked.includes(name)) {
        const ph = `__PN${idx}__`
        found.push({ placeholder: ph, targetName, sourceName: name })
        masked = masked.split(name).join(ph)
        idx++
        break
      }
    }
  }

  const translated = await translateText(masked, fromLang, toLang)

  let result = translated
  for (const { placeholder, targetName } of found) {
    result = result.split(placeholder).join(targetName)
  }
  return result
}

/**
 * แปลเนื้อหาบล็อก (title, excerpt, content) จากภาษาต้นทาง → ทุกภาษา
 * ป้องกันชื่อสถานที่ไม่ให้ถูกแปลมั่ว
 */
export type TranslatedBlogContent = {
  titleEn: string
  titleZh: string
  titleRu: string
  excerptEn: string
  excerptZh: string
  excerptRu: string
  contentEn: string
  contentZh: string
  contentRu: string
}

export async function translateBlogContent(
  title: string,
  excerpt: string,
  content: string,
  sourceLang: ContentLang = 'th'
): Promise<TranslatedBlogContent> {
  const targets: ContentLang[] = ALL_LANGS.filter((l) => l !== sourceLang) as ContentLang[]

  const results = await Promise.all(
    targets.map(async (lang) => {
      const [t, e, c] = await Promise.all([
        title.trim() ? translateWithPlaceProtection(title.trim(), sourceLang, lang) : '',
        excerpt.trim() ? translateWithPlaceProtection(excerpt.trim(), sourceLang, lang) : '',
        content.trim() ? translateWithPlaceProtection(content.trim(), sourceLang, lang) : '',
      ])
      return { lang, title: t, excerpt: e, content: c }
    })
  )

  const get = (lang: ContentLang, field: 'title' | 'excerpt' | 'content') =>
    results.find((r) => r.lang === lang)?.[field] || ''

  const langMap: Record<string, ContentLang> = { En: 'en', Zh: 'zh', Ru: 'ru' }
  const out: Record<string, string> = {}
  for (const [suffix, lang] of Object.entries(langMap)) {
    if (lang === sourceLang) {
      out[`title${suffix}`] = title.trim()
      out[`excerpt${suffix}`] = excerpt.trim()
      out[`content${suffix}`] = content.trim()
    } else {
      out[`title${suffix}`] = get(lang, 'title')
      out[`excerpt${suffix}`] = get(lang, 'excerpt')
      out[`content${suffix}`] = get(lang, 'content')
    }
  }
  return out as unknown as TranslatedBlogContent
}

/**
 * แปลชื่อ, รายละเอียด, จุดเด่น, ทำเล จากภาษาที่กรอก → th, en, zh, ru
 * - ชื่อ/รายละเอียด/จุดเด่น → แปลด้วย MyMemory API
 * - ทำเล → ใช้ dictionary ชื่อสถานที่ที่ถูกต้อง (ไม่ส่งไปแปลผ่าน API)
 */
export async function translatePropertyContent(
  title: string,
  description: string,
  sourceLang: ContentLang = 'th',
  features?: string[],
  location?: string
): Promise<TranslatedContent> {
  const t = (title ?? '').trim()
  const d = (description ?? '').trim()
  const featuresStr = (features ?? []).filter(Boolean).join(', ')
  const loc = (location ?? '').trim()

  const emptyLangs = { th: '', en: '', zh: '', ru: '' }

  const [titleLangs, descLangs, featLangs] = await Promise.all([
    t ? translateToAll(t, sourceLang) : Promise.resolve(emptyLangs),
    d ? translateToAll(d, sourceLang) : Promise.resolve(emptyLangs),
    featuresStr ? translateToAll(featuresStr, sourceLang) : Promise.resolve(emptyLangs),
  ])

  const toArray = (csv: string): string[] =>
    csv.split(',').map((s) => s.trim()).filter(Boolean)

  return {
    title: titleLangs.th || t,
    titleEn: titleLangs.en || t,
    titleZh: titleLangs.zh || t,
    titleRu: titleLangs.ru || t,
    description: descLangs.th || d,
    descriptionEn: descLangs.en || d,
    descriptionZh: descLangs.zh || d,
    descriptionRu: descLangs.ru || d,
    featuresEn: featLangs.en ? toArray(featLangs.en) : [],
    featuresZh: featLangs.zh ? toArray(featLangs.zh) : [],
    featuresRu: featLangs.ru ? toArray(featLangs.ru) : [],
    locationEn: translateLocationByDict(loc, 'en') || loc,
    locationZh: translateLocationByDict(loc, 'zh') || loc,
    locationRu: translateLocationByDict(loc, 'ru') || loc,
  }
}
