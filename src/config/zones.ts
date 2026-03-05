import type { Locale } from '@/config/i18n'

/**
 * โซนทำเลพัทยาและรอบๆ (ใช้ค้นหาและแสดงบนหน้าแรก)
 * label = ไทย, labelEn/labelZh/labelRu สำหรับแสดงตามภาษาที่เลือก
 */
export const pattayaZones = [
  { id: 'pattaya-nua', label: 'พัทยาเหนือ', labelEn: 'North Pattaya', labelZh: '北芭堤雅', labelRu: 'Северная Паттайя', slug: 'พัทยาเหนือ' },
  { id: 'pattaya-klang', label: 'กลางพัทยา', labelEn: 'Central Pattaya', labelZh: '芭堤雅中部', labelRu: 'Центральная Паттайя', slug: 'กลางพัทยา' },
  { id: 'pattaya-tai', label: 'พัทยาใต้', labelEn: 'South Pattaya', labelZh: '南芭堤雅', labelRu: 'Южная Паттайя', slug: 'พัทยาใต้' },
  { id: 'jomtien', label: 'จอมเทียน', labelEn: 'Jomtien', labelZh: '宗甸', labelRu: 'Джомтьен', slug: 'จอมเทียน' },
  { id: 'naklua', label: 'หนองปรือ-นาเกลือ', labelEn: 'Naklua', labelZh: '纳库鲁阿', labelRu: 'Наклуа', slug: 'หนองปรือ' },
  { id: 'banglamung', label: 'บางละมุง', labelEn: 'Bang Lamung', labelZh: '邦拉蒙', labelRu: 'Банг Ламунг', slug: 'บางละมุง' },
  { id: 'siracha', label: 'ศรีราชา', labelEn: 'Si Racha', labelZh: '是拉差', labelRu: 'Си Рача', slug: 'ศรีราชา' },
  { id: 'nongprue', label: 'หนองปลาไหล', labelEn: 'Nong Prue', labelZh: '农普鲁', labelRu: 'Нонг Пруэ', slug: 'หนองปลาไหล' },
  { id: 'nakhonchon', label: 'นครชลบุรี', labelEn: 'Nakhon Chonburi', labelZh: '春武里府', labelRu: 'Накхон Чонбури', slug: 'นครชลบุรี' },
] as const

export function getZoneLabel(
  zone: (typeof pattayaZones)[number],
  locale: Locale
): string {
  if (locale === 'en' && zone.labelEn) return zone.labelEn
  if (locale === 'zh' && zone.labelZh) return zone.labelZh
  if (locale === 'ru' && zone.labelRu) return zone.labelRu
  return zone.label
}

/** ช่วงราคาแบบ preset — ขาย (บาท) */
export const priceRangesSale = [
  { label: 'น้อยกว่า 3 ล้าน', min: 0, max: 3_000_000 },
  { label: '3 - 5 ล้าน', min: 3_000_000, max: 5_000_000 },
  { label: '5 - 10 ล้าน', min: 5_000_000, max: 10_000_000 },
  { label: '10 - 20 ล้าน', min: 10_000_000, max: 20_000_000 },
  { label: 'มากกว่า 20 ล้าน', min: 20_000_000, max: 999_999_999 },
] as const

/** ช่วงราคาแบบ preset — เช่า (บาท/เดือน) */
export const priceRangesRent = [
  { label: 'น้อยกว่า 10,000', min: 0, max: 10_000 },
  { label: '10,000 - 20,000', min: 10_000, max: 20_000 },
  { label: '20,000 - 50,000', min: 20_000, max: 50_000 },
  { label: '50,000 - 100,000', min: 50_000, max: 100_000 },
  { label: 'มากกว่า 100,000', min: 100_000, max: 999_999_999 },
] as const
