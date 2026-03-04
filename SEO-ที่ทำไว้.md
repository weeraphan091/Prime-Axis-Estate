# โครงสร้าง SEO ที่ทำไว้

## 1. Meta & Open Graph (ติดหน้าแรกและแชร์โซเชียลได้ง่าย)

- **Root layout**  
  - `title` (default + template สำหรับหน้าอื่น)  
  - `description`, `keywords`, `metadataBase`  
  - **Open Graph**: title, description, url, locale (th_TH), siteName  
  - **Twitter Card**: summary_large_image  
  - **robots**: index, follow (ให้ Google อินเด็กซ์ได้)  
  - **canonical** หลักของเว็บ  

- **หน้าแรก**  
  - metadata เฉพาะหน้า + **canonical** ชี้ไปที่ URL หลัก  

- **หน้ารายการ (/listings)**  
  - title, description, canonical, Open Graph  

- **หน้ารายละเอียดทรัพย์ (/listings/[id])**  
  - **generateMetadata**: title ประกอบด้วยชื่อรายการ + ขาย/เช่า + ราคา  
  - description จากเนื้อหารายการ  
  - canonical ชี้ไปที่ URL ของหน้านั้น  
  - Open Graph + Twitter + รูปแรกของรายการ (ถ้ามี) เป็น og:image  

---

## 2. Sitemap & Robots (ให้ Google มาเก็บลิงก์ได้แน่นอน)

- **`/sitemap.xml`** (สร้างจาก `src/app/sitemap.ts`)  
  - หน้าแรก (priority 1, changeFrequency daily)  
  - /listings (priority 0.9)  
  - /list-your-property, /contact, /how-to-list  
  - ทุกรายการที่ **published** ใน DB → `/listings/[id]` (priority 0.8, weekly)  

- **`/robots.txt`** (สร้างจาก `src/app/robots.ts`)  
  - อนุญาตให้ครอว์ลทุก path ยกเว้น `/admin`, `/api`, `/login`, `/register`  
  - ชี้ไปที่ `Sitemap: [URL]/sitemap.xml`  
  - กำหนด `Host:` เป็น URL หลักของเว็บ  

→ หน้าแรกและหน้ารายการทั้งหมดอยู่ใน sitemap และไม่ถูกบล็อกใน robots จึงติดและเก็บลิงก์ได้ง่าย  

---

## 3. JSON-LD (ข้อมูลมีโครงสร้างสำหรับ Google)

- **ทั้งไซต์**  
  - **RealEstateAgent** (Organization): ชื่อ, คำอธิบาย, URL, พื้นที่ให้บริการ (พัทยา), SearchAction  

- **หน้ารายละเอียดทรัพย์**  
  - **RealEstateListing**: ชื่อ, คำอธิบาย, url, รูป, ประเภท (ขาย/เช่า), ราคา, ที่อยู่, จำนวนห้อง, พื้นที่  

ช่วยให้ Google แสดง rich result / knowledge panel ได้ดีขึ้น  

---

## 4. โครงสร้าง HTML / Semantic

- **`<html lang="th">`** — ระบุภาษาหน้าเว็บ  
- **หน้าแรก**: มี **h1** เดียว (PRIME AXIS ESTATE + คำขาย)  
- **หน้ารายการ**: **h1** = "ค้นหาทรัพย์"  
- **หน้ารายละเอียด**: ชื่อรายการและข้อมูลอยู่ในโครงที่เหมาะสมกับหัวข้อ  

---

## 5. สิ่งที่คุณควรตั้งค่า

1. **โดเมนจริง**  
   ใน Vercel (หรือโฮสต์ที่ใช้) ตั้งค่า Environment Variable:
   - **ชื่อ:** `NEXT_PUBLIC_SITE_URL`  
   - **ค่า:** URL หลักของเว็บ เช่น `https://primeaxisestate.com` หรือ `https://your-project.vercel.app`  

   ถ้าไม่ใส่ ระบบจะใช้ `VERCEL_URL` (บน Vercel) หรือ fallback ตามที่ตั้งใน `src/config/site.ts`  

2. **Google Search Console**  
   - เพิ่ม property ของเว็บ  
   - ส่ง sitemap: `https://โดเมนคุณ/sitemap.xml`  

3. **(ถ้าต้องการ) ยืนยันความเป็นเจ้าของ**  
   ใน `src/app/layout.tsx` มี `metadata.verification` แล้ว  
   ถ้าได้รหัสจาก Google / Yandex ฯลฯ สามารถเพิ่มในนั้นได้  

---

สรุป: โครงสร้างทุกอย่างจัดไว้ให้ทำ SEO ได้ระดับมืออาชีพ และติดหน้าแรก/หน้ารายการได้ง่าย โดยเฉพาะเมื่อตั้ง `NEXT_PUBLIC_SITE_URL` และส่ง sitemap ใน Search Console แล้ว
