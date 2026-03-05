import type { Metadata } from 'next'
import ListYourPropertyPage from '@/app/list-your-property/page'
import { buildAlternates } from '@/lib/seo'
import { isValidLocale } from '@/config/i18n'

type Props = { params: Promise<{ locale: string }> }

const titles: Record<string, string> = {
  th: 'ฝากขาย-ฝากเช่าทรัพย์ในพัทยา',
  en: 'List Your Property in Pattaya',
  zh: '在芭堤雅挂牌您的房产',
  ru: 'Разместите недвижимость в Паттайе',
}
const descs: Record<string, string> = {
  th: 'กรอกฟอร์มฝากขาย-ฝากเช่าคอนโด บ้าน วิลล่า ที่ดินในพัทยา เราจะติดต่อกลับและช่วยหาลูกค้าให้',
  en: 'Fill the form to list your condo, house, villa, land in Pattaya for sale or rent. We handle everything.',
  zh: '填写表格挂牌您在芭堤雅的公寓、别墅、土地。我们负责寻找买家和租客。',
  ru: 'Заполните форму для размещения кондо, дома, виллы, участка в Паттайе. Мы найдём покупателей.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  return {
    title: titles[locale] ?? titles.th,
    description: descs[locale] ?? descs.th,
    alternates: buildAlternates(locale, '/list-your-property'),
  }
}

export default function LocaleListYourPropertyPage() {
  return <ListYourPropertyPage />
}
