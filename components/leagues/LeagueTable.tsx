"use client"
import React from 'react';
import Link from 'next/link';
import { LeagueStanding, StandingGroup } from '@/types';
import { useRouter } from 'next/navigation';


export interface LeagueTableProps {
  standings: StandingGroup[] | LeagueStanding[];
  leagueName: string;
  season: string;
  isLoading?: boolean;
}

const LeagueTable: React.FC<LeagueTableProps> = ({ 
  standings, 
  leagueName, 
  season,
  isLoading = false 
}) => {
const router = useRouter()

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No standings data available</p>
      </div>
    );
  }

  const isGroupedFormat = standings[0] && typeof standings[0] === 'object' && 'table' in standings[0];
  
  const standingsGroups: StandingGroup[] = isGroupedFormat 
    ? standings as StandingGroup[]
    : [{ stage: 'REGULAR_SEASON', type: 'TOTAL', table: standings as LeagueStanding[] }];

  const renderStandingsTable = (table: LeagueStanding[], groupTitle?: string) => (
    <div className="flex flex-col w-full">
      <span className='w-full'>
        {groupTitle && (
          <div className="px-4 py-2 min-w-full flex items-center bg-blue-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800">{groupTitle}</h3>
          </div>
        )}
      </span>
      <div className='flex flex-col overflow-x-auto'>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">MP</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GF</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GA</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GD</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table?.map((team) => (
              <tr onClick={() => router.push(`/teams/${team.team.id}`)} key={team.team.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  {team.position}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <Link className='flex items-center gap-3' href={`/teams/${team.team.id}`}>
                    <div className="flex items-center justify-center cursor-pointer">
                      <div className="flex-shrink-0 h-8 w-8 relative">
                        <img
                          src={team.team?.crest || '/placeholder-team.png'}
                          alt={`${team.team.name} crest`}
                          className='object-contain h-full w-full'
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-team.png';
                          }}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 hover:text-blue-600">
                          {team.team.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.playedGames}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.won}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.draw}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.lost}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.goalsFor}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.goalsAgainst}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  <span className={team.goalDifference > 0 ? 'text-green-600' : team.goalDifference < 0 ? 'text-red-600' : 'text-gray-500'}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-xl font-bold text-gray-800">{leagueName} - {season}</h2>
      </div>
      
      {standingsGroups.length === 1 ? (
        renderStandingsTable(standingsGroups[0].table)
      ) : (
        <div className="space-y-6">
          {standingsGroups.map((group, index) => {
            const groupTitle = group.group 
              ? `${group.group}` 
              : group.stage === 'GROUP_STAGE' 
                ? `Group ${index + 1}` 
                : group.stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            
            return (
              <div className='min-w-full' key={`${group.stage}-${group.group || index}`}>
                {renderStandingsTable(group.table, groupTitle)}
                {index < standingsGroups.length - 1 && <div className="border-b-4 border-gray-200"></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeagueTable;