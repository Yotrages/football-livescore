// src/components/matches/LiveMatches.tsx
'use client';

import { useState } from 'react';
import { FaSync } from 'react-icons/fa';
import { useLiveMatches } from '@/hooks/useLiveData';
import MatchCard from './MatchCard';

const LiveMatches: React.FC = () => {
  const { data: matches, isLoading, error, refresh } = useLiveMatches(30000); // 30 seconds refresh interval
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500); // Keep the icon spinning for a short time for visual feedback
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Live Matches</h2>
        <button 
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className={`text-blue-600 hover:text-blue-800 transition-colors duration-200 ${isRefreshing ? 'opacity-50' : ''}`}
          aria-label="Refresh live matches"
        >
          <FaSync className={`${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading && !matches ? (
        <div className="py-10 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading live matches...</p>
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="text-red-500">Error loading live matches. Please try again.</p>
        </div>
      ) : matches && matches.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="py-6 text-center bg-white rounded-lg shadow-inner">
          <p className="text-gray-600">No live matches at the moment.</p>
          <p className="text-sm text-gray-500 mt-1">Check back later for upcoming matches.</p>
        </div>
      )}
    </div>
  );
};

export default LiveMatches;