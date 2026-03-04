-- รันใน Supabase SQL Editor (สำหรับฐานที่มีตาราง Property อยู่แล้ว)
-- คอนโด: ชั้น + เลขห้อง | บ้าน/วิลล่า: จำนวนชั้น (1 หรือ 2)

ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "floor" INTEGER;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "roomNumber" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "floors" INTEGER;
