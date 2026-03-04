# สร้างตารางใน Supabase แบบไม่ต้องรันจากเครื่อง (แก้ปัญหาเน็ตนิ่ง)

ทำ 3 อย่างนี้เท่านั้น:

---

## ขั้นที่ 1 — เปิด SQL Editor ใน Supabase

1. เปิดเบราว์เซอร์ไปที่: **https://supabase.com/dashboard/project/liyjjuqzsvgwwopvcdko/sql/new**
2. (ถ้ามันให้ล็อกอิน — ล็อกอิน Supabase ก่อน)
3. จะเห็นหน้าต่างเขียนโค้ด SQL ใหญ่ๆ

---

## ขั้นที่ 2 — วางโค้ด SQL

1. เปิดไฟล์ **`supabase-create-tables.sql`** ในโฟลเดอร์โปรเจกต์ (ดับเบิลคลิกแล้วเปิดด้วย Notepad ได้)
2. กด **Ctrl+A** (เลือกทั้งหมด) แล้ว **Ctrl+C** ( copy )
3. กลับไปที่หน้า SQL Editor ใน Supabase
4. กด **Ctrl+V** ( paste ) วางโค้ดทั้งหมดลงในช่อง

---

## ขั้นที่ 3 — รัน

1. กดปุ่ม **Run** (หรือกด Ctrl+Enter)
2. รอสักครู่ ถ้าสำเร็จจะขึ้นข้อความสีเขียวประมาณ "Success"
3. ปิดได้เลย

---

เสร็จแล้ว = ตารางและข้อมูลเริ่มต้นอยู่ใน Supabase แล้ว

- เว็บบน **Vercel** จะเชื่อมฐานข้อมูลได้ (อย่าลืมใส่ `DATABASE_URL` ใน Vercel Environment Variables ด้วยค่าเดียวกับใน `.env` — แบบ Pooler)
- ลองเข้า **หลังบ้าน → จัดการทรัพย์** ในเว็บที่ deploy แล้ว ควรโหลดได้

**ผู้ใช้ทดสอบ:** อีเมล `demo@example.com` รหัส `demo123`

---

## ถ้ามีตารางอยู่แล้ว (เคยรัน supabase-create-tables.sql ไปก่อนหน้า)

- **`supabase-add-owner-contact-columns.sql`** — เพิ่มคอลัมน์ช่องทางติดต่อเจ้าของทรัพย์ (Line, WhatsApp)
- **`supabase-migration-leads-agents-status.sql`** — สร้างตาราง Agent, Lead และคอลัมน์ status, agentId
- **`supabase-migration-rent-lease.sql`** — เพิ่มคอลัมน์สำหรับรายการเช่า: เช่าอยู่แล้ว + วันที่เริ่ม/สิ้นสุดสัญญา (ลูกค้าวางแผนหาห้องล่วงหน้า)
- **`supabase-migration-floor-room-floors.sql`** — คอนโด: ชั้น + เลขห้อง | บ้าน/วิลล่า: จำนวนชั้น (1 หรือ 2)
- **`supabase-migration-project-name.sql`** — ชื่อโปรเจ็ค/โครงการ (เช่น คอนโด หมู่บ้าน)
