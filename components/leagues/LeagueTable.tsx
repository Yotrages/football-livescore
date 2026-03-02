"use client"
import React from 'react';
import Link from 'next/link';
import { LeagueStanding, StandingGroup } from '@/types';
import { useRouter } from 'next/navigation';

export interface LeagueTableProps {
  standings: StandingGroup[] | LeagueStanding[];
  leagueName: string;
  season: string;
  isLoading?: boolean;
}

const getPositionStyle = (position: number, tableLength: number): { color: string; bg: string; label?: string } => {
  if (position === 1) return { color: '#ffc107', bg: 'rgba(255,193,7,0.15)', label: 'Champion' };
  if (position <= 5) return { color: 'var(--accent-blue)', bg: 'rgba(41,121,255,0.12)' };
  if (position === 6) return { color: '#a78bfa', bg: 'rgba(167,139,250,0.14)' };
  if (position === 7) return { color: '#34d399', bg: 'rgba(52,211,153,0.1)' };
  if (tableLength >= 10 && position >= tableLength - 2) return { color: 'var(--accent-red)', bg: 'rgba(255,23,68,0.12)' };
  return { color: 'var(--text-muted)', bg: 'transparent' };
};

const FormDot: React.FC<{ result: string }> = ({ result }) => {
  const colors: Record<string, string> = { W: 'var(--accent-green)', D: 'var(--accent-amber)', L: 'var(--accent-red)' };
  return (
    <span
      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
      style={{ background: colors[result] || 'rgba(255,255,255,0.1)', color: result === 'D' ? '#000' : '#fff' }}
    >
      {result}
    </span>
  );
};

const LeagueTable: React.FC<LeagueTableProps> = ({ standings, leagueName, season, isLoading = false }) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
          <div className="skeleton h-5 w-48 rounded"></div>
        </div>
        <div className="p-4 space-y-2">
          {[...Array(10)].map((_, i) => <div key={i} className="skeleton h-10 rounded-lg"></div>)}
        </div>
      </div>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No standings data available</p>
      </div>
    );
  }

  const isGroupedFormat = standings[0] && typeof standings[0] === 'object' && 'table' in standings[0];
  const standingsGroups: StandingGroup[] = isGroupedFormat
    ? standings as StandingGroup[]
    : [{ stage: 'REGULAR_SEASON', type: 'TOTAL', table: standings as LeagueStanding[] }];

  const renderStandingsTable = (table: LeagueStanding[], groupTitle?: string) => (
    <div className="w-full">
      {groupTitle && (
        <div className="px-4 py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.03)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{groupTitle}</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="standings-table w-full" style={{ minWidth: '560px' }}>
          <thead>
            <tr>
              <th className="text-left w-8" style={{ paddingLeft: '16px' }}>#</th>
              <th className="text-left" style={{ minWidth: '160px' }}>Club</th>
              <th className="text-center w-8">MP</th>
              <th className="text-center w-8">W</th>
              <th className="text-center w-8">D</th>
              <th className="text-center w-8">L</th>
              <th className="text-center w-8">GF</th>
              <th className="text-center w-8">GA</th>
              <th className="text-center w-10">GD</th>
              <th className="text-center w-10" style={{ color: 'var(--text-primary)' }}>PTS</th>
              <th className="text-center" style={{ minWidth: '80px' }}>Form</th>
            </tr>
          </thead>
          <tbody>
            {table?.map((team) => {
              const posStyle = getPositionStyle(team.position, table.length);
              const formResults = team.form ? team.form.split(',').filter(Boolean).slice(-5) : [];
              return (
                <tr
                  key={team.team.id}
                  className="cursor-pointer transition-colors"
                  onClick={() => router.push(`/teams/${team.team.id}`)}
                >
                  <td style={{ paddingLeft: '16px' }}>
                    <div
                      className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold"
                      style={{ background: posStyle.bg, color: posStyle.color }}
                    >
                      {team.position}
                    </div>
                  </td>
                  <td>
                    <Link className="flex items-center gap-2.5 group" href={`/teams/${team.team.id}`} onClick={(e) => e.stopPropagation()}>
                      <img
                        src={team.team?.crest || '/placeholder-team.png'}
                        alt={team.team.name}
                        className="w-6 h-6 object-contain flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <span className="text-sm font-medium group-hover:underline truncate" style={{ color: 'var(--text-primary)' }}>
                        {team.team.name}
                      </span>
                    </Link>
                  </td>
                  <td className="text-center" style={{ color: 'var(--text-secondary)' }}>{team.playedGames}</td>
                  <td className="text-center" style={{ color: 'var(--text-secondary)' }}>{team.won}</td>
                  <td className="text-center" style={{ color: 'var(--text-secondary)' }}>{team.draw}</td>
                  <td className="text-center" style={{ color: 'var(--text-secondary)' }}>{team.lost}</td>
                  <td className="text-center" style={{ color: 'var(--text-secondary)' }}>{team.goalsFor}</td>
                  <td className="text-center" style={{ color: 'var(--text-secondary)' }}>{team.goalsAgainst}</td>
                  <td className="text-center">
                    <span style={{
                      color: team.goalDifference > 0 ? 'var(--accent-green)' : team.goalDifference < 0 ? 'var(--accent-red)' : 'var(--text-muted)',
                      fontWeight: 600,
                    }}>
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{team.points}</span>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-0.5">
                      {formResults.length > 0
                        ? formResults.map((r, i) => <FormDot key={i} result={r.trim()} />)
                        : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                      }
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}
      >
        <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {leagueName}
        </h2>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{season}</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-4 py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.1)' }}>
        {[
          { color: '#ffc107', label: 'Champion' },
          { color: 'var(--accent-blue)', label: 'Champions League' },
          { color: '#a78bfa', label: 'Europa League' },
          { color: '#34d399', label: 'Conference League' },
          { color: 'var(--accent-red)', label: 'Relegation' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: item.color }}></div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {standingsGroups.length === 1 ? (
        renderStandingsTable(standingsGroups[0].table)
      ) : (
        <div>
          {standingsGroups.map((group, index) => {
            const groupTitle = group.group
              ? group.group
              : group.stage === 'GROUP_STAGE'
                ? `Group ${index + 1}`
                : group.stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            return (
              <div key={`${group.stage}-${group.group || index}`}>
                {renderStandingsTable(group.table, groupTitle)}
                {index < standingsGroups.length - 1 && (
                  <div style={{ borderTop: '4px solid var(--bg-primary)' }}></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeagueTable;
