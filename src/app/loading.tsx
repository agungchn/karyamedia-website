export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      <section className="min-h-screen bg-primary flex items-center pt-[80px] lg:pt-[90px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="h-10 w-64 bg-white/10 rounded-3xl" />
              <div className="h-12 w-96 bg-white/10 rounded-lg" />
              <div className="h-6 w-80 bg-white/10 rounded-lg" />
              <div className="h-4 w-72 bg-white/10 rounded-lg" />
              <div className="flex gap-4">
                <div className="h-14 w-48 bg-white/10 rounded-full" />
                <div className="h-14 w-52 bg-white/10 rounded-full" />
              </div>
            </div>
            <div className="hidden lg:block h-[500px] bg-white/5 rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  )
}
