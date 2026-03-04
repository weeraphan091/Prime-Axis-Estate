/**
 * โซนทำเลพัทยาและรอบๆ (ใช้ค้นหาและแสดงบนหน้าแรก)
 */
export const pattayaZones = [
  { id: 'pattaya-nua', label: 'พัทยาเหนือ', slug: 'พัทยาเหนือ' },
  { id: 'pattaya-klang', label: 'กลางพัทยา', slug: 'กลางพัทยา' },
  { id: 'pattaya-tai', label: 'พัทยาใต้', slug: 'พัทยาใต้' },
  { id: 'jomtien', label: 'จอมเทียน', slug: 'จอมเทียน' },
  { id: 'naklua', label: 'หนองปรือ-นาเกลือ', slug: 'หนองปรือ' },
  { id: 'banglamung', label: 'บางละมุง', slug: 'บางละมุง' },
  { id: 'siracha', label: 'ศรีราชา', slug: 'ศรีราชา' },
  { id: 'nongprue', label: 'หนองปลาไหล', slug: 'หนองปลาไหล' },
  { id: 'nakhonchon', label: 'นครชลบุรี', slug: 'นครชลบุรี' },
] as const

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
