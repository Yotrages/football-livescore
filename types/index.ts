
export interface SingleCompetitionScorers {
  count: number;
  filters: {
    season: string;
    limit: number;
  };
  competition: {
    id: number;
    name: string;
    code: string;
    type: string;
    emblem: string;
  };
  season: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner: null;
  };
  scorers: Array<{
    player: {
      id: number;
      name: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      nationality: string;
      section: string;
      position: null;
      shirtNumber: null;
      lastUpdated: string;
    };
    team: {
      id: number;
      name: string;
      shortName: string;
      tla: string;
      crest: string;
      address: string;
      website: string;
      founded: number;
      clubColors: string;
      venue: string;
      lastUpdated: string;
    };
    playedMatches: number;
    goals: number;
    assists: number;
    penalties: number;
  }>;
}

export interface SingleTeamMatches {
  filters: {
    competitions: string;
    permission: string;
    limit: number;
  };
  resultSet: {
    count: number;
    competitions: string;
    first: string;
    last: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
  };
  matches: Match[];
}

export interface SingleTeam {
  area: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
  id: string;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  runningCompetitions: Array<{
    id: number;
    name: string;
    code: string;
    type: string;
    emblem: string;
  }>;
  coach: {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    dateOfBirth: string;
    nationality: string;
    contract: {
      start: string;
      until: string;
    };
  };
  squad: Array<{
    id: number;
    name: string;
    position: string;
    dateOfBirth: string;
    nationality: string;
  }>;
}
export interface SinglePlayer {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  section: string;
  position: string;
  shirtNumber: number;
  lastUpdated: string;
  currentTeam: {
    area: {
      id: number;
      name: string;
      code: string;
      flag: string;
    };
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
    address: string;
    website: string;
    founded: string;
    clubColors: string;
    venue: string;
    runningCompetitions: [
      {
        id: number;
        name: string;
        code: string;
        type: string;
        emblem: null;
      }
    ];
    contract: {
      start: string;
      until: string;
    };
  };
}

export interface NewsItem {
  title: string,
  content: string,
  summary: string,
  author: string,
  category: string,
  tags: string[],
  imageUrl?: string,
  featured: boolean,
  status: 'draft' | 'published',
  slug: string,
  publishedAt?: string
}


export interface Match {
  id: string;
  matchday: string;
  lastUpdated: string;
  odds: {
    msg: string;
  };
  area: {
    code: string;
    flag: string;
    id: number;
    name: string;
  };
  awayTeam: {
    crest: string;
    id: number;
    name: string;
    shortName: string;
    tla: string;
  };
  homeTeam: {
    crest: string;
    id: number;
    name: string;
    shortName: string;
    tla: string;
  };
  competition: {
    code: string;
    emblem: string;
    id: number;
    name: string;
    type: string;
    group: string | null;
  };
  referees: [
    {
      id: number;
      name: string;
      nationality: string;
      type: string;
    }
  ];
  score: {
    duration: string;
    winner: string;
    fullTime: {
      home: number;
      away: number;
    };
    halfTime: {
      home: number;
      away: number;
    };
    extraTime: {
      home: number;
      away: number;
    };
    penalties: {
      home: number;
      away: number;
    };
    regularTime: {
      home: number;
      away: number;
    };
  };
  stage: string;
  status: string;
  utcDate: string;
  minute: string;
  season: {
    currentMatchday: number;
    id: number;
    endDate: string;
    startDate: string;
    winner: string | null;
  };
}

export interface LeagueStanding {
  position: number;
  team: {
    id: number;
    name: string;
    crest: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form?: string;
}

export interface League {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem?: string;
  currentSeason?: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner: string | null;
    stages: [];
  };
  area?: {
    id: number;
    name: string;
    code: string;
    flag?: string;
  };
  seasons: [];
}

export interface MatchDetail {
    area: {
        id: number,
        name: string,
        code: string,
        flag: string
    },
    competition: {
        id: number,
        name: string,
        code: string,
        type: string,
        emblem: string
    },
    season: {
        id: number,
        startDate: string,
        endDate: string,
        currentMatchday: number,
        winner: string | null
    },
    id: number,
    utcDate: string,
    status: string,
    venue: null,
    matchday: number,
    stage: string,
    group: null,
    lastUpdated: string,
    homeTeam: {
        id: number,
        name: string,
        shortName: string,
        tla: string,
        crest: string
    },
    awayTeam: {
        id: number,
        name: string,
        shortName: string,
        tla: string,
        crest: string
    },
    score: {
        winner: string | null,
        duration: string,
        fullTime: {
            home: string | null,
            away: string | null
        },
        halfTime: {
            home: string | null,
            away: string | null
        }
    },
    referees: [
        {
            id: number,
            name: string,
            type: string,
            nationality: string
        }
    ]
}
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string
}