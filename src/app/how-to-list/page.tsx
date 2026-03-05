import Link from 'next/link'
import { FilePlus, Phone, BadgePercent, Home as HomeIcon, CheckCircle } from 'lucide-react'

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
      <section className="mt-12 bg-gradient-to-br from-stone-50 to-primary-50 rounded-2xl border border-stone-200 p-6 lg:p-8">
        <h2 className="font-display text-xl text-stone-900 flex items-center gap-2 mb-2">
          <BadgePercent className="w-6 h-6 text-primary-600" />
          อัตราค่าบริการ
        </h2>
        <p className="text-sm text-stone-600 mb-6">ค่าบริการเก็บเฉพาะเมื่อปิดการขาย/เช่าสำเร็จเท่านั้น ไม่มีค่าใช้จ่ายล่วงหน้า</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <HomeIcon className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-stone-900">ฝากเช่า</h3>
            </div>
            <p className="text-lg font-bold text-primary-700 mb-1">สัญญา 1 ปี คิดค่าคอมมิชชัน 1 เดือนจากค่าเช่า</p>
            <p className="text-xs text-stone-500">สัญญาสั้นกว่า 1 ปีอาจปรับตามตกลง</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <BadgePercent className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-stone-900">ฝากขาย (เขตพัทยา)</h3>
            </div>
            <p className="text-lg font-bold text-primary-700 mb-1">ค่าคอมมิชชัน 5% จากราคาขาย</p>
            <p className="text-xs text-stone-500">นอกเขตพัทยาสอบถามรายละเอียดเพิ่มเติม</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5">
          <CheckCircle className="w-4 h-4 shrink-0" />
          ไม่เก็บค่าใช้จ่ายล่วงหน้า — จ่ายเมื่อปิดดีลสำเร็จ
        </div>
        <p className="mt-3 text-xs text-stone-400">อัตราค่าบริการอาจปรับเปลี่ยนตามเงื่อนไขทรัพย์ กรุณาสอบถามรายละเอียดเพิ่มเติม</p>
      </section>

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
