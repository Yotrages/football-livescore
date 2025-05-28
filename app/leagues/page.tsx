"use client"
import LeagueCard from '@/components/leagues/LeagueCard'
import { useLeagues } from '@/hooks/useLiveData'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'

const Page = () => {
  const {data: featuredLeagues, error: leagueErrors, isLoading: leagueLoading} = useLeagues(3000000)
  const router = useRouter()
  
  if (leagueLoading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading matches...</p>
          </div>
        </div>
      );
    }
  
    if (leagueErrors || !featuredLeagues) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
            </svg>{" "}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
             No leagues for now
            </h1>
            <p className="text-gray-600 mb-4">
             check back later
            </p>
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
    
    const sortedLeagues = featuredLeagues.sort()
  return (
    <div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {sortedLeagues.length > 0 ? (
                    <div>
                      {sortedLeagues?.map((league) => (
                    <LeagueCard key={league.id} league={league}/>
                  ))}
                    </div>
                  ) : (
                    <div>No matches today</div>
                  )}
                  </div>
    </div>
  )
}

export default Page