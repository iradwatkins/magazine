export function MediaGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="aspect-square w-full animate-pulse bg-gray-200" />
          <div className="p-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 flex justify-between">
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
