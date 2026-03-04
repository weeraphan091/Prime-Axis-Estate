import Link from 'next/link'
import { FilePlus, Phone } from 'lucide-react'

export default function HowToListPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900">วิธีการฝากขาย-ฝากเช่า</h1>
      <p className="mt-2 text-stone-600">
        มีทรัพย์อยู่พัทยาที่ต้องการขายหรือให้เช่า? ส่งข้อมูลมาได้เลย เราดูแลให้
      </p>
      <div className="mt-8 space-y-6">
        <div className="flex gap-4 p-6 bg-white rounded-xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="font-bold text-primary-700">1</span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">กรอกฟอร์มออนไลน์</h2>
            <p className="mt-1 text-stone-600 text-sm">
              เข้าไปที่หน้า &quot;ฝากขาย/เช่า&quot; กรอกประเภทอสังหา หัวข้อ รายละเอียด ราคา ที่ตั้ง
              ขนาดพื้นที่ รูปภาพ (ได้ถึง 10 รูป) และลิงก์ Google Map ถ้ามี
            </p>
          </div>
        </div>
        <div className="flex gap-4 p-6 bg-white rounded-xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="font-bold text-primary-700">2</span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">ส่งข้อมูลติดต่อ</h2>
            <p className="mt-1 text-stone-600 text-sm">
              ใส่ชื่อ เบอร์โทร และอีเมล เพื่อให้เราติดต่อกลับได้
            </p>
          </div>
        </div>
        <div className="flex gap-4 p-6 bg-white rounded-xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="font-bold text-primary-700">3</span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">เราติดต่อกลับและลงประกาศ</h2>
            <p className="mt-1 text-stone-600 text-sm">
              ภายใน 24 ชั่วโมง เราจะโทรหรือไลน์กลับเพื่อคุยรายละเอียด และช่วยลงประกาศ
              หาลูกค้าให้ท่าน
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/list-your-property"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
        >
          <FilePlus className="w-5 h-5" />
          ฝากขาย/เช่าตอนนี้
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 border border-stone-300 rounded-xl font-medium text-stone-700 hover:bg-stone-50"
        >
          <Phone className="w-5 h-5" />
          ติดต่อเรา
        </Link>
      </div>
      <Link href="/" className="inline-block mt-8 text-stone-500 hover:text-stone-700 text-sm">
        ← กลับหน้าแรก
      </Link>
    </div>
  )
}
