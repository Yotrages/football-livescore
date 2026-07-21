"use client"
import { useMatchDetails } from '@/hooks/useLiveData';
import { MatchDetails } from '@/components/matches/MatchDetails';
import { FaArrowLeft } from 'react-icons/fa';
import { useParams, useRouter } from 'next/navigation';

export default function MatchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { data: matchData, isLoading, error } = useMatchDetails(id, 30000);

  if (isLoading) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="skeleton h-8 w-20 rounded mb-6"></div>
          <div className="rounded-2xl overflow-hidden mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="skeleton h-14"></div>
            <div className="p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div className="skeleton w-20 h-20 rounded-2xl"></div>
                  <div className="skeleton h-4 w-28 rounded"></div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="skeleton h-14 w-32 rounded"></div>
                  <div className="skeleton h-7 w-24 rounded-full"></div>
                </div>
                <div className="flex flex-col items-center gap-3 flex-1">
                  <div className="skeleton w-20 h-20 rounded-2xl"></div>
                  <div className="skeleton h-4 w-28 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="skeleton h-10"></div>
            <div className="p-5 space-y-3">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-10 rounded-lg"></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Match Not Found</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>The match you&apos;re looking for could not be loaded.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: 'var(--accent-blue)', color: '#fff' }}
          >
            <FaArrowLeft size={12} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return <MatchDetails match={matchData} />;
}
