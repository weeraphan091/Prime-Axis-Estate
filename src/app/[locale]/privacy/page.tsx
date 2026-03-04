import Link from 'next/link'

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const base = `/${locale}`
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900">Privacy Policy</h1>
      <p className="mt-2 text-stone-500 text-sm">Last updated: March 2025</p>
      <div className="mt-8 prose prose-stone max-w-none text-stone-600 space-y-4">
        <p>Pattaya Estate Hub respects your privacy. We use contact details only to respond and manage listings.</p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">Data we collect</h2>
        <p>When you submit an inquiry or list a property we store name, email, phone as needed.</p>
      </div>
      <Link href={base} className="inline-block mt-8 text-primary-600 hover:underline">Back to Home</Link>
    </div>
  )
}
