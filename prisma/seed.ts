import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const seedData = [
  {
    title: 'คอนโดวิวทะเล พัทยาเหนือ 2 ห้องนอน',
    listingType: 'sale',
    propertyType: 'condo',
    price: 8500000,
    priceLabel: null,
    location: 'พัทยาเหนือ',
    mapUrl: 'https://www.google.com/maps?q=Pattaya',
    area: 65,
    bedrooms: 2,
    bathrooms: 2,
    images: JSON.stringify(['https://placehold.co/800x600/0ea5e9/fff?text=Condo', 'https://placehold.co/800x600/94a3b8/fff?text=View']),
    description: 'คอนโดมิเนียมวิวทะเลสวย ใกล้หาด ฟิตเนส สระว่ายน้ำ พร้อมเฟอร์นิเจอร์',
    features: JSON.stringify(['วิวทะเล', 'ฟิตเนส', 'สระว่ายน้ำ', 'ที่จอดรถ']),
    contactName: 'คุณสมชาย',
    contactPhone: '081-234-5678',
    contactEmail: 'somchai@email.com',
    isFeatured: true,
    isOwnerListing: true,
    createdAt: '2024-01-15',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    title: 'วิลล่าพรivate โซนจอมเทียน',
    listingType: 'rent',
    propertyType: 'villa',
    price: 45000,
    priceLabel: 'ต่อเดือน',
    location: 'จอมเทียน',
    mapUrl: null,
    area: 280,
    bedrooms: 4,
    bathrooms: 4,
    images: JSON.stringify(['https://placehold.co/800x600/e07a5f/fff?text=Villa']),
    description: 'วิลล่าสไตล์โมเดิร์น สระว่ายน้ำส่วนตัว สวนสวย ใกล้หาด',
    features: JSON.stringify(['สระว่ายน้ำส่วนตัว', 'สวน', 'ที่จอดรถ 2 คัน', 'เครื่องปรับอากาศ']),
    contactName: 'คุณมณี',
    contactPhone: '082-345-6789',
    contactEmail: 'manee@email.com',
    isFeatured: true,
    isOwnerListing: false,
    createdAt: '2024-02-01',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    title: 'อพาร์ตเมนต์ให้เช่ารายเดือน กลางพัทยา',
    listingType: 'rent',
    propertyType: 'apartment',
    price: 15000,
    priceLabel: 'ต่อเดือน',
    location: 'กลางพัทยา',
    mapUrl: null,
    area: 45,
    bedrooms: 1,
    bathrooms: 1,
    images: JSON.stringify(['https://placehold.co/800x600/3d5a80/fff?text=Apt']),
    description: 'ห้องสะอาด ใกล้ห้าง ใกล้ทะเล ค่าคอนโดรวม',
    features: JSON.stringify(['อินเทอร์เน็ต', 'ที่จอดรถ', 'ลิฟต์']),
    contactName: 'คุณวิภา',
    contactPhone: '083-456-7890',
    contactEmail: 'wipa@email.com',
    isFeatured: false,
    isOwnerListing: true,
    createdAt: '2024-02-10',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    title: 'บ้านเดี่ยว 2 ชั้น โครงการนครชล',
    listingType: 'sale',
    propertyType: 'house',
    price: 12500000,
    priceLabel: null,
    location: 'นครชลบุรี',
    mapUrl: null,
    area: 180,
    bedrooms: 3,
    bathrooms: 3,
    images: JSON.stringify(['https://placehold.co/800x600/64748b/fff?text=House']),
    description: 'บ้านใหม่ โครงการมาตรฐาน ใกล้พัทยา 15 นาที',
    features: JSON.stringify(['ที่จอดรถ 2 คัน', 'สวนหน้าบ้าน', 'รั้วรอบขอบชิด']),
    contactName: 'บริษัท ABC เอสเตท',
    contactPhone: '038-123-456',
    contactEmail: 'info@abcestate.com',
    isFeatured: false,
    isOwnerListing: false,
    createdAt: '2024-01-20',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    title: 'คอนโดสตูดิโอ หัวหิน-พัทยา ใกล้ MRT',
    listingType: 'rent',
    propertyType: 'condo',
    price: 12000,
    priceLabel: 'ต่อเดือน',
    location: 'บางละมุง',
    mapUrl: null,
    area: 32,
    bedrooms: 1,
    bathrooms: 1,
    images: JSON.stringify(['https://placehold.co/800x600/0ea5e9/fff?text=Studio']),
    description: 'สตูดิโอเฟอร์นิเจอร์ครบ ใกล้สถานที่ท่องเที่ยว',
    features: JSON.stringify(['เฟอร์นิเจอร์ครบ', 'WiFi', 'ที่จอดรถ']),
    contactName: 'คุณธนัท',
    contactPhone: '084-567-8901',
    contactEmail: 'tanat@email.com',
    isFeatured: false,
    isOwnerListing: true,
    createdAt: '2024-02-05',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
  {
    title: 'ที่ดินเปล่า โซนอุตสาหกรรม พัทยา',
    listingType: 'sale',
    propertyType: 'land',
    price: 3500000,
    priceLabel: null,
    location: 'ศรีราชา',
    mapUrl: null,
    area: 400,
    bedrooms: null,
    bathrooms: null,
    images: JSON.stringify(['https://placehold.co/800x600/78716c/fff?text=Land']),
    description: 'ที่ดินโฉนด นิติบุคคล ใกล้ถนนใหญ่',
    features: JSON.stringify(['โฉนดนิติบุคคล', 'ถนนลาดยาง']),
    contactName: 'คุณประเสริฐ',
    contactPhone: '085-678-9012',
    contactEmail: 'prasert@email.com',
    isFeatured: false,
    isOwnerListing: false,
    createdAt: '2024-01-25',
    updatedAt: new Date().toISOString().slice(0, 10),
  },
]

const defaultContact = {
  id: 'default',
  name: 'Pattaya Estate Hub',
  phone: '038-xxx-xxx',
  email: 'contact@pattayaestatehub.com',
  address: 'พัทยา ชลบุรี',
  line: '@187umoiw',
  whatsapp: '66812345678',
  wechat: 'pattayaproperty',
  telegram: 'pattayaproperty',
  updatedAt: new Date().toISOString().slice(0, 19),
}

async function main() {
  await prisma.property.deleteMany()
  for (const p of seedData) {
    await prisma.property.create({ data: p })
  }
  console.log('Seeded', seedData.length, 'properties')

  await prisma.contactSettings.upsert({
    where: { id: 'default' },
    create: defaultContact,
    update: {},
  })
  console.log('Seeded contact settings')

  const demoPasswordHash = await bcrypt.hash('demo123', 10)
  const now = new Date().toISOString().slice(0, 19)
  await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    create: {
      email: 'demo@example.com',
      passwordHash: demoPasswordHash,
      name: 'ผู้ใช้ทดสอบ',
      phone: '081-234-5678',
      createdAt: now,
      updatedAt: now,
    },
    update: { passwordHash: demoPasswordHash, updatedAt: now },
  })
  console.log('Seeded demo user: demo@example.com / demo123')

  // บัญชีแอดมินคนแรก (ผู้ดูแลระบบหลัก) — อีเมล Kiranat56201@gmail.com รหัสตามที่ตั้งไว้
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'Venus0979961789'
  const adminHash = await bcrypt.hash(adminPassword, 10)
  const adminNow = new Date().toISOString().slice(0, 19)
  await prisma.adminUser.upsert({
    where: { email: 'kiranat56201@gmail.com' },
    create: {
      email: 'kiranat56201@gmail.com',
      passwordHash: adminHash,
      name: 'ผู้ดูแลระบบหลัก',
      role: 'admin',
      isActive: true,
      createdAt: adminNow,
      updatedAt: adminNow,
    },
    update: { passwordHash: adminHash, name: 'ผู้ดูแลระบบหลัก', role: 'admin', updatedAt: adminNow },
  })
  console.log('Seeded admin: Kiranat56201@gmail.com (รหัสตาม .env ADMIN_INITIAL_PASSWORD หรือค่าเริ่มต้น)')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
