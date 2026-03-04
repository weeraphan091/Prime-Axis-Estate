-- รันใน Supabase SQL Editor (สำหรับฐานที่มีตารางอยู่แล้ว)
-- สร้างตาราง Agent, Lead และเพิ่มคอลัมน์ status, agentId ใน Property

-- ตารางพนักงานขาย
CREATE TABLE IF NOT EXISTS "Agent" (
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

-- ตารางลีด (สนใจทรัพย์นี้)
CREATE TABLE IF NOT EXISTS "Lead" (
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

-- เพิ่มคอลัมน์ใน Property (ถ้ายังไม่มี)
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'published';
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "agentId" TEXT;

-- อัปเดตแถวเดิมให้มี status
UPDATE "Property" SET "status" = 'published' WHERE "status" IS NULL;
