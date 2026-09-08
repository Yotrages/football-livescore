"use client"
import MatchCard from "@/components/matches/MatchCard";
import { useTodayMatches, useUpcomingMatches, useLeagues, useLiveMatches, useLatestNews } from "@/hooks/useLiveData";
import React, { useState } from "react";
import LeagueCard from "@/components/leagues/LeagueCard";
import NewsCard from "@/components/news/NewsCard";
import Link from "next/link";

const EmptyState = ({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{title}</h3>
    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
  </div>
);

const LatestNewsSection = () => {
  const { data: news = [], isLoading } = useLatestNews(6);
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <span className="section-label">Latest News</span>
        <Link href="/news" className="text-xs font-medium transition-colors" style={{ color: 'var(--accent-blue)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#90c4ff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-blue)')}
        >View all →</Link>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div className="skeleton" style={{ paddingBottom: '56.25%', borderRadius: 0 }}></div>
              <div className="p-4 space-y-2">
                <div className="skeleton h-3 w-20 rounded"></div>
                <div className="skeleton h-4 w-full rounded"></div>
                <div className="skeleton h-3 w-3/4 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.slice(0, 6).map((article: any, i: number) => (
            <div key={article._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <EmptyState icon="📰" title="No Articles Yet" subtitle="Check back soon for the latest football news and updates" />
        </div>
      )}
    </section>
  );
};

const MatchGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-card)' }}>
        <div className="skeleton h-8 m-0 rounded-none" style={{ borderRadius: 0 }}></div>
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="skeleton w-6 h-6 rounded-full"></div>
            <div className="skeleton h-3.5 flex-1 rounded"></div>
            <div className="skeleton w-12 h-5 rounded"></div>
            <div className="skeleton h-3.5 flex-1 rounded"></div>
            <div className="skeleton w-6 h-6 rounded-full"></div>
          </div>
          <div className="skeleton h-3 w-16 mx-auto rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const Page = () => {
  const { data: matches } = useTodayMatches(30000000);
  const { data: upcomingMatches } = useUpcomingMatches(30000000);
  const { data: featuredLeagues } = useLeagues(3000000);
  const { data: liveMatches } = useLiveMatches(300000000);
  const [currentTab, setCurrentTab] = useState<'Today' | 'live' | 'upcoming'>('Today');

  const tabData = {
    Today: { matches, emptyTitle: 'No Matches Today', emptySubtitle: 'Come back later for more fixtures' },
    live: { matches: liveMatches, emptyTitle: 'No Live Matches', emptySubtitle: 'Check back when games are in progress' },
    upcoming: { matches: upcomingMatches, emptyTitle: 'No Upcoming Matches', emptySubtitle: 'Fixtures will appear here soon' },
  };

  const activeMatches = tabData[currentTab].matches;

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div
        className="relative pt-14"
        style={{
          background: 'linear-gradient(180deg, rgba(0,36,10,0.6) 0%, var(--bg-primary) 100%)',
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,230,118,0.08) 0%, transparent 70%)',
            }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="live-dot"></span>
                <span className="text-xs font-bold tracking-widest" style={{ color: 'var(--accent-green)', letterSpacing: '2px' }}>
                  LIVE SCORES
                </span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold leading-tight"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', letterSpacing: '1px' }}
              >
                Football LiveScore
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Real-time scores, fixtures & standings from top leagues worldwide
              </p>
            </div>
            {liveMatches && liveMatches.length > 0 && (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
                style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.25)' }}
                onClick={() => setCurrentTab('live')}
              >
                <span className="live-dot"></span>
                <span className="font-bold text-sm" style={{ color: 'var(--accent-green)' }}>
                  {liveMatches.length} Live {liveMatches.length === 1 ? 'Match' : 'Matches'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 space-y-10">
        {/* Top Leagues */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="section-label">Top Leagues</span>
            </div>
            <Link
              href="/leagues"
              className="text-xs font-medium transition-colors"
              style={{ color: 'var(--accent-blue)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#90c4ff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-blue)')}
            >
              View all →
            </Link>
          </div>

          {featuredLeagues && featuredLeagues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {featuredLeagues.slice(0, 8).map((league: any, i: number) => (
                <div
                  key={league.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <LeagueCard league={league} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4"
                  style={{ background: 'var(--bg-card)' }}
                >
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
          )}
        </section>

        {/* Matches Section */}
        <section>
          {/* Tab Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <span className="section-label">Matches</span>
            <div
              className="flex items-center gap-1 p-1 rounded-lg self-start sm:self-auto"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <button
                className={`tab-btn ${currentTab === 'Today' ? 'active' : ''}`}
                onClick={() => setCurrentTab('Today')}
              >
                <span>Today</span>
                {matches && matches.length > 0 && (
                  <span
                    className="ml-1.5 text-xs px-1.5 py-0.5 rounded font-bold"
                    style={{
                      background: currentTab === 'Today' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                      color: currentTab === 'Today' ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                  >
                    {matches.length}
                  </span>
                )}
              </button>

              <button
                className={`tab-btn flex items-center gap-1.5 ${currentTab === 'live' ? 'active' : ''}`}
                onClick={() => setCurrentTab('live')}
              >
                {currentTab === 'live' && <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>}
                <span>Live</span>
                {liveMatches && liveMatches.length > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-bold"
                    style={{
                      background: 'rgba(0,230,118,0.2)',
                      color: 'var(--accent-green)',
                    }}
                  >
                    {liveMatches.length}
                  </span>
                )}
              </button>

              <button
                className={`tab-btn ${currentTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setCurrentTab('upcoming')}
              >
                <span>Upcoming</span>
                {upcomingMatches && upcomingMatches.length > 0 && (
                  <span
                    className="ml-1.5 text-xs px-1.5 py-0.5 rounded font-bold"
                    style={{
                      background: currentTab === 'upcoming' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                      color: currentTab === 'upcoming' ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                  >
                    {upcomingMatches.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Match content */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--border-subtle)' }}
          >
            <div className="p-4">
              {!activeMatches ? (
                <MatchGridSkeleton />
              ) : activeMatches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {activeMatches.map((match: any, i: number) => (
                    <div
                      key={match.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                    >
                      <MatchCard match={match} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={currentTab === 'live' ? '⚽' : currentTab === 'upcoming' ? '📅' : '📋'}
                  title={tabData[currentTab].emptyTitle}
                  subtitle={tabData[currentTab].emptySubtitle}
                />
              )}
            </div>
          </div>
        </section>

        {/* Latest News */}
        <LatestNewsSection />
      </main>
    </div>
  );
};

export default Page;
