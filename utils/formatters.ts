
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

export const getPositionColor = (position: string) => {
    const positionColors: { [key: string]: string } = {
      'Goalkeeper': 'bg-yellow-100 text-yellow-800',
      'Centre-Back': 'bg-blue-100 text-blue-800',
      'Left-Back': 'bg-blue-100 text-blue-800',
      'Right-Back': 'bg-blue-100 text-blue-800',
      'Defensive Midfield': 'bg-green-100 text-green-800',
      'Central Midfield': 'bg-green-100 text-green-800',
      'Attacking Midfield': 'bg-purple-100 text-purple-800',
      'Left Winger': 'bg-orange-100 text-orange-800',
      'Right Winger': 'bg-orange-100 text-orange-800',
      'Centre-Forward': 'bg-red-100 text-red-800'
    };
    return positionColors[position] || 'bg-gray-100 text-gray-800';
  };

   export const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

   export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };