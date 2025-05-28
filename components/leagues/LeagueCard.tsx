import React from 'react';
import Link from 'next/link';
import { League } from '@/types';


interface LeagueCardProps {
  league: League;
}

const LeagueCard: React.FC<LeagueCardProps> = ({league}) => {
  return (
    <Link href={`/leagues/${league.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
        <div className="p-4 flex items-center">
          <div className="relative w-16 h-16 flex-shrink-0">
            <img
              src={league.area?.flag || league.emblem} 
              alt={`${league.name} logo`}
              className="rounded-md"
            />
          </div>
          <div className="ml-4 flex-grow">
            <h3 className="font-bold text-lg text-gray-900">{league.name}</h3>
            <p className="text-gray-600">{league.area?.name}</p>
            {(league.currentSeason) && (
              <div className="mt-2 text-sm text-gray-500">
                {league.currentSeason && <span>Season: {league.currentSeason.startDate}</span>}
                {league.currentSeason.currentMatchday && <span className="ml-2">Matchday: {league.currentSeason.currentMatchday}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LeagueCard;