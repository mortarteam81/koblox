import { Router, Request, Response } from 'express';

const router = Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    message: 'Server is healthy',
    status: 200,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/health/detailed
 * Detailed health check with system information
 */
router.get('/detailed', (req: Request, res: Response) => {
  res.status(200).json({
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
    },
    message: 'Detailed health check',
    status: 200,
    timestamp: new Date().toISOString(),
  });
});

export default router;
