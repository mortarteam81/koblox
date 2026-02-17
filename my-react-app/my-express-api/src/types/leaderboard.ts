import { z } from 'zod';

export const GameIdSchema = z.enum(['star', 'memory', 'jump']);
export type GameId = z.infer<typeof GameIdSchema>;

export const NicknameSchema = z
  .string()
  .min(2, '닉네임은 2자 이상이어야 합니다')
  .max(12, '닉네임은 12자 이하여야 합니다')
  .regex(/^[가-힣a-zA-Z0-9]+$/, '닉네임은 한글, 영문, 숫자만 사용 가능합니다');

export const ScoreSchema = z
  .number()
  .int()
  .min(0)
  .max(999999, '유효하지 않은 점수입니다');

export const SubmitScoreSchema = z.object({
  nickname: NicknameSchema,
  game: GameIdSchema,
  score: ScoreSchema,
});

export type SubmitScoreInput = z.infer<typeof SubmitScoreSchema>;

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  game: GameId;
  timestamp: string;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
}
