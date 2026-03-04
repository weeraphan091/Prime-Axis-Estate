-- สร้างตารางให้ตรงกับ Prisma schema (รันใน Supabase SQL Editor)
-- คัดลอกทั้งหมดแล้วไปวางที่ https://supabase.com/dashboard/project/liyjjuqzsvgwwopvcdko/sql/new

-- ลบตารางเก่าถ้ามี (ถ้าเป็นครั้งแรกรัน ไม่มีผล)
-- ถ้ามีข้อมูลอยู่แล้ว ใช้ supabase-migration-leads-agents-status.sql แทน
DROP TABLE IF EXISTS "Lead";
DROP TABLE IF EXISTS "Property";
DROP TABLE IF EXISTS "Agent";
DROP TABLE IF EXISTS "ContactSettings";
DROP TABLE IF EXISTS "User";

-- ตารางพนักงานขาย
CREATE TABLE "Agent" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "lineId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL,
  CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- ตารางทรัพย์
CREATE TABLE "Property" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "listingType" TEXT NOT NULL,
  "propertyType" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "priceLabel" TEXT,
  "location" TEXT NOT NULL,
  "mapUrl" TEXT,
  "area" INTEGER NOT NULL,
  "bedrooms" INTEGER,
  "bathrooms" INTEGER,
  "images" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "features" TEXT NOT NULL,
  "contactName" TEXT NOT NULL,
  "contactPhone" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "contactLine" TEXT,
  "contactWhatsapp" TEXT,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isOwnerListing" BOOLEAN NOT NULL DEFAULT false,
  "status" TEXT NOT NULL DEFAULT 'published',
  "agentId" TEXT,
  "rentOccupied" BOOLEAN NOT NULL DEFAULT false,
  "rentLeaseStart" TEXT,
  "rentLeaseEnd" TEXT,
  "floor" INTEGER,
  "roomNumber" TEXT,
  "floors" INTEGER,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL,
  CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- ตารางลีด
CREATE TABLE "Lead" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "propertyTitle" TEXT,
  "agentId" TEXT,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "interestType" TEXT,
  "contactWhen" TEXT,
  "viewWhen" TEXT,
  "message" TEXT,
  "status" TEXT NOT NULL DEFAULT 'new',
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL,
  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- ตารางตั้งค่าติดต่อ
CREATE TABLE "ContactSettings" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "line" TEXT NOT NULL,
  "whatsapp" TEXT NOT NULL,
  "wechat" TEXT NOT NULL,
  "telegram" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL,
  CONSTRAINT "ContactSettings_pkey" PRIMARY KEY ("id")
);

-- ตารางผู้ใช้ (สมัคร/ล็อกอิน)
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- ข้อมูลเริ่มต้น: ตั้งค่าติดต่อ
INSERT INTO "ContactSettings" ("id", "name", "phone", "email", "address", "line", "whatsapp", "wechat", "telegram", "updatedAt")
VALUES (
  'default',
  'PRIME AXIS ESTATE',
  '038-xxx-xxx',
  'contact@primeaxisestate.com',
  'พัทยา ชลบุรี',
  '@187umoiw',
  '66812345678',
  'pattayaproperty',
  'pattayaproperty',
  NOW()::text
);

-- ข้อมูลเริ่มต้น: ผู้ใช้ทดสอบ (อีเมล demo@example.com รหัส demo123)
INSERT INTO "User" ("id", "email", "passwordHash", "name", "phone", "createdAt", "updatedAt")
VALUES (
  'clseeduser01',
  'demo@example.com',
  '$2a$10$HNn2VKAV9mhGeZlKd0NjGe9nxZGT/90w7xmnuJJeV3FF/Ks2Js7z.',
  'ผู้ใช้ทดสอบ',
  '081-234-5678',
  NOW()::text,
  NOW()::text
);

-- ข้อมูลเริ่มต้น: ตัวอย่างทรัพย์ 2 รายการ
INSERT INTO "Property" ("id", "title", "listingType", "propertyType", "price", "priceLabel", "location", "mapUrl", "area", "bedrooms", "bathrooms", "images", "description", "features", "contactName", "contactPhone", "contactEmail", "contactLine", "contactWhatsapp", "isFeatured", "isOwnerListing", "status", "agentId", "rentOccupied", "rentLeaseStart", "rentLeaseEnd", "floor", "roomNumber", "floors", "createdAt", "updatedAt")
VALUES
(
  'clseedprop01',
  'คอนโดวิวทะเล พัทยาเหนือ 2 ห้องนอน',
  'sale',
  'condo',
  8500000,
  NULL,
  'พัทยาเหนือ',
  'https://www.google.com/maps?q=Pattaya',
  65,
  2,
  2,
  '["https://placehold.co/800x600/0ea5e9/fff?text=Condo","https://placehold.co/800x600/94a3b8/fff?text=View"]',
  'คอนโดมิเนียมวิวทะเลสวย ใกล้หาด ฟิตเนส สระว่ายน้ำ พร้อมเฟอร์นิเจอร์',
  '["วิวทะเล","ฟิตเนส","สระว่ายน้ำ","ที่จอดรถ"]',
  'คุณสมชาย',
  '081-234-5678',
  'somchai@email.com',
  NULL,
  NULL,
  true,
  true,
  'published',
  NULL,
  false,
  NULL,
  NULL,
  5,
  '301',
  NULL,
  '2024-01-15',
  '2024-01-15'
),
(
  'clseedprop02',
  'วิลล่า Private โซนจอมเทียน',
  'rent',
  'villa',
  45000,
  'ต่อเดือน',
  'จอมเทียน',
  NULL,
  280,
  4,
  4,
  '["https://placehold.co/800x600/e07a5f/fff?text=Villa"]',
  'วิลล่าสไตล์โมเดิร์น สระว่ายน้ำส่วนตัว สวนสวย ใกล้หาด',
  '["สระว่ายน้ำส่วนตัว","สวน","ที่จอดรถ 2 คัน","เครื่องปรับอากาศ"]',
  'คุณมณี',
  '082-345-6789',
  'manee@email.com',
  NULL,
  NULL,
  true,
  false,
  'published',
  NULL,
  false,
  NULL,
  NULL,
  NULL,
  NULL,
  2,
  '2024-02-01',
  '2024-02-01'
);
