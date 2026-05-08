import { Trip } from '@/types/trip';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const startDate = new Date(trip.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const endDate = new Date(trip.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="glass-card p-5 rounded-2xl group hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {trip.destination}
          </h3>
          <div className="flex items-center text-slate-500 text-sm mt-1">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{startDate} — {endDate}</span>
          </div>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl font-bold text-lg">
          ${trip.budget.toLocaleString()}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6">
        <div className="flex -space-x-2">
          {/* Avatar placeholders for future collaborators */}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
          <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
            +
          </div>
        </div>
        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center group/btn">
          View Details
          <svg className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
