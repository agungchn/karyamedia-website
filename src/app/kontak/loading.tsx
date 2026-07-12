export default function KontakLoading() {
  return (
    <div className="animate-pulse">
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-white/10 rounded-lg mx-auto" />
          <div className="h-4 w-80 bg-white/10 rounded-lg mx-auto mt-4" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-48 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-3 w-24 bg-gray-200 rounded mb-1" />
                <div className="h-10 w-full bg-gray-200 rounded-lg" />
              </div>
            ))}
            <div className="h-12 w-full bg-gray-200 rounded-lg mt-4" />
          </div>
        </div>
      </section>
    </div>
  )
}
