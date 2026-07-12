export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48 mb-8" />
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-32" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-10 bg-gray-200 rounded w-48 mt-6" />
          </div>
        </div>
      </div>
    </div>
  )
}
