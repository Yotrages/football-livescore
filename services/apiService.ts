import { League, LeagueStanding, Match, MatchDetail, NewsItem, NewsListResponse, NewsSingleResponse, SingleCompetitionScorers, SinglePlayer, SingleTeam, SingleTeamMatches, StandingGroup } from "@/types";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://football-backend-yx62.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const footballService = {
  getTodayMatches: async (): Promise<Match[]> => {
    try {
      const response = await api.get("/football/matches");
      return response.data.matches || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  },
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

  getUpcomingMatches: async (): Promise<Match[]> => {
    try {
      const response = await api.get("/football/upcoming-matches");
      return response.data.matches || [];
    } catch (error) {
      console.error("Error fetching upcoming matches:", error);
      return [];
    }
  },


  getPreviousMatches: async (): Promise<Match[]> => {
    try {
      const response = await api.get("/football/previous-matches");
      return response.data.matches || [];
    } catch (error) {
      console.error("Error fetching previous matches:", error);
      return [];
    }
  },

  getLeagues: async (): Promise<League[]> => {
    try {
      const response = await api.get("/football/leagues");
      return response.data.competitions || [];
    } catch (error) {
      console.error("Error fetching leagues:", error);
      return [];
    }
  },

  getSingleLeague: async (leagueId: any): Promise<League> => {
    try {
      const response = await api.get(`/football/leagues/${leagueId}`);
      return response.data || {};
    } catch (error) {
      console.error(`Error fetching standings for league ${leagueId}:`, error);
      return <League>{};
    }
  },

  getSingleCompetitionScorers: async (leagueId: any): Promise<SingleCompetitionScorers> => {
    try {
      const response = await api.get(`/football/competitions/${leagueId}/scorers`);
      return response.data || {};
    } catch (error) {
      console.error(`Error fetching standings for league ${leagueId}:`, error);
      return <SingleCompetitionScorers>{};
    }
  },

  getSingleTeamMatches: async (leagueId: any): Promise<SingleTeamMatches> => {
    try {
      const response = await api.get(`/football/teams/${leagueId}/matches`);
      return response.data || {};
    } catch (error) {
      console.error(`Error fetching standings for league ${leagueId}:`, error);
      return <SingleTeamMatches>{};
    }
  },

  getSingleLeagueMatches: async (leagueId: any): Promise<Match[]> => {
    try {
      const response = await api.get(`/football/leagues/${leagueId}/matches`);
      return response.data.matches || [];
    } catch (error) {
      console.error(`Error fetching standings for league ${leagueId}:`, error);
      return [];
    }
  },

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

  getTeamInfo: async (teamId: any): Promise<SingleTeam> => {
    try {
      const response = await api.get(`/football/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team ${teamId}:`, error);
      throw new Error("Cannot fetch getTeamInfo");
    }
  },

  getSinglePlayer: async (playerId: any): Promise<SinglePlayer> => {
    try {
      const response = await api.get(`/football/persons/${playerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team ${playerId}:`, error);
      throw error;
    }
  },

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

  // ── News ──────────────────────────────────────────────────────────────────

  getNewsList: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    featured?: boolean;
    search?: string;
  } = {}): Promise<NewsListResponse> => {
    try {
      const response = await api.get('/news', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching news list:', error);
      return { articles: [], pagination: { total: 0, page: 1, limit: 12, pages: 0, hasNext: false, hasPrev: false } };
    }
  },

  getLatestNews: async (limit = 6): Promise<NewsItem[]> => {
    try {
      const response = await api.get('/news/latest', { params: { limit } });
      return response.data.articles || [];
    } catch (error) {
      console.error('Error fetching latest news:', error);
      return [];
    }
  },

  getFeaturedNews: async (limit = 5): Promise<NewsItem[]> => {
    try {
      const response = await api.get('/news/featured', { params: { limit } });
      return response.data.articles || [];
    } catch (error) {
      console.error('Error fetching featured news:', error);
      return [];
    }
  },

  getNewsCategories: async (): Promise<{ category: string; count: number }[]> => {
    try {
      const response = await api.get('/news/categories');
      return response.data.categories || [];
    } catch (error) {
      console.error('Error fetching news categories:', error);
      return [];
    }
  },

  getNewsBySlug: async (slug: string): Promise<NewsSingleResponse | null> => {
    try {
      const response = await api.get(`/news/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching article ${slug}:`, error);
      return null;
    }
  },

  createNews: async (formData: FormData): Promise<{ article: NewsItem; message: string }> => {
    const response = await api.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateNews: async (id: string, formData: FormData): Promise<{ article: NewsItem; message: string }> => {
    const response = await api.put(`/news/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteNews: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  getAdminNews: async (params: { page?: number; limit?: number; status?: string; category?: string } = {}) => {
    const response = await api.get('/news/admin', { params });
    return response.data;
  },
};

export default footballService;
