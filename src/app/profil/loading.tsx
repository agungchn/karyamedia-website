export default function ProfilLoading() {
  return (
    <div className="animate-pulse">
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-white/10 rounded-lg mx-auto" />
          <div className="h-4 w-96 bg-white/10 rounded-lg mx-auto mt-4" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="h-6 w-full bg-gray-200 rounded-lg" />
            <div className="h-6 w-full bg-gray-200 rounded-lg" />
            <div className="h-6 w-3/4 bg-gray-200 rounded-lg" />
          </div>
          <div className="aspect-[4/3] bg-gray-200 rounded-2xl" />
        </div>
      </section>
    </div>
  )
}
