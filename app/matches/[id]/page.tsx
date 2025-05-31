"use client"
import Head from 'next/head';
import { useMatchDetails } from '@/hooks/useLiveData';
import { MatchDetails } from '@/components/matches/MatchDetails';
import { FaArrowLeft } from 'react-icons/fa';
import { MdArrowLeft, MdCrisisAlert } from 'react-icons/md';
import { useParams , useRouter} from 'next/navigation';


export default function MatchDetailPage() {
  const router = useRouter()
const params = useParams();
  const id = params.id;
  console.log(id)
  const { data: matchData, isLoading, error } = useMatchDetails(id, 3000000);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <MdCrisisAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Match Not Found</h1>
          <p className="text-gray-600 mb-4">The match you&apos;re looking for could not be loaded.</p>
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


  const match = matchData;

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>
          {match.homeTeam.name} vs {match.awayTeam.name} - {match.competition.name}
        </title>
        <meta 
          name="description" 
          content={`${match.homeTeam.name} vs ${match.awayTeam.name} match details, statistics, lineups and events from ${match.competition.name}`} 
        />
      </Head>

      <main className="container mx-auto px-2 xs:px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MdArrowLeft className="w-4 h-4 mr-2" />
            Back to matches
          </button>
        </div>

        <MatchDetails match={match} />
      </main>
    </div>
  );
}