export default function GalleryLoading() {
  return (
    <div className="animate-pulse">
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-16 w-48 bg-white/10 rounded-lg mx-auto" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </section>
    </div>
  )
}
