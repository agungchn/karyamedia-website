export default function CaraPesanLoading() {
  return (
    <div className="animate-pulse">
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-white/10 rounded-lg mx-auto" />
          <div className="h-4 w-96 bg-white/10 rounded-lg mx-auto mt-4" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="h-4 w-20 bg-gray-200 rounded mx-auto mb-2" />
              <div className="h-3 w-32 bg-gray-200 rounded mx-auto" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
