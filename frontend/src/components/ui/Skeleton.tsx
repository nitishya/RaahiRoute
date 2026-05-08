export default function TripSkeleton() {
  return (
    <div className="glass-card p-5 rounded-2xl animate-shimmer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-7 bg-slate-200 rounded-md w-3/4 mb-3" />
          <div className="h-4 bg-slate-100 rounded-md w-1/2" />
        </div>
        <div className="w-16 h-8 bg-indigo-50 rounded-xl" />
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-200" />
          <div className="w-8 h-8 rounded-full bg-slate-100" />
        </div>
        <div className="h-5 bg-slate-100 rounded-md w-24" />
      </div>
    </div>
  );
}
