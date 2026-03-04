import Link from 'next/link'
import { Suspense } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { PropertyCard } from '@/components/PropertyCard'
import { properties as staticProperties } from '@/data/properties'
import { pattayaZones } from '@/config/zones'
import { LatestListings } from '@/components/LatestListings'
import { getPropertiesFromDb } from '@/lib/property-db'
import { FilePlus, Shield, Home, Zap, MapPin } from 'lucide-react'

// บังคับดึงข้อมูลใหม่ทุกครั้ง — แก้หลังบ้านแล้วหน้าแรกจะอัปเดต
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const dbList = await getPropertiesFromDb()
  const serverList = dbList.length > 0 ? dbList : staticProperties
  const featured = serverList.filter((p) => p.isFeatured).slice(0, 6)
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
              PRIME AXIS ESTATE
              <br />
              <span className="text-primary-200">ขาย-เช่า ค้นหาบ้านที่ใช่ ฝากขายฝากเช่ากับเรา</span>
            </h1>
            <p className="mt-6 text-lg text-primary-100 max-w-xl">
              ค้นหาคอนโด บ้าน วิลล่า ที่ดินในพัทยา หรือมีทรัพย์ต้องการฝากขาย-ฝากเช่า
              ติดต่อเรา เราดูแลให้ครบ
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/list-your-property"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition shadow-lg"
              >
                <FilePlus className="w-5 h-5" />
                ฝากขาย/เช่า
              </Link>
              <Link
                href="/listings"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-500/80 text-white rounded-xl font-semibold hover:bg-primary-500 transition border border-primary-400"
              >
                ดูรายการทั้งหมด
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <Suspense fallback={<div className="h-14 rounded-xl bg-stone-100 animate-pulse" />}>
          <SearchBar compact />
        </Suspense>
      </section>

      {/* โซนทำเล */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-display text-xl lg:text-2xl text-stone-900 mb-4">โซนทำเลยอดนิยม</h2>
        <div className="flex flex-wrap gap-2">
          {pattayaZones.map((z) => (
            <Link
              key={z.id}
              href={`/listings?location=${encodeURIComponent(z.slug)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 rounded-lg text-stone-700 text-sm font-medium hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition"
            >
              <MapPin className="w-4 h-4 text-stone-400" />
              {z.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FilePlus,
              title: 'ฝากขาย/ฝากเช่า',
              text: 'มีทรัพย์อยู่พัทยา? ส่งข้อมูลมา เราดูแลให้ ลงประกาศและหาลูกค้าให้',
            },
            {
              icon: Shield,
              title: 'เชื่อถือได้',
              text: 'เราคือนายหน้าพัทยา ดูแลทั้งผู้ซื้อ-ผู้เช่า และเจ้าของที่ต้องการฝาก',
            },
            {
              icon: Home,
              title: 'ครบทุกประเภท',
              text: 'คอนโด บ้าน วิลล่า ที่ดิน เชิงพาณิชย์ ในพัทยาและรอบๆ',
            },
            {
              icon: Zap,
              title: 'หาบ้านง่าย',
              text: 'ค้นหาและกรองได้รวดเร็ว สนใจรายการไหน โทรหาเราได้เลย',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition"
            >
              <item.icon className="w-10 h-10 text-primary-600 mb-3" />
              <h3 className="font-semibold text-stone-900">{item.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="bg-stone-50 border-t border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2 className="font-display text-2xl lg:text-3xl text-stone-900">
              รายการแนะนำ
            </h2>
            <Link
              href="/listings"
              className="text-primary-600 font-semibold hover:text-primary-700 hover:underline"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* ประกาศล่าสุด */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="font-display text-2xl lg:text-3xl text-stone-900">
            ประกาศล่าสุด
          </h2>
          <Link
            href="/listings"
            className="text-primary-600 font-semibold hover:text-primary-700 hover:underline"
          >
            ดูทั้งหมด →
          </Link>
        </div>
        <LatestListings serverList={serverList} />
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-primary-600 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h2 className="font-display text-2xl lg:text-3xl">
            มีทรัพย์อยู่ที่พัทยา? ฝากขาย-ฝากเช่ากับเรา
          </h2>
          <p className="mt-3 text-primary-100 max-w-xl mx-auto">
            ส่งข้อมูลและรูปมาได้เลย เราจะติดต่อกลับและช่วยลงประกาศ หาลูกค้าให้
          </p>
          <Link
            href="/list-your-property"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3.5 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition"
          >
            <FilePlus className="w-5 h-5" />
            ส่งข้อมูลฝากขาย/เช่า
          </Link>
        </div>
      </section>
    </div>
  )
}
