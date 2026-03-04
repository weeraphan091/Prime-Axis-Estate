# ตั้งค่า Supabase Storage (เก็บรูปทรัพย์)

เมื่อตั้งค่าแล้ว รูปที่ลูกค้าหรือแอดมินอัปโหลดจะเก็บใน Supabase Storage แทนการเก็บในเครื่อง (ใช้ได้บน Vercel)

---

## ขั้นที่ 1 — สร้าง Bucket ใน Supabase

1. เข้า [Supabase Dashboard](https://supabase.com/dashboard) → เลือกโปรเจกต์ของคุณ
2. ไปที่ **Storage** (เมนูซ้าย)
3. กด **New bucket**
4. ตั้งค่า:
   - **Name:** `property-images` (ต้องตรงนี้)
   - **Public bucket:** เปิด (ติ๊ก) — เพื่อให้ลิงก์รูปใช้แสดงบนเว็บได้
5. กด **Create bucket**

---

## ขั้นที่ 2 — ใส่ Environment Variables

ต้องมี 2 ตัว:

| Name | ค่าที่ใช้ |
|------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL โปรเจกต์ เช่น `https://liyjjuqzsvgwwopvcdko.supabase.co` (ดูที่ Project Settings → API → Project URL) |
| `SUPABASE_SERVICE_ROLE_KEY` | คีย์ **service_role** (ไม่ใช่ anon) — ดูที่ Project Settings → API → Project API keys → **service_role** (secret) |

### ในเครื่อง (`.env`)

เปิดไฟล์ `.env` แล้วเพิ่ม:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

(แทน `xxxxx` และค่าคีย์ด้วยของโปรเจกต์คุณ)

### บน Vercel

1. ไปที่โปรเจกต์ใน Vercel → **Settings** → **Environment Variables**
2. เพิ่มตัวแปรทั้งสอง (ชื่อและค่าตามตารางด้านบน)
3. เลือก Environment: **Production** (และ Preview ถ้าต้องการ)
4. **Redeploy** โปรเจกต์หลังเพิ่ม/แก้ไขตัวแปร

---

## ขั้นที่ 3 — ตรวจสอบ

- **ฝากทรัพย์ (ลูกค้า):** ถ้าใช้ปุ่มอัปโหลดรูปและมี API upload เรียก Supabase แล้ว รูปจะไปอยู่ที่ Storage
- **แอดมินลงลิส:** อัปโหลดรูปในฟอร์มจะไปที่ bucket `property-images` เช่นกัน

ลิงก์รูปจะอยู่ในรูปแบบ  
`https://xxxxx.supabase.co/storage/v1/object/public/property-images/ชื่อไฟล์.jpg`

---

## หมายเหตุ

- **Service role key** มีสิทธิ์สูง อย่าใส่ในโค้ดฝั่ง client หรือเปิดเผย
- ใช้เฉพาะใน API ฝั่ง server (`/api/upload`) เท่านั้น
- ถ้าไม่ตั้งค่า Supabase Storage ระบบจะคืน 503 และฝากทรัพย์จะใช้วิธีส่งรูปเป็น data URL แทน (ได้เหมือนกัน แต่รายการที่มีรูปเยอะอาจทำให้ข้อมูลใน DB ใหญ่)
