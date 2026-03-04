'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ImagePlus, X } from 'lucide-react'
import { propertyTypeLabels } from '@/data/properties'
import type { Property } from '@/types/property'

type Agent = { id: string; name: string; phone: string; email: string; lineId: string | null; isActive: boolean }

const listingTypes = [
  { value: 'sale', label: 'ขาย' },
  { value: 'rent', label: 'เช่า' },
]
const propertyTypes = Object.entries(propertyTypeLabels).map(([value, label]) => ({ value, label }))

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

type Props = {
  initial?: Property | null
}

export function AdminListingForm({ initial }: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string[]>(initial?.images ?? [])
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    listingType: (initial?.listingType ?? 'sale') as 'sale' | 'rent',
    propertyType: (initial?.propertyType ?? 'condo') as Property['propertyType'],
    price: initial?.price ?? 0,
    priceLabel: initial?.priceLabel ?? '',
    location: initial?.location ?? '',
    mapUrl: initial?.mapUrl ?? '',
    area: initial?.area ?? 0,
    bedrooms: initial?.bedrooms ?? '',
    bathrooms: initial?.bathrooms ?? '',
    description: initial?.description ?? '',
    features: (initial?.features ?? []).join(', '),
    contactName: initial?.contactName ?? '',
    contactPhone: initial?.contactPhone ?? '',
    contactEmail: initial?.contactEmail ?? '',
    contactLine: initial?.contactLine ?? '',
    contactWhatsapp: initial?.contactWhatsapp ?? '',
    isFeatured: initial?.isFeatured ?? false,
    isOwnerListing: initial?.isOwnerListing ?? false,
    status: initial?.status ?? 'published',
    agentId: initial?.agentId ?? '',
    rentOccupied: initial?.rentOccupied ?? false,
    rentLeaseStart: initial?.rentLeaseStart ?? '',
    rentLeaseEnd: initial?.rentLeaseEnd ?? '',
    floor: initial?.floor ?? '',
    roomNumber: initial?.roomNumber ?? '',
    floors: initial?.floors ?? '',
  })
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    fetch('/api/agents')
      .then((r) => r.ok ? r.json() : [])
      .then(setAgents)
      .catch(() => setAgents([]))
  }, [])

  const update = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const valid = files.filter((f) => f.type.startsWith('image/') && f.size <= MAX_SIZE_MB * 1024 * 1024)
    const toAdd = valid.slice(0, MAX_IMAGES - imagePreview.length)
    if (toAdd.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    Promise.all(toAdd.map((f) => readFileAsDataUrl(f))).then((urls) => {
      setImagePreview((prev) => [...prev, ...urls].slice(0, MAX_IMAGES))
      if (fileInputRef.current) fileInputRef.current.value = ''
    })
  }

  const removeImage = (index: number) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const imageUrls = imagePreview.length > 0
        ? imagePreview
        : ['https://placehold.co/800x600/f4f1de/1c1917?text=ไม่มีรูป']
      const payload = {
        title: form.title,
        listingType: form.listingType,
        propertyType: form.propertyType,
        price: Number(form.price),
        priceLabel: form.priceLabel || (form.listingType === 'rent' ? 'ต่อเดือน' : undefined),
        location: form.location,
        mapUrl: form.mapUrl || undefined,
        area: Number(form.area),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        images: imageUrls,
        description: form.description,
        features: form.features.split(',').map((s) => s.trim()).filter(Boolean),
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        contactLine: form.contactLine || undefined,
        contactWhatsapp: form.contactWhatsapp || undefined,
        isFeatured: form.isFeatured,
        isOwnerListing: form.isOwnerListing,
        status: form.status || 'published',
        agentId: form.agentId || undefined,
        rentOccupied: form.listingType === 'rent' ? form.rentOccupied : false,
        rentLeaseStart: form.listingType === 'rent' && form.rentLeaseStart ? form.rentLeaseStart : undefined,
        rentLeaseEnd: form.listingType === 'rent' && form.rentLeaseEnd ? form.rentLeaseEnd : undefined,
        floor: (form.propertyType === 'condo' || form.propertyType === 'apartment') && form.floor !== '' ? Number(form.floor) : undefined,
        roomNumber: (form.propertyType === 'condo' || form.propertyType === 'apartment') && form.roomNumber ? form.roomNumber : undefined,
        floors: (form.propertyType === 'house' || form.propertyType === 'villa') && form.floors !== '' ? Number(form.floors) : undefined,
        createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
      }
      const url = initial ? `/api/properties/${initial.id}` : '/api/properties'
      const method = initial ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'บันทึกไม่สำเร็จ')
        return
      }
      router.push('/admin/listings')
      router.refresh()
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-900">ข้อมูลประกาศ</h2>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">หัวข้อ *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">ประเภทประกาศ</label>
            <select
              value={form.listingType}
              onChange={(e) => update('listingType', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {listingTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">ประเภทอสังหา</label>
            <select
              value={form.propertyType}
              onChange={(e) => update('propertyType', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {propertyTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">ราคา *</label>
            <input
              type="number"
              required
              min="0"
              value={form.price || ''}
              onChange={(e) => update('price', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">หน่วยราคา (เช่น ต่อเดือน)</label>
            <input
              type="text"
              value={form.priceLabel}
              onChange={(e) => update('priceLabel', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">รายละเอียด *</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-y"
          />
        </div>
        {form.listingType === 'rent' && (
          <div className="border-t border-stone-200 pt-4 mt-4 space-y-4">
            <h3 className="font-medium text-stone-800">ข้อมูลสัญญาเช่า (ลูกค้าวางแผนหาห้องล่วงหน้า)</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.rentOccupied}
                onChange={(e) => update('rentOccupied', e.target.checked)}
                className="rounded border-stone-300"
              />
              <span className="text-sm">เช่าอยู่แล้ว — ระบุระยะสัญญาด้านล่าง</span>
            </label>
            {(form.rentOccupied || form.rentLeaseStart || form.rentLeaseEnd) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">วันที่เริ่มสัญญา</label>
                  <input
                    type="date"
                    value={form.rentLeaseStart}
                    onChange={(e) => update('rentLeaseStart', e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">วันที่สิ้นสุดสัญญา</label>
                  <input
                    type="date"
                    value={form.rentLeaseEnd}
                    onChange={(e) => update('rentLeaseEnd', e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <h2 className="font-semibold text-stone-900">ที่ตั้งและขนาด</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">พื้นที่/โซน *</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">ลิงก์ Google Map</label>
            <input
              type="url"
              value={form.mapUrl}
              onChange={(e) => update('mapUrl', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">พื้นที่ (ตร.ม.) *</label>
            <input
              type="number"
              required
              min="1"
              value={form.area || ''}
              onChange={(e) => update('area', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">ห้องนอน</label>
            <input
              type="number"
              min="0"
              value={form.bedrooms}
              onChange={(e) => update('bedrooms', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">ห้องน้ำ</label>
            <input
              type="number"
              min="0"
              value={form.bathrooms}
              onChange={(e) => update('bathrooms', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            />
          </div>
        </div>
        {(form.propertyType === 'condo' || form.propertyType === 'apartment') && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">ชั้น (แสดงต่อลูกค้า + ส่งใน Bot)</label>
              <input
                type="number"
                min="0"
                value={form.floor}
                onChange={(e) => update('floor', e.target.value)}
                placeholder="เช่น 5"
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">เลขห้อง</label>
              <input
                type="text"
                value={form.roomNumber}
                onChange={(e) => update('roomNumber', e.target.value)}
                placeholder="เช่น 301, A-502"
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
              />
            </div>
          </div>
        )}
        {(form.propertyType === 'house' || form.propertyType === 'villa') && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">จำนวนชั้นของบ้าน (แสดงต่อลูกค้า + ส่งใน Bot)</label>
            <select
              value={form.floors}
              onChange={(e) => update('floors', e.target.value)}
              className="w-full max-w-xs px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            >
              <option value="">— เลือก —</option>
              <option value="1">1 ชั้น</option>
              <option value="2">2 ชั้น</option>
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">จุดเด่น (คั่นด้วย comma)</label>
          <input
            type="text"
            value={form.features}
            onChange={(e) => update('features', e.target.value)}
            placeholder="วิวทะเล, ฟิตเนส, สระว่ายน้ำ"
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium text-stone-700 mb-2">รูปภาพ</h3>
          <p className="text-xs text-stone-500 mb-3">
            อัปโหลดได้สูงสุด {MAX_IMAGES} รูป รูปละไม่เกิน {MAX_SIZE_MB} MB
          </p>
          <div className="flex flex-wrap gap-3">
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
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 shadow"
                  aria-label="ลบรูป"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {imagePreview.length < MAX_IMAGES && (
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
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-stone-900">ข้อมูลช่องทางติดต่อเจ้าของทรัพย์</h2>
          <p className="text-sm text-stone-500 mt-1">
            บันทึกข้อมูลติดต่อเจ้าของทรัพย์ไว้ใช้ติดต่อภายใน — ลูกค้าที่สนใจจะติดต่อผ่านช่องทางของเรา (ตั้งค่าใน ตั้งค่าเว็บ)
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">ชื่อเจ้าของ/ผู้ติดต่อ *</label>
            <input
              type="text"
              required
              value={form.contactName}
              onChange={(e) => update('contactName', e.target.value)}
              placeholder="ชื่อ-นามสกุล หรือชื่อบริษัท"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">เบอร์โทร *</label>
            <input
              type="tel"
              required
              value={form.contactPhone}
              onChange={(e) => update('contactPhone', e.target.value)}
              placeholder="081-234-5678"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-1">อีเมล *</label>
            <input
              type="email"
              required
              value={form.contactEmail}
              onChange={(e) => update('contactEmail', e.target.value)}
              placeholder="owner@example.com"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Line ID เจ้าของ (ไม่บังคับ)</label>
            <input
              type="text"
              value={form.contactLine}
              onChange={(e) => update('contactLine', e.target.value)}
              placeholder="@username หรือเบอร์โทรที่ใช้กับ Line"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">WhatsApp เจ้าของ (ไม่บังคับ)</label>
            <input
              type="text"
              value={form.contactWhatsapp}
              onChange={(e) => update('contactWhatsapp', e.target.value)}
              placeholder="66812345678 (ใส่เบอร์พร้อม country code)"
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">สถานะรายการ</label>
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            >
              <option value="draft">แบบร่าง (ไม่โชว์ในเว็บ)</option>
              <option value="published">เผยแพร่</option>
              <option value="sold_rented">ขายแล้ว/เช่าแล้ว</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">พนักงานรับผิดชอบ</label>
            <select
              value={form.agentId}
              onChange={(e) => update('agentId', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
            >
              <option value="">— ไม่ระบุ —</option>
              {agents.filter((a) => a.isActive).map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => update('isFeatured', e.target.checked)}
              className="rounded border-stone-300"
            />
            <span className="text-sm">แนะนำในหน้าแรก</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isOwnerListing}
              onChange={(e) => update('isOwnerListing', e.target.checked)}
              className="rounded border-stone-300"
            />
            <span className="text-sm">ฝากกับเรา</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? 'กำลังบันทึก...' : initial ? 'บันทึกการแก้ไข' : 'ลงลิส'}
        </button>
        <Link
          href="/admin/listings"
          className="px-6 py-2.5 border border-stone-300 rounded-lg font-medium text-stone-700 hover:bg-stone-50"
        >
          ยกเลิก
        </Link>
      </div>
    </form>
  )
}
