"use client"
import MatchCard from "@/components/matches/MatchCard";
import { useTodayMatches, useUpcomingMatches, useLeagues, useLiveMatches } from "@/hooks/useLiveData";
import React, {useState} from "react";
import LeagueCard from "@/components/leagues/LeagueCard"
// import NewsCard from "@/components/news/NewsCard";

const Page = () => {
  const { data: matches } = useTodayMatches(30000);
  const {data: upcomingMatches} = useUpcomingMatches(300000)
  const {data: featuredLeagues} = useLeagues(3000000)
  const {data: liveMatches} = useLiveMatches(30000)
  const [currentTab, setCurrentTab] = useState<'Today' | 'live' | 'upcoming'>('Today');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Live Sports Hub
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Stay updated with live matches, scores, and the latest sports news from around the world
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <main className="container mx-auto px-6 py-12 space-y-16">
        {/* Top Leagues Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Top Leagues</h2>
              <p className="text-gray-600">Follow your favorite competitions</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLeagues?.map((league) => (
              <div key={league.id} className="transform hover:scale-105 transition-all duration-300">
                <LeagueCard league={league} />
              </div>
            ))}
          </div>
        </section>

        {/* Matches Section */}
        <section>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Matches</h2>
              <p className="text-gray-600">Today&apos;s games and upcoming fixtures</p>
            </div>
            
            {/* Enhanced Tab Navigation */}
            <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-1.5 border border-white/20">
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentTab === 'Today'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
                onClick={() => setCurrentTab('Today')}
              >
                <div className="flex items-center space-x-2">
                  <span>Today</span>
                  {matches?.length > 0 && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                      {matches.length}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentTab === 'live'
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
                onClick={() => setCurrentTab('live')}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                  {liveMatches?.length > 0 && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                      {liveMatches.length}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentTab === 'upcoming'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
                onClick={() => setCurrentTab('upcoming')}
              >
                <div className="flex items-center space-x-2">
                  <span>Upcoming</span>
                  {upcomingMatches?.length > 0 && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                      {upcomingMatches.length}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Matches Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-8">
              {currentTab === 'live' ? (
                liveMatches?.length > 0 ? (
                  <>
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <h3 className="text-lg font-semibold text-gray-800">Live Matches</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {liveMatches?.map((match) => (
                        <div key={match.id} className="transform hover:scale-105 transition-all duration-300">
                          <MatchCard match={match} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Live Matches</h3>
                    <p className="text-gray-500">Check back later for live updates</p>
                  </div>
                )
              ) : currentTab === 'upcoming' ? (
                upcomingMatches?.length > 0 ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Upcoming Fixtures</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {upcomingMatches?.map((match) => (
                        <div key={match.id} className="transform hover:scale-105 transition-all duration-300">
                          <MatchCard match={match} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Matches</h3>
                    <p className="text-gray-500">New fixtures will appear here</p>
                  </div>
                )
              ) : currentTab === 'Today' ? (
                matches?.length > 0 ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Today&apos;s Matches</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {matches?.map((match) => (
                        <div key={match.id} className="transform hover:scale-105 transition-all duration-300">
                          <MatchCard match={match} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Matches Today</h3>
                    <p className="text-gray-500">Enjoy your break from the action!</p>
                  </div>
                )
              ) : (
                <div className="py-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Connection Issue</h3>
                  <p className="text-gray-500">Unable to load matches. Please check your connection and try again.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Latest News</h2>
              <p className="text-gray-600">Stay informed with the latest sports updates</p>
            </div>
            <button className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 text-gray-600 hover:text-blue-600 transition-colors">
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="py-16 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">News Coming Soon</h3>
              <p className="text-gray-500">We&apos;re working on bringing you the latest sports news and updates</p>
            </div>
          </div>
          
          {/* Uncommented news section for when ready */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <div key={news.id} className="transform hover:scale-105 transition-all duration-300">
                <NewsCard
                  id={news.id}
                  title={news.title}
                  summary={news.summary}
                  image={news.image}
                  publishedAt={news.publishedAt}
                  source={news.source}
                  url={news.url}
                />
              </div>
            ))}
          </div> */}
        </section>
      </main>

    </div>
  );
};

export default Page;