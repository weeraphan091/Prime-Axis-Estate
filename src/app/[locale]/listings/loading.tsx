export default function ListingsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-48 bg-stone-200 rounded mb-6" />

      {/* Title skeleton */}
      <div className="h-8 w-64 bg-stone-200 rounded mb-2" />
      <div className="h-4 w-80 bg-stone-100 rounded mb-8" />

      {/* Search bar skeleton */}
      <div className="h-16 w-full bg-stone-100 rounded-xl mb-8" />

      {/* Count skeleton */}
      <div className="h-4 w-32 bg-stone-100 rounded mb-6" />

      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            {/* Image placeholder */}
            <div className="aspect-[4/3] bg-stone-200" />
            {/* Content placeholder */}
            <div className="p-4 space-y-3">
              <div className="h-3 w-3/4 bg-stone-100 rounded" />
              <div className="h-5 w-full bg-stone-200 rounded" />
              <div className="h-5 w-2/3 bg-stone-100 rounded" />
              <div className="flex gap-4 pt-1">
                <div className="h-4 w-16 bg-stone-100 rounded" />
                <div className="h-4 w-16 bg-stone-100 rounded" />
                <div className="h-4 w-16 bg-stone-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
