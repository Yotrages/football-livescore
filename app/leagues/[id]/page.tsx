"use client"
import { useState } from 'react';
import Head from 'next/head';
import { useParams } from 'next/navigation';
import LeagueTable from '@/components/leagues/LeagueTable';
import MatchCard from '@/components/matches/MatchCard';
import { useLeagueStandings, useSingleCompetitionScorers, useSingleLeague, useSingleLeagueMatches, useSingleLeaguePrevMatches, } from '@/hooks/useLiveData';
import { CompetitionScorers } from '@/components/leagues/Scorers';

const LeaguePage = () => {
 const params = useParams();
   const id = params.id;
   const { data: fixtures, isLoading } = useSingleLeagueMatches(id, 300000);
    const {data: leagueDetails} = useSingleLeague(id, 300000)
    const {data: standings} = useLeagueStandings(id,300000)
    const {data:  results} = useSingleLeaguePrevMatches(id,300000)
    const {data: scorers} = useSingleCompetitionScorers(id, 380000)
  const [activeTab, setActiveTab] = useState<'standings' | 'fixtures' | 'results' | 'scorers'>('standings');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const seasonStart = leagueDetails.currentSeason?.startDate.slice(0, 4)
  const seasonEnd = leagueDetails.currentSeason?.endDate.slice(0, 4)
  const season = `${seasonStart}/${seasonEnd}`

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Football Livescore & News</title>
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* League Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative h-32 w-32 md:h-40 md:w-40 mb-4 md:mb-0">
              <img
                src={leagueDetails?.area?.flag || '/placeholder-league.png'}
                alt={leagueDetails?.name}
              />
            </div>
            <div className="md:ml-8 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{leagueDetails?.name}</h1>
              <p className="text-gray-600 mb-1">{leagueDetails?.area?.name}</p>
              <p className="text-gray-600 mb-4">Season: {season}</p>
              <div className="bg-gray-100 rounded-lg p-3 inline-block">
                <p className="text-sm">Current Matchday: <span className="font-bold">{leagueDetails?.currentSeason?.currentMatchday}</span></p>
                <p className="text-sm">Season Period: <span className="font-bold">{season}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-white rounded-lg shadow-md p-1">
          <button
            onClick={() => setActiveTab('standings')}
            className={`flex-1 py-3 text-center rounded-md ${
              activeTab === 'standings' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Standings
          </button>
          <button
            onClick={() => setActiveTab('fixtures')}
            className={`flex-1 py-3 text-center rounded-md ${
              activeTab === 'fixtures' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Upcoming Fixtures
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 py-3 text-center rounded-md ${
              activeTab === 'results' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Recent Results
          </button>
          <button
            onClick={() => setActiveTab('scorers')}
            className={`flex-1 py-3 text-center rounded-md ${
              activeTab === 'scorers' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Top Scorers
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'standings' && (
          <LeagueTable 
            standings={standings}
            leagueName={leagueDetails.name}
            season={season}
          />
        )}

        {activeTab === 'scorers' && (
          <CompetitionScorers data={scorers}/>
        )}

        {activeTab === 'fixtures' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Upcoming Fixtures</h2>
            {fixtures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fixtures.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No upcoming fixtures available
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Results</h2>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent results available
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default LeaguePage