import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import type { LeaderboardData } from '../types/leaderboard';

const dbPath = path.join(__dirname, '../../data/leaderboard.json');
const adapter = new JSONFile<LeaderboardData>(dbPath);
const db = new Low<LeaderboardData>(adapter, { entries: [] });

let initialized = false;

export async function getDb(): Promise<Low<LeaderboardData>> {
  if (!initialized) {
    await db.read();
    db.data ??= { entries: [] };
    initialized = true;
  }
  return db;
}
