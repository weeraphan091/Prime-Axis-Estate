-- ตารางบัญชีผู้ใช้หลังบ้าน (แอดมิน/พนักงาน)
-- รันใน Supabase SQL Editor หลังจากมีตารางอื่นแล้ว

CREATE TABLE IF NOT EXISTS "AdminUser" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'staff',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

-- สร้างบัญชีแอดมินคนแรก: รัน seed ด้วยคำสั่ง npm run db:seed (จะสร้าง Kiranat56201@gmail.com)
-- หรือเพิ่มบัญชีผ่านหน้าแอดมินหลังสร้างตารางแล้ว (ต้องมีแอดมินอย่างน้อย 1 คน — สร้างด้วย script ด้านล่างหรือ seed)

-- ตัวอย่าง INSERT แอดมินแรก (รหัส Venus0979961789 — hash นี้สร้างจาก bcrypt 10 rounds):
-- INSERT INTO "AdminUser" ("id", "email", "passwordHash", "name", "role", "isActive", "createdAt", "updatedAt")
-- VALUES (
--   gen_random_uuid()::text,
--   'kiranat56201@gmail.com',
--   '$2a$10$YourHashFromSeedOrBcryptHere',
--   'ผู้ดูแลระบบหลัก',
--   'admin',
--   true,
--   to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS'),
--   to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS')
-- );
-- แนะนำ: ใช้ npm run db:seed แทน เพื่อให้ได้ hash ที่ถูกต้อง
