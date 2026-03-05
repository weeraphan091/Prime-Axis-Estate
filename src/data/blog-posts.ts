const now = '2025-12-01'

export const blogPosts = [
  // ===== 1. คู่มือซื้อคอนโดพัทยาสำหรับชาวต่างชาติ =====
  {
    slug: 'foreigners-guide-buying-condo-pattaya',
    title: 'คู่มือซื้อคอนโดพัทยาสำหรับชาวต่างชาติ',
    titleEn: 'Foreigner\'s Guide to Buying a Condo in Pattaya',
    titleZh: '外国人芭堤雅购买公寓完整指南',
    titleRu: 'Гид для иностранцев: покупка квартиры в Паттайе',
    excerpt: 'ทุกสิ่งที่ต่างชาติต้องรู้ก่อนซื้อคอนโดในพัทยา ตั้งแต่กฎหมาย สัดส่วนกรรมสิทธิ์ ขั้นตอนโอน จนถึงค่าใช้จ่าย',
    excerptEn: 'Everything foreigners need to know before buying a condo in Pattaya — from ownership laws to transfer fees.',
    excerptZh: '外国人在芭堤雅买公寓前需要了解的所有信息 — 从法律到过户费用。',
    excerptRu: 'Всё, что иностранцу нужно знать перед покупкой квартиры в Паттайе — от законов до расходов.',
    content: `ชาวต่างชาติสามารถถือกรรมสิทธิ์คอนโดในไทยได้อย่างถูกกฎหมาย ภายใต้ พ.ร.บ. อาคารชุด โดยมีเงื่อนไขสำคัญ:

**สัดส่วน 49/51**
กฎหมายกำหนดให้ต่างชาติถือกรรมสิทธิ์ได้ไม่เกิน 49% ของพื้นที่ทั้งหมดในโครงการ หากยังเหลือสัดส่วนอยู่ ก็สามารถซื้อในชื่อตัวเองได้เลย

**ขั้นตอนการซื้อ**
1. เลือกห้องและทำสัญญาจอง (วางมัดจำ)
2. ตรวจสอบสัญญาซื้อขาย (แนะนำให้ทนายดู)
3. โอนเงินจากต่างประเทศเข้าบัญชีไทย — ต้องมี Foreign Exchange Transaction Form (FETF) เพื่อยืนยันแหล่งเงิน
4. จ่ายค่าโอนกรรมสิทธิ์ที่กรมที่ดิน
5. รับกรรมสิทธิ์ห้องชุด

**ค่าใช้จ่ายที่ต้องทราบ**
- ค่าโอน 2% ของราคาประเมิน (ปกติแบ่งจ่ายผู้ซื้อ-ผู้ขาย)
- ค่าส่วนกลางรายปี (Common Area Fee)
- ค่าซ่อมบำรุงสาธารณูปโภค (Sinking Fund)

**เคล็ดลับ**: เลือกโครงการที่ยังมีสัดส่วนต่างชาติเหลือ เพราะถ้าเต็มแล้วจะต้องทำสัญญาเช่าระยะยาวแทน หากต้องการความช่วยเหลือ [ค้นหาทรัพย์ในพัทยา](/th/listings) หรือ [ติดต่อเรา](/th/contact) ได้เลย`,
    contentEn: `Foreigners can legally own a condominium unit in Thailand under the Condominium Act. Here's what you need to know:

**The 49/51 Rule**
Foreign ownership is capped at 49% of the total area of a condominium project. As long as quota remains, you can buy under your own name (freehold).

**Step-by-Step Process**
1. Choose your unit and sign a reservation agreement (pay deposit)
2. Review the sale-purchase contract (lawyer recommended)
3. Transfer funds from overseas into a Thai bank account — you must obtain a Foreign Exchange Transaction Form (FETF) to prove source of funds
4. Pay transfer fees at the Land Department
5. Receive your ownership title deed (chanote)

**Key Costs**
- Transfer fee: 2% of appraised value (usually split between buyer and seller)
- Common Area Fee (annual maintenance)
- Sinking Fund (one-time reserve contribution)

**Tip**: Choose a project that still has foreign quota available. If full, you'd need a long-term lease instead. Need help? [Browse Pattaya properties](/en/listings) or [contact us](/en/contact).`,
    contentZh: `外国人可以合法拥有泰国公寓产权，依据《公寓法》规定。以下是购买前需要了解的关键信息：

**49/51 规则**
外国人持有面积不得超过整个项目总面积的49%。只要配额未满，就可以以个人名义购买（永久产权）。

**购买步骤**
1. 选择房间并签订预订合同（支付定金）
2. 审查买卖合同（建议聘请律师）
3. 从境外将资金汇入泰国银行账户 — 必须获得外汇交易表 (FETF) 以证明资金来源
4. 在土地局缴纳过户费
5. 领取产权证书

**主要费用**
- 过户费：评估价的2%（通常买卖双方分摊）
- 公共区域维护费（年费）
- 维修基金（一次性缴纳）

**建议**：选择仍有外国人配额的项目。如果配额已满，则需要签订长期租约。需要帮助？[浏览芭堤雅房产](/zh/listings) 或 [联系我们](/zh/contact)。`,
    contentRu: `Иностранцы могут легально владеть квартирой в Таиланде в соответствии с Законом о кондоминиумах. Вот что нужно знать:

**Правило 49/51**
Иностранцы могут владеть не более 49% общей площади кондоминиума. Пока квота не исчерпана, можно купить на своё имя.

**Пошаговый процесс**
1. Выберите квартиру и подпишите договор бронирования (внесите задаток)
2. Проверьте договор купли-продажи (рекомендуется привлечь юриста)
3. Переведите средства из-за рубежа на тайский банковский счёт — необходимо получить справку FETF
4. Оплатите регистрационный сбор в Земельном управлении
5. Получите свидетельство о праве собственности

**Основные расходы**
- Регистрационный сбор: 2% от оценочной стоимости (обычно делится между покупателем и продавцом)
- Ежегодные взносы за содержание общих зон
- Фонд капремонта (единовременный взнос)

**Совет**: Выбирайте проект, где ещё есть иностранная квота. Если квота исчерпана, придётся оформлять долгосрочную аренду. Нужна помощь? [Смотрите недвижимость](/ru/listings) или [свяжитесь с нами](/ru/contact).`,
    coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=630&fit=crop&q=80',
    category: 'guide',
    tags: '["condo","foreigner","buying","pattaya"]',
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },

  // ===== 2. แนะนำทำเลพัทยา: จอมเทียน vs วงศ์อมาตย์ vs นาจอมเทียน =====
  {
    slug: 'pattaya-locations-jomtien-wongamat-najomtien',
    title: 'แนะนำทำเลพัทยา: จอมเทียน vs วงศ์อมาตย์ vs นาจอมเทียน',
    titleEn: 'Pattaya Locations Compared: Jomtien vs Wongamat vs Na Jomtien',
    titleZh: '芭堤雅区域比较：中天 vs 黄艾玛 vs 纳中天',
    titleRu: 'Сравнение районов Паттайи: Джомтьен vs Вонгамат vs На Джомтьен',
    excerpt: 'เปรียบเทียบทำเลยอดนิยมในพัทยา ข้อดี-ข้อเสีย ราคา บรรยากาศ เหมาะกับใคร',
    excerptEn: 'Compare the top Pattaya locations — pros, cons, prices, and which suits you best.',
    excerptZh: '对比芭堤雅热门地段 — 优缺点、价格和适合人群。',
    excerptRu: 'Сравнение популярных районов Паттайи — плюсы, минусы, цены и кому подойдёт.',
    content: `การเลือกทำเลเป็นปัจจัยสำคัญที่สุดในการซื้ออสังหาพัทยา มาดูสามโซนยอดนิยม:

**จอมเทียน (Jomtien)**
- บรรยากาศผ่อนคลาย หาดยาว คลื่นเล็ก เหมาะกับครอบครัว
- ราคาเริ่มต้น: คอนโดสตูดิโอ ตั้งแต่ 1.5-3 ล้านบาท
- ข้อดี: ใกล้ชายหาด ร้านอาหารเยอะ ขนส่งสะดวก
- ข้อเสีย: บางช่วงจราจรหนาแน่น โดยเฉพาะหน้าเทศกาล

**วงศ์อมาตย์ (Wongamat)**
- โซนหรูฝั่งพัทยาเหนือ ชายหาดสวยสะอาดที่สุดในพัทยา
- ราคาเริ่มต้น: 3-8 ล้านบาท สำหรับ 1-2 ห้องนอน
- ข้อดี: เงียบสงบ วิวสวย โครงการระดับ 5 ดาว
- ข้อเสีย: ราคาสูงกว่าโซนอื่น ร้านค้าน้อย

**นาจอมเทียน (Na Jomtien)**
- โซนใหม่ที่กำลังเติบโต ห่างจากตัวเมือง 10-15 นาที
- ราคาเริ่มต้น: 1.2-2.5 ล้านบาท
- ข้อดี: ราคาถูกที่สุด โครงการใหม่เยอะ วิวทะเลสวย
- ข้อเสีย: ห่างจากแหล่งชุมชน ต้องมีรถ

**สรุป**: จอมเทียนเหมาะกับคนรักความสะดวก วงศ์อมาตย์สำหรับคนชอบหรู นาจอมเทียนสำหรับนักลงทุนที่มองระยะยาว [ค้นหาทรัพย์ตามโซน](/th/listings) ได้เลย`,
    contentEn: `Choosing the right location is the most important factor when buying property in Pattaya. Here are the top three zones:

**Jomtien**
- Relaxed atmosphere, long beach, small waves — great for families
- Starting price: studio condos from 1.5-3 million baht
- Pros: Beach proximity, many restaurants, good transport links
- Cons: Traffic congestion during peak seasons

**Wongamat**
- Premium north Pattaya zone, the cleanest and most beautiful beach in Pattaya
- Starting price: 3-8 million baht for 1-2 bedrooms
- Pros: Quiet, stunning views, five-star developments
- Cons: Higher prices, fewer shops nearby

**Na Jomtien**
- Emerging zone 10-15 minutes from downtown
- Starting price: 1.2-2.5 million baht
- Pros: Most affordable, new developments, sea views
- Cons: Far from amenities, car needed

**Bottom line**: Jomtien for convenience lovers, Wongamat for luxury seekers, Na Jomtien for long-term investors. [Search properties by zone](/en/listings).`,
    contentZh: `选择合适的地段是在芭堤雅购房最重要的因素。以下是三大热门区域：

**中天 (Jomtien)**
- 氛围轻松，海滩绵长，浪小 — 适合家庭
- 起步价：Studio公寓从150万-300万泰铢
- 优点：靠近海滩，餐厅众多，交通便利
- 缺点：旺季时交通拥堵

**黄艾玛 (Wongamat)**
- 北芭堤雅高端区，拥有芭堤雅最干净美丽的海滩
- 起步价：1-2卧室 300万-800万泰铢
- 优点：安静，景色优美，五星级开发项目
- 缺点：价格较高，周边商店较少

**纳中天 (Na Jomtien)**
- 新兴区域，距市中心10-15分钟
- 起步价：120万-250万泰铢
- 优点：最实惠，新项目多，海景好
- 缺点：远离社区设施，需要自驾

**总结**：中天适合追求便利的人，黄艾玛适合喜欢高端的人，纳中天适合长期投资者。[按区域搜索房产](/zh/listings)。`,
    contentRu: `Выбор правильного района — самый важный фактор при покупке недвижимости в Паттайе. Вот три самых популярных:

**Джомтьен (Jomtien)**
- Расслабленная атмосфера, длинный пляж — идеально для семей
- Стартовая цена: студии от 1,5-3 млн бат
- Плюсы: Близость пляжа, много ресторанов, удобный транспорт
- Минусы: Пробки в сезон

**Вонгамат (Wongamat)**
- Премиум-район на севере Паттайи, самый чистый и красивый пляж
- Стартовая цена: 3-8 млн бат за 1-2 спальни
- Плюсы: Тихо, шикарные виды, 5-звёздочные проекты
- Минусы: Высокие цены, мало магазинов

**На Джомтьен (Na Jomtien)**
- Развивающийся район в 10-15 минутах от центра
- Стартовая цена: 1,2-2,5 млн бат
- Плюсы: Самые доступные цены, новые проекты, виды на море
- Минусы: Далеко от инфраструктуры, нужна машина

**Итог**: Джомтьен — для ценителей удобства, Вонгамат — для любителей роскоши, На Джомтьен — для долгосрочных инвесторов. [Искать недвижимость по районам](/ru/listings).`,
    coverImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&h=630&fit=crop&q=80',
    category: 'guide',
    tags: '["pattaya","location","jomtien","wongamat","najomtien"]',
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },

  // ===== 3. ซื้อ vs เช่า ในพัทยา =====
  {
    slug: 'buying-vs-renting-pattaya',
    title: 'ซื้อ vs เช่า ในพัทยา — อะไรคุ้มกว่า?',
    titleEn: 'Buying vs Renting in Pattaya — Which Is Better Value?',
    titleZh: '在芭堤雅买房还是租房 — 哪个更划算？',
    titleRu: 'Покупка или аренда в Паттайе — что выгоднее?',
    excerpt: 'เปรียบเทียบข้อดี-ข้อเสียระหว่างซื้อกับเช่าอสังหาในพัทยา ช่วยตัดสินใจได้ถูกต้อง',
    excerptEn: 'Compare the pros and cons of buying versus renting property in Pattaya to make the right decision.',
    excerptZh: '比较在芭堤雅买房和租房的优缺点，帮你做出正确决定。',
    excerptRu: 'Сравните плюсы и минусы покупки и аренды в Паттайе для правильного решения.',
    content: `คำถามยอดฮิตของทุกคนที่สนใจอสังหาพัทยา: ซื้อดีหรือเช่าดี? มาวิเคราะห์กัน:

**เมื่อไหร่ควรซื้อ?**
- อยู่ระยะยาว (3 ปีขึ้นไป)
- มีเงินก้อนพร้อมจ่ายเต็มหรือผ่อนดาวน์
- ต้องการทรัพย์สินเป็นของตัวเอง / ลงทุนปล่อยเช่า
- ตลาดขาขึ้น ราคามีแนวโน้มเพิ่ม

**เมื่อไหร่ควรเช่า?**
- อยู่ไม่ถึง 3 ปี หรือยังไม่แน่ใจทำเล
- ไม่ต้องการภาระค่าโอน ค่าซ่อมบำรุง
- ต้องการความยืดหยุ่น ย้ายได้ง่าย
- ทดลองอยู่ก่อนตัดสินใจซื้อ

**ตัวเลขเปรียบเทียบ** (คอนโด 1 ห้องนอน จอมเทียน)
| รายการ | ซื้อ | เช่า |
|--------|------|------|
| ราคา/ค่าเช่า | 2.5 ล้านบาท | 12,000 บาท/เดือน |
| ค่าโอน + ค่าใช้จ่าย | ~80,000 บาท | ไม่มี |
| ค่าส่วนกลาง/ปี | ~18,000 บาท | รวมในค่าเช่า |
| 5 ปี รวม | 2.67 ล้าน + มูลค่าห้อง | 720,000 บาท |

**สรุป**: ถ้าอยู่เกิน 5 ปี ซื้อคุ้มกว่า ถ้าอยู่ไม่ถึง 3 ปี เช่าสบายกว่า ไม่แน่ใจ? [ดูรายการทั้งหมด](/th/listings) หรือ [ปรึกษาเรา](/th/contact)`,
    contentEn: `The most popular question from anyone interested in Pattaya real estate: should you buy or rent? Let's analyze:

**When to Buy**
- Staying long-term (3+ years)
- Have capital ready for full payment or down payment
- Want to own an asset / invest for rental income
- Market is trending upward

**When to Rent**
- Staying less than 3 years or unsure about location
- Don't want transfer fees and maintenance costs
- Need flexibility to move easily
- Want to try before committing to buy

**Cost Comparison** (1-bedroom condo in Jomtien)
| Item | Buy | Rent |
|------|-----|------|
| Price/Rent | 2.5M baht | 12,000 baht/month |
| Transfer + fees | ~80,000 baht | None |
| Common fee/year | ~18,000 baht | Included |
| 5-year total | 2.67M + property value | 720,000 baht |

**Bottom line**: If staying 5+ years, buying wins. Under 3 years, renting is smarter. Not sure? [Browse all listings](/en/listings) or [consult us](/en/contact).`,
    contentZh: `每个对芭堤雅房产感兴趣的人都会问：该买还是该租？来分析一下：

**什么时候该买？**
- 长期居住（3年以上）
- 有足够资金全款或分期付款
- 想拥有资产/投资出租收益
- 市场处于上升趋势

**什么时候该租？**
- 居住不到3年或不确定地段
- 不想承担过户费和维护成本
- 需要灵活性，方便搬迁
- 想先试住再决定是否购买

**成本对比**（中天1卧室公寓）
| 项目 | 购买 | 租赁 |
|------|------|------|
| 价格/租金 | 250万泰铢 | 12,000泰铢/月 |
| 过户费 | ~8万泰铢 | 无 |
| 公共维护费/年 | ~1.8万泰铢 | 含在租金内 |
| 5年总计 | 267万 + 房产价值 | 72万泰铢 |

**总结**：居住超过5年，买房更划算。不到3年，租房更明智。不确定？[浏览所有房源](/zh/listings) 或 [咨询我们](/zh/contact)。`,
    contentRu: `Самый популярный вопрос: покупать или арендовать в Паттайе? Анализируем:

**Когда покупать**
- Планируете жить долго (3+ лет)
- Есть капитал для полной оплаты или первого взноса
- Хотите владеть активом / инвестировать в аренду
- Рынок растёт

**Когда арендовать**
- Планируете жить менее 3 лет или не уверены в районе
- Не хотите платить за перевод и содержание
- Нужна гибкость для переезда
- Хотите попробовать перед покупкой

**Сравнение расходов** (1-спальня в Джомтьене)
| Статья | Покупка | Аренда |
|--------|---------|--------|
| Цена/аренда | 2,5 млн бат | 12 000 бат/мес |
| Сборы за перевод | ~80 000 бат | Нет |
| Обслуживание/год | ~18 000 бат | Включено |
| Итого за 5 лет | 2,67 млн + стоимость | 720 000 бат |

**Итог**: Если живёте 5+ лет — покупка выгоднее. Менее 3 лет — аренда разумнее. Не уверены? [Смотрите объявления](/ru/listings) или [проконсультируйтесь](/ru/contact).`,
    coverImage: 'https://images.unsplash.com/photo-1582407947092-5fa0e1e0e987?w=1200&h=630&fit=crop&q=80',
    category: 'tips',
    tags: '["buying","renting","comparison","pattaya"]',
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },

  // ===== 4. กฎหมายอสังหาที่ต่างชาติต้องรู้ =====
  {
    slug: 'thai-property-laws-for-foreigners',
    title: 'กฎหมายอสังหาที่ต่างชาติต้องรู้ก่อนซื้อในไทย',
    titleEn: 'Thai Property Laws Every Foreigner Must Know',
    titleZh: '外国人在泰国买房必知的法律规定',
    titleRu: 'Законы о недвижимости Таиланда для иностранцев',
    excerpt: 'สรุปกฎหมายอสังหาไทยที่เกี่ยวข้องกับต่างชาติ สิ่งที่ทำได้และทำไม่ได้ ข้อควรระวัง',
    excerptEn: 'Summary of Thai property laws affecting foreigners — what you can and cannot do.',
    excerptZh: '与外国人相关的泰国房产法律概要 — 可以做和不可以做的事。',
    excerptRu: 'Обзор законов Таиланда о недвижимости для иностранцев — что можно и нельзя.',
    content: `ก่อนซื้ออสังหาในไทย ต่างชาติต้องเข้าใจกฎหมายสำคัญเหล่านี้:

**1. คอนโด — ถือกรรมสิทธิ์ได้ (Freehold)**
ต่างชาติซื้อคอนโดในชื่อตัวเองได้ ภายใต้ พ.ร.บ. อาคารชุด พ.ศ. 2522 โดยสัดส่วนต่างชาติต้องไม่เกิน 49% ของพื้นที่โครงการ

**2. บ้าน/ที่ดิน — ไม่สามารถถือกรรมสิทธิ์ได้โดยตรง**
ต่างชาติไม่สามารถเป็นเจ้าของที่ดินในไทยได้ แต่มีทางเลือก:
- เช่าระยะยาว (Leasehold) 30 ปี ต่อได้อีก 30 ปี
- จัดตั้งบริษัทไทย (ต่างชาติถือหุ้นไม่เกิน 49%)
- สมรสกับคนไทย (ที่ดินต้องเป็นชื่อคู่สมรสไทย)

**3. การโอนเงินเข้าประเทศ**
ต้องโอนเงินค่าซื้อจากต่างประเทศเข้าบัญชีไทยเท่านั้น และต้องมีเอกสาร FETF จากธนาคาร

**4. ภาษีและค่าธรรมเนียม**
- ค่าโอน: 2% ของราคาประเมิน
- ภาษีธุรกิจเฉพาะ: 3.3% (ถ้าขายภายใน 5 ปี)
- ภาษีหัก ณ ที่จ่าย: ตามอัตราก้าวหน้า
- อากรแสตมป์: 0.5% (ถ้าไม่เสียภาษีธุรกิจเฉพาะ)

**5. ข้อควรระวัง**
- ตรวจสอบ chanote (โฉนดที่ดิน) ให้แน่ใจ
- ใช้ทนายความตรวจสัญญาเสมอ
- อย่าซื้อผ่านนอมินี — ผิดกฎหมาย

ต้องการคำแนะนำเพิ่มเติม? [ติดต่อเรา](/th/contact) เรายินดีช่วย`,
    contentEn: `Before buying property in Thailand, foreigners must understand these key laws:

**1. Condos — Freehold Ownership Allowed**
Foreigners can buy a condo in their own name under the Condominium Act (1979). Foreign ownership must not exceed 49% of total project area.

**2. Houses/Land — No Direct Ownership**
Foreigners cannot own land in Thailand directly, but have alternatives:
- Long-term lease (30 years, renewable for another 30)
- Set up a Thai company (foreigner holds max 49% shares)
- Marry a Thai national (land must be in Thai spouse's name)

**3. Fund Transfer Requirements**
Purchase funds must be transferred from overseas into a Thai bank account with FETF documentation from the bank.

**4. Taxes and Fees**
- Transfer fee: 2% of appraised value
- Specific Business Tax: 3.3% (if sold within 5 years)
- Withholding tax: progressive rate
- Stamp duty: 0.5% (if SBT not applicable)

**5. Important Warnings**
- Verify the chanote (title deed) thoroughly
- Always use a lawyer to review contracts
- Never use a nominee structure — it's illegal

Need more guidance? [Contact us](/en/contact) — we're happy to help.`,
    contentZh: `在泰国购买房产前，外国人必须了解以下关键法律：

**1. 公寓 — 可永久持有**
根据《公寓法》(1979)，外国人可以以个人名义购买公寓。外国人持有面积不得超过项目总面积的49%。

**2. 别墅/土地 — 不能直接持有**
外国人不能直接拥有泰国土地，但有替代方案：
- 长期租赁（30年，可续签30年）
- 设立泰国公司（外国人最多持股49%）
- 与泰国人结婚（土地须以泰国配偶名义持有）

**3. 资金汇入要求**
购房资金必须从海外汇入泰国银行账户，并需提供银行的FETF文件。

**4. 税费**
- 过户费：评估价的2%
- 特殊营业税：3.3%（5年内出售）
- 预扣税：累进税率
- 印花税：0.5%（如不适用特殊营业税）

**5. 重要警告**
- 务必核实产权证书(chanote)
- 始终聘请律师审查合同
- 切勿使用代持人 — 这是违法的

需要更多指导？[联系我们](/zh/contact) — 我们乐意帮助。`,
    contentRu: `Перед покупкой недвижимости в Таиланде иностранцам необходимо знать эти ключевые законы:

**1. Квартиры — полная собственность**
Иностранцы могут купить квартиру на своё имя по Закону о кондоминиумах (1979). Доля иностранцев не должна превышать 49% площади проекта.

**2. Дома/земля — прямое владение невозможно**
Иностранцы не могут владеть землёй, но есть альтернативы:
- Долгосрочная аренда (30 лет с продлением на 30)
- Регистрация тайской компании (иностранец владеет макс. 49%)
- Брак с гражданином Таиланда (земля на имя тайского супруга)

**3. Перевод средств**
Средства должны быть переведены из-за рубежа на тайский банковский счёт с документом FETF.

**4. Налоги и сборы**
- Регистрационный сбор: 2% от оценки
- Налог на бизнес: 3,3% (при продаже в течение 5 лет)
- Подоходный налог: прогрессивная ставка
- Гербовый сбор: 0,5%

**5. Важные предупреждения**
- Тщательно проверяйте документ о праве собственности
- Всегда привлекайте юриста для проверки договора
- Никогда не используйте номинала — это незаконно

Нужна помощь? [Свяжитесь с нами](/ru/contact).`,
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=630&fit=crop&q=80',
    category: 'legal',
    tags: '["law","foreigner","ownership","thailand"]',
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },

  // ===== 5. 5 เหตุผลที่พัทยาเป็นทำเลลงทุนที่น่าสนใจ =====
  {
    slug: '5-reasons-invest-pattaya-real-estate',
    title: '5 เหตุผลที่พัทยาเป็นทำเลลงทุนอสังหาที่น่าสนใจ',
    titleEn: '5 Reasons Pattaya Is a Great Real Estate Investment',
    titleZh: '投资芭堤雅房产的5大理由',
    titleRu: '5 причин инвестировать в недвижимость Паттайи',
    excerpt: 'ทำไมพัทยาถึงเป็นตัวเลือกอันดับต้นๆ สำหรับนักลงทุนอสังหา ทั้งไทยและต่างชาติ',
    excerptEn: 'Why Pattaya is a top choice for property investors, both Thai and foreign.',
    excerptZh: '为什么芭堤雅是泰国和外国房产投资者的首选。',
    excerptRu: 'Почему Паттайя — лучший выбор для инвесторов в недвижимость.',
    content: `พัทยาไม่ใช่แค่เมืองท่องเที่ยว แต่เป็นศูนย์กลางอสังหาที่เติบโตอย่างต่อเนื่อง นี่คือ 5 เหตุผลสำคัญ:

**1. ราคาที่ยังจับต้องได้**
เมื่อเทียบกับกรุงเทพฯ หรือภูเก็ต ราคาคอนโดพัทยาถูกกว่า 30-50% ในขณะที่ให้ผลตอบแทนค่าเช่าสูงกว่า (5-8% ต่อปี)

**2. โครงสร้างพื้นฐานใหม่**
- รถไฟความเร็วสูงเชื่อมกรุงเทพฯ-พัทยา (กำลังก่อสร้าง)
- สนามบินอู่ตะเภาขยายเป็นสนามบินนานาชาติ
- โครงการ EEC (เขตเศรษฐกิจพิเศษภาคตะวันออก)

**3. ตลาดเช่าแข็งแกร่ง**
นักท่องเที่ยว + ชาวต่างชาติที่มาพำนักระยะยาว = ดีมานด์เช่าสูงตลอดทั้งปี โดยเฉพาะ studio-1 bedroom

**4. ศูนย์กลางท่องเที่ยวนานาชาติ**
พัทยาเป็นเมืองท่องเที่ยวอันดับ 1 ของไทย (ยอดนักท่องเที่ยว 15+ ล้านคน/ปี) ทำให้ตลาดเช่าระยะสั้นรุ่ง

**5. ไลฟ์สไตล์ครบวงจร**
ชายหาด สนามกอล์ฟ ห้างสรรพสินค้า โรงพยาบาลนานาชาติ โรงเรียนนานาชาติ — ทุกอย่างมีพร้อม

[ดูทรัพย์ลงทุนในพัทยา](/th/listings) หรือ [ฝากขาย-ฝากเช่ากับเรา](/th/list-your-property)`,
    contentEn: `Pattaya isn't just a tourist city — it's a growing real estate hub. Here are 5 key reasons:

**1. Affordable Prices**
Compared to Bangkok or Phuket, Pattaya condos are 30-50% cheaper while offering higher rental yields (5-8% annually).

**2. New Infrastructure**
- High-speed rail connecting Bangkok-Pattaya (under construction)
- U-Tapao airport expanding to international capacity
- EEC (Eastern Economic Corridor) development

**3. Strong Rental Market**
Tourists + long-stay expats = high rental demand year-round, especially for studios and 1-bedrooms.

**4. International Tourism Hub**
Pattaya is Thailand's #1 tourist destination (15+ million visitors/year), fueling short-term rental demand.

**5. Complete Lifestyle**
Beaches, golf courses, shopping malls, international hospitals, international schools — everything is available.

[Browse Pattaya investment properties](/en/listings) or [list your property with us](/en/list-your-property).`,
    contentZh: `芭堤雅不仅是旅游城市，更是不断增长的房地产中心。以下是5个关键原因：

**1. 价格实惠**
与曼谷或普吉岛相比，芭堤雅公寓便宜30-50%，而租金收益更高（年5-8%）。

**2. 新基础设施**
- 曼谷-芭堤雅高铁（建设中）
- 乌塔堡机场扩建为国际机场
- EEC（东部经济走廊）开发

**3. 强劲的租赁市场**
游客 + 长期居住外国人 = 全年高租赁需求，尤其是Studio和1卧室。

**4. 国际旅游中心**
芭堤雅是泰国第一旅游目的地（每年1500万+游客），推动短期租赁需求。

**5. 完善的生活配套**
海滩、高尔夫球场、购物中心、国际医院、国际学校 — 一应俱全。

[浏览芭堤雅投资房产](/zh/listings) 或 [委托我们挂牌](/zh/list-your-property)。`,
    contentRu: `Паттайя — не просто курорт, а растущий центр недвижимости. Вот 5 ключевых причин:

**1. Доступные цены**
По сравнению с Бангкоком или Пхукетом, квартиры в Паттайе на 30-50% дешевле при более высокой доходности аренды (5-8% годовых).

**2. Новая инфраструктура**
- Скоростная железная дорога Бангкок-Паттайя (строится)
- Аэропорт У-Тапао расширяется до международного
- Проект EEC (Восточный экономический коридор)

**3. Сильный рынок аренды**
Туристы + долгосрочные экспаты = высокий спрос на аренду круглый год, особенно студии и 1-спальни.

**4. Международный туристический центр**
Паттайя — туристическое направление №1 в Таиланде (15+ млн туристов в год).

**5. Полная инфраструктура**
Пляжи, гольф, ТЦ, международные больницы и школы — всё есть.

[Смотрите инвестиционную недвижимость](/ru/listings) или [разместите объявление](/ru/list-your-property).`,
    coverImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=630&fit=crop&q=80',
    category: 'market',
    tags: '["investment","pattaya","reasons","roi"]',
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },

  // ===== 6. เตรียมตัวก่อนซื้อคอนโด: Checklist =====
  {
    slug: 'first-time-buyer-condo-checklist',
    title: 'เตรียมตัวก่อนซื้อคอนโด: Checklist สำหรับผู้ซื้อครั้งแรก',
    titleEn: 'First-Time Condo Buyer Checklist for Pattaya',
    titleZh: '首次购买芭堤雅公寓清单',
    titleRu: 'Чек-лист для первой покупки квартиры в Паттайе',
    excerpt: 'รายการตรวจสอบครบทุกข้อก่อนซื้อคอนโดครั้งแรก ไม่พลาดขั้นตอนสำคัญ',
    excerptEn: 'A complete checklist so you don\'t miss any important step when buying your first condo.',
    excerptZh: '完整的购房清单，确保首次购买公寓不遗漏任何重要步骤。',
    excerptRu: 'Полный чек-лист, чтобы не пропустить важные шаги при первой покупке.',
    content: `ซื้อคอนโดครั้งแรก ตื่นเต้นแน่ แต่อย่าลืมตรวจสอบทุกข้อต่อไปนี้:

**ก่อนดูห้อง**
☐ กำหนดงบประมาณ (รวมค่าโอน ค่าตกแต่ง ค่าส่วนกลาง)
☐ เลือกทำเลที่ต้องการ (ใกล้ทะเล? ใกล้ห้าง? เงียบ?)
☐ ตรวจสอบสิทธิ์การซื้อ (ต่างชาติ: สัดส่วน 49%)
☐ เตรียมเอกสาร (พาสปอร์ต, FETF, หลักฐานเงิน)

**ตอนดูห้อง**
☐ ตรวจสภาพห้องจริง ไม่ใช่แค่รูป
☐ เช็ควิว ทิศทาง แดด ลม
☐ ถามค่าส่วนกลาง Sinking Fund อัตราปัจจุบัน
☐ ถามเรื่องที่จอดรถ เฟอร์นิเจอร์ที่รวมอยู่
☐ สำรวจสิ่งอำนวยความสะดวก (สระว่ายน้ำ ฟิตเนส ฯลฯ)
☐ ตรวจสอบสภาพอาคาร ลิฟต์ ทางเดิน

**ก่อนเซ็นสัญญา**
☐ ให้ทนายตรวจสอบสัญญาซื้อขาย
☐ ตรวจสอบโฉนด chanote (ฉโนด)
☐ เปรียบเทียบราคากับห้องใกล้เคียง
☐ ตรวจสอบประวัติโครงการและผู้พัฒนา

**หลังโอนกรรมสิทธิ์**
☐ ตรวจสอบมิเตอร์น้ำ-ไฟ
☐ เปลี่ยนกุญแจ (ถ้าเป็นมือสอง)
☐ ลงทะเบียนนิติบุคคล
☐ ทำประกันทรัพย์สิน

พร้อมหาคอนโดแล้ว? [ค้นหาทรัพย์ในพัทยา](/th/listings)`,
    contentEn: `Buying your first condo is exciting, but don't forget to check everything:

**Before Viewing**
☐ Set your budget (include transfer fees, furnishing, common fees)
☐ Choose your preferred location (beachfront? near mall? quiet?)
☐ Verify purchase eligibility (foreigners: 49% quota)
☐ Prepare documents (passport, FETF, proof of funds)

**During Viewing**
☐ Inspect the actual unit, not just photos
☐ Check the view, sun direction, and ventilation
☐ Ask about common area fees and sinking fund rates
☐ Ask about parking and included furniture
☐ Survey facilities (pool, gym, etc.)
☐ Inspect building condition, elevators, corridors

**Before Signing**
☐ Have a lawyer review the sale contract
☐ Verify the chanote (title deed)
☐ Compare prices with similar units
☐ Research the developer's track record

**After Transfer**
☐ Check water and electric meters
☐ Change locks (if resale)
☐ Register with building management
☐ Get property insurance

Ready to find your condo? [Search Pattaya properties](/en/listings).`,
    contentZh: `首次购买公寓令人兴奋，但别忘了检查以下所有事项：

**看房前**
☐ 确定预算（包括过户费、装修费、公共费用）
☐ 选择理想位置（海景？近商场？安静？）
☐ 确认购买资格（外国人：49%配额）
☐ 准备文件（护照、FETF、资金证明）

**看房时**
☐ 亲自检查房间，不仅看照片
☐ 检查景观、朝向、通风
☐ 询问公共区域费和维修基金
☐ 询问车位和包含的家具
☐ 考察设施（泳池、健身房等）
☐ 检查建筑状况、电梯、走廊

**签约前**
☐ 请律师审查购房合同
☐ 核实产权证书
☐ 与类似房源比价
☐ 调查开发商背景

**过户后**
☐ 检查水电表
☐ 更换门锁（如果是二手房）
☐ 向物业管理处登记
☐ 购买财产保险

准备好了？[搜索芭堤雅房产](/zh/listings)。`,
    contentRu: `Покупка первой квартиры — волнительный момент, но не забудьте проверить всё:

**Перед просмотром**
☐ Определите бюджет (включая сборы, мебель, коммунальные)
☐ Выберите район (у моря? рядом с ТЦ? тихий?)
☐ Проверьте право на покупку (иностранцы: квота 49%)
☐ Подготовьте документы (паспорт, FETF, подтверждение средств)

**Во время просмотра**
☐ Осмотрите реальную квартиру, а не только фото
☐ Проверьте вид, сторону света, вентиляцию
☐ Узнайте о взносах за обслуживание
☐ Спросите о парковке и мебели
☐ Осмотрите инфраструктуру (бассейн, спортзал)
☐ Проверьте состояние здания, лифтов

**Перед подписанием**
☐ Юрист должен проверить договор
☐ Проверьте документ о праве собственности
☐ Сравните цены с аналогами
☐ Изучите репутацию застройщика

**После оформления**
☐ Проверьте счётчики воды и электричества
☐ Смените замки (если вторичка)
☐ Зарегистрируйтесь в управляющей компании
☐ Оформите страховку

Готовы? [Ищите квартиры в Паттайе](/ru/listings).`,
    coverImage: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&h=630&fit=crop&q=80',
    category: 'tips',
    tags: '["checklist","first-time","condo","buying"]',
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },

  // ===== 7. ตลาดอสังหาพัทยา 2025-2026: แนวโน้มและโอกาส =====
  {
    slug: 'pattaya-property-market-2025-2026-trends',
    title: 'ตลาดอสังหาพัทยา 2025-2026: แนวโน้มและโอกาส',
    titleEn: 'Pattaya Property Market 2025-2026: Trends & Opportunities',
    titleZh: '2025-2026年芭堤雅房产市场趋势与机遇',
    titleRu: 'Рынок недвижимости Паттайи 2025-2026: тренды и возможности',
    excerpt: 'วิเคราะห์แนวโน้มตลาดอสังหาพัทยาปี 2025-2026 โอกาสสำหรับนักลงทุนและผู้ซื้อ',
    excerptEn: 'Analysis of Pattaya property market trends for 2025-2026 — opportunities for investors and buyers.',
    excerptZh: '2025-2026年芭堤雅房产市场趋势分析 — 投资者和买家的机遇。',
    excerptRu: 'Анализ трендов рынка недвижимости Паттайи на 2025-2026 — возможности для инвесторов.',
    content: `ตลาดอสังหาพัทยาเข้าสู่ช่วงฟื้นตัวเต็มกำลังหลังโควิด มาดูแนวโน้มที่สำคัญ:

**แนวโน้มหลักปี 2025-2026**

**1. ราคาขยับขึ้น 5-10% ต่อปี**
คอนโดติดทะเลและโครงการใหม่ในโซนจอมเทียน-นาจอมเทียนมีราคาปรับสูงขึ้นชัด เนื่องจากที่ดินแพงขึ้นและต้นทุนก่อสร้างเพิ่ม

**2. ตลาดเช่าระยะยาวเติบโต**
ชาวต่างชาติที่ทำงาน Remote Work เลือกมาพำนักพัทยามากขึ้น ทำให้ตลาดเช่ารายเดือน 3-12 เดือนบูม

**3. คอนโดระดับกลาง-สูงมาแรง**
โครงการ 2-5 ล้านบาทเป็นที่ต้องการมากที่สุด เหมาะทั้งซื้ออยู่เองและลงทุนปล่อยเช่า

**4. โครงสร้างพื้นฐานเปลี่ยนเกม**
- รถไฟความเร็วสูงกรุงเทพฯ-พัทยา ลดเวลาเดินทางเหลือ 45 นาที
- EEC ดึงดูดบริษัทต่างชาติ = พนักงานต้องการที่อยู่อาศัย
- มอเตอร์เวย์ใหม่ทำให้เดินทางสะดวกขึ้น

**5. นักลงทุนจีน-รัสเซียกลับมา**
หลังเปิดประเทศ นักลงทุนจากจีนและรัสเซียกลับมาซื้อเพิ่มอย่างมีนัยสำคัญ

**โอกาสสำหรับคุณ**
- ซื้อตอนนี้ก่อนรถไฟความเร็วสูงเสร็จ = ราคาจะขึ้นอีก
- คอนโดใกล้สถานีรถไฟเป็นเป้าหมายสำคัญ
- โซนนาจอมเทียนยังราคาถูก แต่มีแนวโน้มขึ้น

[ค้นหาทรัพย์ลงทุน](/th/listings) หรือ [ฝากขาย-ฝากเช่ากับเรา](/th/list-your-property)`,
    contentEn: `Pattaya's property market has entered a full post-COVID recovery phase. Here are the key trends:

**Key Trends 2025-2026**

**1. Prices Rising 5-10% Annually**
Beachfront condos and new projects in Jomtien-Na Jomtien are seeing clear price increases due to rising land costs.

**2. Long-term Rental Market Growing**
More foreign remote workers are choosing Pattaya, boosting the 3-12 month rental market.

**3. Mid-to-High Range Condos in Demand**
Projects priced 2-5 million baht are the most sought-after — ideal for both living and rental investment.

**4. Infrastructure Game-Changers**
- Bangkok-Pattaya high-speed rail reduces travel to 45 minutes
- EEC attracts foreign companies = housing demand
- New motorways improve connectivity

**5. Chinese & Russian Investors Returning**
Since reopening, Chinese and Russian buyers have significantly increased their purchasing activity.

**Your Opportunity**
- Buy now before the high-speed rail completes — prices will rise further
- Condos near train stations are prime targets
- Na Jomtien is still affordable but trending up

[Search investment properties](/en/listings) or [list your property](/en/list-your-property).`,
    contentZh: `芭堤雅房产市场已进入后疫情全面复苏阶段。以下是关键趋势：

**2025-2026年主要趋势**

**1. 价格年涨5-10%**
中天和纳中天的海景公寓和新项目价格明显上涨，主要因土地成本和建筑成本增加。

**2. 长期租赁市场增长**
更多远程工作的外国人选择芭堤雅，推动3-12个月租赁市场蓬勃发展。

**3. 中高端公寓需求旺盛**
200万-500万泰铢的项目最受欢迎 — 自住和投资出租皆宜。

**4. 基础设施改变格局**
- 曼谷-芭堤雅高铁将出行时间缩短至45分钟
- EEC吸引外资企业 = 住房需求增加
- 新高速公路改善交通

**5. 中国和俄罗斯投资者回归**
开放以来，中国和俄罗斯买家的购买活动显著增加。

**您的机会**
- 在高铁建成前购买 — 价格还会上涨
- 靠近火车站的公寓是最佳目标
- 纳中天仍然实惠但在上涨中

[搜索投资房产](/zh/listings) 或 [委托挂牌](/zh/list-your-property)。`,
    contentRu: `Рынок недвижимости Паттайи вступил в фазу полного восстановления. Ключевые тренды:

**Тренды 2025-2026**

**1. Цены растут на 5-10% в год**
Квартиры на берегу и новые проекты в Джомтьене-На Джомтьене показывают значительный рост цен.

**2. Рынок долгосрочной аренды растёт**
Всё больше удалённых работников выбирают Паттайю, что стимулирует аренду на 3-12 месяцев.

**3. Квартиры среднего и выше ценового сегмента в спросе**
Проекты по 2-5 млн бат — самые востребованные для жизни и инвестиций.

**4. Инфраструктурные изменения**
- Скоростная ж/д Бангкок-Паттайя сократит путь до 45 минут
- EEC привлекает иностранные компании = спрос на жильё
- Новые автострады улучшают доступность

**5. Возвращение китайских и российских инвесторов**
После открытия границ активность китайских и российских покупателей значительно возросла.

**Ваша возможность**
- Покупайте сейчас, пока не завершена скоростная ж/д — цены вырастут
- Квартиры рядом со станциями — приоритетная цель
- На Джомтьен всё ещё доступен, но цены растут

[Ищите инвестиционные объекты](/ru/listings) или [разместите объявление](/ru/list-your-property).`,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=630&fit=crop&q=80',
    category: 'market',
    tags: '["market","trends","2025","2026","investment"]',
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },

  // ===== 8. วิธีเลือกนายหน้าอสังหาที่ไว้ใจได้ =====
  {
    slug: 'how-to-choose-reliable-real-estate-agent',
    title: 'วิธีเลือกนายหน้าอสังหาที่ไว้ใจได้',
    titleEn: 'How to Choose a Reliable Real Estate Agent in Pattaya',
    titleZh: '如何在芭堤雅选择可靠的房产经纪人',
    titleRu: 'Как выбрать надёжного агента по недвижимости в Паттайе',
    excerpt: 'เคล็ดลับการเลือกนายหน้าที่ดี สัญญาณเตือนที่ต้องระวัง เพื่อให้การซื้อ-ขายราบรื่น',
    excerptEn: 'Tips for choosing a good agent and red flags to watch out for when buying or selling.',
    excerptZh: '选择好经纪人的技巧和需要注意的危险信号。',
    excerptRu: 'Советы по выбору хорошего агента и тревожные сигналы.',
    content: `นายหน้าที่ดีช่วยให้การซื้อ-ขายอสังหาราบรื่น นายหน้าที่ไม่ดีอาจทำให้เสียเงินเสียเวลา ดูวิธีเลือก:

**สัญญาณของนายหน้าที่ดี**
✅ มีใบอนุญาตหรือจดทะเบียนถูกต้อง
✅ มีรีวิวหรือผลงานที่ตรวจสอบได้
✅ ตอบคำถามชัดเจน ไม่กดดันให้รีบซื้อ
✅ ให้ข้อมูลทั้งข้อดีและข้อเสีย
✅ มีประสบการณ์ในพื้นที่ที่ต้องการ
✅ พาดูหลายทรัพย์เพื่อให้เปรียบเทียบ

**สัญญาณเตือน (Red Flags)**
⚠️ กดดันให้ตัดสินใจทันที
⚠️ ไม่ยอมให้ดูเอกสารกรรมสิทธิ์
⚠️ ค่าคอมมิชชันสูงผิดปกติ (ปกติ 3-5%)
⚠️ ไม่มีสำนักงานหรือข้อมูลที่ตรวจสอบได้
⚠️ ให้ข้อมูลเฉพาะด้านดีอย่างเดียว

**คำถามที่ควรถาม**
1. คุณมีประสบการณ์ในพื้นที่นี้กี่ปี?
2. ช่วยเรื่องเอกสารโอนกรรมสิทธิ์ได้ไหม?
3. ค่าคอมมิชชันเท่าไหร่?
4. มีทนายที่แนะนำไหม?

Pattaya Estate Hub พร้อมให้บริการอย่างโปร่งใส [ติดต่อเรา](/th/contact) หรือ [ค้นหาทรัพย์](/th/listings) ได้เลย`,
    contentEn: `A good agent makes buying and selling smooth. A bad one can waste your time and money. Here's how to choose:

**Signs of a Good Agent**
✅ Licensed or properly registered
✅ Has verifiable reviews and track record
✅ Answers questions clearly, no pressure tactics
✅ Shares both pros and cons of properties
✅ Has local area expertise
✅ Shows multiple options for comparison

**Red Flags**
⚠️ Pressures you to decide immediately
⚠️ Won't show ownership documents
⚠️ Unusually high commission (normal: 3-5%)
⚠️ No office or verifiable information
⚠️ Only shares positive information

**Questions to Ask**
1. How many years of experience in this area?
2. Can you help with transfer documentation?
3. What's your commission rate?
4. Can you recommend a lawyer?

Pattaya Estate Hub operates with full transparency. [Contact us](/en/contact) or [browse properties](/en/listings).`,
    contentZh: `好的经纪人让买卖过程顺利。差的经纪人会浪费你的时间和金钱。以下是选择方法：

**好经纪人的标志**
✅ 持有执照或正规注册
✅ 有可查证的评价和业绩记录
✅ 回答问题清晰，不施加压力
✅ 分享房产的优缺点
✅ 熟悉当地市场
✅ 提供多个选项供比较

**危险信号**
⚠️ 催促你立即决定
⚠️ 不愿出示产权文件
⚠️ 佣金异常高（正常：3-5%）
⚠️ 没有办公室或可查信息
⚠️ 只说好的方面

**应该问的问题**
1. 在此区域有多少年经验？
2. 能协助办理过户手续吗？
3. 佣金比例是多少？
4. 能推荐律师吗？

Pattaya Estate Hub 透明运营。[联系我们](/zh/contact) 或 [浏览房产](/zh/listings)。`,
    contentRu: `Хороший агент делает сделку гладкой. Плохой — потеря времени и денег. Как выбрать:

**Признаки хорошего агента**
✅ Лицензирован или зарегистрирован
✅ Имеет проверяемые отзывы
✅ Отвечает чётко, без давления
✅ Рассказывает и о плюсах, и о минусах
✅ Знает местный рынок
✅ Показывает несколько вариантов

**Тревожные сигналы**
⚠️ Давит принять решение немедленно
⚠️ Не показывает документы на собственность
⚠️ Завышенная комиссия (норма: 3-5%)
⚠️ Нет офиса или проверяемой информации
⚠️ Говорит только о плюсах

**Вопросы, которые стоит задать**
1. Сколько лет опыта в этом районе?
2. Поможете с документами на перевод?
3. Какова ваша комиссия?
4. Можете порекомендовать юриста?

Pattaya Estate Hub работает прозрачно. [Свяжитесь с нами](/ru/contact) или [ищите недвижимость](/ru/listings).`,
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop&q=80',
    category: 'tips',
    tags: '["agent","tips","choosing","trust"]',
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },

  // ===== 9. ค่าใช้จ่ายแฝงที่ต้องรู้ เมื่อซื้อคอนโดในพัทยา =====
  {
    slug: 'hidden-costs-buying-condo-pattaya',
    title: 'ค่าใช้จ่ายแฝงที่ต้องรู้ เมื่อซื้อคอนโดในพัทยา',
    titleEn: 'Hidden Costs of Buying a Condo in Pattaya',
    titleZh: '在芭堤雅买公寓的隐藏费用',
    titleRu: 'Скрытые расходы при покупке квартиры в Паттайе',
    excerpt: 'นอกจากราคาห้อง ยังมีค่าใช้จ่ายที่หลายคนมองข้าม มาดูรายละเอียดกัน',
    excerptEn: 'Beyond the room price, there are costs many buyers overlook. Here\'s the full breakdown.',
    excerptZh: '除了房价之外，还有很多买家忽略的费用。这是完整清单。',
    excerptRu: 'Помимо цены квартиры есть расходы, которые многие забывают. Полный список.',
    content: `หลายคนซื้อคอนโดโดยดูแค่ราคาห้อง แต่จริงๆ มีค่าใช้จ่ายอื่นที่ต้องเตรียม:

**ค่าใช้จ่ายตอนซื้อ**
1. **ค่าโอนกรรมสิทธิ์** — 2% ของราคาประเมิน (ปกติแบ่งจ่าย 50/50)
2. **ภาษีหัก ณ ที่จ่าย** — ตามอัตราก้าวหน้า (ผู้ขายจ่าย)
3. **ภาษีธุรกิจเฉพาะ** — 3.3% (ถ้าผู้ขายถือไม่ถึง 5 ปี)
4. **อากรแสตมป์** — 0.5% (ถ้าไม่ต้องเสียภาษีธุรกิจเฉพาะ)
5. **ค่าทนายความ** — 10,000-30,000 บาท (แนะนำให้จ้าง)

**ค่าใช้จ่ายรายปี**
6. **ค่าส่วนกลาง (Common Area Fee)** — 40-80 บาท/ตร.ม./เดือน
   - ห้อง 35 ตร.ม. = ประมาณ 16,800-33,600 บาท/ปี
7. **ค่าซ่อมบำรุง (Sinking Fund)** — จ่ายครั้งเดียวตอนโอน 500-800 บาท/ตร.ม.
8. **ค่าประกันทรัพย์สิน** — 3,000-5,000 บาท/ปี
9. **ค่ามิเตอร์ไฟฟ้า/น้ำ** — ขึ้นอยู่กับการใช้งาน

**ค่าใช้จ่ายที่ลืมได้ง่าย**
10. **ค่าตกแต่งเฟอร์นิเจอร์** — 50,000-200,000 บาท (ถ้าห้องเปล่า)
11. **ค่า WiFi/อินเทอร์เน็ต** — 600-900 บาท/เดือน
12. **ค่าบริหารจัดการ** (ถ้าปล่อยเช่า) — 10-20% ของค่าเช่า

**สรุป**: เตรียมเงินเผื่อ 10-15% ของราคาห้อง สำหรับค่าใช้จ่ายเพิ่มเติมทั้งหมด [ค้นหาคอนโดในพัทยา](/th/listings)`,
    contentEn: `Many buyers only look at the room price, but there are additional costs to prepare for:

**Costs at Purchase**
1. **Transfer fee** — 2% of appraised value (usually split 50/50)
2. **Withholding tax** — progressive rate (seller pays)
3. **Specific Business Tax** — 3.3% (if seller held less than 5 years)
4. **Stamp duty** — 0.5% (if SBT not applicable)
5. **Lawyer fees** — 10,000-30,000 baht (recommended)

**Annual Costs**
6. **Common Area Fee** — 40-80 baht/sqm/month
   - 35 sqm unit = approx. 16,800-33,600 baht/year
7. **Sinking Fund** — one-time at transfer, 500-800 baht/sqm
8. **Property insurance** — 3,000-5,000 baht/year
9. **Utilities** — depends on usage

**Easily Forgotten Costs**
10. **Furniture** — 50,000-200,000 baht (if unfurnished)
11. **WiFi/Internet** — 600-900 baht/month
12. **Management fees** (if renting out) — 10-20% of rental income

**Bottom line**: Budget an extra 10-15% on top of the room price. [Search Pattaya condos](/en/listings).`,
    contentZh: `很多买家只看房价，但还有额外费用需要准备：

**购买时的费用**
1. **过户费** — 评估价的2%（通常买卖双方各付一半）
2. **预扣税** — 累进税率（卖方支付）
3. **特殊营业税** — 3.3%（如卖方持有不足5年）
4. **印花税** — 0.5%（如不适用特殊营业税）
5. **律师费** — 1万-3万泰铢（建议聘请）

**年度费用**
6. **公共区域维护费** — 40-80泰铢/平方米/月
   - 35平方米 = 约16,800-33,600泰铢/年
7. **维修基金** — 过户时一次性支付 500-800泰铢/平方米
8. **财产保险** — 3,000-5,000泰铢/年
9. **水电费** — 视使用情况而定

**容易忘记的费用**
10. **家具** — 5万-20万泰铢（如果是空房）
11. **WiFi/网络** — 600-900泰铢/月
12. **物业管理费**（如果出租） — 租金的10-20%

**总结**：在房价基础上额外准备10-15%的预算。[搜索芭堤雅公寓](/zh/listings)。`,
    contentRu: `Многие покупатели смотрят только на цену квартиры, но есть дополнительные расходы:

**Расходы при покупке**
1. **Регистрационный сбор** — 2% от оценки (обычно 50/50)
2. **Подоходный налог** — прогрессивная ставка (платит продавец)
3. **Налог на бизнес** — 3,3% (если продавец владел менее 5 лет)
4. **Гербовый сбор** — 0,5%
5. **Услуги юриста** — 10 000-30 000 бат (рекомендуется)

**Ежегодные расходы**
6. **Плата за содержание** — 40-80 бат/кв.м/мес
   - 35 кв.м = ~16 800-33 600 бат/год
7. **Фонд капремонта** — разовый при оформлении 500-800 бат/кв.м
8. **Страховка** — 3 000-5 000 бат/год
9. **Коммунальные** — зависит от потребления

**Легко забываемые расходы**
10. **Мебель** — 50 000-200 000 бат (если без мебели)
11. **Интернет** — 600-900 бат/мес
12. **Управление** (при сдаче) — 10-20% от аренды

**Итог**: Закладывайте дополнительно 10-15% сверх цены. [Ищите квартиры](/ru/listings).`,
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop&q=80',
    category: 'legal',
    tags: '["costs","hidden","condo","fees","pattaya"]',
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },

  // ===== 10. ฝากขาย-ฝากเช่ายังไงให้ปิดดีลเร็ว =====
  {
    slug: 'tips-sell-rent-property-faster-pattaya',
    title: 'ฝากขาย-ฝากเช่ายังไงให้ปิดดีลเร็ว',
    titleEn: 'How to Sell or Rent Your Pattaya Property Faster',
    titleZh: '如何更快出售或出租您的芭堤雅房产',
    titleRu: 'Как быстрее продать или сдать недвижимость в Паттайе',
    excerpt: 'เคล็ดลับฝากขายฝากเช่าอสังหาให้ปิดดีลเร็ว ตั้งแต่ถ่ายรูป ตั้งราคา จนถึงเลือกช่องทาง',
    excerptEn: 'Tips for selling or renting your property faster — from photos to pricing to choosing the right channels.',
    excerptZh: '更快出售或出租房产的技巧 — 从拍照到定价到选择渠道。',
    excerptRu: 'Советы по быстрой продаже или сдаче — от фото до цен и каналов.',
    content: `อยากปิดดีลเร็ว? ทำตามเคล็ดลับเหล่านี้:

**1. รูปถ่ายคุณภาพสูง**
- ถ่ายในเวลากลางวัน แสงธรรมชาติ
- จัดห้องให้เรียบร้อย เก็บของรก
- ถ่ายอย่างน้อย 10-15 รูป (ห้องนอน ห้องนั่งเล่น ห้องน้ำ วิว ส่วนกลาง)
- ถ้ามีวิวทะเล ต้องมีรูปวิวทะเลอย่างแน่นอน

**2. ตั้งราคาให้สมเหตุสมผล**
- เปรียบเทียบกับห้องใกล้เคียงในตึกเดียวกัน
- ราคาสูงเกิน = ไม่มีคนสนใจ
- เผื่อช่องต่อรอง 5-10%

**3. เขียนรายละเอียดให้ครบ**
- ระบุขนาด ชั้น วิว เฟอร์นิเจอร์ สิ่งอำนวยความสะดวก
- เน้นจุดเด่น (ใกล้ทะเล ใกล้ห้าง เพิ่งรีโนเวท ฯลฯ)
- เขียนหลายภาษาเพื่อเข้าถึงต่างชาติ

**4. เลือกช่องทางที่ใช่**
- ลงในแพลตฟอร์มอสังหาเช่น Pattaya Estate Hub
- โพสต์ในกลุ่ม Facebook ท้องถิ่น
- ใช้นายหน้าที่มีเครือข่ายลูกค้าต่างชาติ

**5. ตอบกลับรวดเร็ว**
- ลูกค้าสนใจวันนี้ แต่ถ้าตอบช้า พรุ่งนี้ไปดูที่อื่นแล้ว
- ตอบภายใน 1-2 ชั่วโมง

**6. เตรียมเอกสารพร้อม**
- โฉนด ทะเบียนบ้าน สัญญาซื้อขาย
- ใบเสร็จค่าส่วนกลางปัจจุบัน

พร้อมฝากขาย-ฝากเช่า? [ลงประกาศกับเรา](/th/list-your-property) หรือ [ติดต่อทีมงาน](/th/contact)`,
    contentEn: `Want to close deals faster? Follow these tips:

**1. High-Quality Photos**
- Shoot in daylight with natural lighting
- Tidy up and declutter the space
- Take at least 10-15 photos (bedroom, living room, bathroom, view, facilities)
- If there's a sea view, make sure to showcase it

**2. Price It Right**
- Compare with similar units in the same building
- Overpriced = no interest
- Allow 5-10% negotiation room

**3. Write Complete Descriptions**
- Specify size, floor, view, furniture, amenities
- Highlight key features (near beach, near mall, newly renovated)
- Write in multiple languages to reach foreigners

**4. Choose the Right Channels**
- List on property platforms like Pattaya Estate Hub
- Post in local Facebook groups
- Use agents with foreign buyer networks

**5. Respond Quickly**
- Buyers interested today will look elsewhere if you're slow
- Respond within 1-2 hours

**6. Have Documents Ready**
- Title deed, house registration, sale contract
- Current common area fee receipts

Ready to list? [Post your property](/en/list-your-property) or [contact our team](/en/contact).`,
    contentZh: `想更快成交？按照以下技巧：

**1. 高质量照片**
- 白天自然光拍摄
- 整理房间，清除杂物
- 至少拍10-15张（卧室、客厅、卫生间、景观、公共设施）
- 有海景一定要展示

**2. 合理定价**
- 与同楼栋类似房源比价
- 定价过高 = 无人问津
- 留5-10%议价空间

**3. 完整的描述**
- 注明面积、楼层、景观、家具、设施
- 突出卖点（近海、近商场、新装修）
- 多语言描述以吸引外国买家

**4. 选择正确的渠道**
- 在Pattaya Estate Hub等平台挂牌
- 在本地Facebook群组发布
- 利用有外国客户网络的经纪人

**5. 快速回复**
- 今天感兴趣的买家，如果回复慢明天就去看别的了
- 1-2小时内回复

**6. 准备好文件**
- 产权证、户口本、买卖合同
- 当前公共维护费收据

准备好了？[发布房产](/zh/list-your-property) 或 [联系我们](/zh/contact)。`,
    contentRu: `Хотите закрыть сделку быстрее? Следуйте этим советам:

**1. Качественные фотографии**
- Снимайте днём при естественном освещении
- Уберите беспорядок
- Сделайте минимум 10-15 фото (спальня, гостиная, ванная, вид, инфраструктура)
- Вид на море — обязательно покажите

**2. Правильная цена**
- Сравните с аналогичными квартирами в здании
- Завышенная цена = нет интереса
- Оставьте 5-10% на торг

**3. Полное описание**
- Укажите площадь, этаж, вид, мебель, удобства
- Выделите ключевые преимущества
- Пишите на нескольких языках

**4. Правильные каналы**
- Размещайте на платформах вроде Pattaya Estate Hub
- Публикуйте в местных Facebook-группах
- Используйте агентов с иностранной клиентской базой

**5. Быстрые ответы**
- Покупатель, заинтересованный сегодня, завтра уже смотрит другие варианты
- Отвечайте в течение 1-2 часов

**6. Документы наготове**
- Свидетельство о праве, договор купли-продажи
- Текущие квитанции за обслуживание

Готовы? [Разместите объявление](/ru/list-your-property) или [свяжитесь с нами](/ru/contact).`,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=630&fit=crop&q=80',
    category: 'tips',
    tags: '["selling","renting","tips","faster","listing"]',
    status: 'published',
    createdAt: now,
    updatedAt: now,
  },
]
