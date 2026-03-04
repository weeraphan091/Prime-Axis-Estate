# ต่อ Supabase ทำตามนี้ (ทีละขั้น)

คุณอยู่หน้า **API Keys** — ต้องไปเอา **Connection String ของฐานข้อมูล** แทน (คนละอัน)

---

## ขั้นที่ 1 — เอา Connection String จาก Supabase

**วิธีที่ 1 — เปิดลิงก์นี้ (ง่ายสุด)**  
เปิดในเบราว์เซอร์ (ล็อกอิน Supabase อยู่แล้ว):

**https://supabase.com/dashboard/project/liyjjuqzsvgwwopvcdko/settings/database**

หรือลิงก์นี้เพื่อเปิดป๊อปอัป Connect:

**https://supabase.com/dashboard/project/liyjjuqzsvgwwopvcdko?showConnect=true**

1. ในหน้าที่เปิด จะมีส่วน **Connection string** หรือปุ่ม **Connect**
2. เลือก **Connection string** / **URI** (ไม่ใช่ API Keys)
3. เลือกแบบ **Transaction** (สำหรับ Vercel) หรือ **Session** ก็ได้
4. กด **Copy** — จะได้ข้อความขึ้นต้นด้วย `postgresql://...` หรือ `postgres://...`
5. ถ้ามี `[YOUR-PASSWORD]` ในนั้น ให้แทนที่ด้วยรหัสผ่านที่ตั้งตอนสร้างโปรเจกต์

**วิธีที่ 2 — ถ้าอยากหาจากในแอป**  
ไปที่ **Project Settings** (ไอคอนฟันเฟืองด้านซ้ายล่าง) → ในเมนูซ้ายเลือก **Database** (อยู่ใต้หัว "Project" หรือ "Configuration") → เลื่อนลงหา **Connection string**

---

## ขั้นที่ 2 — ใส่ในไฟล์ .env ในเครื่อง

1. เปิดโฟลเดอร์โปรเจกต์ (ที่เก็บไฟล์เว็บ Prime-Axis-Estate)
2. หาไฟล์ชื่อ **.env** (ถ้าไม่มี ให้ copy ไฟล์ **.env.example** มาสร้างใหม่แล้วเปลี่ยนชื่อเป็น **.env**)
3. เปิดไฟล์ .env ด้วย Notepad
4. หาบรรทัดที่เขียนว่า `DATABASE_URL=...`
   - ถ้ามีอยู่แล้ว → ลบค่าข้างหลัง `=` ออก แล้ววาง connection string ที่ copy มา (ให้อยู่ในเครื่องหมายคำพูด)
   - ถ้าไม่มี → เพิ่มบรรทัดใหม่ด้านบนสุด:
   ```
   DATABASE_URL="วาง connection string ที่ copy มาเลย"
   ```
   ตัวอย่าง (ไม่ต้องใช้ตัวนี้ตรงๆ ใช้ของที่คุณ copy จาก Supabase):
   ```
   DATABASE_URL="postgresql://postgres.liyjjuqzsvgwwopvcdko:รหัสผ่านคุณ@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```
5. **บันทึก** (Ctrl+S) แล้วปิด Notepad

---

## ขั้นที่ 3 — สร้างตารางและข้อมูลเริ่มต้น

1. เปิดโฟลเดอร์โปรเจกต์
2. ดับเบิลคลิกไฟล์ **สร้างตาราง-Supabase.bat** (หรือเปิด Terminal ในโฟลเดอร์นี้แล้วรันคำสั่งด้านล่าง)
3. ถ้าไม่มีไฟล์ bat ให้เปิด **Command Prompt** หรือ **PowerShell** ในโฟลเดอร์นี้ แล้วพิมพ์ทีละบรรทัด:
   ```
   npx prisma db push
   npm run db:seed
   ```
4. รอจนไม่มี error แดง

**ถ้าขึ้นว่า "Can't reach database server"**  
อาจเป็นเพราะการเชื่อมตรง (port 5432) ใช้ IPv6 — ให้ไปที่ Supabase → Connect → เลือก **Session** หรือ **Transaction** (Pooler) แล้ว copy connection string ใหม่มาแทนใน `.env` (แบบ Pooler ใช้โฮสต์อื่น รองรับ IPv4)

---

## ขั้นที่ 4 — ใส่ DATABASE_URL ใน Vercel

1. เปิด **https://vercel.com** → เลือกโปรเจกต์
2. ไปที่ **Settings** → **Environment Variables**
3. กด **Add New**
   - **Name:** `DATABASE_URL`
   - **Value:** วาง **connection string เดิม** (ที่ใส่ใน .env ขั้นที่ 2) — ต้องเป็นบรรทัดเดียว ไม่เว้นบรรทัด
4. กด **Save**

---

## ขั้นที่ 5 — Redeploy

1. ใน Vercel ไปที่ **Deployments**
2. กด **⋯** ที่ deployment ล่าสุด → **Redeploy**
3. รอ build เสร็จ

เสร็จแล้วลองเข้า **หลังบ้าน → จัดการทรัพย์** อีกครั้ง หน้าจะโหลดได้
