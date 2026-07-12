export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="animate-pulse space-y-8">
        <div className="h-4 bg-gray-200 rounded w-48" />
        <div className="h-8 bg-gray-200 rounded w-64" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl mx-auto mb-4" />
              <div className="h-4 bg-gray-100 rounded w-24 mx-auto mb-2" />
              <div className="h-3 bg-gray-100 rounded w-32 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
