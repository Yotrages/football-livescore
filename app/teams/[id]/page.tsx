"use client"
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSingleTeamMatches, useTeamInfo } from '@/hooks/useLiveData';
import { FaArrowLeft, FaCalendarAlt, FaExternalLinkAlt, FaGlobe, FaMapPin, FaShieldAlt, FaTrophy, FaUser, FaUsers } from 'react-icons/fa';
import MatchCard from '@/components/matches/MatchCard';
import { formatDate } from '@/utils/formatters';

const positionStyles: Record<string, { bg: string; color: string }> = {
  goalkeeper: { bg: 'rgba(255,193,7,0.15)', color: '#ffc107' },
  defence: { bg: 'rgba(41,121,255,0.12)', color: '#6ab0ff' },
  midfield: { bg: 'rgba(0,230,118,0.12)', color: 'var(--accent-green)' },
  offence: { bg: 'rgba(255,23,68,0.12)', color: '#ff6b8a' },
};

const getPositionStyle = (position: string) => {
  if (!position) return { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' };
  const pos = position.toLowerCase();
  if (pos.includes('goalkeeper') || pos.includes('keeper')) return positionStyles.goalkeeper;
  if (pos.includes('back') || pos.includes('defence') || pos.includes('defender')) return positionStyles.defence;
  if (pos.includes('midfield')) return positionStyles.midfield;
  if (pos.includes('forward') || pos.includes('winger') || pos.includes('offence') || pos.includes('striker')) return positionStyles.offence;
  return { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' };
};

const SingleTeamPage = () => {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id;

  const { data: teamData, isLoading: teamLoading, error: teamError } = useTeamInfo(teamId, 30000);
  const { data: matchesData, isLoading: matchesLoading } = useSingleTeamMatches(teamId, 30000);

  const [activeTab, setActiveTab] = useState<'overview' | 'squad' | 'matches' | 'stats'>('overview');

  if (teamLoading || matchesLoading) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* Header skeleton */}
          <div className="skeleton h-8 w-16 rounded mb-6"></div>
          <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-5">
              <div className="skeleton w-24 h-24 rounded-2xl"></div>
              <div className="flex-1 space-y-3">
                <div className="skeleton h-7 w-52 rounded"></div>
                <div className="skeleton h-4 w-36 rounded"></div>
                <div className="flex gap-3">
                  <div className="skeleton h-6 w-24 rounded-full"></div>
                  <div className="skeleton h-6 w-24 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="skeleton h-12 rounded-xl mb-5"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (teamError || !teamData || !matchesData) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Team Not Found</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Unable to load team information.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: 'var(--accent-blue)', color: '#fff' }}
          >
            <FaArrowLeft size={12} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaShieldAlt },
    { id: 'squad', label: 'Squad', icon: FaUsers },
    { id: 'matches', label: 'Matches', icon: FaTrophy },
    { id: 'stats', label: 'Statistics', icon: FaCalendarAlt },
  ] as const;

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-5 text-sm font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <FaArrowLeft size={12} /> Back
        </button>

        {/* Team Hero */}
        <div
          className="rounded-2xl overflow-hidden mb-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <div
            className="relative px-5 py-6"
            style={{ background: 'linear-gradient(135deg, rgba(41,121,255,0.1) 0%, rgba(0,0,0,0) 60%)' }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Crest */}
              <div
                className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <img
                  src={teamData.crest}
                  alt={teamData.name}
                  className="w-16 h-16 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <h1
                  className="font-bold text-2xl sm:text-3xl mb-1"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', letterSpacing: '0.5px' }}
                >
                  {teamData.name}
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-3">
                  <span
                    className="text-sm px-2 py-0.5 rounded font-semibold"
                    style={{ background: 'rgba(41,121,255,0.15)', color: '#6ab0ff' }}
                  >
                    {teamData.tla}
                  </span>
                  {teamData.area?.flag && (
                    <img
                      src={teamData.area.flag}
                      alt={teamData.area.name}
                      className="w-5 h-4 object-cover rounded-sm"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{teamData.area?.name}</span>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {teamData.founded && (
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt size={10} />
                      <span>Est. {teamData.founded}</span>
                    </div>
                  )}
                  {teamData.venue && (
                    <div className="flex items-center gap-1">
                      <FaMapPin size={10} />
                      <span>{teamData.venue}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Website */}
              {teamData.website && (
                <a
                  href={teamData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: 'rgba(41,121,255,0.15)', color: '#6ab0ff', border: '1px solid rgba(41,121,255,0.25)' }}
                >
                  <FaGlobe size={12} />
                  Website
                  <FaExternalLinkAlt size={10} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-5"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all"
              style={{
                background: activeTab === id ? 'var(--bg-surface)' : 'transparent',
                color: activeTab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={12} className="hidden sm:block" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Info */}
            <div className="lg:col-span-2 space-y-4">
              <div
                className="rounded-xl p-5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
              >
                <h2
                  className="font-bold text-sm mb-4 uppercase tracking-wider"
                  style={{ fontFamily: 'Rajdhani', color: 'var(--text-muted)' }}
                >
                  Club Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Full Name', value: teamData.name },
                    { label: 'Short Name', value: teamData.shortName },
                    { label: 'Abbreviation', value: teamData.tla },
                    { label: 'Founded', value: teamData.founded },
                    { label: 'Stadium', value: teamData.venue },
                    { label: 'Colors', value: teamData.clubColors },
                    { label: 'Country', value: teamData.area?.name },
                    { label: 'Address', value: teamData.address },
                  ].filter(item => item.value).map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coach */}
              {teamData.coach?.name && (
                <div
                  className="rounded-xl p-5"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                >
                  <h2
                    className="font-bold text-sm mb-4 uppercase tracking-wider"
                    style={{ fontFamily: 'Rajdhani', color: 'var(--text-muted)' }}
                  >
                    Manager
                  </h2>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(41,121,255,0.15)' }}
                    >
                      <FaUser size={22} style={{ color: '#6ab0ff' }} />
                    </div>
                    <div>
                      <div className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{teamData.coach.name}</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{teamData.coach.nationality}</div>
                      {teamData.coach.contract?.start && (
                        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          Contract: {formatDate(teamData.coach.contract.start)} → {formatDate(teamData.coach.contract.until)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Competitions */}
            <div>
              <div
                className="rounded-xl p-5"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
              >
                <h2
                  className="font-bold text-sm mb-4 uppercase tracking-wider"
                  style={{ fontFamily: 'Rajdhani', color: 'var(--text-muted)' }}
                >
                  Competitions
                </h2>
                <div className="space-y-2">
                  {teamData.runningCompetitions?.map((comp) => (
                    <div
                      key={comp.id}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
                      onClick={() => router.push(`/leagues/${comp.id}`)}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                    >
                      {comp.emblem && (
                        <img
                          src={comp.emblem}
                          alt={comp.name}
                          className="w-8 h-8 object-contain flex-shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{comp.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{comp.type}</div>
                      </div>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                        <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'squad' && (
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <div
              className="px-4 py-3"
              style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
            >
              <h2 className="font-bold text-sm" style={{ fontFamily: 'Rajdhani', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Squad ({teamData.squad?.length || 0} players)
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3">
              {teamData.squad?.map((player) => {
                const style = getPositionStyle(player.position);
                return (
                  <Link
                    key={player.id}
                    href={`/players/${player.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                        {player.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-xs px-2 py-0.5 rounded font-medium"
                          style={{ background: style.bg, color: style.color }}
                        >
                          {player.position || 'Unknown'}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {player.nationality}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div>
            {matchesData.resultSet && (
              <div
                className="rounded-xl p-4 mb-4 flex flex-wrap gap-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
              >
                {[
                  { label: 'Played', value: matchesData.resultSet.played, color: '#6ab0ff' },
                  { label: 'Wins', value: matchesData.resultSet.wins, color: 'var(--accent-green)' },
                  { label: 'Draws', value: matchesData.resultSet.draws, color: 'var(--accent-amber)' },
                  { label: 'Losses', value: matchesData.resultSet.losses, color: 'var(--accent-red)' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span
                      className="text-xl font-black"
                      style={{ fontFamily: 'Rajdhani, sans-serif', color: item.color }}
                    >
                      {item.value}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            )}
            {matchesData.matches && matchesData.matches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {matchesData.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div
                className="rounded-xl py-14 text-center"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
              >
                <FaTrophy className="mx-auto mb-3" size={28} style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No matches available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <h2
              className="font-bold text-sm mb-5 uppercase tracking-wider"
              style={{ fontFamily: 'Rajdhani', color: 'var(--text-muted)' }}
            >
              Season Statistics
            </h2>
            {matchesData.resultSet ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Matches Played', value: matchesData.resultSet.played, color: '#6ab0ff', bg: 'rgba(41,121,255,0.1)' },
                  { label: 'Wins', value: matchesData.resultSet.wins, color: 'var(--accent-green)', bg: 'rgba(0,230,118,0.1)' },
                  { label: 'Draws', value: matchesData.resultSet.draws, color: 'var(--accent-amber)', bg: 'rgba(255,171,0,0.1)' },
                  { label: 'Losses', value: matchesData.resultSet.losses, color: 'var(--accent-red)', bg: 'rgba(255,23,68,0.1)' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center p-5 rounded-xl text-center"
                    style={{ background: item.bg, border: `1px solid ${item.color}22` }}
                  >
                    <div
                      className="text-4xl font-black mb-1"
                      style={{ fontFamily: 'Rajdhani, sans-serif', color: item.color }}
                    >
                      {item.value}
                    </div>
                    <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No statistics available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleTeamPage;
