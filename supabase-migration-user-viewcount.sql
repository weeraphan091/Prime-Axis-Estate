-- เพิ่มคอลัมน์สำหรับรายการของสมาชิก + จำนวนการดู
-- รันใน Supabase SQL Editor

ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS "Property_userId_idx" ON "Property"("userId");
