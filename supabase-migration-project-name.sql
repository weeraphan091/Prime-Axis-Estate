-- รันใน Supabase SQL Editor (สำหรับฐานที่มีตาราง Property อยู่แล้ว)
-- เพิ่มคอลัมน์ชื่อโปรเจ็ค/โครงการ

ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "projectName" TEXT;
