"use client";
import LeagueCard from '@/components/leagues/LeagueCard';
import { useLeagues } from '@/hooks/useLiveData';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaArrowLeft, FaTrophy, FaSearch, FaRedo } from 'react-icons/fa';

const Page = () => {
  const { data: featuredLeagues, error: leagueErrors, isLoading: leagueLoading } = useLeagues(3600000);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const sortedLeagues = featuredLeagues ? [...featuredLeagues].sort((a, b) => {
    if (a.name && b.name) return a.name.localeCompare(b.name);
    return 0;
  }) : [];

  const countries = [...new Set(sortedLeagues.map(l => l.area?.name).filter(Boolean) as string[])].sort();

  const filteredLeagues = sortedLeagues.filter(league => {
    const matchesSearch = !searchTerm ||
      league.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      league.area?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || league.area?.name === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              <FaArrowLeft size={12} />
            </button>
            <div>
              <h1 className="font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Football Leagues
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Competitions from around the world</p>
            </div>
          </div>
          {sortedLeagues.length > 0 && (
            <div className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
              {sortedLeagues.length} Leagues
            </div>
          )}
        </div>

        {/* Search + Filter */}
        {!leagueLoading && sortedLeagues.length > 0 && (
          <div
            className="rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="relative flex-1">
              <FaSearch size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search leagues or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                minWidth: '160px',
              }}
            >
              <option value="all">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {/* Results */}
        {searchTerm || selectedCountry !== 'all' ? (
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {filteredLeagues.length} of {sortedLeagues.length} leagues
            </span>
            <button
              className="text-xs font-medium"
              style={{ color: 'var(--accent-blue)' }}
              onClick={() => { setSearchTerm(''); setSelectedCountry('all'); }}
            >
              Clear filters
            </button>
          </div>
        ) : null}

        {/* Grid */}
        {leagueLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                  <div className="skeleton w-12 h-12 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4 rounded"></div>
                    <div className="skeleton h-3 w-1/2 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : leagueErrors ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>Unable to Load Leagues</h3>
            <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              Please check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--accent-blue)', color: '#fff' }}
            >
              <FaRedo size={12} /> Try Again
            </button>
          </div>
        ) : filteredLeagues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredLeagues.map((league, i) => (
              <div key={league.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                <LeagueCard league={league} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl" style={{ background: 'var(--bg-card)' }}>
              <FaTrophy style={{ color: 'var(--text-muted)', fontSize: '22px' }} />
            </div>
            <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
              {searchTerm || selectedCountry !== 'all' ? 'No leagues found' : 'No Leagues Available'}
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              {searchTerm || selectedCountry !== 'all' ? 'Try adjusting your filters.' : 'Check back later for updates.'}
            </p>
            {(searchTerm || selectedCountry !== 'all') && (
              <button
                onClick={() => { setSearchTerm(''); setSelectedCountry('all'); }}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: 'var(--accent-blue)', color: '#fff' }}
              >
                Show All Leagues
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
