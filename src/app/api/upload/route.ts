import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getSupabaseServer, STORAGE_BUCKET } from '@/lib/supabase-server'
import { randomBytes } from 'crypto'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })
  }
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file || !file.size) {
      return NextResponse.json({ error: 'ไม่มีไฟล์' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'รูปใหญ่เกิน 2MB' }, { status: 400 })
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'รองรับเฉพาะรูปภาพ (JPG, PNG, WebP, GIF)' }, { status: 400 })
    }

    const supabase = getSupabaseServer()
    if (supabase) {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const name = `${randomBytes(12).toString('hex')}.${ext}`
      const bytes = await file.arrayBuffer()
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(name, bytes, {
          contentType: file.type,
          upsert: false,
        })
      if (error) {
        console.error('[Upload] Supabase Storage:', error)
        return NextResponse.json({ error: 'อัปโหลดไม่สำเร็จ: ' + (error.message || 'Storage error') }, { status: 500 })
      }
      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path)
      return NextResponse.json({ url: urlData.publicUrl })
    }

    return NextResponse.json(
      { error: 'ยังไม่ได้ตั้งค่า Supabase Storage (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY และสร้าง bucket property-images)' },
      { status: 503 }
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'อัปโหลดไม่สำเร็จ' }, { status: 500 })
  }
}
