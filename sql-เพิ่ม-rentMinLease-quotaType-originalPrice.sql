-- เพิ่ม 3 คอลัมน์ใหม่ในตาราง Property
-- รันใน Supabase SQL Editor

ALTER TABLE "Property"
  ADD COLUMN IF NOT EXISTS "rentMinLease" INTEGER,
  ADD COLUMN IF NOT EXISTS "quotaType" TEXT,
  ADD COLUMN IF NOT EXISTS "originalPrice" INTEGER;
