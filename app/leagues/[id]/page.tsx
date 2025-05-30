"use client";
import { useState } from "react";
import Head from "next/head";
import { useParams } from "next/navigation";
import LeagueTable from "@/components/leagues/LeagueTable";
import MatchCard from "@/components/matches/MatchCard";
import {
  useLeagueStandings,
  useSingleCompetitionScorers,
  useSingleLeague,
  useSingleLeagueMatches,
  useSingleLeaguePrevMatches,
} from "@/hooks/useLiveData";
import { CompetitionScorers } from "@/components/leagues/Scorers";
import { FaShieldAlt } from "react-icons/fa";

const LeaguePage = () => {
  const params = useParams();
  const id = params.id;
  const {
    data: fixtures,
    isLoading: fixturesLoading,
    error: fixturesError,
  } = useSingleLeagueMatches(id, 300000);
  const {
    data: leagueDetails,
    isLoading: leagueLoading,
    error: leagueErrors,
  } = useSingleLeague(id, 300000);
  const {
    data: standings,
    isLoading: standingsLoading,
    error: standingsError,
  } = useLeagueStandings(id, 300000);
  const {
    data: results,
    isLoading: resultsLoading,
    error: resultsError,
  } = useSingleLeaguePrevMatches(id, 300000);
  const {
    data: scorers,
    isLoading: scorersLoading,
    error: scorersError,
  } = useSingleCompetitionScorers(id, 380000);
  const [activeTab, setActiveTab] = useState<
    "standings" | "fixtures" | "results" | "scorers"
  >("standings");

  console.log('Debug info:', {
    fixtures, results, standings, scorers, leagueDetails,
    fixturesError, leagueErrors, standingsError, resultsError, scorersError,
    fixturesLoading, leagueLoading, standingsLoading, scorersLoading, resultsLoading
  });

  const isLoading = fixturesLoading || leagueLoading || standingsLoading || scorersLoading || resultsLoading;

  const hasErrors = !!(fixturesError && fixturesError) || 
                   !!(leagueErrors && leagueErrors) || 
                   !!(standingsError && standingsError) || 
                   !!(resultsError && resultsError) || 
                   !!(scorersError && scorersError);

  // Check if critical data is missing or empty
  const isCriticalDataMissing = !leagueDetails || 
                               (typeof leagueDetails === 'object' && Object.keys(leagueDetails).length === 0) ||
                               !leagueDetails.name;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading league information...</p>
        </div>
      </div>
    );
  }

  // Show error screen if there are errors OR if critical data is missing
  if (hasErrors || isCriticalDataMissing) {
    console.log('Showing error screen because:', { hasErrors, isCriticalDataMissing });
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaShieldAlt className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            League Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            Unable to load league information
            {hasErrors && <span className="block text-sm mt-2">Error occurred - Please try again later</span>}
            {isCriticalDataMissing && <span className="block text-sm mt-2">League data is missing</span>}
          </p>
          <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
        </div>
      </div>
    );
  }

  const seasonStart = leagueDetails?.currentSeason?.startDate?.slice(0, 4) || 'N/A';
  const seasonEnd = leagueDetails?.currentSeason?.endDate?.slice(0, 4) || 'N/A';
  const season = seasonStart !== 'N/A' && seasonEnd !== 'N/A' ? `${seasonStart}/${seasonEnd}` : 'Unknown Season';

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Football Livescore & News</title>
      </Head>

      <main className="container mx-auto px-2 xs:px-4 py-8">
        {/* League Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="relative h-32 w-32 md:h-40 md:w-40 mb-4 md:mb-0">
              <img
                src={leagueDetails?.area?.flag || "/placeholder-league.png"}
                alt={leagueDetails?.name}
              />
            </div>
            <div className="md:ml-8 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {leagueDetails?.name}
              </h1>
              <p className="text-gray-600 mb-1">{leagueDetails?.area?.name}</p>
              <p className="text-gray-600 mb-4">Season: {season}</p>
              <div className="bg-gray-100 rounded-lg p-3 inline-block">
                <p className="text-sm">
                  Current Matchday:{" "}
                  <span className="font-bold">
                    {leagueDetails?.currentSeason?.currentMatchday}
                  </span>
                </p>
                <p className="text-sm">
                  Season Period: <span className="font-bold">{season}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap mb-6 bg-white rounded-lg shadow-md p-1">
          <button
            onClick={() => setActiveTab("standings")}
            className={`flex-1 xs:py-2 py-1 px-2 text-center rounded-md ${
              activeTab === "standings"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Standings
          </button>
          <button
            onClick={() => setActiveTab("fixtures")}
            className={`flex-1 xs:py-2 py-1 px-2 text-center rounded-md ${
              activeTab === "fixtures"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Upcoming Fixtures
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex-1 xs:py-2 py-1 px-2 text-center rounded-md ${
              activeTab === "results"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Recent Results
          </button>
          <button
            onClick={() => setActiveTab("scorers")}
            className={`flex-1 xs:py-2 py-1 px-2 text-center rounded-md ${
              activeTab === "scorers"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Top Scorers
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "standings" && (
          <>
            {standings ? (
              <LeagueTable
                standings={standings}
                leagueName={leagueDetails.name}
                season={season}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">Standings data is currently unavailable</p>
              </div>
            )}
          </>
        )}

        {activeTab === "scorers" && (
          <>
            {scorers ? (
              <CompetitionScorers data={scorers} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">Top scorers data is currently unavailable</p>
              </div>
            )}
          </>
        )}

        {activeTab === "fixtures" && (
          <div className="bg-white rounded-lg shadow-md px-2">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Upcoming Fixtures
            </h2>
            {fixtures && fixtures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fixtures.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : fixtures && fixtures.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No upcoming fixtures available
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Fixtures data is currently unavailable
              </div>
            )}
          </div>
        )}

        {activeTab === "results" && (
          <div className="rounded-lg shadow-md px-2">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Recent Results
            </h2>
            {results && results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : results && results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent results available
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Results data is currently unavailable
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default LeaguePage;