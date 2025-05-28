"use client"
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSingleTeamMatches, useTeamInfo } from '@/hooks/useLiveData';
import { FaArrowLeft, FaCalendar, FaExternalLinkAlt, FaGlobe, FaMapPin, FaShieldAlt, FaTrophy, FaUser, FaUsers } from 'react-icons/fa';
import MatchCard from '@/components/matches/MatchCard';

const SingleTeamPage = () => {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id;
  
  const { data: teamData, isLoading: teamLoading, error: teamError } = useTeamInfo(teamId, 30000);
  const { data: matchesData, isLoading: matchesLoading } = useSingleTeamMatches(teamId, 300000);
  

  const [activeTab, setActiveTab] = useState<'overview' | 'squad' | 'matches' | 'stats'>('overview');

  if (teamLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team information...</p>
        </div>
      </div>
    );
  }

  if (teamError || !teamData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaShieldAlt className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Team Not Found</h1>
          <p className="text-gray-600 mb-4">Unable to load team information</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPositionColor = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes('goalkeeper')) return 'bg-yellow-100 text-yellow-800';
    if (pos.includes('back') || pos.includes('defence')) return 'bg-blue-100 text-blue-800';
    if (pos.includes('midfield')) return 'bg-green-100 text-green-800';
    if (pos.includes('forward') || pos.includes('winger')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <img
                src={teamData?.crest || ""}
                alt={`${teamData.name} crest`}
                className="object-contain"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {teamData.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{teamData.shortName} • {teamData.tla}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCalendar className="w-4 h-4" />
                  <span>Founded {teamData.founded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapPin className="w-4 h-4" />
                  <span>{teamData.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={teamData.area?.flag} className="w-4 h-4 text-lg" />
                  <span>{teamData.area?.name}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={teamData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaGlobe className="w-4 h-4" />
                Official Website
                <FaExternalLinkAlt className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: FaShieldAlt },
              { id: 'squad', label: 'Squad', icon: FaUsers },
              { id: 'matches', label: 'Matches', icon: FaTrophy },
              { id: 'stats', label: 'Statistics', icon: FaCalendar }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Team Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Team Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-800">{teamData.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Club Colors</label>
                    <p className="text-gray-800">{teamData.clubColors}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Stadium</label>
                    <p className="text-gray-800">{teamData.venue}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Founded</label>
                    <p className="text-gray-800">{teamData.founded}</p>
                  </div>
                </div>
              </div>

              {/* Coach Info */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Manager</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FaUser className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{teamData.coach?.name}</h3>
                    <p className="text-gray-600">{teamData.coach?.nationality}</p>
                    <p className="text-sm text-gray-500">
                      Contract: {formatDate(teamData.coach?.contract?.start)} - {formatDate(teamData.coach.contract.until)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Competitions */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Competitions</h2>
                <div className="space-y-3">
                  {teamData.runningCompetitions && teamData.runningCompetitions?.map((competition) => (
                    <div key={competition.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 relative">
                        <img
                          src={competition.emblem}
                          alt={competition.name}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{competition.name}</p>
                        <p className="text-sm text-gray-500">{competition.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'squad' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Squad</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamData.squad.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.id}`}
                  className="group block p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                        {player.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(player.position)}`}>
                          {player.position}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {player.nationality} • {new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()} years
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent & Upcoming Matches</h2>
              {matchesData.resultSet && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{matchesData.resultSet.played}</span> matches played
                </div>
              )}
            </div>
            
            {matchesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading matches...</p>
              </div>
            ) : matchesData.matches && matchesData.matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchesData.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaTrophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No matches available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Season Statistics</h2>
            {matchesData.resultSet ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{matchesData.resultSet.wins}</div>
                  <div className="text-green-800 font-medium">Wins</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{matchesData.resultSet.draws}</div>
                  <div className="text-yellow-800 font-medium">Draws</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{matchesData.resultSet.losses}</div>
                  <div className="text-red-800 font-medium">Losses</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{matchesData.resultSet.played}</div>
                  <div className="text-blue-800 font-medium">Played</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No statistics available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleTeamPage