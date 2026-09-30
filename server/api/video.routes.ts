// StreamHub Video Routes
import { Router, Request, Response } from 'express';
import { store } from '../db/store.ts';

export const videoRouter = Router();

// GET /api/videos - Feed videos with category & search
videoRouter.get('/', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const query = req.query.q as string | undefined;
  const channelId = req.query.channelId as string | undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 30;

  const videos = store.listVideos({
    category,
    query,
    channelId,
    limit,
  });

  return res.json({
    videos,
    total: videos.length,
    hasMore: false,
  });
});

// GET /api/videos/:id - Single video
videoRouter.get('/:id', (req: Request, res: Response) => {
  const video = store.findVideoById(req.params.id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found.' });
  }
  return res.json(video);
});
