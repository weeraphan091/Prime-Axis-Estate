# Performance Report

Generated: 2026-03-20  
**Updated:** โค้ดในโปรเจกต์ได้รับการแก้ตามรายงานนี้แล้ว (ดู implementation ใน repo ล่าสุด)

Scope: Next.js (App Router) code under `src/app`, `src/components`, `src/context`, `src/lib`, and `src/app/api`.

## 🔴 Critical (กระทบ TTFB โดยตรง)

### 1) `RootLayout` ใช้ `cookies()` ทำให้ทุกหน้าเป็น dynamic (ตัดการ cache/SSG)
- Evidence:
  - `src/app/layout.tsx` เรียก `cookies()` เพื่ออ่าน `NEXT_LOCALE` แล้วตั้ง `<html lang=...>`
- Why it’s critical:
  - การใช้ `cookies()` ใน `layout` (ซึ่งเป็น shared across all routes) ทำให้ผลลัพธ์ของ layout เป็น dynamic และลดโอกาสในการ cache/Static Optimization ของทั้งแอป
- วิธีแก้แนะนำ:
  - เอา `cookies()` ออกจาก `src/app/layout.tsx`
  - ตั้ง `lang` เป็นค่า default แบบ static (เช่น `th`) และให้ client component ขนาดเล็กไปอัปเดต `document.documentElement.lang` จาก `window.location.pathname` (อ่าน segment แรก) หลัง hydrate
  - ยังใช้ `src/app/[locale]/layout.tsx` สำหรับการเรนเดอร์เนื้อหา/โลแคลง่าย ๆ ตาม params อยู่แล้ว

### 2) หน้าค้นหา/ลิสต์ดึง “ข้อมูลทั้งหมด” จาก DB โดยไม่มี pagination + client ทำ filter ทั้งก้อน
- Evidence:
  - `src/lib/property-db.ts`:
    - `getPropertiesFromDb()` เรียก `prisma.property.findMany()` โดยไม่มี `take/skip` และไม่มี `select` เฉพาะฟิลด์
  - `src/app/[locale]/listings/page.tsx` และ `src/app/listings/page.tsx`:
    - เรียก `getPropertiesFromDb(...)` แล้วส่ง `serverProperties` เข้า `src/components/ListingsResults.tsx`
  - `src/components/ListingsResults.tsx`:
    - ใช้ `useSearchParams()` แล้ว filter ในฝั่ง client จาก array ทั้งก้อนที่โหลดมาจาก server
- Why it’s critical:
  - ส่งผลโดยตรงต่อเวลา response ของหน้า (TTFB/Time-to-Render) เพราะต้อง query/serialize/แปลง property หลายร้อย/หลายพันแถวก่อนส่ง HTML ไปที่ client
  - ยิ่งในข้อ 1 ที่ `RootLayout` dynamic อยู่ จะยิ่งลดโอกาสที่ Next จะ cache output ของ page
- วิธีแก้แนะนำ:
  - ทำ server-side filtering/pagination:
    - ให้หน้า `listings` อ่าน query params (เช่น `type/property/location/minPrice/maxPrice`) แล้ว query DB เฉพาะที่ตรงเงื่อนไข
    - ใส่ `take` + `orderBy` + (ถ้าใช้ pagination แบบ cursor) `skip/take` หรือ cursor-based pagination
  - ทำ `select` เฉพาะฟิลด์ที่ `PropertyCard` ใช้จริง:
    - ลดการดึง `description/features` และ fields ที่ไม่จำเป็นสำหรับการ์ด
  - พิจารณา virtualization/lazy render ถ้าจำนวนการ์ดเยอะ (เช่น windowing) เพื่อช่วย CPU ใน client

### 3) `api/properties/route.ts` ดึงทุก property โดยไม่มี pagination (ส่งผลกับหน้า Favorites ที่เรียก API)
- Evidence:
  - `src/app/api/properties/route.ts` ใช้ `prisma.property.findMany({ where: { status:'published' }, orderBy:{...} })` โดยไม่มี `take/skip` และไม่มี `select`
  - `src/app/favorites/page.tsx` และ `src/app/[locale]/favorites/page.tsx` เรียก `/api/properties` เพื่อโหลดทั้งชุดก่อนกรอง
- Why it’s critical:
  - endpoint นี้ถูกเรียกจาก client เพื่อโหลดรายการทั้งก้อน ส่งผลต่อ latency และ bandwidth ทันที
- วิธีแก้แนะนำ:
  - เพิ่ม pagination/filter ใน API (`take`, `cursor`, หรืออย่างน้อย `limit`/`skip`)
  - หรือเปลี่ยน flow Favorites ให้เรียกเฉพาะรายการที่อยู่ใน favoriteIds (เช่นส่ง array id ไปแล้วใช้ `where: { id: { in: [...] } }`)
  - ใช้ `select` เฉพาะฟิลด์ที่ใช้ในการ์ด (เหมือนข้อ 2)

## 🟠 High (กระทบ load time ชัดเจน)

### 4) Contact ข้อมูลติดต่อโหลดทุกหน้าแบบปิด cache (`cache: 'no-store'`) และ API บังคับ `force-dynamic + revalidate=0`
- Evidence:
  - `src/context/ContactContext.tsx`:
    - `fetch('/api/settings/contact', { cache: 'no-store' })`
    - เรียกซ้ำเมื่อแท็บกลับมา `visibilitychange`
  - `src/app/api/settings/contact/route.ts`:
    - `export const dynamic = 'force-dynamic'`
    - `export const revalidate = 0`
- Why it’s high:
  - `ContactProvider` ถูก mount ใน `src/app/layout.tsx` (ทุกหน้า) ทำให้เกิด network request ซ้ำ ๆ ทุกครั้งที่ผู้ใช้เข้า/รีเฟรชหน้า
  - combined กับ server route ที่ไม่มี caching ทำให้เพิ่ม TTFB/latency ของ API call
- วิธีแก้แนะนำ:
  - ฝั่ง client: เอา `cache: 'no-store'` ออก หรือเปลี่ยนเป็นการใช้ cache ตามปกติ/TTL
  - ฝั่ง server: ปรับ route:
    - ลบ `force-dynamic`
    - ตั้ง `export const revalidate = 300` (หรือ 600/3600 ตามความถี่การเปลี่ยนแปลง)
    - ใช้ `select` เฉพาะฟิลด์ที่ส่งกลับ
  - ทำ lazy fetch เฉพาะเมื่อ UI ที่ต้องใช้ contact ถูก render (เช่นเฉพาะหน้า Contact/Interest/Agent card)

### 5) มี fetch หลายตัวทำงานพร้อมกันตอน mount (auth + contact + exchange rates)
- Evidence:
  - `src/context/AuthContext.tsx`: `useEffect(() => refresh(), ...)` เรียก `/api/auth/me` ทุกหน้า
  - `src/context/ContactContext.tsx`: `useEffect(fetchContact, ...)` เรียก `/api/settings/contact` ทุกหน้า
  - `src/context/LocaleContext.tsx`: `useEffect(fetch('/api/exchange-rates'), ...)` ทุกหน้าใน locale segment
- Why it’s high:
  - ทำให้เกิด waterfall/parallel network หลาย request ก่อนที่ UI จะนิ่ง โดยเฉพาะมือถือ/เครือข่ายช้า
- วิธีแก้แนะนำ:
  - Auth: ย้าย `AuthProvider`/การเรียก `/api/auth/me` ไปเฉพาะส่วนที่ต้องใช้จริง (เช่น `admin` และหน้า `my-listings`)
  - Exchange rates: เก็บใน memory/localStorage พร้อม TTL (เช่น 1 วัน) เพื่อไม่ยิงซ้ำเมื่อเปลี่ยนหน้า
  - Contact: เช่นเดียวกับข้อ 4 ทำ caching/lazy fetch

### 6) API export/utility ดึงทั้งตารางโดยไม่จำกัดจำนวน (เสี่ยงช้า/กินทรัพยากร)
- Evidence:
  - `src/app/api/export/listings/route.ts`:
    - `prisma.property.findMany(...)` ไม่มี `take/skip`
  - `src/app/api/export/leads/route.ts`:
    - `prisma.lead.findMany(...)` ไม่มี `take/skip`
- Why it’s high:
  - ถ้าจำนวนข้อมูลมาก จะช้า/ใช้เวลา serialize นาน (แม้จะเป็น admin แต่กระทบ UX หลัง trigger)
- วิธีแก้แนะนำ:
  - เพิ่ม pagination หรือ job-based export (เช่นสร้างไฟล์ async แล้วค่อยดาวน์โหลด)
  - ถ้า export เพื่อ CSV ต้องใช้เป็นชุด (batch) เช่น fetch 1,000 แถวต่อรอบ
  - ใช้ `select` เฉพาะ fields ที่ export (ลดขนาดข้อมูลที่ Prisma ส่งกลับ)

### 7) Remote images ส่วนใหญ่ไม่ใช้ `next/image` (optimize ไม่เต็มที่)
- Evidence:
  - `src/components/PropertyCard.tsx`:
    - logic เลือก `<img>` เมื่อ `currentSrc` เป็น `http` (ยกเว้นบางกรณี placeholder) ทำให้ไม่ใช้ next/image สำหรับ remote ทั่วไป
  - `src/app/[locale]/listings/[id]/PropertyImageCarousel.tsx`:
    - ใช้ `<img>` เมื่อเป็น `data:` หรือ `http` ที่ไม่ใช่ placehold
- Why it’s high:
  - ทำให้สูญเสียการ optimize/batching/การปรับขนาดของ Next Image (โดยเฉพาะจำนวนรูปเยอะ)
- วิธีแก้แนะนำ:
  - ใช้ `next/image` สำหรับ remote URL ที่อยู่ใน allow list (`next.config.js` มี remotePatterns สำหรับ `*.supabase.co`)
  - คง `<img>` เฉพาะกรณี `data:` (และกรณีที่โดเมนไม่รองรับ)

## 🟡 Medium (ควรแก้แต่ไม่เร่งด่วน)

### 8) `sitemap.ts` ดึง property ทั้งหมด (เสี่ยงช้าหากข้อมูลโตมาก)
- Evidence:
  - `src/app/sitemap.ts` เรียก `getPropertiesFromDb(true)` ซึ่งดึงทุก published properties โดยไม่มี limit
- วิธีแก้แนะนำ:
  - จำกัดจำนวน/ทำ incremental sitemap (เช่น sitemap แยกตาม range หรือใช้ pagination)
  - หรือ cache ผล sitemap (เช่นเก็บ JSON/ไฟล์) แล้วค่อย regenerate ตามรอบเวลา

### 9) `api/blog/seed/route.ts` ทำ loop ยิง DB หลายรอบต่อ post (รูปแบบ N queries)
- Evidence:
  - `src/app/api/blog/seed/route.ts`:
    - `for (const post of blogPosts)` แล้วเรียก `prisma.blogPost.findUnique(...)` + `create/update` ทีละโพสต์
- Why it’s medium:
  - เป็น seed/admin endpoint (ไม่กระทบ TTFB ผู้ใช้งานโดยตรง) แต่ถ้า dataset โต จะช้า
- วิธีแก้แนะนำ:
  - ใช้ batch strategy:
    - อ่านรายการที่มีอยู่ครั้งเดียว แล้วค่อย diff/insert/update
    - หรือใช้ transaction + batch insert/update

### 10) Translation ใช้ external fetch แบบไม่ cache (`cache: 'no-store'`)
- Evidence:
  - `src/lib/translate.ts`:
    - `fetch(url, { cache: 'no-store' })` กับ MyMemory API
- Why it’s medium:
  - เกิดตอน admin สร้าง/อัปเดตทรัพย์หรือบล็อกเป็นหลัก
- วิธีแก้แนะนำ:
  - เพิ่ม caching ระดับแอป (เช่น Map in-memory ระหว่างรัน หรือ cache ลง DB ตาราง translation โดยใช้ key จาก hash ของ text+langpair)
  - ลดจำนวนการเรียกซ้ำ (เช่น reuse translation ที่เคยได้)

### 11) Modal/form (เช่น `InterestForm`) ถูก bundle ตั้งแต่แรก แม้จะ render เฉพาะตอนเปิด
- Evidence:
  - `src/app/[locale]/listings/[id]/InterestButton.tsx` import `InterestForm` แล้ว render เฉพาะเมื่อ `show === true` แต่ยังเป็น static import (ไม่ได้ lazy load code-splitting)
- วิธีแก้แนะนำ:
  - ใช้ `next/dynamic` เพื่อ import `InterestForm` แบบ lazy เฉพาะตอนที่ผู้ใช้กดเปิด (ลดขนาด JS ที่โหลดตอนเข้าหน้า detail)

## ✅ OK (ไม่มีปัญหาหนักที่พบจากการสแกน)

### 12) `api/blog/route.ts` มี `select` และตั้ง cache header
- Evidence:
  - `src/app/api/blog/route.ts` ใช้ `prisma.blogPost.findMany({ select: {...} })` และตั้ง `Cache-Control` สำหรับ GET

### 13) View counter ใช้ cookie throttling เพื่อลดการชน server
- Evidence:
  - `src/app/api/properties/[id]/view/route.ts`:
    - ใช้ cookie prefix `pv_{id}` + maxAge ~24 ชม.

### 14) Locale segment layout ใช้ `params` (หลีกเลี่ยง cookies ใน layout ย่อย)
- Evidence:
  - `src/app/[locale]/layout.tsx` ใช้ `params.locale` และ `generateStaticParams()`

### 15) API ที่เป็นข้อมูลเฉพาะผู้ใช้/หลังบ้าน “ไม่ควร cache” อยู่แล้ว
- Evidence (ตัวอย่าง):
  - `src/app/api/auth/me/route.ts` (ผู้ใช้เฉพาะคน)
  - `src/app/api/leads/route.ts`, `src/app/api/agents/route.ts`, `src/app/api/my-listings/route.ts` (มี `hasAdminSession()`/session)
- Notes:
  - การไม่มี `Cache-Control`/การไม่ตั้ง `revalidate` มักเหมาะสมเพราะข้อมูลเปลี่ยนตาม session และควรไม่ถูก cache ข้ามผู้ใช้

