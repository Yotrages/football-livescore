"use client"
import { useState } from 'react';
import { SingleCompetitionScorers } from '@/types';
import { FaSearch, FaFutbol, FaHandsHelping, FaBullseye, FaGamepad, FaFlag, FaBirthdayCake, FaSort } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const CompetitionScorers: React.FC<{ data: SingleCompetitionScorers }> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'goals' | 'assists' | 'matches' | 'penalties'>('goals');
  const router = useRouter();

  const filteredAndSortedScorers = data.scorers
    .filter(scorer =>
      scorer.player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scorer.team.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'goals': return b.goals - a.goals;
        case 'assists': return b.assists - a.assists;
        case 'matches': return b.playedMatches - a.playedMatches;
        case 'penalties': return b.penalties - a.penalties;
        default: return b.goals - a.goals;
      }
    });

  const getAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) return age - 1;
    return age;
  };

  const rankColors = [
    { bg: 'rgba(255,193,7,0.12)', border: 'rgba(255,193,7,0.3)', badge: '#ffc107', medal: '🥇' },
    { bg: 'rgba(176,190,197,0.1)', border: 'rgba(176,190,197,0.25)', badge: '#b0bec5', medal: '🥈' },
    { bg: 'rgba(188,121,65,0.1)', border: 'rgba(188,121,65,0.25)', badge: '#bc7941', medal: '🥉' },
  ];

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div
        className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="relative flex-1">
          <FaSearch size={11} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search players or teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaSort size={11} style={{ color: 'var(--text-muted)' }} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-lg text-sm outline-none flex-1 sm:flex-none"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              minWidth: '130px',
            }}
          >
            <option value="goals">Sort: Goals</option>
            <option value="assists">Sort: Assists</option>
            <option value="matches">Sort: Matches</option>
            <option value="penalties">Sort: Penalties</option>
          </select>
        </div>
      </div>

      {/* Top 3 podium */}
      {filteredAndSortedScorers.length >= 3 && !searchTerm && (
        <div className="grid grid-cols-3 gap-3">
          {[1, 0, 2].map((idx) => {
            const scorer = filteredAndSortedScorers[idx];
            if (!scorer) return null;
            const rank = rankColors[idx];
            const isFirst = idx === 0;
            return (
              <div
                key={scorer.player.id}
                className="relative rounded-xl p-4 flex flex-col items-center text-center cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: rank.bg,
                  border: `1px solid ${rank.border}`,
                  order: idx === 0 ? -1 : idx === 1 ? 0 : 1,
                }}
                onClick={() => router.push(`/players/${scorer.player.id}`)}
              >
                {isFirst && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: '#ffc107', color: '#000' }}
                  >
                    1
                  </div>
                )}
                <span className="text-2xl mb-2">{rank.medal}</span>
                <img
                  src={scorer.team.crest}
                  alt={scorer.team.name}
                  className="w-10 h-10 object-contain mb-2"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div
                  className={`font-bold leading-tight mb-0.5 ${isFirst ? 'text-base' : 'text-sm'}`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  {scorer.player.name.split(' ').pop()}
                </div>
                <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{scorer.team.shortName}</div>
                <div
                  className={`font-black ${isFirst ? 'text-4xl' : 'text-3xl'}`}
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: rank.badge }}
                >
                  {scorer.goals}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>goals</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5 sm:col-span-4">Player</div>
          <div className="hidden sm:block col-span-2">Club</div>
          <div className="col-span-2 text-center">G</div>
          <div className="col-span-2 text-center">A</div>
          <div className="col-span-2 text-center hidden sm:block">MP</div>
        </div>

        {/* Rows */}
        {filteredAndSortedScorers.length > 0 ? (
          <div>
            {filteredAndSortedScorers.map((scorer, index) => {
              const isTop3 = index < 3 && !searchTerm;
              const rankStyle = isTop3 ? rankColors[index] : null;
              return (
                <div
                  key={scorer.player.id}
                  className="grid grid-cols-12 gap-2 px-4 py-3 items-center cursor-pointer transition-colors border-b"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    background: isTop3 && rankStyle ? rankStyle.bg : 'transparent',
                  }}
                  onClick={() => router.push(`/players/${scorer.player.id}`)}
                  onMouseEnter={(e) => {
                    if (!isTop3) (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isTop3) (e.currentTarget as HTMLElement).style.background = 'transparent';
                    else if (rankStyle) (e.currentTarget as HTMLElement).style.background = rankStyle.bg;
                  }}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex justify-center">
                    {isTop3 && rankStyle ? (
                      <span className="text-base">{rankStyle.medal}</span>
                    ) : (
                      <span className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded"
                        style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)' }}>
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Player */}
                  <div className="col-span-5 sm:col-span-4 min-w-0">
                    <div className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                      {scorer.player.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <FaFlag size={9} />
                      <span className="truncate">{scorer.player.nationality}</span>
                      {scorer.player.dateOfBirth && (
                        <>
                          <span>·</span>
                          <span>{getAge(scorer.player.dateOfBirth)}y</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Club */}
                  <div className="hidden sm:flex col-span-2 items-center gap-1.5 min-w-0">
                    <img
                      src={scorer.team.crest}
                      alt={scorer.team.name}
                      className="w-5 h-5 object-contain flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                      {scorer.team.shortName}
                    </span>
                  </div>

                  {/* Goals */}
                  <div className="col-span-2 text-center">
                    <span
                      className="font-black text-base"
                      style={{ fontFamily: 'Rajdhani, sans-serif', color: sortBy === 'goals' ? 'var(--accent-green)' : 'var(--text-primary)' }}
                    >
                      {scorer.goals}
                    </span>
                  </div>

                  {/* Assists */}
                  <div className="col-span-2 text-center">
                    <span
                      className="font-bold text-sm"
                      style={{ color: sortBy === 'assists' ? '#6ab0ff' : 'var(--text-secondary)' }}
                    >
                      {scorer.assists}
                    </span>
                  </div>

                  {/* Played */}
                  <div className="hidden sm:block col-span-2 text-center">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {scorer.playedMatches}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <FaSearch className="mb-3" size={24} style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              No players found
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Try a different search term
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'var(--accent-green)' }}></span> G = Goals</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ background: '#6ab0ff' }}></span> A = Assists</span>
        <span>MP = Matches Played</span>
      </div>
    </div>
  );
};
