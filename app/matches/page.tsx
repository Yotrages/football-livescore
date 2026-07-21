"use client";
import MatchCard from "@/components/matches/MatchCard";
import { useTodayMatches } from "@/hooks/useLiveData";
import { useRouter } from "next/navigation";
import React from "react";
import { FaArrowLeft, FaCalendarAlt, FaFutbol, FaRedo } from "react-icons/fa";

const SkeletonCard = () => (
  <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
    <div className="skeleton h-8" style={{ borderRadius: 0 }}></div>
    <div className="p-3 space-y-3">
      <div className="flex items-center gap-3">
        <div className="skeleton w-6 h-6 rounded-full"></div>
        <div className="skeleton h-3 flex-1 rounded"></div>
        <div className="skeleton w-14 h-5 rounded"></div>
        <div className="skeleton h-3 flex-1 rounded"></div>
        <div className="skeleton w-6 h-6 rounded-full"></div>
      </div>
      <div className="skeleton h-3 w-16 mx-auto rounded"></div>
    </div>
  </div>
);

const Page = () => {
  const { data: matches, error: matchesError, isLoading: matchesLoading } = useTodayMatches(30000);
  const router = useRouter();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
                Today&apos;s Matches
              </h1>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <FaCalendarAlt size={10} />
                <span>{today}</span>
              </div>
            </div>
          </div>

          {matches && matches.length > 0 && (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', color: 'var(--accent-green)' }}
            >
              <div className="live-dot" style={{ width: '6px', height: '6px' }}></div>
              {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
            </div>
          )}
        </div>

        {/* Content */}
        {matchesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : matchesError || !matches ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl" style={{ background: 'rgba(255,23,68,0.1)' }}>⚠️</div>
            <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>Failed to Load Matches</h3>
            <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              We couldn&apos;t load today&apos;s matches. Please check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{ background: 'var(--accent-blue)', color: '#fff' }}
            >
              <FaRedo size={12} /> Try Again
            </button>
          </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {matches.map((match, i) => (
              <div key={match.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl" style={{ background: 'var(--bg-card)' }}>
              <FaFutbol style={{ color: 'var(--text-muted)', fontSize: '24px' }} />
            </div>
            <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>No Matches Today</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Enjoy the day off! Check back tomorrow for more action.
            </p>
            <button
              onClick={() => router.push('/leagues')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--accent-blue)', color: '#fff' }}
            >
              Browse Leagues
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
