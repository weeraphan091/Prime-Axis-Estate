# เชื่อม GitHub แล้ว Deploy ไป Vercel

## ขั้นตอนสั้นๆ

### 1. สร้าง Repo บน GitHub

1. เปิด **[github.com](https://github.com)** → ล็อกอิน
2. คลิก **+** มุมขวาบน → **New repository**
3. ตั้งชื่อ เช่น `prime-axis-estate` หรือ `real-estate-web`
4. เลือก **Private** หรือ **Public** ตามต้องการ
5. **อย่า** เลือก "Add a README" (เพราะโปรเจกต์มีอยู่แล้ว)
6. คลิก **Create repository**

---

### 2. เชื่อมโปรเจกต์กับ GitHub (ในเครื่องคุณ)

เปิด **Terminal** หรือ **PowerShell** ในโฟลเดอร์โปรเจกต์ แล้วรันตามลำดับ:

```bash
# ไปที่โฟลเดอร์โปรเจกต์ (ถ้าอยู่อยู่แล้วข้ามได้)
cd "c:\Users\Zhong\OneDrive\เดสก์ท็อป\อสังหา"

# ถ้ายังไม่เคยใช้ git ในโฟลเดอร์นี้
git init

# ใส่ remote ชี้ไปที่ repo ที่สร้างไว้ (แทน YOUR_USERNAME และ YOUR_REPO ด้วยของจริง)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# ดูสถานะ
git status

# เพิ่มไฟล์ทั้งหมด (ไฟล์ใน .gitignore จะไม่ถูก add เช่น .env, node_modules)
git add .

# commit ครั้งแรก
git commit -m "Initial: PRIME AXIS ESTATE website"

# ส่งขึ้น GitHub (สาขา main)
git branch -M main
git push -u origin main
```

- **YOUR_USERNAME** = ชื่อ user GitHub ของคุณ  
- **YOUR_REPO** = ชื่อ repo ที่สร้าง (เช่น `prime-axis-estate`)  
- ถ้า GitHub ถามล็อกอิน ใช้ **Username + Password** หรือ **Personal Access Token** (แนะนำสร้างที่ GitHub → Settings → Developer settings → Personal access tokens)

---

### 3. Deploy บน Vercel

1. เปิด **[vercel.com](https://vercel.com)** → ล็อกอิน (เลือก **Continue with GitHub** ได้)
2. คลิก **Add New…** → **Project**
3. เลือก repo ที่ push ไว้ (เช่น `prime-axis-estate`)
4. กด **Import**
5. **Settings ก่อน Deploy:**
   - **Framework Preset**: Next.js (Vercel ตรวจจับให้อัตโนมัติ)
   - **Root Directory**: ว่างไว้
   - **Build Command**: `npm run build` (หรือปล่อย default)
   - **Environment Variables** (สำคัญ): กด **Add** แล้วใส่ทีละตัว เช่น  
     - `ADMIN_PASSWORD` = รหัสผ่านหลังบ้าน  
     - `SESSION_SECRET` = สตริงยาวแบบสุ่ม  
     - `TELEGRAM_BOT_TOKEN` = ค่าจากบอท  
     - `TELEGRAM_CHAT_ID` = เลข Chat ID  
     - **ถ้าใช้ PostgreSQL ภายหลัง** ใส่ `DATABASE_URL` ด้วย
6. กด **Deploy**
7. รอสักครู่ จะได้ลิงก์ เช่น `https://xxxxx.vercel.app` → เปิดดูได้เลย

---

### 4. อัปเดตโค้ดในอนาคต

แก้โค้ดในเครื่องแล้วส่งขึ้น GitHub → Vercel จะ **build + deploy ใหม่ให้อัตโนมัติ**:

```bash
git add .
git commit -m "อธิบายสิ่งที่แก้"
git push
```

---

## หมายเหตุสำคัญ

- ไฟล์ **`.env`** อยู่ใน `.gitignore` แล้ว **จะไม่ถูก push ขึ้น GitHub** (ปลอดภัย)
- ค่าเช่น รหัสผ่าน, Token ต้องไปใส่ใน **Vercel → Project → Settings → Environment Variables** แทน
- ตอนนี้โปรเจกต์ใช้ **SQLite** ในเครื่อง; บน Vercel ต้องใช้ **ฐานข้อมูลภายนอก** (เช่น Vercel Postgres, Supabase) และตั้ง `DATABASE_URL` ถึงจะเก็บข้อมูลได้ถาวร (มีเอกสารใน `ขั้นตอนใช้จริง.md` / `วิธีรันและรองรับเหมือนเว็บอสังหาอื่น.md`)
