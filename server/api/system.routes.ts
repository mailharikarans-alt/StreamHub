// StreamHub System & Health Routes
import { Router, Request, Response } from 'express';
import { store } from '../db/store.ts';

export const systemRouter = Router();

systemRouter.get('/status', (_req: Request, res: Response) => {
  const userCount = store.users.size;
  const channelCount = store.channels.size;
  const videoCount = store.videos.size;

  return res.json({
    status: 'HEALTHY',
    version: '1.0.0-phase1',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: {
        engine: 'PostgreSQL 16 (Prisma schema ready)',
        inMemoryStore: 'Active with seed data',
        records: {
          users: userCount,
          channels: channelCount,
          videos: videoCount,
        }
      },
      redis: {
        configured: Boolean(process.env.REDIS_URL),
        purpose: 'BullMQ Queues & Anti-Thundering View Counting'
      },
      storage: {
        configured: Boolean(process.env.S3_ENDPOINT || process.env.S3_BUCKET_RAW),
        endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000 (MinIO)',
        buckets: ['streamhub-raw', 'streamhub-hls', 'streamhub-thumbnails']
      },
      transcoderWorker: {
        engine: 'FFmpeg Multi-Rendition HLS (Phase 2 Ready)',
        renditions: ['1080p', '720p', '480p', '360p', '240p']
      }
    },
    activePhase: {
      current: 'Phase 1: Architecture, Data Model, Auth & Channel Provisioning',
      next: 'Phase 2: Direct S3 Presigned Uploads & FFmpeg HLS Worker'
    }
  });
});
