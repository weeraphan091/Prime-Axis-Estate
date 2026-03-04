# อัปโหลดขึ้น GitHub แบบไม่ใช้คำสั่ง Git (ลากไฟล์ขึ้นเว็บ)

ใช้วิธีนี้ได้ถ้าติดตั้ง Git ไม่ได้ หรือใช้คำสั่งไม่เป็น

---

## ขั้นที่ 1 — เตรียมโฟลเดอร์ที่จะอัปโหลด

ในโฟลเดอร์โปรเจกต์ (อสังหา) **อย่าลากโฟลเดอร์เหล่านี้ขึ้น GitHub** เพราะใหญ่และไม่จำเป็น:

- **node_modules** (โฟลเดอร์นี้)
- **.next** (ถ้ามี)
- **.env** (ไฟล์นี้มีรหัสผ่าน อย่าส่งขึ้น GitHub)

ให้ลากเฉพาะโฟลเดอร์และไฟล์เหล่านี้:

- โฟลเดอร์ **src**
- โฟลเดอร์ **public** (แต่ไม่ต้องส่งโฟลเดอร์ย่อย uploads ถ้ามีรูปเยอะ)
- โฟลเดอร์ **prisma**
- ไฟล์ **package.json**
- ไฟล์ **package-lock.json** (ถ้ามี)
- ไฟล์ **tsconfig.json** (ถ้ามี)
- ไฟล์ **tailwind.config.ts** (ถ้ามี)
- ไฟล์ **postcss.config.js** หรือ **postcss.config.mjs** (ถ้ามี)
- ไฟล์ **next.config.js** (ถ้ามี)
- ไฟล์ **.gitignore**
- ไฟล์อื่นที่อยู่ระดับเดียวกับ **src** (เช่น .eslintrc, README ฯลฯ)

---

## ขั้นที่ 2 — อัปโหลดบน GitHub

1. เปิด **https://github.com/weeraphan091/Prime-Axis-Estate**
2. ถ้า repo ยังว่าง: กด **uploading an existing file** หรือ **Add file** → **Upload files**
3. เปิดโฟลเดอร์โปรเจกต์ใน File Explorer (ที่เก็บเว็บ)
4. **ลากโฟลเดอร์ `src`** ไปวางในกรอบบนเว็บ (Drag files here…)
5. ลากโฟลเดอร์ **public** (หรือเปิด public แล้วลากเฉพาะไฟล์ข้างใน เช่น logo.png, .gitkeep)
6. ลากโฟลเดอร์ **prisma**
7. ลากไฟล์ **package.json**, **.gitignore** และไฟล์ config อื่นๆ ที่ระดับเดียวกับ src
8. ด้านล่างกรอบ ใส่ข้อความ commit เช่น `Initial upload`
9. กด **Commit changes**

ถ้าขึ้นว่ามีไฟล์เกินขนาด หรืออัปโหลดไม่หมด ให้อัปโหลดหลายรอบ (เช่น รอบที่ 1: src, รอบที่ 2: public + prisma, รอบที่ 3: ไฟล์ config)

---

## ขั้นที่ 3 — Deploy บน Vercel

1. ไปที่ **https://vercel.com** → ล็อกอิน (ใช้ GitHub)
2. กด **Add New…** → **Project**
3. เลือก repo **weeraphan091/Prime-Axis-Estate**
4. กด **Import** แล้ว **Deploy**
5. ไปที่ **Settings** → **Environment Variables** ใส่ค่าเช่น  
   `ADMIN_PASSWORD`, `SESSION_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

หลังอัปโหลดครบและ Deploy แล้ว เว็บจะรันได้ (ถ้าใช้ SQLite บน Vercel ข้อมูลอาจไม่คงอยู่ถาวร ต้องใช้ DB ภายนอก เช่น Vercel Postgres / Supabase ภายหลัง)
