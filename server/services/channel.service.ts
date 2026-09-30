// StreamHub Channel Service
import { store } from '../db/store.ts';
import { Channel, Video } from '../types/index.ts';

export class ChannelService {
  // Find channel by handle (e.g. "@techpulse" or "techpulse") or ID
  public static getChannel(identifier: string): (Channel & { subscriberCountFormatted: string }) | null {
    let channel: Channel | undefined;
    if (identifier.startsWith('chn_')) {
      channel = store.findChannelById(identifier);
    } else {
      channel = store.findChannelByHandle(identifier);
    }

    if (!channel) return null;

    return {
      ...channel,
      subscriberCountFormatted: this.formatSubscriberCount(channel.subscribersCount),
    };
  }

  // Update channel customization (name, handle, description, avatar, banner)
  public static updateChannel(
    channelId: string,
    userId: string,
    updates: {
      name?: string;
      handle?: string;
      description?: string;
      avatarUrl?: string;
      bannerUrl?: string;
    }
  ): Channel {
    const channel = store.findChannelById(channelId);
    if (!channel) {
      throw new Error('Channel not found.');
    }

    // Ownership authorization check
    if (channel.userId !== userId) {
      throw new Error('Forbidden: You can only edit your own channel.');
    }

    // Handle uniqueness validation if handle is being modified
    if (updates.handle) {
      const cleanHandle = updates.handle.replace(/^@/, '').toLowerCase().trim();
      if (cleanHandle.length < 3) {
        throw new Error('Channel handle must be at least 3 characters long.');
      }
      if (!/^[a-z0-9_.-]+$/.test(cleanHandle)) {
        throw new Error('Channel handle can only contain lowercase letters, numbers, dashes, and underscores.');
      }

      const existing = store.findChannelByHandle(cleanHandle);
      if (existing && existing.id !== channelId) {
        throw new Error(`The handle @${cleanHandle} is already claimed by another creator.`);
      }
      updates.handle = cleanHandle;
    }

    const updated = store.updateChannel(channelId, updates);
    if (!updated) {
      throw new Error('Failed to update channel.');
    }
    return updated;
  }

  // Toggle user subscription to channel
  public static toggleSubscription(
    subscriberUserId: string,
    channelId: string
  ): { isSubscribed: boolean; subscribersCount: number } {
    const channel = store.findChannelById(channelId);
    if (!channel) throw new Error('Channel not found');

    if (channel.userId === subscriberUserId) {
      throw new Error('You cannot subscribe to your own channel.');
    }

    const result = store.toggleSubscription(subscriberUserId, channelId);
    return {
      isSubscribed: result.isSubscribed,
      subscribersCount: result.newCount,
    };
  }

  // Check subscription state
  public static checkSubscription(subscriberUserId: string, channelId: string): boolean {
    return store.isSubscribed(subscriberUserId, channelId);
  }

  // Get videos for a channel
  public static getChannelVideos(channelId: string): Video[] {
    return store.listVideos({ channelId });
  }

  // Format subscriber count helper (e.g. 248.5K, 1.2M)
  public static formatSubscriberCount(count: number): string {
    if (count >= 1_000_000) {
      return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M subscribers`;
    }
    if (count >= 1_000) {
      return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}K subscribers`;
    }
    return `${count} ${count === 1 ? 'subscriber' : 'subscribers'}`;
  }
}
