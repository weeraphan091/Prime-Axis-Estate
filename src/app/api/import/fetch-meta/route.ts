import { NextResponse } from 'next/server'
import { hasAdminSession } from '@/lib/admin-auth'

/**
 * ดึง Open Graph image(s) จาก URL (เช่น ลิงก์โพส Facebook)
 * Facebook มักใส่รูปหลักใน og:image — ได้อย่างน้อย 1 รูป
 */
export async function POST(request: Request) {
  const ok = await hasAdminSession()
  if (!ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const url = typeof body?.url === 'string' ? body.url.trim() : ''
    if (!url) {
      return NextResponse.json({ error: 'กรุณาส่ง url' }, { status: 400 })
    }
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      return NextResponse.json({ error: 'URL ต้องขึ้นต้นด้วย https:// หรือ http://' }, { status: 400 })
    }

    const isFacebook = /^https?:\/\/(www\.)?(facebook|fb\.com|fb\.me|m\.facebook)/i.test(url)
    const headers: Record<string, string> = {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Upgrade-Insecure-Requests': '1',
    }
    if (isFacebook) {
      headers['User-Agent'] = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
      headers['Referer'] = 'https://www.facebook.com/'
    } else {
      headers['User-Agent'] =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      try {
        const u = new URL(url)
        headers['Referer'] = `${u.protocol}//${u.host}/`
      } catch {
        // ignore
      }
    }

    const res = await fetch(url, {
      method: 'GET',
      headers,
      redirect: 'follow',
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      const hint =
        res.status === 400 && isFacebook
          ? ' — Facebook อาจจำกัดการเข้าถึงจากเซิร์ฟเวอร์ ลองเซฟรูปจากโพสมาอัปโหลดในหน้าลิสต์'
          : ''
      return NextResponse.json(
        { error: `ดึงหน้าไม่สำเร็จ (${res.status})${hint}`, images: [] },
        { status: 200 }
      )
    }

    const html = await res.text()
    const images: string[] = []

    // og:image (อาจมีหลายอันแบบ og:image:url, og:image:secure_url)
    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    if (ogImage?.[1]) images.push(ogImage[1])

    // บางไซต์ใช้ content ก่อน property
    const ogImageAlt = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    if (ogImageAlt?.[1] && !images.includes(ogImageAlt[1])) images.push(ogImageAlt[1])

    // og:image:url (รูปเพิ่ม) — ใช้ exec แทน matchAll เพื่อไม่ต้องใช้ downlevelIteration
    const ogImageUrlRe = /<meta[^>]+property=["']og:image:url["'][^>]+content=["']([^"']+)["']/gi
    let m: RegExpExecArray | null
    while ((m = ogImageUrlRe.exec(html)) !== null) {
      if (m[1] && !images.includes(m[1])) images.push(m[1])
    }

    // Facebook บางทีมีหลายรูปใน JSON-LD หรือ meta
    const ogImageSecure = html.match(/<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i)
    if (ogImageSecure?.[1] && !images.includes(ogImageSecure[1])) images.push(ogImageSecure[1])

    return NextResponse.json({ images: Array.from(new Set(images)) })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    if (msg.includes('timeout') || msg.includes('abort')) {
      return NextResponse.json({ error: 'หมดเวลา — ลองใหม่หรือวางลิงก์แล้วก็อปข้อความมาวาง', images: [] }, { status: 200 })
    }
    console.error('[import/fetch-meta]', e)
    return NextResponse.json({ error: 'ดึงรูปไม่สำเร็จ', images: [] }, { status: 200 })
  }
}
