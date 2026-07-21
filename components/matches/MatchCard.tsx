"use client"
import { useRouter } from 'next/navigation';
import { Match } from '@/types';
import {
  formatMatchDate,
  formatMatchStatus,
  formatTeamName
} from '@/utils/formatters';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const router = useRouter();

  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isScheduled = match.status === 'SCHEDULED' || match.status === 'TIMED';
  const isFinished = match.status === 'FINISHED';
  const isHalfTime = match.status === 'PAUSED';

  const getStatusBadge = () => {
    if (isLive && !isHalfTime) {
      return (
        <div className="flex items-center gap-1.5">
          <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>
          <span className="status-live">{match.minute ? `${match.minute}'` : 'LIVE'}</span>
        </div>
      );
    }
    if (isHalfTime) return <span className="status-paused">HT</span>;
    if (isFinished) return <span className="status-finished">FT</span>;
    if (isScheduled) return <span className="status-scheduled">{formatMatchDate(match.utcDate)}</span>;
    return <span className="status-finished">{formatMatchStatus(match.status, match.minute)}</span>;
  };

  const homeScore = match.score.fullTime.home;
  const awayScore = match.score.fullTime.away;
  const homeWon = homeScore !== null && awayScore !== null && homeScore > awayScore;
  const awayWon = homeScore !== null && awayScore !== null && awayScore > homeScore;

  return (
    <div
      className={`match-card ${isLive ? 'is-live' : ''}`}
      onClick={() => router.push(`/matches/${match.id}`)}
    >
      {/* Competition header */}
      {match.competition && (
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.15)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            {match.competition.emblem && (
              <img
                src={match.competition.emblem}
                alt={match.competition.name}
                className="w-4 h-4 object-contain flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <span
              className="text-xs font-medium truncate"
              style={{ color: 'var(--text-secondary)' }}
            >
              {match.competition.name}
            </span>
          </div>
          {match.matchday && match.matchday !== 0 && (
            <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>
              MD {match.matchday}
            </span>
          )}
        </div>
      )}

      {/* Match body */}
      <div className="px-3 py-3">
        {/* Teams + Score row */}
        <div className="flex items-center gap-2">
          {/* Home team */}
          <div
            className="flex items-center gap-2 flex-1 min-w-0"
            onClick={(e) => { e.stopPropagation(); router.push(`/teams/${match.homeTeam.id}`); }}
          >
            {match.homeTeam.crest && (
              <img
                src={match.homeTeam.crest}
                alt={match.homeTeam.shortName}
                className="w-6 h-6 object-contain flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <span
              className="text-sm font-semibold truncate"
              style={{
                color: isFinished && homeWon ? 'var(--text-primary)' : isFinished && !homeWon ? 'var(--text-muted)' : 'var(--text-primary)',
                fontWeight: homeWon ? 700 : 500,
              }}
            >
              {formatTeamName(match.homeTeam)}
            </span>
          </div>

          {/* Score / VS */}
          <div className="flex-shrink-0 text-center w-16">
            {isScheduled ? (
              <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>VS</span>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <span
                  className="score-display"
                  style={{
                    color: isLive ? 'var(--accent-green)' : 'var(--text-primary)',
                    fontSize: '18px',
                    fontWeight: homeWon ? 800 : 700
                  }}
                >
                  {homeScore !== null ? homeScore : '-'}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>:</span>
                <span
                  className="score-display"
                  style={{
                    color: isLive ? 'var(--accent-green)' : 'var(--text-primary)',
                    fontSize: '18px',
                    fontWeight: awayWon ? 800 : 700
                  }}
                >
                  {awayScore !== null ? awayScore : '-'}
                </span>
              </div>
            )}
          </div>

          {/* Away team */}
          <div
            className="flex items-center gap-2 flex-1 min-w-0 justify-end"
            onClick={(e) => { e.stopPropagation(); router.push(`/teams/${match.awayTeam.id}`); }}
          >
            <span
              className="text-sm truncate text-right"
              style={{
                color: isFinished && awayWon ? 'var(--text-primary)' : isFinished && !awayWon ? 'var(--text-muted)' : 'var(--text-primary)',
                fontWeight: awayWon ? 700 : 500,
              }}
            >
              {formatTeamName(match.awayTeam)}
            </span>
            {match.awayTeam.crest && (
              <img
                src={match.awayTeam.crest}
                alt={match.awayTeam.shortName}
                className="w-6 h-6 object-contain flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
          </div>
        </div>

        {/* Status row */}
        <div className="flex justify-center mt-2">
          {getStatusBadge()}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
