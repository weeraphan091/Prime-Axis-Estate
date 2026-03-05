'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { parseListingText, type ParsedListing } from '@/lib/parse-listing-text'
import { ClipboardPaste, Sparkles, ArrowRight, RotateCcw, Facebook, Link as LinkIcon, ImagePlus, Loader2 } from 'lucide-react'

const IMPORT_IMAGES_KEY = 'importImageUrls'

const TYPE_LABELS: Record<string, string> = {
  condo: 'คอนโด',
  house: 'บ้าน',
  villa: 'วิลล่า',
  apartment: 'อพาร์ตเมนต์',
  land: 'ที่ดิน',
  commercial: 'อาคารพาณิชย์',
}

export default function AdminImportPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [postUrl, setPostUrl] = useState('')
  const [fetchedImages, setFetchedImages] = useState<string[]>([])
  const [fetchImageLoading, setFetchImageLoading] = useState(false)
  const [fetchImageError, setFetchImageError] = useState('')
  const [parsed, setParsed] = useState<ParsedListing | null>(null)
  const [editing, setEditing] = useState<ParsedListing | null>(null)

  const handleFetchImages = useCallback(async () => {
    const url = postUrl.trim()
    if (!url) {
      setFetchImageError('กรุณาวางลิงก์โพส')
      return
    }
    setFetchImageLoading(true)
    setFetchImageError('')
    try {
      const res = await fetch('/api/import/fetch-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (data.images?.length) {
        setFetchedImages(data.images)
        setFetchImageError('')
      } else {
        setFetchImageError(data.error || 'ดึงรูปไม่ได้ — Facebook อาจจำกัดการเข้าถึง ลองเซฟรูปจากโพสมาอัปโหลดในหน้าลิสต์ได้')
      }
    } catch {
      setFetchImageError('เกิดข้อผิดพลาด ลองใหม่')
    } finally {
      setFetchImageLoading(false)
    }
  }, [postUrl])

  const handleParse = useCallback(() => {
    if (!text.trim()) return
    const result = parseListingText(text)
    setParsed(result)
    setEditing({ ...result })
  }, [text])

  const handleReset = useCallback(() => {
    setText('')
    setPostUrl('')
    setFetchedImages([])
    setFetchImageError('')
    setParsed(null)
    setEditing(null)
  }, [])

  const handleCreateListing = useCallback(() => {
    if (!editing) return
    if (fetchedImages.length > 0) {
      try {
        sessionStorage.setItem(IMPORT_IMAGES_KEY, JSON.stringify(fetchedImages))
      } catch {
        // ignore quota
      }
    }
    const params = new URLSearchParams()
    if (editing.title) params.set('title', editing.title)
    if (editing.listingType) params.set('listingType', editing.listingType)
    if (editing.propertyType) params.set('propertyType', editing.propertyType)
    if (editing.price) params.set('price', String(editing.price))
    if (editing.bedrooms) params.set('bedrooms', String(editing.bedrooms))
    if (editing.bathrooms) params.set('bathrooms', String(editing.bathrooms))
    if (editing.area) params.set('area', String(editing.area))
    if (editing.floor) params.set('floor', String(editing.floor))
    if (editing.location) params.set('location', editing.location)
    if (editing.projectName) params.set('projectName', editing.projectName)
    if (editing.description) params.set('description', editing.description.slice(0, 2000))
    if (editing.features?.length) params.set('features', JSON.stringify(editing.features))
    router.push(`/admin/listings/new?${params.toString()}`)
  }, [editing, fetchedImages, router])

  const update = (key: keyof ParsedListing, value: unknown) => {
    setEditing((prev) => prev ? { ...prev, [key]: value } : prev)
  }

  const inputCls = 'w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm'
  const labelCls = 'block text-xs font-medium text-stone-600 mb-1'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Facebook className="w-6 h-6 text-blue-600" />
        <h1 className="font-display text-2xl text-stone-900">นำเข้าจากโพส Facebook</h1>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 space-y-2">
        <p className="font-semibold">วิธีใช้:</p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>เปิดโพส Facebook ที่มีรายละเอียดทรัพย์</li>
          <li><strong>วางลิงก์โพส</strong> (ถ้ามี) แล้วกด &quot;ดึงรูปจากลิงก์&quot; — ระบบจะดึงรูปหลักจากโพสมาให้</li>
          <li><strong>ก็อปข้อความ</strong>ทั้งหมดจากโพสมาวาง แล้วกด &quot;วิเคราะห์ข้อมูล&quot;</li>
          <li>ตรวจสอบ/แก้ไขข้อมูล แล้วกด &quot;สร้างลิสต์&quot; — รูปที่ดึงได้จะไปโผล่ในฟอร์มลิสต์</li>
        </ol>
      </div>

      {!parsed ? (
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-1">
              <LinkIcon className="inline w-4 h-4 mr-1.5 -mt-0.5" />
              ลิงก์โพส Facebook (ถ้ามี — ใช้ดึงรูป)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={postUrl}
                onChange={(e) => { setPostUrl(e.target.value); setFetchImageError('') }}
                placeholder="https://www.facebook.com/..."
                className={`${inputCls} flex-1`}
              />
              <button
                type="button"
                onClick={handleFetchImages}
                disabled={fetchImageLoading}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                {fetchImageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                {fetchImageLoading ? 'กำลังดึง...' : 'ดึงรูปจากลิงก์'}
              </button>
            </div>
            {fetchImageError && <p className="mt-1 text-sm text-amber-600">{fetchImageError}</p>}
            {fetchedImages.length > 0 && (
              <p className="mt-1 text-sm text-green-600">ดึงรูปได้ {fetchedImages.length} รูป — จะนำไปใส่ในลิสต์เมื่อกดสร้างลิสต์</p>
            )}
          </div>
          <label className="block text-sm font-semibold text-stone-800">
            <ClipboardPaste className="inline w-4 h-4 mr-1.5 -mt-0.5" />
            วางข้อความจากโพส Facebook
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            className={`${inputCls} resize-y`}
            placeholder={`ตัวอย่าง:\nขายคอนโด The Base Central Pattaya ชั้น 15 วิวทะเล\n1 ห้องนอน 1 ห้องน้ำ 35 ตร.ม.\nราคา 2.5 ล้านบาท\nเฟอร์นิเจอร์ครบ พร้อมอยู่\nสระว่ายน้ำ ฟิตเนส ที่จอดรถ\nทำเล: กลางพัทยา`}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleParse}
              disabled={!text.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition"
            >
              <Sparkles className="w-4 h-4" />
              วิเคราะห์ข้อมูล
            </button>
            <Link href="/admin/listings" className="px-5 py-2.5 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50 transition">
              ยกเลิก
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-stone-900">ข้อมูลที่ดึงได้ — ตรวจสอบ/แก้ไข</h2>
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700">
                <RotateCcw className="w-4 h-4" />
                เริ่มใหม่
              </button>
            </div>

            <div>
              <label className={labelCls}>รูปจากลิงก์โพส</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={postUrl}
                  onChange={(e) => { setPostUrl(e.target.value); setFetchImageError('') }}
                  placeholder="วางลิงก์โพส Facebook เพื่อดึงรูป"
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={handleFetchImages}
                  disabled={fetchImageLoading}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  {fetchImageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                  {fetchImageLoading ? 'กำลังดึง...' : 'ดึงรูป'}
                </button>
              </div>
              {fetchImageError && <p className="text-sm text-amber-600 mb-2">{fetchImageError}</p>}
              {fetchedImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {fetchedImages.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-20 h-20 object-cover rounded-lg border border-stone-200" />
                  ))}
                  <span className="text-xs text-stone-500 self-center">รวม {fetchedImages.length} รูป — จะไปโผล่ในฟอร์มลิสต์</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>ชื่อรายการ</label>
                <input value={editing?.title || ''} onChange={(e) => update('title', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>ชื่อโครงการ</label>
                <input value={editing?.projectName || ''} onChange={(e) => update('projectName', e.target.value)} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelCls}>ประเภท</label>
                <select value={editing?.listingType || ''} onChange={(e) => update('listingType', e.target.value)} className={inputCls}>
                  <option value="">-- เลือก --</option>
                  <option value="sale">ขาย</option>
                  <option value="rent">เช่า</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>ประเภททรัพย์</label>
                <select value={editing?.propertyType || ''} onChange={(e) => update('propertyType', e.target.value)} className={inputCls}>
                  <option value="">-- เลือก --</option>
                  {Object.entries(TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>ราคา (฿)</label>
                <input type="number" value={editing?.price || ''} onChange={(e) => update('price', Number(e.target.value))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>พื้นที่ (ตร.ม.)</label>
                <input type="number" value={editing?.area || ''} onChange={(e) => update('area', Number(e.target.value))} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelCls}>ห้องนอน</label>
                <input type="number" value={editing?.bedrooms ?? ''} onChange={(e) => update('bedrooms', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>ห้องน้ำ</label>
                <input type="number" value={editing?.bathrooms ?? ''} onChange={(e) => update('bathrooms', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>ชั้น</label>
                <input type="number" value={editing?.floor ?? ''} onChange={(e) => update('floor', e.target.value ? Number(e.target.value) : undefined)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>ทำเล / โซน</label>
                <input value={editing?.location || ''} onChange={(e) => update('location', e.target.value)} className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>จุดเด่น (แยกด้วย comma)</label>
              <input
                value={editing?.features?.join(', ') || ''}
                onChange={(e) => update('features', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>รายละเอียด</label>
              <textarea
                value={editing?.description || ''}
                onChange={(e) => update('description', e.target.value)}
                rows={6}
                className={`${inputCls} resize-y`}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCreateListing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
              สร้างลิสต์จากข้อมูลนี้
            </button>
            <button type="button" onClick={handleReset} className="px-6 py-3 border border-stone-300 rounded-lg text-stone-600 hover:bg-stone-50 transition">
              เริ่มใหม่
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
