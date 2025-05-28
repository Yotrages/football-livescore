import { useState } from 'react';
import { MatchDetail } from '@/types';
import { FaCalendar, FaClock, FaMapPin } from 'react-icons/fa';
import Link from 'next/link';

export const MatchDetails: React.FC<{ match: MatchDetail }> = ({ match }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'officials'>('overview');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDisplay = () => {
    if (match.status === 'FINISHED') {
      return <span className="text-green-600 font-semibold">Full Time</span>;
    } else if (match.status === 'IN_PLAY') {
      return <span className="text-red-600 font-semibold">Live</span>;
    } else if (match.status === 'PAUSED') {
      return <span className="text-yellow-600 font-semibold">Half Time</span>;
    } else if (match.status === 'TIMED') {
      return <span className="text-blue-600 font-semibold">Scheduled</span>;
    }
    return <span className="text-gray-600 font-semibold">{match.status}</span>;
  };

  const getScoreDisplay = () => {
    if (match.score.fullTime.home !== null && match.score.fullTime.away !== null) {
      return `${match.score.fullTime.home} - ${match.score.fullTime.away}`;
    }
    return "- : -";
  };

  const getHalfTimeScore = () => {
    if (match.score.halfTime.home !== null && match.score.halfTime.away !== null) {
      return `HT: ${match.score.halfTime.home} - ${match.score.halfTime.away}`;
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img src={match.competition.emblem} alt={match.competition.name} className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold">{match.competition.name}</h1>
              <p className="text-blue-100">Matchday {match.season.currentMatchday}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <FaCalendar className="w-4 h-4" />
              <span className="text-sm">{formatDate(match.utcDate)}</span>
            </div>
            {match.venue && (
              <div className="flex items-center space-x-2">
                <FaMapPin className="w-4 h-4" />
                <span className="text-sm">{match.venue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Score Display */}
        <div className="flex items-center justify-center space-x-8 py-6">
          <Link href={`/teams/${match.homeTeam.id}`} className="text-center">
            <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-16 h-16 mx-auto mb-2" />
            <h2 className="text-xl font-bold">{match.homeTeam.name}</h2>
            <p className="text-blue-100 text-sm">{match.homeTeam.shortName}</p>
          </Link>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              {getScoreDisplay()}
            </div>
            {getHalfTimeScore() && (
              <div className="text-sm text-blue-100 mb-1">
                {getHalfTimeScore()}
              </div>
            )}
            {getStatusDisplay()}
          </div>
          
          <Link href={`/teams/${match.awayTeam.id}`} className="text-center">
            <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-16 h-16 mx-auto mb-2" />
            <h2 className="text-xl font-bold">{match.awayTeam.name}</h2>
            <p className="text-blue-100 text-sm">{match.awayTeam.shortName}</p>
          </Link>
        </div>

        {/* Match Info */}
        <div className="flex justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-1">
            <FaClock className="w-4 h-4" />
            <span>Updated: {new Date(match.lastUpdated).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {['overview', 'officials'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Match Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Match Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Competition:</span>
                    <span className="font-medium">{match.competition.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stage:</span>
                    <span className="font-medium">{match.stage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Matchday:</span>
                    <span className="font-medium">{match.matchday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{match.status}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(match.utcDate)}</span>
                  </div>
                  {match.score.winner && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Winner:</span>
                      <span className="font-medium text-green-600">{match.score.winner}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{match.score.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{new Date(match.lastUpdated).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Teams Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-700">Home Team</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="w-12 h-12" />
                  <div>
                    <h4 className="font-bold text-lg">{match.homeTeam.name}</h4>
                    <p className="text-gray-600">{match.homeTeam.shortName} ({match.homeTeam.tla})</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-700">Away Team</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="w-12 h-12" />
                  <div>
                    <h4 className="font-bold text-lg">{match.awayTeam.name}</h4>
                    <p className="text-gray-600">{match.awayTeam.shortName} ({match.awayTeam.tla})</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Season Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Season Information</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {new Date(match.season.startDate).getFullYear()}
                  </div>
                  <div className="text-sm text-gray-500">Season Start</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{match.season.currentMatchday}</div>
                  <div className="text-sm text-gray-500">Current Matchday</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {match.season.winner || 'TBD'}
                  </div>
                  <div className="text-sm text-gray-500">Season Winner</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'officials' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Match Officials</h3>
              <div className="space-y-4">
                {match.referees && match.referees.length > 0 ? (
                  match.referees.map((referee, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-lg">{referee.name}</div>
                          <div className="text-sm text-gray-500">{referee.nationality}</div>
                        </div>
                        <div className="text-right">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {referee.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    No referee information available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};