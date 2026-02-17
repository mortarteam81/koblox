import axios from 'axios';
import type { LeaderboardEntry, GameId } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const leaderboardService = {
  async getLeaderboard(game?: GameId, limit = 10): Promise<LeaderboardEntry[]> {
    const params: Record<string, string | number> = { limit };
    if (game) params.game = game;
    const res = await axiosInstance.get('/leaderboard', { params });
    return res.data.data as LeaderboardEntry[];
  },

  async submitScore(payload: { nickname: string; game: GameId; score: number }): Promise<LeaderboardEntry> {
    const res = await axiosInstance.post('/leaderboard', payload);
    return res.data.data as LeaderboardEntry;
  },
};
