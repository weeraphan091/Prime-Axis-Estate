# จับมือทำ — ใส่ Environment Variables ใน Vercel แล้ว Redeploy

ทำตามทีละขั้น

---

## ขั้นที่ 1 — เปิด Vercel

1. เปิดเบราว์เซอร์ ไปที่ **https://vercel.com**
2. ล็อกอิน (ถ้ายัง)
3. จะเห็นรายการโปรเจกต์ — **คลิกที่ชื่อโปรเจกต์** (เช่น Prime-Axis-Estate หรือชื่อที่คุณตั้ง)

---

## ขั้นที่ 2 — เข้า Settings → Environment Variables

4. ด้านบนของหน้าโปรเจกต์จะมีแท็บ **Overview**, **Deployments**, **Analytics**, **Settings** ฯลฯ  
   → **คลิก "Settings"**
5. เมนูซ้ายจะมี **General**, **Domains**, **Environment Variables**, **Functions** ฯลฯ  
   → **คลิก "Environment Variables"**

---

## ขั้นที่ 3 — เพิ่มตัวแปร 2 ตัว (สำหรับ Supabase Storage)

6. จะเห็นช่อง **Key** กับ **Value** และปุ่ม **Save**

   **ตัวที่ 1**
   - ช่อง **Key** พิมพ์: `NEXT_PUBLIC_SUPABASE_URL`
   - ช่อง **Value** พิมพ์: `https://liyjjuqzsvgwwopvcdko.supabase.co`
   - ช่อง **Environment** เลือก **Production** (หรือติ๊กทั้ง Production และ Preview)
   - กด **Save**

   **ตัวที่ 2**
   - ช่อง **Key** พิมพ์: `SUPABASE_SERVICE_ROLE_KEY`
   - ช่อง **Value** วางค่าจากไฟล์ .env ของคุณ (ค่าเดียวกับ SUPABASE_SERVICE_ROLE_KEY ในเครื่อง)
   - ช่อง **Environment** เลือก **Production** (หรือติ๊กทั้ง Production และ Preview)
   - กด **Save**

7. ถ้ามี **DATABASE_URL** อยู่แล้ว ไม่ต้องเพิ่มอีก (เว็บเชื่อม DB ได้อยู่แล้ว)  
   ถ้ายังไม่มี ให้เพิ่ม:
   - **Key:** `DATABASE_URL`
   - **Value:** `postgresql://postgres.liyjjuqzsvgwwopvcdko:รหัสผ่านDBจริง@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`  
     (แทน "รหัสผ่านDBจริง" ด้วยรหัสผ่าน Database จริง)

---

## ขั้นที่ 4 — Redeploy (เลือกวิธีใดวิธีหนึ่ง)

### วิธีที่ 1 — จากแท็บ Deployments
8. ไปที่แท็บ **Deployments** (ด้านบน)
9. จะเห็นรายการ deployment — แถวบนสุดคือล่าสุด
10. คลิก **ชื่อ deployment** (ข้อความสีน้ำเงิน) เพื่อเข้าไปในหน้านั้น → ด้านบนขวาจะมีปุ่ม **Redeploy** ให้กด
11. หรือที่แถว deployment แต่ละแถว อาจมีไอคอน **⋮** หรือ **⋯** (สามจุด) ทางขวา → คลิกแล้วเลือก **Redeploy**
12. รอจนสถานะเป็น **Ready**

### วิธีที่ 2 — จาก Overview (ถ้า Deployments ไม่ขึ้นหรือไม่เห็นปุ่ม)
8. ไปที่แท็บ **Overview** (หน้าแรกของโปรเจกต์)
9. ด้านบนจะมีการ์ดแสดง deployment ล่าสุด — คลิกที่การ์ดนั้น หรือคลิก **View** / **ดู**
10. ในหน้านั้นจะมีปุ่ม **Redeploy** ด้านบนขวา → กด **Redeploy**

### วิธีที่ 3 — ให้ Vercel deploy ใหม่เอง (ไม่ต้องกด Redeploy)
8. ใส่ Environment Variables เสร็จแล้ว **Save** ไว้ก่อน
9. จากเครื่องคุณ: เปิดโฟลเดอร์โปรเจกต์ → ส่งโค้ดขึ้น Git (git add, commit, push)
10. Vercel จะ deploy ใหม่อัตโนมัติเมื่อมี push ขึ้น GitHub
11. ไปที่ **Deployments** รอสักครู่ จะเห็น deployment ใหม่โผล่ขึ้นมา (สถานะ Building แล้วค่อยเป็น Ready)

---

## เสร็จแล้ว

หลัง Redeploy เว็บบน Vercel จะใช้ตัวแปรใหม่แล้ว ลองเปิดเว็บแล้วทดสอบฝากทรัพย์หรือแอดมินอัปโหลดรูป — รูปจะไปเก็บที่ Supabase Storage ได้
