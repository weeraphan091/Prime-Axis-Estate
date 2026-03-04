# ตั้งค่า PostgreSQL ให้หลังบ้านบน Vercel ใช้ได้

โปรเจกต์เปลี่ยนมาใช้ **PostgreSQL** แล้ว (บน Vercel ใช้ SQLite ไม่ได้) ทำตามขั้นตอนด้านล่างครั้งเดียว

---

## ขั้นที่ 1 — สร้างฐานข้อมูลฟรี (Supabase)

1. เปิด **https://supabase.com** → สมัคร/ล็อกอิน
2. กด **New Project** → ตั้งชื่อ เช่น `prime-axis-estate` → ตั้งรหัสผ่าน (เก็บไว้ใช้)
3. เลือก Region ใกล้ไทย (เช่น Singapore) → กด **Create project**
4. รอสร้างเสร็จ แล้วเข้าเมนู **Project Settings** (ไอคอนฟันเฟือง) → **Database**
5. ใน Supabase ตอนนี้ Connection string อยู่ที่ปุ่ม **Connect** (มุมขวาบนหรือใต้ชื่อโปรเจกต์) — กด Connect แล้วเลือกแท็บ **Connection string** หรือ **URI** (อย่าเลือก API Keys)
6. โปรเจกต์คุณ: **liyjjuqzsvgwwopvcdko**  
   ตัวอย่าง connection string (แทนที่ **รหัสผ่านDB** ด้วยรหัสที่ตั้งตอนสร้างโปรเจกต์):
   ```
   postgresql://postgres.liyjjuqzsvgwwopvcdko:รหัสผ่านDB@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
   หรือใช้ **Direct connection** จากใน Supabase (ปุ่ม Copy ในหน้า Database):
   ```
   postgresql://postgres:รหัสผ่านDB@db.liyjjuqzsvgwwopvcdko.supabase.co:5432/postgres
   ```
   แนะนำ: copy ตัวที่ Supabase แสดงในหน้า Database ของคุณ แล้วแค่แทนที่ส่วนรหัสผ่านให้ตรง

---

## ขั้นที่ 2 — สร้างตารางในฐานข้อมูล (รันในเครื่องคุณ)

1. เปิดโฟลเดอร์โปรเจกต์ในเครื่อง
2. สร้างหรือแก้ไฟล์ **.env** ให้มีบรรทัดนี้ (วาง connection string ที่ copy มา):
   ```
   DATABASE_URL="postgresql://postgres.xxxx:รหัสผ่าน@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
3. เปิด Terminal ในโฟลเดอร์โปรเจกต์ รัน:
   ```
   npx prisma db push
   npm run db:seed
   ```
4. ถ้าไม่มี error แปลว่าตารางสร้างและมีข้อมูลเริ่มต้นแล้ว

---

## ขั้นที่ 3 — ใส่ DATABASE_URL ใน Vercel

1. ไปที่ **https://vercel.com** → เลือกโปรเจกต์
2. **Settings** → **Environment Variables**
3. กด **Add New**
   - **Name:** `DATABASE_URL`
   - **Value:** วาง connection string เดิม (ที่ใช้ใน .env) — **ต้องใส่แบบต่อกันหนึ่งบรรทัด ไม่มีเว้นบรรทัด**
   - Environment: เลือก **Production** (และ Preview ถ้าต้องการ)
4. กด **Save**

---

## ขั้นที่ 4 — Redeploy

1. ไปที่แท็บ **Deployments**
2. กด **⋯** ที่ deployment ล่าสุด → **Redeploy**
3. รอ build จนเสร็จ

จากนั้นลองเข้า **หลังบ้าน → จัดการทรัพย์** อีกครั้ง หน้าจะโหลดได้และไม่ขึ้น Application error

---

## สรุป

- โปรเจกต์ใช้ **PostgreSQL** แล้ว (ไม่ใช้ SQLite บน Vercel)
- ต้องมี **DATABASE_URL** ใน .env (ในเครื่อง) และใน Vercel Environment Variables
- รัน **npx prisma db push** และ **npm run db:seed** ครั้งเดียว (ในเครื่อง) เพื่อสร้างตารางและข้อมูลเริ่มต้น
- ใส่ **DATABASE_URL** ใน Vercel แล้ว **Redeploy** หนึ่งครั้ง
