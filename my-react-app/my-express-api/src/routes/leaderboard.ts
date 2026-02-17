import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { getLeaderboard, submitScore } from '../controllers/leaderboardController';

const router = Router();

router.get('/', asyncHandler(getLeaderboard));
router.post('/', asyncHandler(submitScore));

export default router;
