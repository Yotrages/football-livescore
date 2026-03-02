"use client"
import { useSinglePlayer } from '@/hooks/useLiveData';
import { calculateAge, formatDate, getPositionColor } from '@/utils/formatters';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaCalendarAlt, FaGlobe, FaTrophy, FaUser } from 'react-icons/fa';

const positionStyles: Record<string, { bg: string; color: string }> = {
  goalkeeper: { bg: 'rgba(255,193,7,0.15)', color: '#ffc107' },
  defence: { bg: 'rgba(41,121,255,0.12)', color: '#6ab0ff' },
  midfield: { bg: 'rgba(0,230,118,0.12)', color: '#00e676' },
  offence: { bg: 'rgba(255,23,68,0.12)', color: '#ff6b8a' },
};

const getPositionStyle = (position: string) => {
  if (!position) return { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' };
  const pos = position.toLowerCase();
  if (pos.includes('goalkeeper') || pos.includes('keeper')) return positionStyles.goalkeeper;
  if (pos.includes('back') || pos.includes('defence') || pos.includes('defender')) return positionStyles.defence;
  if (pos.includes('midfield')) return positionStyles.midfield;
  if (pos.includes('forward') || pos.includes('winger') || pos.includes('offence') || pos.includes('striker')) return positionStyles.offence;
  return { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' };
};

const SinglePlayerPage: React.FC = () => {
  const router = useRouter();
  const param = useParams();
  const id = param.id;

  const { data: selectedPlayer, isLoading: playerLoading, error: playerError } = useSinglePlayer(id, 3600000);

  if (playerLoading) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="skeleton h-8 w-16 rounded mb-6"></div>
          <div className="rounded-2xl p-6 mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-5">
              <div className="skeleton w-24 h-24 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="skeleton h-7 w-48 rounded"></div>
                <div className="skeleton h-4 w-32 rounded"></div>
                <div className="flex gap-2">
                  <div className="skeleton h-6 w-20 rounded-full"></div>
                  <div className="skeleton h-6 w-20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="skeleton h-56 rounded-xl"></div>
            <div className="skeleton h-56 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (playerError || !selectedPlayer) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Player Not Found</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Unable to load player information.</p>
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

  const posStyle = getPositionStyle(selectedPlayer.position);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-5 text-sm font-medium transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <FaArrowLeft size={12} /> Back
        </button>

        {/* Player Hero Card */}
        <div
          className="rounded-2xl overflow-hidden mb-5"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <div
            className="px-5 py-6"
            style={{ background: `linear-gradient(135deg, ${posStyle.bg} 0%, rgba(0,0,0,0) 60%)` }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-black"
                style={{ background: posStyle.bg, border: `2px solid ${posStyle.color}`, color: posStyle.color, fontFamily: 'Rajdhani' }}
              >
                {selectedPlayer.firstName?.[0] || ''}{selectedPlayer.lastName?.[0] || ''}
                {selectedPlayer.shirtNumber ? (
                  <span className="text-sm ml-0.5">#{selectedPlayer.shirtNumber}</span>
                ) : null}
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <h1
                  className="font-bold text-2xl sm:text-3xl mb-1"
                  style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', letterSpacing: '0.5px' }}
                >
                  {selectedPlayer.name}
                </h1>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-3">
                  {selectedPlayer.position && (
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: posStyle.bg, color: posStyle.color, border: `1px solid ${posStyle.color}33` }}
                    >
                      {selectedPlayer.position}
                    </span>
                  )}
                  {selectedPlayer.shirtNumber && (
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-bold"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}
                    >
                      #{selectedPlayer.shirtNumber}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex items-center gap-1">
                    <FaGlobe size={10} />
                    <span>{selectedPlayer.nationality}</span>
                  </div>
                  {selectedPlayer.dateOfBirth && (
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt size={10} />
                      <span>{calculateAge(selectedPlayer.dateOfBirth)} years old</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Team badge */}
              {selectedPlayer.currentTeam?.crest && (
                <div
                  className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-xl cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                  onClick={() => router.push(`/teams/${selectedPlayer.currentTeam?.id}`)}
                  title={selectedPlayer.currentTeam?.name}
                >
                  <img
                    src={selectedPlayer.currentTeam.crest}
                    alt={selectedPlayer.currentTeam.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detail cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Personal Info */}
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <h2
              className="font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: 'Rajdhani', color: 'var(--text-muted)' }}
            >
              <FaUser size={11} /> Personal Info
            </h2>
            <div className="space-y-2">
              {[
                { label: 'Full Name', value: `${selectedPlayer.firstName || ''} ${selectedPlayer.lastName || ''}`.trim() || selectedPlayer.name },
                { label: 'Date of Birth', value: selectedPlayer.dateOfBirth ? formatDate(selectedPlayer.dateOfBirth) : undefined },
                { label: 'Age', value: selectedPlayer.dateOfBirth ? `${calculateAge(selectedPlayer.dateOfBirth)} years` : undefined },
                { label: 'Nationality', value: selectedPlayer.nationality },
                { label: 'Section', value: selectedPlayer.section?.replace(/_/g, ' ') },
                { label: 'Position', value: selectedPlayer.position },
              ].filter(item => item.value).map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span className="text-sm font-medium text-right" style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Team */}
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <h2
              className="font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: 'Rajdhani', color: 'var(--text-muted)' }}
            >
              <FaTrophy size={11} /> Current Club
            </h2>
            {selectedPlayer.currentTeam ? (
              <>
                <div
                  className="flex items-center gap-3 p-3 rounded-xl mb-3 cursor-pointer"
                  style={{ background: 'rgba(41,121,255,0.08)', border: '1px solid rgba(41,121,255,0.2)' }}
                  onClick={() => router.push(`/teams/${selectedPlayer.currentTeam?.id}`)}
                >
                  <img
                    src={selectedPlayer.currentTeam.crest}
                    alt={selectedPlayer.currentTeam.name}
                    className="w-12 h-12 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div>
                    <div className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                      {selectedPlayer.currentTeam.name}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {selectedPlayer.currentTeam.tla} · {selectedPlayer.currentTeam.area?.name}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Venue', value: selectedPlayer.currentTeam.venue },
                    { label: 'Founded', value: selectedPlayer.currentTeam.founded },
                    { label: 'Colors', value: selectedPlayer.currentTeam.clubColors },
                    selectedPlayer.currentTeam.contract?.start
                      ? { label: 'Contract', value: `${formatDate(selectedPlayer.currentTeam.contract.start)} → ${formatDate(selectedPlayer.currentTeam.contract.until)}` }
                      : null,
                  ].filter(Boolean).map((item: any) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                      <span className="text-sm font-medium text-right" style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No club information</div>
            )}
          </div>
        </div>

        {/* Running Competitions */}
        {selectedPlayer.currentTeam?.runningCompetitions?.length > 0 && (
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <h2
              className="font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2"
              style={{ fontFamily: 'Rajdhani', color: 'var(--text-muted)' }}
            >
              <FaTrophy size={11} /> Active Competitions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedPlayer.currentTeam.runningCompetitions.map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
                >
                  {comp.emblem && (
                    <img
                      src={comp.emblem}
                      alt={comp.name}
                      className="w-8 h-8 object-contain flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{comp.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{comp.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last updated */}
        <div className="mt-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Last updated: {selectedPlayer.lastUpdated ? formatDate(selectedPlayer.lastUpdated) : 'Unknown'}
        </div>
      </div>
    </div>
  );
};

export default SinglePlayerPage;
