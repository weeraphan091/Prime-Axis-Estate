import { NextResponse } from 'next/server'
import { hasAdminSession } from '@/lib/admin-auth'

const HTTPS_ONLY = /^https:\/\//i

function addImage(images: string[], url: string): void {
  if (!url || !HTTPS_ONLY.test(url)) return
  if (images.indexOf(url) === -1) images.push(url)
}

/** ลองดึงรูปจาก Facebook oEmbed (ได้บ้างในบางประเภทโพส) */
async function tryFacebookOEmbed(url: string): Promise<string[]> {
  const images: string[] = []
  try {
    const oembedUrl = `https://www.facebook.com/plugins/post/oembed.json?url=${encodeURIComponent(url)}`
    const res = await fetch(oembedUrl, {
      method: 'GET',
      headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0 (compatible; bot)' },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) return []
    const data = (await res.json()) as Record<string, unknown>
    const thumb = data?.thumbnail_url ?? data?.image
    if (typeof thumb === 'string') addImage(images, thumb)
  } catch {
    // ignore
  }
  return images
}

/** รวบรวม URL รูปจาก HTML: og:image, twitter:image, และ meta ที่เกี่ยวกับ image ทั้งหมด */
function collectImagesFromHtml(html: string): string[] {
  const images: string[] = []

  // og:image
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
  if (ogImage?.[1]) addImage(images, ogImage[1])
  const ogImageAlt = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
  if (ogImageAlt?.[1]) addImage(images, ogImageAlt[1])

  // og:image:url, og:image:secure_url
  const ogImageUrlRe = /<meta[^>]+property=["']og:image(?::url|:secure_url)?["'][^>]+content=["']([^"']+)["']/gi
  let m: RegExpExecArray | null
  while ((m = ogImageUrlRe.exec(html)) !== null) {
    if (m[1]) addImage(images, m[1])
  }
  const ogSecure = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image:secure_url["']/i)
  if (ogSecure?.[1]) addImage(images, ogSecure[1])

  // twitter:image (บางไซต์มีหลายรูป)
  const twRe = /<meta[^>]+(?:name|property)=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/gi
  while ((m = twRe.exec(html)) !== null) {
    if (m[1]) addImage(images, m[1])
  }
  const twAltRe = /<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']twitter:image/gi
  while ((m = twAltRe.exec(html)) !== null) {
    if (m[1]) addImage(images, m[1])
  }

  // meta ใดก็ได้ที่ property/name มี "image" และ content เป็น URL
  const anyImageRe = /<meta[^>]+(?:property|name)=["'][^"']*image[^"']*["'][^>]+content=["'](https:[^"']+)["']/gi
  while ((m = anyImageRe.exec(html)) !== null) {
    if (m[1]) addImage(images, m[1])
  }
  const anyImageAltRe = /<meta[^>]+content=["'](https:[^"']+)["'][^>]+(?:property|name)=["'][^"']*image[^"']*["']/gi
  while ((m = anyImageAltRe.exec(html)) !== null) {
    if (m[1]) addImage(images, m[1])
  }

  return images
}

/**
 * ดึง Open Graph image(s) จาก URL (เช่น ลิงก์โพส Facebook)
 * เว็บทั่วไป: ดึงได้หลายรูปจาก og:image, twitter:image และ meta ที่เกี่ยวกับ image
 * Facebook: ลอง oEmbed ก่อน; ถ้าไม่ได้ต้องเซฟรูปจากโพสเอง (Facebook จำกัดการเข้าถึงจากเซิร์ฟเวอร์)
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
    let images: string[] = []

    if (isFacebook) {
      images = await tryFacebookOEmbed(url)
      if (images.length > 0) {
        return NextResponse.json({ images })
      }
    }

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
          ? ' — Facebook จำกัดการเข้าถึงจากเซิร์ฟเวอร์ กรุณาเซฟรูปจากโพสมาอัปโหลดในหน้าลิสต์'
          : ''
      return NextResponse.json(
        { error: `ดึงหน้าไม่สำเร็จ (${res.status})${hint}`, images: [] },
        { status: 200 }
      )
    }

    const html = await res.text()
    images = collectImagesFromHtml(html)

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
