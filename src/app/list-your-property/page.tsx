'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FilePlus, CheckCircle, Home, MapPin, ImagePlus, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { propertyTypeLabels } from '@/data/properties'
import type { ListingType, PropertyType } from '@/types/property'

const listingTypes: { value: ListingType; label: string }[] = [
  { value: 'sale', label: 'ขาย' },
  { value: 'rent', label: 'เช่า' },
]

const propertyTypes = Object.entries(propertyTypeLabels).map(([value, label]) => ({
  value: value as PropertyType,
  label,
}))

const MAX_IMAGES = 10
const MAX_SIZE_MB = 2

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const LIST_PAGE = '/list-your-property'

export default function ListYourPropertyPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [authChecked, setAuthChecked] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    listingType: 'sale' as ListingType,
    propertyType: 'condo' as PropertyType,
    title: '',
    description: '',
    price: '',
    priceLabel: '',
    location: '',
    mapUrl: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    features: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  })

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(LIST_PAGE)}`)
      return
    }
    setAuthChecked(true)
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    setForm((prev) => ({
      ...prev,
      contactName: prev.contactName || user.name || '',
      contactPhone: prev.contactPhone || user.phone || '',
      contactEmail: prev.contactEmail || user.email || '',
    }))
  }, [user])

  if (!authChecked || authLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center text-stone-500">
        กำลังโหลด...
      </div>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const valid = files.filter((f) => f.type.startsWith('image/') && f.size <= MAX_SIZE_MB * 1024 * 1024)
    const combined = [...imageFiles, ...valid].slice(0, MAX_IMAGES)
    setImageFiles(combined)
    Promise.all(combined.map((f) => readFileAsDataUrl(f))).then(setImagePreview)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (index: number) => {
    const nextFiles = imageFiles.filter((_, i) => i !== index)
    const nextPreview = imagePreview.filter((_, i) => i !== index)
    setImageFiles(nextFiles)
    setImagePreview(nextPreview)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let imageUrls: string[] = []
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const fd = new FormData()
          fd.append('file', file, file.name || 'image.jpg')
          const res = await fetch('/api/upload', {
            method: 'POST',
            credentials: 'include',
            body: fd,
          })
          const data = await res.json()
          if (!res.ok || !data.url) {
            alert(data.error || 'อัปโหลดรูปไม่สำเร็จ')
            setLoading(false)
            return
          }
          imageUrls.push(data.url)
        }
      }
      if (imageUrls.length === 0) {
        imageUrls = ['https://placehold.co/800x600/f4f1de/1c1917?text=ไม่มีรูป']
      }
      const features = form.features
        ? form.features.split(',').map((s) => s.trim()).filter(Boolean)
        : []
      const payload = {
        title: form.title,
        listingType: form.listingType,
        propertyType: form.propertyType,
        price: Number(form.price),
        priceLabel: form.priceLabel || (form.listingType === 'rent' ? 'ต่อเดือน' : undefined),
        location: form.location,
        mapUrl: form.mapUrl?.trim() || undefined,
        area: Number(form.area),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        images: imageUrls,
        description: form.description,
        features,
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
      }
      const res = await fetch('/api/owner-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'บันทึกรายการไม่สำเร็จ')
        setLoading(false)
        return
      }
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  const update = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-10">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-display text-2xl text-stone-900">ส่งข้อมูลสำเร็จ</h1>
          <p className="mt-3 text-stone-600">
            เราได้รับข้อมูลฝากขาย/เช่าของคุณแล้ว รายการของคุณจะโผล่ในหน้าค้นหาทรัพย์ทันที
          </p>
          <p className="mt-1 text-sm text-stone-500">
            เราจะติดต่อกลับภายใน 24 ชั่วโมงเพื่อคุยรายละเอียดเพิ่มเติม
          </p>
          <p className="mt-2 text-sm text-stone-500">
            หากมีคำถาม โทรหรือไลน์เราได้ที่หมายเลขด้านล่างของเว็บ
          </p>
          <Link
            href="/listings"
            className="inline-block mt-6 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
          >
            ดูรายการทั้งหมด
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-stone-900 flex items-center gap-3">
          <FilePlus className="w-9 h-9 text-primary-600" />
          ฝากขาย / ฝากเช่ากับเรา
        </h1>
        <p className="mt-2 text-stone-600">
          มีทรัพย์อยู่พัทยาที่ต้องการขายหรือให้เช่า? กรอกข้อมูลด้านล่างส่งมาได้เลย เราจะติดต่อกลับและช่วยลงประกาศ หาลูกค้าให้
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">
          <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5" />
            ประเภทประกาศและอสังหา
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                ประเภทประกาศ *
              </label>
              <div className="flex rounded-lg border border-stone-300 overflow-hidden">
                {listingTypes.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update('listingType', opt.value)}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium transition ${
                      form.listingType === opt.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                ประเภทอสังหา *
              </label>
              <select
                required
                value={form.propertyType}
                onChange={(e) => update('propertyType', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {propertyTypes.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">
          <h2 className="font-semibold text-stone-900 mb-4">รูปภาพ (ถ้ามี)</h2>
          <p className="text-sm text-stone-500 mb-3">
            อัปโหลดได้สูงสุด {MAX_IMAGES} รูป รูปละไม่เกิน {MAX_SIZE_MB} MB
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            {imagePreview.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`รูป ${i + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border border-stone-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100"
                  aria-label="ลบรูป"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {imageFiles.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-400 hover:border-primary-400 hover:text-primary-500 transition"
              >
                <ImagePlus className="w-8 h-8" />
                <span className="text-xs mt-1">เพิ่มรูป</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </section>

        <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">
          <h2 className="font-semibold text-stone-900 mb-4">ข้อมูลประกาศ</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                หัวข้อประกาศ *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น คอนโดวิวทะเล พัทยาเหนือ 2 ห้องนอน"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                รายละเอียด *
              </label>
              <textarea
                required
                rows={4}
                placeholder="อธิบายจุดเด่น สภาพพื้นที่ สิ่งอำนวยความสะดวก..."
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  ราคา (บาท) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="เช่น 8500000"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              {form.listingType === 'rent' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    หน่วยราคา (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ต่อเดือน, ต่อปี"
                    value={form.priceLabel}
                    onChange={(e) => update('priceLabel', e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">
          <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            ที่ตั้งและขนาด
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                พื้นที่ / โซน *
              </label>
              <input
                type="text"
                required
                placeholder="เช่น พัทยาเหนือ, จอมเทียน"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                ลิงก์ Google Map (ไม่บังคับ)
              </label>
              <input
                type="url"
                placeholder="วางลิงก์ที่คัดลอกจาก Google Maps"
                value={form.mapUrl}
                onChange={(e) => update('mapUrl', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <p className="text-xs text-stone-500 mt-1">
                เปิด Google Maps แล้วกดแชร์ → คัดลอกลิงก์ มาวางที่นี่
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                พื้นที่ (ตร.ม.) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="65"
                value={form.area}
                onChange={(e) => update('area', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                ห้องนอน
              </label>
              <input
                type="number"
                min="0"
                placeholder="-"
                value={form.bedrooms}
                onChange={(e) => update('bedrooms', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                ห้องน้ำ
              </label>
              <input
                type="number"
                min="0"
                placeholder="-"
                value={form.bathrooms}
                onChange={(e) => update('bathrooms', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              จุดเด่น (คั่นด้วย comma)
            </label>
            <input
              type="text"
              placeholder="เช่น วิวทะเล, ฟิตเนส, สระว่ายน้ำ"
              value={form.features}
              onChange={(e) => update('features', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">
          <h2 className="font-semibold text-stone-900 mb-4">ข้อมูลติดต่อ</h2>
          <p className="text-sm text-stone-500 mb-4">
            ข้อมูลนี้จะแสดงในประกาศให้ผู้สนใจติดต่อคุณได้
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                ชื่อผู้ติดต่อ *
              </label>
              <input
                type="text"
                required
                placeholder="ชื่อ-นามสกุล หรือชื่อบริษัท"
                value={form.contactName}
                onChange={(e) => update('contactName', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                เบอร์โทร *
              </label>
              <input
                type="tel"
                required
                placeholder="081-234-5678"
                value={form.contactPhone}
                onChange={(e) => update('contactPhone', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                อีเมล *
              </label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={form.contactEmail}
                onChange={(e) => update('contactEmail', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60 transition"
          >
            {loading ? 'กำลังส่ง...' : 'ส่งข้อมูลฝากขาย/เช่า'}
          </button>
        </div>
      </form>
    </div>
  )
}
