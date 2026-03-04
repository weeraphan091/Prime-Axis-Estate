import Link from 'next/link'
import { FilePlus, Phone } from 'lucide-react'
import { getT } from '@/messages'

export default async function HowToListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = getT(locale as 'th' | 'en' | 'zh' | 'ru')
  const base = `/${locale}`

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl text-stone-900">{locale === 'th' ? 'วิธีการฝากขาย-ฝากเช่า' : 'How to list your property'}</h1>
      <p className="mt-2 text-stone-600">{t('home.listText')}</p>
      <div className="mt-8 space-y-6">
        <div className="flex gap-4 p-6 bg-white rounded-xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="font-bold text-primary-700">1</span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">{locale === 'th' ? 'กรอกฟอร์มออนไลน์' : 'Fill the form'}</h2>
            <p className="mt-1 text-stone-600 text-sm">{locale === 'th' ? 'เข้าไปที่หน้า ฝากขาย/เช่า กรอกประเภท หัวข้อ รายละเอียด ราคา ที่ตั้ง รูปภาพ' : 'Go to List Property and fill type, title, details, price, location, photos.'}</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 bg-white rounded-xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="font-bold text-primary-700">2</span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">{locale === 'th' ? 'ส่งข้อมูลติดต่อ' : 'Contact details'}</h2>
            <p className="mt-1 text-stone-600 text-sm">{locale === 'th' ? 'ใส่ชื่อ เบอร์โทร อีเมล เพื่อให้เราติดต่อกลับ' : 'Add name, phone, email so we can get back to you.'}</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 bg-white rounded-xl border border-stone-200">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="font-bold text-primary-700">3</span>
          </div>
          <div>
            <h2 className="font-semibold text-stone-900">{locale === 'th' ? 'เราติดต่อกลับและลงประกาศ' : 'We reply and list'}</h2>
            <p className="mt-1 text-stone-600 text-sm">{locale === 'th' ? 'เราจะติดต่อกลับและช่วยลงประกาศ หาลูกค้าให้' : 'We will contact you and list your property.'}</p>
          </div>
        </div>
      </div>
      <Link href={`${base}/list-your-property`} className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700">
        <FilePlus className="w-5 h-5" />
        {t('nav.listProperty')}
      </Link>
      <p className="mt-4">
        <Link href={`${base}/contact`} className="inline-flex items-center gap-2 text-primary-600 hover:underline">
          <Phone className="w-4 h-4" />
          {t('nav.contact')}
        </Link>
      </p>
    </div>
  )
}
