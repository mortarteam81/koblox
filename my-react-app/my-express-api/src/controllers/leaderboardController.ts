import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { getDb } from '../utils/storage';
import { SubmitScoreSchema } from '../types/leaderboard';
import type { GameId } from '../types/leaderboard';

export async function getLeaderboard(req: Request, res: Response): Promise<void> {
  const game = req.query.game as GameId | undefined;
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const db = await getDb();
  let entries = [...db.data.entries];

  if (game) {
    entries = entries.filter((e) => e.game === game);
  }

  entries.sort((a, b) => b.score - a.score);
  const top = entries.slice(0, limit);

  res.json({
    data: top,
    message: '리더보드 조회 성공',
    status: 200,
    timestamp: new Date().toISOString(),
  });
}

export async function submitScore(req: Request, res: Response): Promise<void> {
  const parsed = SubmitScoreSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: '입력값이 올바르지 않습니다',
      code: 'VALIDATION_ERROR',
      status: 400,
      details: parsed.error.flatten().fieldErrors,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  const { nickname, game, score } = parsed.data;
  const db = await getDb();

  const entry = {
    id: randomUUID(),
    nickname,
    score,
    game,
    timestamp: new Date().toISOString(),
  };

  db.data.entries.push(entry);
  await db.write();

  res.status(201).json({
    data: entry,
    message: '점수가 등록되었습니다',
    status: 201,
    timestamp: new Date().toISOString(),
  });
}
