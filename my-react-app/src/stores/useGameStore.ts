import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameId } from '../types';

interface GameStore {
  nickname: string;
  sessionScores: Record<GameId, number>;
  setNickname: (nickname: string) => void;
  setScore: (game: GameId, score: number) => void;
  resetSession: () => void;
}

const initialScores: Record<GameId, number> = {
  star: 0,
  memory: 0,
  jump: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      nickname: '',
      sessionScores: { ...initialScores },
      setNickname: (nickname) => set({ nickname }),
      setScore: (game, score) =>
        set((state) => ({
          sessionScores: { ...state.sessionScores, [game]: score },
        })),
      resetSession: () => set({ sessionScores: { ...initialScores } }),
    }),
    {
      name: 'game-store',
      partialize: (state) => ({ nickname: state.nickname }),
    }
  )
);
