'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { FilePlus, CheckCircle, Home, MapPin, ImagePlus, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'
import { propertyTypeLabels } from '@/data/properties'
import type { ListingType, PropertyType } from '@/types/property'

const LISTING_TYPE_VALUES: ListingType[] = ['sale', 'rent']
const PROPERTY_TYPE_KEYS = Object.keys(propertyTypeLabels) as PropertyType[]

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

export default function ListYourPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const locale = (params as { locale?: string })?.locale
  const base = locale ? `/${locale}` : ''
  const LIST_PAGE = base ? `${base}/list-your-property` : '/list-your-property'
  const { user, loading: authLoading } = useAuth()
  const { t } = useLocale()
  const [authChecked, setAuthChecked] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    contentLanguage: 'th' as 'th' | 'en' | 'zh' | 'ru',
    listingType: 'sale' as ListingType,
    propertyType: 'condo' as PropertyType,
    title: '',
    projectName: '',
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
    contactLine: '',
    contactWhatsapp: '',
    floor: '',
    roomNumber: '',
    floors: '',
    rentOccupied: false,
    rentLeaseStart: '',
    rentLeaseEnd: '',
  })

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace(`${base || ''}/login?next=${encodeURIComponent(LIST_PAGE)}`)
      return
    }
    setAuthChecked(true)
  }, [user, authLoading, router, base, LIST_PAGE])

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
        {t('listYourProperty.loading')}
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
        let uploadOk = true
        for (const file of imageFiles) {
          const fd = new FormData()
          fd.append('file', file, file.name || 'image.jpg')
          const res = await fetch('/api/upload', { method: 'POST', credentials: 'include', body: fd })
          const data = await res.json()
          if (res.ok && data.url) {
            imageUrls.push(data.url)
          } else {
            uploadOk = false
            break
          }
        }
        if (!uploadOk) imageUrls = imagePreview
      }
      if (imageUrls.length === 0) {
        imageUrls = imagePreview.length > 0 ? imagePreview : ['https://placehold.co/800x600/f4f1de/1c1917?text=ไม่มีรูป']
      }
      const features = form.features
        ? form.features.split(',').map((s) => s.trim()).filter(Boolean)
        : []
      const payload = {
        contentLanguage: form.contentLanguage,
        title: form.title,
        projectName: form.projectName?.trim() || undefined,
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
        contactLine: form.contactLine?.trim() || undefined,
        contactWhatsapp: form.contactWhatsapp?.trim() || undefined,
        floor: (form.propertyType === 'condo' || form.propertyType === 'apartment') && form.floor !== '' ? Number(form.floor) : undefined,
        roomNumber: (form.propertyType === 'condo' || form.propertyType === 'apartment') && form.roomNumber ? form.roomNumber : undefined,
        floors: (form.propertyType === 'house' || form.propertyType === 'villa') && form.floors !== '' ? Number(form.floors) : undefined,
        rentOccupied: form.listingType === 'rent' ? form.rentOccupied : false,
        rentLeaseStart: form.listingType === 'rent' && form.rentLeaseStart ? form.rentLeaseStart : undefined,
        rentLeaseEnd: form.listingType === 'rent' && form.rentLeaseEnd ? form.rentLeaseEnd : undefined,
      }
      const res = await fetch('/api/owner-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || t('listYourProperty.errorSubmit'))
        setLoading(false)
        return
      }
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert(t('listYourProperty.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  const update = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-10">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="font-display text-2xl text-stone-900">{t('listYourProperty.successTitle')}</h1>
          <p className="mt-3 text-stone-600">
            {t('listYourProperty.successMessage')}
          </p>
          <p className="mt-1 text-sm text-stone-500">
            {t('listYourProperty.successContact')}
          </p>
          <p className="mt-2 text-sm text-stone-500">
            {t('listYourProperty.successQuestions')}
          </p>
          <Link
            href={base ? `${base}/listings` : '/listings'}
            className="inline-block mt-6 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
          >
            {t('listYourProperty.viewListings')}
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
          {t('listYourProperty.title')}
        </h1>
        <p className="mt-2 text-stone-600">
          {t('listYourProperty.intro')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">
          <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5" />
            {t('listYourProperty.sectionType')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {t('listYourProperty.listingTypeLabel')}
              </label>
              <div className="flex rounded-lg border border-stone-300 overflow-hidden">
                {LISTING_TYPE_VALUES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update('listingType', value)}
                    className={`flex-1 px-4 py-2.5 text-sm font-medium transition ${
                      form.listingType === value
                        ? 'bg-primary-600 text-white'
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {t(`listing.${value}`)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {t('listYourProperty.propertyTypeLabel')}
              </label>
              <select
                required
                value={form.propertyType}
                onChange={(e) => update('propertyType', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                {PROPERTY_TYPE_KEYS.map((value) => (
                  <option key={value} value={value}>
                    {t(`listing.${value}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">
          <h2 className="font-semibold text-stone-900 mb-4">{t('listYourProperty.sectionImages')}</h2>
          <p className="text-sm text-stone-500 mb-3">
            {t('listYourProperty.imagesHint')}
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            {imagePreview.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`${t('listYourProperty.addImage')} ${i + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border border-stone-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100"
                  aria-label={t('listYourProperty.removeImage')}
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
                <span className="text-xs mt-1">{t('listYourProperty.addImage')}</span>
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
          <h2 className="font-semibold text-stone-900 mb-4">{t('listYourProperty.sectionListing')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.contentLanguageLabel')}
              </label>
              <p className="text-xs text-stone-500 mb-1.5">
                {t('listYourProperty.contentLanguageHint')}
              </p>
              <select
                value={form.contentLanguage}
                onChange={(e) => setForm((prev) => ({ ...prev, contentLanguage: e.target.value as 'th' | 'en' | 'zh' | 'ru' }))}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="th">ไทย</option>
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="ru">Русский</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.titleLabel')}
              </label>
              <input
                type="text"
                required
                placeholder={t('listYourProperty.titlePlaceholder')}
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.projectNameLabel')}
              </label>
              <input
                type="text"
                placeholder={t('listYourProperty.projectNamePlaceholder')}
                value={form.projectName}
                onChange={(e) => update('projectName', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.descriptionLabel')}
              </label>
              <textarea
                required
                rows={4}
                placeholder={t('listYourProperty.descriptionPlaceholder')}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-y"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  {t('listYourProperty.priceLabel')}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder={t('listYourProperty.pricePlaceholder')}
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
              {form.listingType === 'rent' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    {t('listYourProperty.priceUnitLabel')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('listYourProperty.priceUnitPlaceholder')}
                    value={form.priceLabel}
                    onChange={(e) => update('priceLabel', e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              )}
            </div>
            {form.listingType === 'rent' && (
              <div className="border-t border-stone-200 pt-4 mt-4 space-y-4">
                <h3 className="text-sm font-medium text-stone-800">{t('listYourProperty.rentSectionTitle')}</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.rentOccupied}
                    onChange={(e) => update('rentOccupied', e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  <span className="text-sm">{t('listYourProperty.rentOccupiedLabel')}</span>
                </label>
                {(form.rentOccupied || form.rentLeaseStart || form.rentLeaseEnd) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">{t('listYourProperty.leaseStartLabel')}</label>
                      <input
                        type="date"
                        value={form.rentLeaseStart}
                        onChange={(e) => update('rentLeaseStart', e.target.value)}
                        className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">{t('listYourProperty.leaseEndLabel')}</label>
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
        </section>

        <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">
          <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {t('listYourProperty.sectionLocation')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.locationLabel')}
              </label>
              <input
                type="text"
                required
                placeholder={t('listYourProperty.locationPlaceholder')}
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.mapUrlLabel')}
              </label>
              <input
                type="url"
                placeholder={t('listYourProperty.mapUrlPlaceholder')}
                value={form.mapUrl}
                onChange={(e) => update('mapUrl', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <p className="text-xs text-stone-500 mt-1">
                {t('listYourProperty.mapUrlHint')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.areaLabel')}
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder={t('listYourProperty.areaPlaceholder')}
                value={form.area}
                onChange={(e) => update('area', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.bedroomsLabel')}
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
                {t('listYourProperty.bathroomsLabel')}
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
            {(form.propertyType === 'condo' || form.propertyType === 'apartment') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('listYourProperty.floorLabel')}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder={t('listYourProperty.floorPlaceholder')}
                    value={form.floor}
                    onChange={(e) => update('floor', e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('listYourProperty.roomNumberLabel')}</label>
                  <input
                    type="text"
                    placeholder={t('listYourProperty.roomNumberPlaceholder')}
                    value={form.roomNumber}
                    onChange={(e) => update('roomNumber', e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
                  />
                </div>
              </>
            )}
            {(form.propertyType === 'house' || form.propertyType === 'villa') && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t('listYourProperty.floorsLabel')}</label>
                <select
                  value={form.floors}
                  onChange={(e) => update('floors', e.target.value)}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
                >
                  <option value="">{t('listYourProperty.floorsSelect')}</option>
                  <option value="1">{t('listYourProperty.floors1')}</option>
                  <option value="2">{t('listYourProperty.floors2')}</option>
                </select>
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              {t('listYourProperty.featuresLabel')}
            </label>
            <input
              type="text"
              placeholder={t('listYourProperty.featuresPlaceholder')}
              value={form.features}
              onChange={(e) => update('features', e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 lg:p-8">
          <h2 className="font-semibold text-stone-900 mb-4">{t('listYourProperty.sectionContact')}</h2>
          <p className="text-sm text-stone-500 mb-4">
            {t('listYourProperty.contactIntro')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.contactNameLabel')}
              </label>
              <input
                type="text"
                required
                placeholder={t('listYourProperty.contactNamePlaceholder')}
                value={form.contactName}
                onChange={(e) => update('contactName', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.contactPhoneLabel')}
              </label>
              <input
                type="tel"
                required
                placeholder={t('listYourProperty.contactPhonePlaceholder')}
                value={form.contactPhone}
                onChange={(e) => update('contactPhone', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.contactEmailLabel')}
              </label>
              <input
                type="email"
                required
                placeholder={t('listYourProperty.contactEmailPlaceholder')}
                value={form.contactEmail}
                onChange={(e) => update('contactEmail', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.contactLineLabel')}
              </label>
              <input
                type="text"
                placeholder={t('listYourProperty.contactLinePlaceholder')}
                value={form.contactLine}
                onChange={(e) => update('contactLine', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                {t('listYourProperty.contactWhatsappLabel')}
              </label>
              <input
                type="text"
                placeholder={t('listYourProperty.contactWhatsappPlaceholder')}
                value={form.contactWhatsapp}
                onChange={(e) => update('contactWhatsapp', e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg outline-none"
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
            {loading ? t('listYourProperty.sending') : t('listYourProperty.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}
