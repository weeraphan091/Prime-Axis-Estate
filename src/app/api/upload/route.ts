import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
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
    await mkdir(UPLOAD_DIR, { recursive: true })
    const ext = path.extname(file.name) || '.jpg'
    const name = randomBytes(12).toString('hex') + ext
    const filePath = path.join(UPLOAD_DIR, name)
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))
    const url = `/uploads/${name}`
    return NextResponse.json({ url })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'อัปโหลดไม่สำเร็จ' }, { status: 500 })
  }
}
