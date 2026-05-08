'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import TripForm from '@/components/TripForm';
import TripCard from '@/components/TripCard';
import TripSkeleton from '@/components/ui/Skeleton';
import { fetchTrips } from '@/lib/api';
import { Trip } from '@/types/trip';

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = async () => {
    try {
      const data = await fetchTrips();
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar: Form */}
          <div className="lg:w-1/3">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                Your Journey <span className="text-indigo-600">Starts Here</span>
              </h1>
              <p className="text-slate-500 text-lg">
                Create and manage your upcoming travel itineraries with ease.
              </p>
            </div>
            <TripForm onTripCreated={loadTrips} />
          </div>

          {/* Main Content: Trips List */}
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Upcoming Trips</h2>
              {!loading && trips.length > 0 && (
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-bold">
                  {trips.length} Total
                </span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <TripSkeleton key={i} />
                ))}
              </div>
            ) : trips.length === 0 ? (
              <div className="glass-card p-12 rounded-3xl text-center border-dashed border-2 border-slate-200 bg-transparent shadow-none">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a3 3 0 013 3V16.5a1.5 1.5 0 001.5 1.5h1.332M9 21h6m-3-3v3m-6 0h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No trips found</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">
                  You haven't planned any trips yet. Use the form on the left to start planning your next adventure!
                </p>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                >
                  Start Planning &rarr;
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
