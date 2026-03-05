import type { Locale } from '@/config/i18n'

type Translations = Record<string, Record<string, string>>

const featureTranslations: Translations = {
  'วิวทะเล': { en: 'Sea View', zh: '海景', ru: 'Вид на море' },
  'วิวเมือง': { en: 'City View', zh: '城市景观', ru: 'Вид на город' },
  'วิวภูเขา': { en: 'Mountain View', zh: '山景', ru: 'Вид на горы' },
  'วิวสระ': { en: 'Pool View', zh: '泳池景观', ru: 'Вид на бассейн' },
  'สระว่ายน้ำ': { en: 'Swimming Pool', zh: '游泳池', ru: 'Бассейн' },
  'สระว่ายน้ำส่วนตัว': { en: 'Private Pool', zh: '私人泳池', ru: 'Частный бассейн' },
  'ฟิตเนส': { en: 'Fitness', zh: '健身房', ru: 'Фитнес' },
  'ฟิตเนสส่วนกลาง': { en: 'Communal Gym', zh: '公共健身房', ru: 'Общий фитнес-зал' },
  'ซาวน่า': { en: 'Sauna', zh: '桑拿', ru: 'Сауна' },
  'จากุซซี่': { en: 'Jacuzzi', zh: '按摩浴缸', ru: 'Джакузи' },
  'ที่จอดรถ': { en: 'Parking', zh: '停车位', ru: 'Парковка' },
  'ที่จอดรถส่วนตัว': { en: 'Private Parking', zh: '私人停车位', ru: 'Частная парковка' },
  'รปภ. 24 ชม.': { en: '24h Security', zh: '24小时安保', ru: 'Охрана 24ч' },
  'รปภ.24ชม.': { en: '24h Security', zh: '24小时安保', ru: 'Охрана 24ч' },
  'กล้องวงจรปิด': { en: 'CCTV', zh: '监控摄像', ru: 'Видеонаблюдение' },
  'คีย์การ์ด': { en: 'Key Card Access', zh: '门禁卡', ru: 'Карта доступа' },
  'ลิฟต์': { en: 'Elevator', zh: '电梯', ru: 'Лифт' },
  'เฟอร์นิเจอร์ครบ': { en: 'Fully Furnished', zh: '全装修', ru: 'С мебелью' },
  'เฟอร์นิเจอร์บางส่วน': { en: 'Partly Furnished', zh: '部分装修', ru: 'Частично меблирован' },
  'แอร์': { en: 'Air Conditioning', zh: '空调', ru: 'Кондиционер' },
  'เครื่องทำน้ำอุ่น': { en: 'Water Heater', zh: '热水器', ru: 'Водонагреватель' },
  'เครื่องซักผ้า': { en: 'Washing Machine', zh: '洗衣机', ru: 'Стиральная машина' },
  'ตู้เย็น': { en: 'Refrigerator', zh: '冰箱', ru: 'Холодильник' },
  'ทีวี': { en: 'TV', zh: '电视', ru: 'Телевизор' },
  'ไมโครเวฟ': { en: 'Microwave', zh: '微波炉', ru: 'Микроволновка' },
  'อินเทอร์เน็ต': { en: 'Internet', zh: '网络', ru: 'Интернет' },
  'WiFi': { en: 'WiFi', zh: 'WiFi', ru: 'WiFi' },
  'ระเบียง': { en: 'Balcony', zh: '阳台', ru: 'Балкон' },
  'สวนส่วนตัว': { en: 'Private Garden', zh: '私人花园', ru: 'Частный сад' },
  'สวน': { en: 'Garden', zh: '花园', ru: 'Сад' },
  'ใกล้ชายหาด': { en: 'Near Beach', zh: '近海滩', ru: 'Рядом с пляжем' },
  'ใกล้ทะเล': { en: 'Near the Sea', zh: '近海', ru: 'Рядом с морем' },
  'ใกล้ห้าง': { en: 'Near Shopping Mall', zh: '近商场', ru: 'Рядом с ТЦ' },
  'ใกล้โรงเรียน': { en: 'Near School', zh: '近学校', ru: 'Рядом со школой' },
  'ใกล้โรงพยาบาล': { en: 'Near Hospital', zh: '近医院', ru: 'Рядом с больницей' },
  'ใกล้รถไฟฟ้า': { en: 'Near BTS/MRT', zh: '近轻轨', ru: 'Рядом с метро' },
  'ห้องครัว': { en: 'Kitchen', zh: '厨房', ru: 'Кухня' },
  'ห้องครัวแยก': { en: 'Separate Kitchen', zh: '独立厨房', ru: 'Отдельная кухня' },
  'บาร์บีคิว': { en: 'BBQ Area', zh: '烧烤区', ru: 'Зона барбекю' },
  'สนามเด็กเล่น': { en: 'Playground', zh: '儿童游乐场', ru: 'Детская площадка' },
  'พื้นที่ส่วนกลาง': { en: 'Common Area', zh: '公共区域', ru: 'Общая зона' },
  'ห้องประชุม': { en: 'Meeting Room', zh: '会议室', ru: 'Конференц-зал' },
  'co-working space': { en: 'Co-working Space', zh: '共享办公空间', ru: 'Коворкинг' },
  'สัตว์เลี้ยงได้': { en: 'Pet Friendly', zh: '可养宠物', ru: 'Можно с животными' },
  'ชั้นสูง': { en: 'High Floor', zh: '高层', ru: 'Высокий этаж' },
  'ห้องมุม': { en: 'Corner Unit', zh: '转角单位', ru: 'Угловой номер' },
  'ตกแต่งใหม่': { en: 'Newly Renovated', zh: '新装修', ru: 'Новый ремонт' },
  'พร้อมอยู่': { en: 'Ready to Move In', zh: '即可入住', ru: 'Готово к заселению' },
  'โอนถูก': { en: 'Low Transfer Fee', zh: '低过户费', ru: 'Низкая комиссия' },
  'ราคาต่ำกว่าตลาด': { en: 'Below Market Price', zh: '低于市场价', ru: 'Ниже рыночной цены' },
  'ผ่อนได้': { en: 'Installment Available', zh: '可分期', ru: 'Рассрочка' },
  'อ่างอาบน้ำ': { en: 'Bathtub', zh: '浴缸', ru: 'Ванна' },
  'ครัวไทย': { en: 'Thai Kitchen', zh: '泰式厨房', ru: 'Тайская кухня' },
  'เตาไฟฟ้า': { en: 'Electric Stove', zh: '电炉', ru: 'Электроплита' },
}

export function translateFeature(feature: string, locale: Locale): string {
  if (locale === 'th') return feature
  const trimmed = feature.trim()
  const match = featureTranslations[trimmed]
  if (match && match[locale]) return match[locale]
  const lower = trimmed.toLowerCase()
  for (const [key, translations] of Object.entries(featureTranslations)) {
    if (key.toLowerCase() === lower && translations[locale]) return translations[locale]
  }
  return feature
}

export function translateFeatures(features: string[], locale: Locale): string[] {
  if (locale === 'th') return features
  return features.map((f) => translateFeature(f, locale))
}
