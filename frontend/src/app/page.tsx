'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import TripForm from '@/components/TripForm';
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TripForm onTripCreated={loadTrips} />
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Trips</h2>
            {loading ? (
              <p>Loading trips...</p>
            ) : trips.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="text-gray-500 text-lg">No trips planned yet. Start your journey today!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip) => (
                  <div key={trip.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{trip.destination}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">${trip.budget.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
