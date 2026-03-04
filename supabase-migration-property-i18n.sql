-- เพิ่มคอลัมน์ชื่อ/รายละเอียดหลายภาษา (titleEn, descriptionEn, titleZh, descriptionZh, titleRu, descriptionRu)
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "titleEn" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "titleZh" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "descriptionZh" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "titleRu" TEXT;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "descriptionRu" TEXT;
