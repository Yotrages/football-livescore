"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LeagueTable from "@/components/leagues/LeagueTable";
import MatchCard from "@/components/matches/MatchCard";
import {
  useLeagueStandings,
  useSingleCompetitionScorers,
  useSingleLeague,
  useSingleLeagueMatches,
  useSingleLeaguePrevMatches,
} from "@/hooks/useLiveData";
import { CompetitionScorers } from "@/components/leagues/Scorers";
import { FaArrowLeft, FaRedo } from "react-icons/fa";

const LeaguePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const { data: fixtures, isLoading: fixturesLoading } = useSingleLeagueMatches(id, 30000);
  const { data: leagueDetails, isLoading: leagueLoading, error: leagueErrors } = useSingleLeague(id, 300000);
  const { data: standings, isLoading: standingsLoading } = useLeagueStandings(id, 60000);
  const { data: results, isLoading: resultsLoading } = useSingleLeaguePrevMatches(id, 300000);
  const { data: scorers, isLoading: scorersLoading } = useSingleCompetitionScorers(id, 3600000);

  const [activeTab, setActiveTab] = useState<"standings" | "fixtures" | "results" | "scorers">("standings");

  const isLoading = fixturesLoading || leagueLoading || standingsLoading || scorersLoading || resultsLoading;
  const isCriticalDataMissing = !leagueDetails || !leagueDetails.name;

  const seasonStart = leagueDetails?.currentSeason?.startDate?.slice(0, 4) || 'N/A';
  const seasonEnd = leagueDetails?.currentSeason?.endDate?.slice(0, 4) || 'N/A';
  const season = seasonStart !== 'N/A' && seasonEnd !== 'N/A' ? `${seasonStart}/${seasonEnd}` : 'Unknown Season';

  if (isLoading) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="skeleton w-8 h-8 rounded-lg"></div>
            <div className="skeleton h-5 w-48 rounded"></div>
          </div>
          {/* Header skeleton */}
          <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-5">
              <div className="skeleton w-20 h-20 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-6 w-52 rounded"></div>
                <div className="skeleton h-4 w-32 rounded"></div>
                <div className="skeleton h-4 w-24 rounded"></div>
              </div>
            </div>
          </div>
          {/* Tab skeleton */}
          <div className="skeleton h-10 w-full rounded-xl mb-6"></div>
          {/* Content skeleton */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="p-4 space-y-2">
              {[...Array(10)].map((_, i) => <div key={i} className="skeleton h-10 rounded-lg"></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (leagueErrors || isCriticalDataMissing) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex items-center justify-center">
        <div className="text-center py-20 px-4">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>League Not Found</h1>
          <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
            Unable to load league information. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold mx-auto"
            style={{ background: 'var(--accent-blue)', color: '#fff' }}
          >
            <FaRedo size={12} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'standings', label: 'Standings' },
    { key: 'fixtures', label: 'Fixtures' },
    { key: 'results', label: 'Results' },
    { key: 'scorers', label: 'Top Scorers' },
  ] as const;

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-5 text-sm font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <FaArrowLeft size={12} /> Back
        </button>

        {/* League Header Card */}
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <div
            className="relative px-5 py-6"
            style={{
              background: 'linear-gradient(135deg, rgba(41,121,255,0.12) 0%, rgba(0,0,0,0) 60%)',
            }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div
                className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <img
                  src={leagueDetails?.emblem || leagueDetails?.area?.flag}
                  alt={leagueDetails?.name}
                  className="w-14 h-14 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="font-bold text-2xl mb-1" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
                  {leagueDetails?.name}
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {leagueDetails?.area?.flag && (
                    <img
                      src={leagueDetails.area.flag}
                      alt={leagueDetails.area.name}
                      className="w-5 h-4 object-cover rounded-sm"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                  <span>{leagueDetails?.area?.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                    {leagueDetails.type === 'LEAGUE' ? `Season ${season}` : `Year ${seasonStart}`}
                  </span>
                  {leagueDetails?.currentSeason?.currentMatchday && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,230,118,0.1)', color: 'var(--accent-green)', border: '1px solid rgba(0,230,118,0.2)' }}>
                      MD {leagueDetails.currentSeason.currentMatchday}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-5"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 px-2 sm:px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all"
              style={{
                background: activeTab === tab.key ? 'var(--bg-surface)' : 'transparent',
                color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "standings" && (
          standings ? (
            <LeagueTable standings={standings} leagueName={leagueDetails.name} season={season} />
          ) : (
            <div className="py-14 text-center rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Standings data is currently unavailable</p>
            </div>
          )
        )}

        {activeTab === "scorers" && (
          scorers ? (
            <CompetitionScorers data={scorers} />
          ) : (
            <div className="py-14 text-center rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Top scorers data is currently unavailable</p>
            </div>
          )
        )}

        {activeTab === "fixtures" && (
          <div>
            {fixtures && fixtures.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {fixtures.map((match) => <MatchCard key={match.id} match={match} />)}
              </div>
            ) : (
              <div className="py-14 text-center rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No upcoming fixtures available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "results" && (
          <div>
            {results && results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {results.map((match) => <MatchCard key={match.id} match={match} />)}
              </div>
            ) : (
              <div className="py-14 text-center rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No recent results available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaguePage;
