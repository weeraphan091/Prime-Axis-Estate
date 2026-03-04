import { NextResponse } from 'next/server'

export type ExchangeRatesResponse = {
  ok: boolean
  date?: string
  rates: { USD: number; CNY: number; RUB: number }
  source?: string
}

/** ค่าเริ่มต้นเมื่อ API ภายนอกใช้ไม่ได้ (1 THB = ? หน่วย) */
const FALLBACK: ExchangeRatesResponse['rates'] = {
  USD: 1 / 36,
  CNY: 1 / 5,
  RUB: 1 / 0.35,
}

/** ดึงอัตราแลกเปลี่ยนรายวันจาก Frankfurter (ฟรี ไม่ต้องใช้ key), cache 24 ชม. */
export async function GET() {
  try {
    const res = await fetch(
      'https://api.frankfurter.app/latest?from=THB&to=USD,CNY,RUB',
      { next: { revalidate: 86400 } } // cache 24 ชั่วโมง
    )
    if (!res.ok) throw new Error('Frankfurter API error')
    const data = await res.json()
    const rates = data.rates || {}
    const result: ExchangeRatesResponse = {
      ok: true,
      date: data.date,
      rates: {
        USD: typeof rates.USD === 'number' ? rates.USD : FALLBACK.USD,
        CNY: typeof rates.CNY === 'number' ? rates.CNY : FALLBACK.CNY,
        RUB: typeof rates.RUB === 'number' ? rates.RUB : FALLBACK.RUB,
      },
      source: 'frankfurter',
    }
    return NextResponse.json(result)
  } catch (e) {
    console.warn('Exchange rates fetch failed, using fallback:', e)
    return NextResponse.json({
      ok: true,
      rates: FALLBACK,
      source: 'fallback',
    } satisfies ExchangeRatesResponse)
  }
}
