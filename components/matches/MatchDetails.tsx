"use client"
import { useState } from 'react';
import { MatchDetail } from '@/types';
import { FaCalendar, FaClock, FaMapPin, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const MatchDetails: React.FC<{ match: MatchDetail }> = ({ match }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'officials'>('overview');
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isLive = match.status === 'IN_PLAY' || match.status === 'LIVE';
  const isHalfTime = match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';
  const isScheduled = match.status === 'SCHEDULED' || match.status === 'TIMED';

  const getStatusChip = () => {
    if (isLive) return (
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)' }}>
        <span className="live-dot" style={{ width: '7px', height: '7px' }}></span>
        <span className="font-bold text-sm" style={{ color: 'var(--accent-green)' }}>LIVE</span>
      </div>
    );
    if (isHalfTime) return (
      <div className="px-4 py-1.5 rounded-full" style={{ background: 'rgba(255,171,0,0.15)', border: '1px solid rgba(255,171,0,0.3)' }}>
        <span className="font-bold text-sm" style={{ color: 'var(--accent-amber)' }}>HALF TIME</span>
      </div>
    );
    if (isFinished) return (
      <div className="px-4 py-1.5 rounded-full" style={{ background: 'rgba(138,152,175,0.12)', border: '1px solid rgba(138,152,175,0.2)' }}>
        <span className="font-bold text-sm" style={{ color: 'var(--text-secondary)' }}>FULL TIME</span>
      </div>
    );
    return (
      <div className="px-4 py-1.5 rounded-full" style={{ background: 'rgba(41,121,255,0.12)', border: '1px solid rgba(41,121,255,0.25)' }}>
        <span className="font-bold text-sm" style={{ color: '#6ab0ff' }}>
          {new Date(match.utcDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    );
  };

  const homeScore = match.score.fullTime.home;
  const awayScore = match.score.fullTime.away;
  const homeScoreNum = homeScore !== null ? Number(homeScore) : null;
  const awayScoreNum = awayScore !== null ? Number(awayScore) : null;
  const homeWon = homeScoreNum !== null && awayScoreNum !== null && homeScoreNum > awayScoreNum;
  const awayWon = homeScoreNum !== null && awayScoreNum !== null && awayScoreNum > homeScoreNum;
  const score = {
    home: homeScore !== null ? homeScore : '-',
    away: awayScore !== null ? awayScore : '-',
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'officials', label: 'Officials' },
  ] as const;

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-sm font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <FaArrowLeft size={12} /> Back
        </button>

        {/* Match Hero Card */}
        <div
          className="rounded-2xl overflow-hidden mb-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          {/* Competition banner */}
          <div
            className="flex items-center justify-between px-5 py-3 cursor-pointer"
            style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
            onClick={() => router.push(`/leagues/${match.competition.id}`)}
          >
            <div className="flex items-center gap-3">
              {match.competition.emblem && (
                <img
                  src={match.competition.emblem}
                  alt={match.competition.name}
                  className="w-6 h-6 object-contain flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
              <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {match.competition.name}
              </span>
              {match.matchday && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  · MD {match.matchday}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <FaCalendar size={10} />
              <span>{new Date(match.utcDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Score section */}
          <div className="px-4 sm:px-8 py-8">
            <div className="flex items-center justify-between gap-2 sm:gap-6">
              {/* Home team */}
              <Link href={`/teams/${match.homeTeam.id}`} className="flex flex-col items-center gap-3 flex-1 min-w-0 group">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {match.homeTeam.crest && (
                    <img
                      src={match.homeTeam.crest}
                      alt={match.homeTeam.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                </div>
                <div className="text-center w-full">
                  <h2
                    className="font-bold text-sm sm:text-base leading-tight group-hover:underline truncate"
                    style={{ color: isFinished && !homeWon && homeScoreNum !== null ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                  >
                    {match.homeTeam.shortName || match.homeTeam.name}
                  </h2>
                  <span className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>{match.homeTeam.tla}</span>
                </div>
              </Link>

              {/* Score */}
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-4">
                  <span
                    className="score-display"
                    style={{
                      fontSize: 'clamp(32px, 5vw, 52px)',
                      color: isLive ? 'var(--accent-green)' : 'var(--text-primary)',
                      fontWeight: homeWon ? 800 : 700,
                      opacity: isFinished && !homeWon && homeScoreNum !== null ? 0.45 : 1,
                    }}
                  >
                    {score.home}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '20px', fontWeight: 300 }}>-</span>
                  <span
                    className="score-display"
                    style={{
                      fontSize: 'clamp(32px, 5vw, 52px)',
                      color: isLive ? 'var(--accent-green)' : 'var(--text-primary)',
                      fontWeight: awayWon ? 800 : 700,
                      opacity: isFinished && !awayWon && awayScoreNum !== null ? 0.45 : 1,
                    }}
                  >
                    {score.away}
                  </span>
                </div>

                {match.score.halfTime.home !== null && (
                  <span
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
                  >
                    HT {match.score.halfTime.home} – {match.score.halfTime.away}
                  </span>
                )}

                {getStatusChip()}

                {match.venue && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <FaMapPin size={9} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>{match.venue}</span>
                  </div>
                )}
              </div>

              {/* Away team */}
              <Link href={`/teams/${match.awayTeam.id}`} className="flex flex-col items-center gap-3 flex-1 min-w-0 group">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {match.awayTeam.crest && (
                    <img
                      src={match.awayTeam.crest}
                      alt={match.awayTeam.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                </div>
                <div className="text-center w-full">
                  <h2
                    className="font-bold text-sm sm:text-base leading-tight group-hover:underline truncate"
                    style={{ color: isFinished && !awayWon && awayScoreNum !== null ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                  >
                    {match.awayTeam.shortName || match.awayTeam.name}
                  </h2>
                  <span className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>{match.awayTeam.tla}</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Last updated */}
          <div
            className="flex items-center justify-center gap-1.5 py-2"
            style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.1)' }}
          >
            <FaClock size={9} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Updated {new Date(match.lastUpdated).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <div
            className="flex"
            style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-5 py-3 text-sm font-semibold capitalize transition-all"
                style={{
                  color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === tab.key ? '2px solid var(--accent-blue)' : '2px solid transparent',
                  background: 'transparent',
                  marginBottom: '-1px',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Match Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Competition', value: match.competition.name },
                    { label: 'Stage', value: match.stage?.replace(/_/g, ' ') },
                    { label: 'Matchday', value: match.matchday },
                    { label: 'Status', value: match.status?.replace(/_/g, ' ') },
                    { label: 'Date', value: formatDate(match.utcDate) },
                    { label: 'Duration', value: match.score.duration },
                    match.score.winner ? { label: 'Winner', value: match.score.winner.replace(/_/g, ' ') } : null,
                  ].filter(Boolean).map((item: any) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 py-2.5 px-3 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                      <span className="text-sm font-medium text-right" style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Teams */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { team: match.homeTeam, label: 'Home', accent: 'rgba(41,121,255,0.08)', color: '#6ab0ff', border: 'rgba(41,121,255,0.2)' },
                    { team: match.awayTeam, label: 'Away', accent: 'rgba(255,23,68,0.07)', color: '#ff6b8a', border: 'rgba(255,23,68,0.2)' },
                  ].map(({ team, label, accent, color, border }) => (
                    <div
                      key={team.id}
                      className="rounded-xl p-4 cursor-pointer transition-all"
                      style={{ background: accent, border: `1px solid ${border}` }}
                      onClick={() => router.push(`/teams/${team.id}`)}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = '1'}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color }}>{label} Team</span>
                      <div className="flex items-center gap-3">
                        {team.crest && (
                          <img
                            src={team.crest}
                            alt={team.name}
                            className="w-10 h-10 object-contain flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        )}
                        <div>
                          <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{team.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {team.shortName} ({team.tla})
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Season info */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
                >
                  <h3
                    className="text-xs font-bold uppercase tracking-wider mb-4"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Season Info
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { value: new Date(match.season.startDate).getFullYear(), label: 'Season Start', color: 'var(--accent-blue)' },
                      { value: match.season.currentMatchday ?? '—', label: 'Matchday', color: 'var(--accent-green)' },
                      { value: match.season.winner || 'TBD', label: 'Season Winner', color: 'var(--accent-amber)' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div
                          className="text-xl font-bold mb-1"
                          style={{ fontFamily: 'Rajdhani', color: item.color }}
                        >
                          {item.value}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'officials' && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Match Officials
                </h3>
                {match.referees && match.referees.length > 0 ? (
                  <div className="space-y-2">
                    {match.referees.map((referee, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-4 py-3 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
                      >
                        <div>
                          <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{referee.name}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{referee.nationality}</div>
                        </div>
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ background: 'rgba(41,121,255,0.12)', color: '#6ab0ff' }}
                        >
                          {referee.type}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center" style={{ color: 'var(--text-muted)' }}>
                    No referee information available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
