export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="w-full max-w-4xl space-y-4 text-center">
        <div className="h-4 bg-slate-200 rounded-full w-32 mx-auto"></div>
        <div className="h-10 bg-slate-200 rounded-full w-3/4 md:w-1/2 mx-auto"></div>
        <div className="h-4 bg-slate-200 rounded-full w-2/3 md:w-1/3 mx-auto"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-12">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-full h-40 bg-slate-100 rounded-xl"></div>
            <div className="h-6 bg-slate-200 rounded-full w-2/3"></div>
            <div className="h-4 bg-slate-200 rounded-full w-1/2"></div>
            <div className="flex justify-between items-center mt-4">
              <div className="h-4 bg-slate-200 rounded-full w-1/4"></div>
              <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
