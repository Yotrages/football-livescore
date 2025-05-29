"use client";
import LeagueCard from '@/components/leagues/LeagueCard';
import { useLeagues } from '@/hooks/useLiveData';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaArrowLeft, FaTrophy, FaSearch, FaFilter, FaGlobe } from 'react-icons/fa';

const Page = () => {
  const { data: featuredLeagues, error: leagueErrors, isLoading: leagueLoading } = useLeagues(3000000);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Loading state
  if (leagueLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Search/Filter Skeleton */}
          <div className="bg-white rounded-xl p-6 shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-48 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
          
          {/* Loading Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (leagueErrors || !featuredLeagues) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Unable to load leagues
            </h1>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              We couldn&apos;t fetch the leagues at the moment. Please check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Process and filter leagues
  const sortedLeagues = featuredLeagues ? [...featuredLeagues].sort((a, b) => {
    if (a.name && b.name) {
      return a.name.localeCompare(b.name);
    }
    return 0;
  }) : [];

  // Get unique countries for filter
  const countries = [...new Set(sortedLeagues.map(league => league.name || 'Unknown').filter(Boolean))].sort();

  // Filter leagues based on search and country
  const filteredLeagues = sortedLeagues.filter(league => {
    const matchesSearch = !searchTerm || 
      league.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      league.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry === 'all' || league.name === selectedCountry;
    
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl">
                <FaTrophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Football Leagues</h1>
                <p className="text-sm text-gray-600">Discover competitions from around the world</p>
              </div>
            </div>
          </div>
          
          {/* League count badge */}
          {sortedLeagues.length > 0 && (
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <FaGlobe className="w-3 h-3 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                {sortedLeagues.length} {sortedLeagues.length === 1 ? 'League' : 'Leagues'}
              </span>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        {sortedLeagues.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leagues or countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              {/* Country Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white min-w-48"
                >
                  <option value="all">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Search Results Info */}
            {(searchTerm || selectedCountry !== 'all') && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredLeagues.length} of {sortedLeagues.length} leagues
                  {searchTerm && <span> for &apos;{searchTerm}&apos;</span>}
                  {selectedCountry !== 'all' && <span> in {selectedCountry}</span>}
                </p>
                {(searchTerm || selectedCountry !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCountry('all');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Leagues Grid */}
        {filteredLeagues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLeagues.map((league, index) => (
              <div
                key={league.id}
                className="transform hover:scale-105 transition-all duration-300 hover:z-10"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <LeagueCard league={league} />
              </div>
            ))}
          </div>
        ) : sortedLeagues.length > 0 ? (
          // No results from filtering
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <FaSearch className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No leagues found
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              We couldn&apos;t find any leagues matching your search criteria. Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Show All Leagues
            </button>
          </div>
        ) : (
          // No leagues at all
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
              <FaTrophy className="w-12 h-12 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No Leagues Available
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              There are no leagues to display at the moment. Check back later for updates.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/matches')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Matches
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Page;