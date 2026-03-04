import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900">ข้อตกลงและเงื่อนไข</h1>
      <p className="mt-2 text-stone-500 text-sm">อัปเดตล่าสุด: มีนาคม 2568</p>
      <div className="mt-8 prose prose-stone max-w-none text-stone-600 space-y-4">
        <p>
          การใช้งานเว็บไซต์ PRIME AXIS ESTATE หมายความว่าท่านยอมรับข้อตกลงและเงื่อนไขการให้บริการนี้
        </p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">1. การให้บริการ</h2>
        <p>
          เราให้บริการเป็นตัวกลางในการนำเสนอข้อมูลอสังหาริมทรัพย์ในพื้นที่พัทยาและจังหวัดชลบุรี
          ทั้งรายการขายและเช่า การลงประกาศฝากขาย-ฝากเช่า และการติดต่อระหว่างผู้สนใจกับนายหน้า
        </p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">2. ข้อมูลบนเว็บ</h2>
        <p>
          ข้อมูลรายการทรัพย์ที่แสดงเป็นความรับผิดชอบของผู้ลงประกาศ เราไม่รับรองความถูกต้องครบถ้วน
          แนะนำให้ตรวจสอบและเยี่ยมชมสถานที่ก่อนตัดสินใจ
        </p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">3. การติดต่อและธุรกรรม</h2>
        <p>
          การเจรจา การโอนกรรมสิทธิ์ หรือการทำสัญญาเช่า เป็นเรื่องระหว่างผู้ซื้อ/ผู้เช่ากับเจ้าของหรือนายหน้า
          เราไม่เป็นคู่สัญญาในธุรกรรมดังกล่าว
        </p>
      </div>
      <Link href="/" className="inline-block mt-8 text-primary-600 hover:underline">
        ← กลับหน้าแรก
      </Link>
    </div>
  )
}
