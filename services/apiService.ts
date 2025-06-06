import { League, LeagueStanding, Match, MatchDetail, SingleCompetitionScorers, SinglePlayer, SingleTeam, SingleTeamMatches, StandingGroup } from "@/types";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://football-backend-yx62.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const footballService = {
  // Get today matches
  getTodayMatches: async (): Promise<Match[]> => {
    try {
      const response = await api.get("/football/matches");
      return response.data.matches || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  // Get live matches
  getLiveMatches: async (): Promise<Match[]> => {
    try {
      const response = await api.get("/football/live-matches");
      console.log(response.data.matches);
      return response.data.matches || [];
    } catch (error) {
      console.error("Error fetching live matches:", error);
      return [];
    }
  },

  // Get upcoming matches
  getUpcomingMatches: async (): Promise<Match[]> => {
    try {
      const response = await api.get("/football/upcoming-matches");
      return response.data.matches || [];
    } catch (error) {
      console.error("Error fetching upcoming matches:", error);
      return [];
    }
  },

  // get previous Matches

  getPreviousMatches: async (): Promise<Match[]> => {
    try {
      const response = await api.get("/football/previous-matches");
      return response.data.matches || [];
    } catch (error) {
      console.error("Error fetching previous matches:", error);
      return [];
    }
  },

  // Get competitions/leagues
  getLeagues: async (): Promise<League[]> => {
    try {
      const response = await api.get("/football/leagues");
      return response.data.competitions || [];
    } catch (error) {
      console.error("Error fetching leagues:", error);
      return [];
    }
  },

  // get Single League
  getSingleLeague: async (leagueId: any): Promise<League> => {
    try {
      const response = await api.get(`/football/leagues/${leagueId}`);
      return response.data || {};
    } catch (error) {
      console.error(`Error fetching standings for league ${leagueId}:`, error);
      return <League>{};
    }
  },

  // get Single competition top scorers
  getSingleCompetitionScorers: async (leagueId: any): Promise<SingleCompetitionScorers> => {
    try {
      const response = await api.get(`/football/competitions/${leagueId}/scorers`);
      return response.data || {};
    } catch (error) {
      console.error(`Error fetching standings for league ${leagueId}:`, error);
      return <SingleCompetitionScorers>{};
    }
  },

  // get Single team matches
  getSingleTeamMatches: async (leagueId: any): Promise<SingleTeamMatches> => {
    try {
      const response = await api.get(`/football/teams/${leagueId}/matches`);
      return response.data || {};
    } catch (error) {
      console.error(`Error fetching standings for league ${leagueId}:`, error);
      return <SingleTeamMatches>{};
    }
  },

  // get Single League
  getSingleLeagueMatches: async (leagueId: any): Promise<Match[]> => {
    try {
      const response = await api.get(`/football/leagues/${leagueId}/matches`);
      return response.data.matches || [];
    } catch (error) {
      console.error(`Error fetching standings for league ${leagueId}:`, error);
      return [];
    }
  },

  // get Single League previous Matches
  getSingleLeaguePrevMatches: async (leagueId: any): Promise<Match[]> => {
    try {
      const response = await api.get(
        `/football/leagues/${leagueId}/prevmatches`
      );
      return response.data.matches || [];
    } catch (error) {
      console.error(`Error fetching standings for league ${leagueId}:`, error);
      return [];
    }
  },

  // Get league standings
 getLeagueStandings: async (leagueId: any): Promise<StandingGroup[] | LeagueStanding[]> => {
  try {
    const response = await api.get(`/football/leagues/${leagueId}/standings`);
    
    console.log('API Response Structure:', response.data);
    
    if (response.data.standings) {
      if (Array.isArray(response.data.standings)) {
        return response.data.standings;
      }
      
    }
    
    if (Array.isArray(response.data.standings) && response.data.standings[0]?.table) {
      return response.data.standings[0]?.table;
    }
    
    console.warn('Unexpected standings structure:', response.data);
    return [];
    
  } catch (error) {
    console.error(`Error fetching standings for league ${leagueId}:`, error);
    return [];
  }
},

  // Get single Team
  getTeamInfo: async (teamId: any): Promise<SingleTeam> => {
    try {
      const response = await api.get(`/football/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team ${teamId}:`, error);
      throw new Error("Cannot fetch getTeamInfo");
    }
  },

  // Get player details
  getSinglePlayer: async (playerId: any): Promise<SinglePlayer> => {
    try {
      const response = await api.get(`/football/persons/${playerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team ${playerId}:`, error);
      throw error;
    }
  },

  // Get match details
  getMatchDetails: async (matchId: any): Promise<MatchDetail | null> => {
    try {
      const response = await api.get(`/football/matches/${matchId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching match ${matchId}:`, error);
      return null;
    }
  },
};

export default footballService;
