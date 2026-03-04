-- รันใน Supabase SQL Editor (สำหรับฐานที่มีตาราง Property อยู่แล้ว)
-- เพิ่มฟิลด์สำหรับรายการเช่า: เช่าอยู่แล้ว + ระยะสัญญา (ลูกค้าวางแผนหาห้องล่วงหน้า)

ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "rentOccupied" BOOLEAN DEFAULT false;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "rentLeaseStart" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "rentLeaseEnd" TEXT;
