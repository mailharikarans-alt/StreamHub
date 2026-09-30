// StreamHub Channel Routes
import { Router, Request, Response } from 'express';
import { ChannelService } from '../services/channel.service.ts';
import { requireAuth, extractUser } from './auth.routes.ts';
import { store } from '../db/store.ts';

export const channelRouter = Router();

// GET /api/channels - List popular channels
channelRouter.get('/', (_req: Request, res: Response) => {
  const channels = store.listChannels(20).map(c => ({
    ...c,
    subscriberCountFormatted: ChannelService.formatSubscriberCount(c.subscribersCount),
  }));
  return res.json(channels);
});

// GET /api/channels/:identifier - Get channel by @handle or ID
channelRouter.get('/:identifier', extractUser, (req: Request, res: Response) => {
  const identifier = req.params.identifier;
  const channel = ChannelService.getChannel(identifier);
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found.' });
  }

  const currentUser = (req as any).user;
  let isSubscribed = false;
  if (currentUser) {
    isSubscribed = ChannelService.checkSubscription(currentUser.id, channel.id);
  }

  return res.json({
    ...channel,
    isSubscribed,
    isOwner: currentUser ? currentUser.id === channel.userId : false,
  });
});

// PATCH /api/channels/:id - Update channel customizations (owner only)
channelRouter.patch('/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const channelId = req.params.id;
    const currentUser = (req as any).user;
    const { name, handle, description, avatarUrl, bannerUrl } = req.body;

    const updated = ChannelService.updateChannel(channelId, currentUser.id, {
      name,
      handle,
      description,
      avatarUrl,
      bannerUrl,
    });

    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to update channel.' });
  }
});

// POST /api/channels/:id/subscribe - Toggle subscription
channelRouter.post('/:id/subscribe', requireAuth, (req: Request, res: Response) => {
  try {
    const channelId = req.params.id;
    const currentUser = (req as any).user;

    const result = ChannelService.toggleSubscription(currentUser.id, channelId);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Subscription failed.' });
  }
});

// GET /api/channels/:id/videos - List channel videos
channelRouter.get('/:id/videos', (req: Request, res: Response) => {
  const channelId = req.params.id;
  const videos = ChannelService.getChannelVideos(channelId);
  return res.json(videos);
});
