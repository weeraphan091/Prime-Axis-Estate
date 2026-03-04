export default function ListingsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-9 w-48 bg-stone-200 rounded animate-pulse" />
        <div className="mt-2 h-5 w-96 max-w-full bg-stone-100 rounded animate-pulse" />
      </div>
      <div className="mb-8 h-20 rounded-xl bg-stone-100 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-stone-200 overflow-hidden bg-white">
            <div className="aspect-[4/3] bg-stone-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-stone-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-stone-100 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-stone-100 rounded w-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
