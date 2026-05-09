'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import TripForm from '@/components/TripForm';
import TripCard from '@/components/TripCard';
import TripSkeleton from '@/components/ui/Skeleton';
import { fetchTrips } from '@/lib/api';
import { Trip } from '@/types/trip';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const loadTrips = async () => {
    try {
      const data = await fetchTrips();
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTripsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTrips();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Public Landing Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight">
              Design Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                Perfect Getaway
              </span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              RaahiRoute is your intelligent travel companion. Plan itineraries, manage budgets, and organize all your upcoming adventures in one beautiful place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1"
              >
                Start Planning Free
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl font-bold text-lg shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300"
              >
                Sign In
              </Link>
            </div>
            
            {/* Feature preview / Mockup placeholder */}
            <div className="mt-20 relative mx-auto w-full max-w-4xl rounded-2xl bg-white shadow-2xl p-2 border border-slate-100 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 to-transparent pointer-events-none z-10" />
              <div className="glass-card p-8 rounded-xl opacity-80 scale-95 origin-top filter blur-[1px]">
                 <div className="h-8 w-1/3 bg-slate-200 rounded mb-6 animate-pulse" />
                 <div className="grid grid-cols-2 gap-4">
                   <div className="h-32 bg-slate-100 rounded-lg animate-pulse" />
                   <div className="h-32 bg-slate-100 rounded-lg animate-pulse" />
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen pb-20 bg-slate-50">
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
              {!tripsLoading && trips.length > 0 && (
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-bold">
                  {trips.length} Total
                </span>
              )}
            </div>

            {tripsLoading ? (
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
