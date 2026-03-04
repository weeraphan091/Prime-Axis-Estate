-- สำหรับฐานข้อมูลที่มีตาราง Property อยู่แล้ว (รันครั้งเดียวใน Supabase SQL Editor)
-- เพิ่มคอลัมน์ช่องทางติดต่อเจ้าของทรัพย์

ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "contactLine" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "contactWhatsapp" TEXT;
