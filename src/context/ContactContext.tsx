'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

export type ContactData = {
  name: string
  phone: string
  email: string
  address: string
  line: string
  whatsapp: string
  wechat: string
  telegram: string
}

type ContactContextType = {
  contact: ContactData
  loading: boolean
  getLineUrl: () => string
  getWhatsAppUrl: () => string
  getTelegramUrl: () => string
}

const defaultContact: ContactData = {
  name: 'Pattaya Estate Hub',
  phone: '038-xxx-xxx',
  email: 'contact@pattayaestatehub.com',
  address: 'พัทยา ชลบุรี',
  line: '@187umoiw',
  whatsapp: '66812345678',
  wechat: 'pattayaproperty',
  telegram: 'pattayaproperty',
}

const ContactContext = createContext<ContactContextType | null>(null)

function getLineUrlFrom(contact: ContactData): string {
  const id = contact.line
  if (id.startsWith('http')) return id
  return id.startsWith('@') ? `https://line.me/ti/p/${id}` : `https://line.me/ti/p/~${id}`
}

function getWhatsAppUrlFrom(contact: ContactData): string {
  const num = contact.whatsapp.replace(/\D/g, '')
  return `https://wa.me/${num}`
}

function getTelegramUrlFrom(contact: ContactData): string {
  const u = contact.telegram.replace('@', '')
  if (u.startsWith('http')) return u
  return `https://t.me/${u}`
}

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [contact, setContact] = useState<ContactData>(defaultContact)
  const [loading, setLoading] = useState(true)

  const fetchContact = useCallback(() => {
    fetch('/api/settings/contact', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && typeof data.name === 'string') {
          setContact({
            name: data.name ?? defaultContact.name,
            phone: data.phone ?? defaultContact.phone,
            email: data.email ?? defaultContact.email,
            address: data.address ?? defaultContact.address,
            line: data.line ?? defaultContact.line,
            whatsapp: data.whatsapp ?? defaultContact.whatsapp,
            wechat: data.wechat ?? defaultContact.wechat,
            telegram: data.telegram ?? defaultContact.telegram,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchContact()
  }, [fetchContact])

  // เมื่อกลับมาเปิดแท็บเว็บ (เช่น หลังแก้ตั้งค่าในหลังบ้าน) ให้ดึงข้อมูลติดต่อใหม่
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchContact()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [fetchContact])

  const value = useMemo(
    () => ({
      contact,
      loading,
      getLineUrl: () => getLineUrlFrom(contact),
      getWhatsAppUrl: () => getWhatsAppUrlFrom(contact),
      getTelegramUrl: () => getTelegramUrlFrom(contact),
    }),
    [contact, loading]
  )

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
}

export function useContact(): ContactContextType {
  const ctx = useContext(ContactContext)
  if (!ctx) {
    return {
      contact: defaultContact,
      loading: false,
      getLineUrl: () => getLineUrlFrom(defaultContact),
      getWhatsAppUrl: () => getWhatsAppUrlFrom(defaultContact),
      getTelegramUrl: () => getTelegramUrlFrom(defaultContact),
    }
  }
  return ctx
}
