export type ListingType = 'sale' | 'rent'

export type PropertyType =
  | 'condo'
  | 'house'
  | 'villa'
  | 'apartment'
  | 'land'
  | 'commercial'

export interface Property {
  id: string
  title: string
  /** ชื่อโปรเจ็ค/โครงการ (เช่น คอนโด หมู่บ้าน) */
  projectName?: string
  listingType: ListingType
  propertyType: PropertyType
  price: number
  priceLabel?: string // e.g. "ต่อเดือน" for rent
  location: string
  /** ลิงก์ Google Map (คัดลอกจาก Google Maps ใส่ได้เลย) */
  mapUrl?: string
  area: number // sqm
  bedrooms?: number
  bathrooms?: number
  images: string[]
  description: string
  features: string[]
  contactName: string
  contactPhone: string
  contactEmail: string
  /** Line ID เจ้าของทรัพย์ (เช่น @xxx) — ใช้ในแอดมิน */
  contactLine?: string
  /** เบอร์ WhatsApp เจ้าของทรัพย์ — ใช้ในแอดมิน */
  contactWhatsapp?: string
  isFeatured?: boolean
  isOwnerListing?: boolean
  /** ทรัพย์ติดเจ้าของโดยตรง (owner_direct) หรือ โคจากเอเจ้นอื่น (from_agent) */
  listingSource?: 'owner_direct' | 'from_agent'
  /** draft | published | sold_rented */
  status?: string
  /** id ของพนักงานรับผิดชอบ */
  agentId?: string
  /** รายการเช่า: มีคนเช่าอยู่ */
  rentOccupied?: boolean
  /** รายการเช่า: วันที่เริ่มสัญญา YYYY-MM-DD */
  rentLeaseStart?: string
  /** รายการเช่า: วันที่สิ้นสุดสัญญา YYYY-MM-DD */
  rentLeaseEnd?: string
  /** คอนโด/อพาร์ตเมนต์: ชั้นที่อยู่ */
  floor?: number
  /** คอนโด/อพาร์ตเมนต์: เลขห้อง */
  roomNumber?: string
  /** บ้าน/วิลล่า: จำนวนชั้น (1 หรือ 2) */
  floors?: number
  /** จำนวนครั้งที่有人เปิดหน้ารายละเอียด */
  viewCount?: number
  /** id สมาชิกที่ฝากขาย (เจ้าของรายการ) */
  userId?: string
  /** ชื่อรายการภาษาอังกฤษ (ใช้แสดงเมื่อเลือกภาษา en) */
  titleEn?: string
  descriptionEn?: string
  titleZh?: string
  descriptionZh?: string
  titleRu?: string
  descriptionRu?: string
  createdAt: string
}

export interface ListPropertyForm {
  listingType: ListingType
  propertyType: PropertyType
  title: string
  description: string
  price: number
  priceLabel?: string
  location: string
  area: number
  bedrooms?: number
  bathrooms?: number
  features: string[]
  contactName: string
  contactPhone: string
  contactEmail: string
  contactLine?: string
  contactWhatsapp?: string
  images?: File[] | string[]
}
