import React from 'react';
import Link from 'next/link';

interface TeamStanding {
  position: number;
  team: {
    id: number;
    name: string;
    crest: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form?: string;
}

interface LeagueTableProps {
  standings: TeamStanding[];
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-xl font-bold text-gray-800">{leagueName} - {season}</h2>
      </div>
      <div className="overflow-x-auto">
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
            {standings?.map((team) => (
              <tr key={team.team.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                  {team.position}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <Link href={`/teams/${team.team.id}`}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 relative">
                        <img
                          src={team.team?.crest || '/placeholder-team.png'}
                          alt={`${team.team.name} crest`}
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{team.team.name}</div>
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
                <td className="px-3 py-4 whitespace-nowrap text-sm text-center text-gray-500">{team.goalDifference}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-900">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeagueTable;