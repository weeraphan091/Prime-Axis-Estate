import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900">นโยบายความเป็นส่วนตัว</h1>
      <p className="mt-2 text-stone-500 text-sm">อัปเดตล่าสุด: มีนาคม 2568</p>
      <div className="mt-8 prose prose-stone max-w-none text-stone-600 space-y-4">
        <p>
          PRIME AXIS ESTATE ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้บริการ
          นโยบายนี้อธิบายการเก็บและใช้ข้อมูลของเรา
        </p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">ข้อมูลที่เรารวบรวม</h2>
        <p>
          เราเก็บข้อมูลที่ท่านให้เมื่อติดต่อเรา ลงประกาศฝากขาย/เช่า หรือสมัครรับข่าวสาร
          เช่น ชื่อ เบอร์โทร อีเมล และข้อมูลรายการทรัพย์
        </p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">การใช้งานข้อมูล</h2>
        <p>
          เราใช้ข้อมูลเพื่อให้บริการ ตอบคำถาม หาลูกค้าให้รายการที่ฝากกับเรา
          และส่งข่าวสารโปรโมชั่นหรือรายการใหม่ (หากท่านสมัครรับ)
        </p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">การเปิดเผยข้อมูล</h2>
        <p>
          เราไม่ขายข้อมูลส่วนบุคคล ให้กับบุคคลที่สามเฉพาะเมื่อจำเป็นสำหรับการให้บริการ
          หรือตามกฎหมาย
        </p>
      </div>
      <Link href="/" className="inline-block mt-8 text-primary-600 hover:underline">
        ← กลับหน้าแรก
      </Link>
    </div>
  )
}
