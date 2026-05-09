'use client';

import { useState } from 'react';
import { fetchRecommendations, fetchItinerary } from '@/lib/api';

interface TripAIProps {
  tripId: string;
}

export default function TripAI({ tripId }: TripAIProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tips' | 'itinerary'>('tips');

  const handleFetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecommendations(tripId);
      setRecommendations(data);
      setActiveTab('tips');
    } catch (err) {
      setError('Failed to load recommendations. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchItinerary = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItinerary(tripId);
      setItinerary(data);
      setActiveTab('itinerary');
    } catch (err) {
      setError('Failed to generate itinerary. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border-t border-slate-100 pt-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleFetchRecommendations}
          disabled={loading}
          className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'tips' && recommendations.length > 0
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {loading && activeTab === 'tips' ? 'Thinking...' : 'AI Tips'}
        </button>
        <button
          onClick={handleFetchItinerary}
          disabled={loading}
          className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'itinerary' && itinerary.length > 0
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-100'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {loading && activeTab === 'itinerary' ? 'Planning...' : 'Generate Itinerary'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl mb-4 border border-red-100">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 text-sm animate-pulse">Our AI is crafting your experience...</p>
        </div>
      )}

      {!loading && activeTab === 'tips' && recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Personalized Recommendations</h4>
          {recommendations.map((tip, i) => (
            <div key={i} className="flex gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 transition-all hover:bg-indigo-50">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === 'itinerary' && itinerary.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your AI Itinerary</h4>
          {itinerary.map((day, i) => (
            <div key={i} className="relative pl-8 pb-6 border-l-2 border-slate-100 last:pb-0">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-violet-600 border-4 border-white shadow-sm" />
              <h5 className="font-bold text-slate-900 mb-3">Day {day.day}</h5>
              <div className="space-y-2">
                {day.activities.map((activity: string, j: number) => (
                  <div key={j} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-violet-400 mt-1">•</span>
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
