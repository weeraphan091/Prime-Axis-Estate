/**
 * Parser สำหรับดึงข้อมูลอสังหาจากข้อความ (เช่น ก็อปจาก Facebook)
 * รองรับทั้งภาษาไทยและอังกฤษ
 */

export interface ParsedListing {
  listingType?: 'sale' | 'rent'
  propertyType?: 'condo' | 'house' | 'villa' | 'apartment' | 'land' | 'commercial'
  price?: number
  bedrooms?: number
  bathrooms?: number
  area?: number
  floor?: number
  location?: string
  projectName?: string
  title?: string
  description?: string
  features?: string[]
}

export function parseListingText(raw: string): ParsedListing {
  const text = raw.replace(/\r\n/g, '\n').trim()
  if (!text) return {}

  const result: ParsedListing = {}

  // --- listing type ---
  if (/\b(ขาย|ขายด่วน|ขายถูก|for\s*sale|sale)\b/i.test(text)) {
    result.listingType = 'sale'
  }
  if (/\b(ให้เช่า|เช่า|ปล่อยเช่า|for\s*rent|rent)\b/i.test(text)) {
    result.listingType = 'rent'
  }
  if (/\b(ขาย|sale)\b/i.test(text) && /\b(เช่า|rent)\b/i.test(text)) {
    result.listingType = 'sale'
  }

  // --- property type ---
  const typeMap: [RegExp, ParsedListing['propertyType']][] = [
    [/\b(คอนโด|condo|condominium)\b/i, 'condo'],
    [/\b(บ้าน|บ้านเดี่ยว|ทาวน์เฮ้าส์|ทาวน์โฮม|house|townhouse|townhome)\b/i, 'house'],
    [/\b(วิลล่า|วิลลา|pool\s*villa|villa)\b/i, 'villa'],
    [/\b(อพาร์ตเมนต์|apartment|studio)\b/i, 'apartment'],
    [/\b(ที่ดิน|land)\b/i, 'land'],
    [/\b(อาคารพาณิชย์|commercial|ตึกแถว|ห้องแถว|ออฟฟิศ|office|shop|ร้าน)\b/i, 'commercial'],
  ]
  for (const [re, type] of typeMap) {
    if (re.test(text)) {
      result.propertyType = type
      break
    }
  }

  // --- price ---
  const pricePatterns = [
    /ราคา\s*[:\-]?\s*([\d,._]+)\s*(ล้าน|mb|m)/i,
    /price\s*[:\-]?\s*([\d,._]+)\s*(million|m|mb)/i,
    /([\d,._]+)\s*(ล้าน|mb)\s*(บาท|baht)?/i,
    /ราคา\s*[:\-]?\s*([\d,._]+)\s*(บาท|baht|฿)?/i,
    /price\s*[:\-]?\s*(?:฿|THB)?\s*([\d,._]+)/i,
    /([\d,._]+)\s*(?:บาท|baht|฿)\s*(?:\/\s*(?:เดือน|month))?/i,
    /(?:฿|THB)\s*([\d,._]+)/i,
  ]
  for (const re of pricePatterns) {
    const m = text.match(re)
    if (m) {
      const numStr = m[1].replace(/[,_]/g, '')
      let num = parseFloat(numStr)
      if (isNaN(num) || num <= 0) continue
      const unit = (m[2] || '').toLowerCase()
      if (/ล้าน|million|^mb?$/i.test(unit)) {
        num = num * 1_000_000
      }
      if (num >= 500) {
        result.price = Math.round(num)
        break
      }
    }
  }

  // --- bedrooms ---
  const brPatterns = [
    /(\d+)\s*(?:ห้องนอน|bed(?:room)?s?|br|นอน)/i,
    /(?:ห้องนอน|bed(?:room)?s?|br)\s*[:\-]?\s*(\d+)/i,
  ]
  for (const re of brPatterns) {
    const m = text.match(re)
    if (m) {
      const n = parseInt(m[1])
      if (n > 0 && n <= 20) {
        result.bedrooms = n
        break
      }
    }
  }

  // --- bathrooms ---
  const bathPatterns = [
    /(\d+)\s*(?:ห้องน้ำ|bath(?:room)?s?|ba)/i,
    /(?:ห้องน้ำ|bath(?:room)?s?)\s*[:\-]?\s*(\d+)/i,
  ]
  for (const re of bathPatterns) {
    const m = text.match(re)
    if (m) {
      const n = parseInt(m[1])
      if (n > 0 && n <= 20) {
        result.bathrooms = n
        break
      }
    }
  }

  // --- area ---
  const areaPatterns = [
    /([\d,.]+)\s*(?:ตร\.?\s*ม\.?|ตารางเมตร|sq\.?\s*m\.?|sqm)/i,
    /(?:พื้นที่|area|size)\s*[:\-]?\s*([\d,.]+)\s*(?:ตร\.?\s*ม\.?|ตารางเมตร|sq\.?\s*m\.?|sqm)?/i,
  ]
  for (const re of areaPatterns) {
    const m = text.match(re)
    if (m) {
      const n = parseFloat(m[1].replace(/,/g, ''))
      if (n > 0 && n < 100_000) {
        result.area = n
        break
      }
    }
  }

  // --- floor ---
  const floorM = text.match(/(?:ชั้น(?:ที่)?|floor)\s*[:\-]?\s*(\d+)/i)
  if (floorM) {
    const n = parseInt(floorM[1])
    if (n > 0 && n <= 99) result.floor = n
  }

  // --- location / zone ---
  const KNOWN_PLACES = [
    'พัทยาเหนือ', 'กลางพัทยา', 'พัทยาใต้', 'จอมเทียน', 'หนองปรือ', 'นาเกลือ',
    'บางละมุง', 'ศรีราชา', 'หนองปลาไหล', 'นครชลบุรี', 'มาบประชัน', 'ห้วยใหญ่',
    'เขาพระตำหนัก', 'วงศ์อมาตย์', 'นาจอมเทียน', 'พัทยา', 'ชลบุรี',
    'North Pattaya', 'Central Pattaya', 'South Pattaya', 'Jomtien', 'Naklua',
    'Wongamat', 'Na Jomtien', 'Mabprachan', 'Huay Yai', 'Khao Pratamnak',
    'Pattaya', 'Chonburi',
  ]
  for (const place of KNOWN_PLACES) {
    if (text.includes(place)) {
      result.location = place
      break
    }
  }

  // --- project name ---
  const projectPatterns = [
    /(?:โครงการ|project|ชื่อโครงการ)\s*[:\-]?\s*([^\n,]+)/i,
    /(?:คอนโด|condo)\s+([^\n,()]+?)(?:\s+(?:ขาย|เช่า|ราคา|ชั้น|ห้อง|\d))/i,
  ]
  for (const re of projectPatterns) {
    const m = text.match(re)
    if (m) {
      const name = m[1].trim()
      if (name.length >= 3 && name.length <= 80) {
        result.projectName = name
        break
      }
    }
  }

  // --- features ---
  const featureKeywords = [
    'สระว่ายน้ำ', 'ฟิตเนส', 'ฟิตเน็ส', 'ซาวน่า', 'ที่จอดรถ', 'วิวทะเล', 'วิวเมือง',
    'วิวสระ', 'เฟอร์นิเจอร์ครบ', 'fully furnished', 'ใกล้ทะเล', 'ใกล้หาด', 'ใกล้ห้าง',
    'ระเบียง', 'balcony', 'เครื่องซักผ้า', 'washing machine', 'อินเทอร์เน็ต', 'wifi',
    'แอร์', 'air con', 'ตู้เย็น', 'ทีวี', 'เฟอร์ครบ', 'พร้อมอยู่', 'ใกล้ BTS', 'ใกล้ MRT',
    'security', 'รปภ', 'กล้องวงจรปิด', 'CCTV', 'คีย์การ์ด', 'key card',
    'pool', 'gym', 'fitness', 'sea view', 'city view', 'garden', 'สวน',
    'เพิ่งรีโนเวท', 'renovated', 'ใหม่', 'new',
  ]
  const found: string[] = []
  for (const kw of featureKeywords) {
    if (text.toLowerCase().includes(kw.toLowerCase())) {
      found.push(kw)
    }
  }
  if (found.length) result.features = found

  // --- title: first meaningful line ---
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length > 0) {
    const firstLine = lines[0].slice(0, 120)
    result.title = firstLine
  }

  // --- description: full original text ---
  result.description = text.slice(0, 3000)

  return result
}
