# ตั้งค่า Vercel ให้ปุ่ม「สนใจทรัพย์」ส่งเข้า Telegram ได้

หลัง Deploy แล้วกดสนใจทรัพย์ไม่ส่งเข้า Bot เพราะ **บน Vercel ยังไม่มีค่า Token กับ Chat ID**

---

## ทำแบบนี้

### 1. เปิดตั้งค่า Environment Variables

1. ไปที่ **https://vercel.com** → ล็อกอิน
2. เลือกโปรเจกต์ **Prime-Axis-Estate** (หรือชื่อที่ deploy ไว้)
3. ไปที่ **Settings** (แท็บด้านบน)
4. ซ้ายมือเลือก **Environment Variables**

### 2. เพิ่ม 2 ตัวนี้

กด **Add New** แล้วเพิ่มทีละตัว:

| Name | Value |
|------|--------|
| **TELEGRAM_BOT_TOKEN** | ค่า Token ของบอท (จาก @BotFather) เช่น `8780635737:AAE...` |
| **TELEGRAM_CHAT_ID** | เลข Chat ID ของคุณ เช่น `6955097888` |

- **Environment**: เลือกทั้ง **Production**, **Preview**, **Development** (หรืออย่างน้อย Production)
- กด **Save**

(ค่า 2 ตัวนี้อยู่ที่ไฟล์ **.env** ในเครื่องคุณ — เปิดดูแล้ว copy ไปวางใน Vercel ได้เลย)

### 3. ให้ Vercel ใช้ค่าที่เพิ่มใหม่

หลังเพิ่มตัวแปรแล้วต้อง ** Redeploy ** หนึ่งครั้ง:

- ไปที่แท็บ **Deployments**
- ที่ deployment ล่าสุด กดปุ่ม **⋯** (สามจุด) → **Redeploy**
- หรือไปที่ **Settings** → **Environment Variables** แล้วกด **Redeploy** ตามที่ Vercel แนะนำ

รอ build เสร็จแล้วลองกด「สนใจทรัพย์」บนเว็บที่ deploy อีกครั้ง — ข้อความควรเข้า Telegram บอทได้

---

## สรุป

- **สาเหตุ:** บน Vercel ไม่มี `TELEGRAM_BOT_TOKEN` กับ `TELEGRAM_CHAT_ID` (ไฟล์ .env ไม่ขึ้นไปกับโค้ด)
- **แก้:** ไปที่ Vercel → โปรเจกต์ → **Settings** → **Environment Variables** → เพิ่ม 2 ตัวด้านบน (ใช้ค่าเดียวกับใน .env) → **Redeploy**
