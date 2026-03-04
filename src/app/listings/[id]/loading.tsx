export default function ListingDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4 h-5 w-24 bg-stone-200 rounded animate-pulse" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video rounded-xl bg-stone-200 animate-pulse" />
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-14 rounded-lg bg-stone-100 animate-pulse shrink-0" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-stone-200 rounded w-4/5 animate-pulse" />
          <div className="h-6 bg-stone-100 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-stone-100 rounded w-full animate-pulse" />
          <div className="h-4 bg-stone-100 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
