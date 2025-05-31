
/**
 * Format match date to readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export const formatMatchDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format match status to a more readable format
 * @param status - Match status from API
 * @param minute - Current match minute (optional)
 * @returns Formatted status string
 */
export const formatMatchStatus = (status: string, minute?: string): string => {
  switch (status) {
    case 'SCHEDULED':
      return 'Scheduled';
    case 'LIVE':
    case 'IN_PLAY':
      return minute ? `${minute}'` : 'Live';
    case 'PAUSED':
      return 'Half Time';
    case 'FINISHED':
      return 'Full Time';
    case 'POSTPONED':
      return 'Postponed';
    case 'SUSPENDED':
      return 'Suspended';
    case 'CANCELED':
      return 'Canceled';
    default:
      return status;
  }
};

/**
 * Get appropriate status class for styling
 * @param status - Match status
 * @returns CSS class name
 */
export const getStatusClass = (status: string): string => {
  switch (status) {
    case 'LIVE':
    case 'IN_PLAY':
      return 'bg-red-600 text-white';
    case 'PAUSED':
      return 'green text-white';
    case 'FINISHED':
      return 'green text-white';
    case 'POSTPONED':
    case 'SUSPENDED':
    case 'CANCELED':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-blue-600 text-white';
  }
};

/**
 * Format score for display
 * @param homeScore - Home team score
 * @param awayScore - Away team score
 * @returns Formatted score string
 */
export const formatScore = (homeScore: number | null, awayScore: number | null): string => {
  if (homeScore === null || awayScore === null) {
    return '- : -';
  }
  return `${homeScore} : ${awayScore}`;
};

/**
 * Truncate text if too long
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format team name (handle long names)
 * @param team - Team object
 * @returns Formatted team name
 */
export const formatTeamName = (team: { name: string; shortName?: string; tla?: string }): string => {
  if (team.shortName && team.shortName.length < team.name.length) {
    return team.shortName;
  }
  return truncateText(team.name);
};

/**
 * Group matches by date
 * @param matches - Array of matches
 * @returns Object with dates as keys and match arrays as values
 */
export const groupMatchesByDate = (matches: any[]): Record<string, any[]> => {
  return matches.reduce((groups: Record<string, any[]>, match) => {
    const date = new Date(match.utcDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(match);
    return groups;
  }, {});
};