import React from 'react';
import Link from 'next/link';
import { League } from '@/types';

interface LeagueCardProps {
  league: League;
}

const LeagueCard: React.FC<LeagueCardProps> = ({ league }) => {
  return (
    <Link href={`/leagues/${league.id}`}>
      <div className="league-card group">
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <img
              src={league.emblem || league.area?.flag}
              alt={`${league.name} logo`}
              className="w-8 h-8 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-sm leading-tight truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {league.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              {league.area?.flag && (
                <img
                  src={league.area.flag}
                  alt={league.area.name}
                  className="w-3.5 h-3.5 object-cover rounded-sm"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {league.area?.name}
              </span>
            </div>
            {league.currentSeason?.currentMatchday && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                MD {league.currentSeason.currentMatchday}
              </span>
            )}
          </div>
          <div
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(41,121,255,0.2)', color: '#6ab0ff' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LeagueCard;
