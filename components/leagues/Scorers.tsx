"use client"
import { useState } from 'react';
import { SingleCompetitionScorers } from '@/types';
import { FaTrophy, FaFootballBall, FaHandsHelping, FaBullseye, FaCalendar, FaGamepad, FaFlag, FaBirthdayCake, FaSearch } from 'react-icons/fa';
import Link from 'next/link';

export const CompetitionScorers: React.FC<{ data: SingleCompetitionScorers }> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'goals' | 'assists' | 'matches' | 'penalties'>('goals');

  const filteredAndSortedScorers = data.scorers
    .filter(scorer => 
      scorer.player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scorer.team.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'goals':
          return b.goals - a.goals;
        case 'assists':
          return b.assists - a.assists;
        case 'matches':
          return b.playedMatches - a.playedMatches;
        case 'penalties':
          return b.penalties - a.penalties;
        default:
          return b.goals - a.goals;
      }
    });

  const getAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <span className="text-yellow-500 text-2xl">🥇</span>;
    if (index === 1) return <span className="text-gray-400 text-2xl">🥈</span>;
    if (index === 2) return <span className="text-amber-600 text-2xl">🥉</span>;
    return <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">{index + 1}</span>;
  };

  const StatBadge = ({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) => (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${color} text-white text-sm font-medium`}>
      {icon}
      <span>{value}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img src={data.competition.emblem} alt={data.competition.name} className="w-16 h-16" />
            <div>
              <h1 className="text-3xl font-bold">{data.competition.name}</h1>
              <p className="text-blue-100">Top Scorers - Season {data.season.startDate.split('-')[0]}/{data.season.endDate.split('-')[0]}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <FaTrophy className="w-5 h-5" />
              <span className="text-lg font-semibold">{data.count} Players</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendar className="w-4 h-4" />
              <span className="text-sm">Matchday {data.season.currentMatchday}</span>
            </div>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search players or teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-white/80">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="goals" className="text-black">Goals</option>
              <option value="assists" className="text-black">Assists</option>
              <option value="matches" className="text-black">Matches</option>
              <option value="penalties" className="text-black">Penalties</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top 3 Showcase */}
      <div className="bg-gradient-to-b from-gray-50 to-white p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">🏆 Top 3 Scorers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {filteredAndSortedScorers.slice(0, 3).map((scorer, index) => (
            <div key={scorer.player.id} className={`relative overflow-hidden rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ${
              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 md:scale-110' :
              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
              'bg-gradient-to-br from-amber-500 to-amber-700'
            }`}>
              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  {getRankIcon(index)}
                  <img src={scorer.team.crest} alt={scorer.team.name} className="w-12 h-12" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{scorer.player.name}</h3>
                  <p className="text-sm opacity-90 mb-1">{scorer.team.name}</p>
                  <p className="text-xs opacity-75 mb-4">{scorer.player.nationality} • Age {getAge(scorer.player.dateOfBirth)}</p>
                  <div className="text-4xl font-bold mb-2">{scorer.goals}</div>
                  <div className="text-sm opacity-90">Goals</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <FaFootballBall className="w-6 h-6 mr-3 text-green-600" />
          Full Leaderboard
        </h2>
        
        <div className="space-y-3">
          {filteredAndSortedScorers.map((scorer, index) => (
            <div key={scorer.player.id} className={`bg-white border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300 ${
              index < 3 ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-white' : 'border-gray-200 hover:border-blue-300'
            }`}>
              <Link href={`/players/${scorer.player.id}`} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getRankIcon(index)}
                  </div>
                  
                  <img src={scorer.team.crest} alt={scorer.team.name} className="w-12 h-12" />
                  
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{scorer.player.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="font-medium">{scorer.team.shortName}</span>
                      <div className="flex items-center space-x-1">
                        <FaFlag className="w-3 h-3" />
                        <span>{scorer.player.nationality}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaBirthdayCake className="w-3 h-3" />
                        <span>{getAge(scorer.player.dateOfBirth)} years</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-wrap justify-end">
                  <StatBadge
                    icon={<FaFootballBall className="w-4 h-4" />}
                    value={scorer.goals}
                    label="Goals"
                    color="bg-green-500"
                  />
                  <StatBadge
                    icon={<FaHandsHelping className="w-4 h-4" />}
                    value={scorer.assists}
                    label="Assists"
                    color="bg-blue-500"
                  />
                  <StatBadge
                    icon={<FaBullseye className="w-4 h-4" />}
                    value={scorer.penalties}
                    label="Penalties"
                    color="bg-purple-500"
                  />
                  <StatBadge
                    icon={<FaGamepad className="w-4 h-4" />}
                    value={scorer.playedMatches}
                    label="Matches"
                    color="bg-gray-500"
                  />
                </div>
              </Link>
              
              {/* Additional stats bar for top scorers */}
              {index < 5 && (
                <div className="mt-4 bg-gray-100 rounded-lg p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{(scorer.goals / scorer.playedMatches).toFixed(2)}</div>
                      <div className="text-gray-600">Goals/Match</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{scorer.goals + scorer.assists}</div>
                      <div className="text-gray-600">G+A</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{scorer.penalties > 0 ? ((scorer.penalties / scorer.goals) * 100).toFixed(0) + '%' : '0%'}</div>
                      <div className="text-gray-600">Penalty %</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-600">{((scorer.goals + scorer.assists) / scorer.playedMatches).toFixed(2)}</div>
                      <div className="text-gray-600">G+A/Match</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredAndSortedScorers.length === 0 && (
          <div className="text-center py-12">
            <FaSearch className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No players found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};