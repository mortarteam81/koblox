import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health';
import leaderboardRoutes from './routes/leaderboard';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(
  cors({
    origin: [ALLOWED_ORIGIN, 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter for score submission (5 per minute per IP)
const scoreLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message: '너무 많은 요청입니다. 잠시 후 다시 시도해 주세요.',
    code: 'RATE_LIMIT',
    status: 429,
    timestamp: new Date().toISOString(),
  },
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/leaderboard', scoreLimiter, leaderboardRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found',
    code: 'NOT_FOUND',
    status: 404,
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

// Server startup
const server = app.listen(PORT, () => {
  console.log(`✓ Express server running on http://localhost:${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
