-- เพิ่มคอลัมน์แปลจุดเด่นและทำเลเป็น 3 ภาษา
-- รันใน Supabase SQL Editor

ALTER TABLE "Property"
  ADD COLUMN IF NOT EXISTS "featuresEn" TEXT,
  ADD COLUMN IF NOT EXISTS "featuresZh" TEXT,
  ADD COLUMN IF NOT EXISTS "featuresRu" TEXT,
  ADD COLUMN IF NOT EXISTS "locationEn" TEXT,
  ADD COLUMN IF NOT EXISTS "locationZh" TEXT,
  ADD COLUMN IF NOT EXISTS "locationRu" TEXT;
