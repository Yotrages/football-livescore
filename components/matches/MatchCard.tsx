// src/components/matches/MatchCard.tsx
"use client"
import { useRouter } from 'next/navigation';
import { Match } from '@/types';
import { 
  formatMatchDate, 
  formatMatchStatus, 
  getStatusClass, 
  formatTeamName 
} from '@/utils/formatters';
import Link from 'next/link';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const router = useRouter();

  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isScheduled = match.status === 'SCHEDULED' || match.status === 'TIMED';
  
  const handleClick = () => {
    router.push(`/matches/${match.id}`);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer ${isLive ? 'border-l-4 border-red-500' : ''}`}
      onClick={handleClick}
    >
      {/* Competition/League info */}
      {match.competition && (
        <div className="bg-gray-100 px-4 py-2 justify-between flex items-center text-sm text-gray-600">
          <span className='flex items-center'>
            {match.competition.emblem && (
              <img
                src={match.competition.emblem}
                alt={match.competition.name}
                className="w-6 h-6 mr-2"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <span>{match.competition.name}</span>
          </span>
          {match.matchday && <span className="ml-auto">Matchday {match.matchday}</span>}
        </div>
      )}

      <div className="p-4">
        {/* Match status */}
        <div className="flex justify-between items-center mb-4">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(match.status)}`}>
            {formatMatchStatus(match.status, match.minute)}
          </span>
          <span className="text-xs text-gray-500">
            {formatMatchDate(match.utcDate)}
          </span>
        </div>

        {/* Teams and score */}
        <div className="flex items-center justify-between">
          {/* Home team */}
          <Link href={`/teams/${match.homeTeam.id}`} className="flex items-center w-2/5">
            {match.homeTeam.crest && (
              <img 
                src={match.homeTeam.crest} 
                alt={match.homeTeam.shortName} 
                className="w-6 h-6 mr-2"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
            <span className="font-medium text-right w-full truncate">
              {formatTeamName(match.homeTeam)}
            </span>
          </Link>

          {/* Score */}
          <div className="flex-shrink-0 mx-2 w-1/5 text-center">
            {isScheduled ? (
              <div className="text-sm font-medium text-gray-500">vs</div>
            ) : (
              <div className={`font-bold text-lg ${isLive ? 'text-red-600' : ''}`}>
                {match.score.fullTime.home !== null ? match.score.fullTime.home : '-'}
                {' : '}
                {match.score.fullTime.away !== null ? match.score.fullTime.away : '-'}
              </div>
            )}
          </div>

          {/* Away team */}
          <Link href={`/teams/${match.homeTeam.id}`} className="flex items-center w-2/5 justify-end">
            <span className="font-medium text-left w-full truncate">
              {formatTeamName(match.awayTeam)}
            </span>
            {match.awayTeam.crest && (
              <img 
                src={match.awayTeam.crest} 
                alt={match.awayTeam.shortName} 
                className="w-6 h-6 ml-2"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;