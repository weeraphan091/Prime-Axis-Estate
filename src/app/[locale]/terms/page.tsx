import Link from 'next/link'

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const base = `/${locale}`
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl lg:text-3xl text-stone-900">Terms and Conditions</h1>
      <p className="mt-2 text-stone-500 text-sm">Last updated: March 2025</p>
      <div className="mt-8 prose prose-stone max-w-none text-stone-600 space-y-4">
        <p>By using PRIME AXIS ESTATE you agree to these terms.</p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">1. Services</h2>
        <p>We provide a platform for real estate listings in Pattaya.</p>
        <h2 className="text-lg font-semibold text-stone-900 mt-6">2. Listing information</h2>
        <p>Listing details are the responsibility of the lister. Please verify before deciding.</p>
      </div>
      <Link href={base} className="inline-block mt-8 text-primary-600 hover:underline">Back to Home</Link>
    </div>
  )
}
