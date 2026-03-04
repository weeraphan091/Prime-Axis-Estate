import Link from 'next/link'
import Image from 'next/image'
import { AgentContact } from '@/components/AgentContact'
import { NewsletterForm } from '@/components/NewsletterForm'

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="PRIME AXIS ESTATE" width={36} height={36} className="object-contain" />
              <h3 className="font-display text-lg text-white">PRIME AXIS ESTATE</h3>
            </Link>
            <p className="text-sm leading-relaxed">
              บริการนายหน้าอสังหา ค้นหาบ้าน-คอนโดที่ต้องการ หรือฝากขาย-ฝากเช่าทรัพย์กับเรา
              ติดต่อเราได้ตลอด
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">ลิงก์ด่วน</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/listings" className="hover:text-white transition">
                  ค้นหาทรัพย์
                </Link>
              </li>
              <li>
                <Link href="/list-your-property" className="hover:text-white transition">
                  ฝากขาย/เช่า
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  ติดต่อเรา
                </Link>
              </li>
              <li>
                <Link href="/how-to-list" className="hover:text-white transition">
                  วิธีการฝากขาย-เช่า
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  ข้อตกลงและเงื่อนไข
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
            </ul>
          </div>
          <AgentContact variant="footer" />
          <NewsletterForm />
        </div>
        <div className="mt-10 pt-8 border-t border-stone-700 text-center text-sm">
          © {new Date().getFullYear()} PRIME AXIS ESTATE. สงวนลิขสิทธิ์.
        </div>
      </div>
    </footer>
  )
}
