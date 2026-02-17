import { useState, useEffect, useCallback } from 'react';
import { leaderboardService } from '../services/leaderboardService';
import type { LeaderboardEntry, GameId } from '../types';

export function useLeaderboard(game?: GameId, limit = 10) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leaderboardService.getLeaderboard(game, limit);
      setEntries(data);
    } catch {
      setError('리더보드를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [game, limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { entries, loading, error, refetch: fetch };
}
