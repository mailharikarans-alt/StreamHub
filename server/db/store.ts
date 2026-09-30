// StreamHub Database Repository & In-Memory Store
// Provides identical schema-aligned operations as Prisma Client

import { User, Channel, Video, Subscription, VideoReaction, Comment } from '../types/index.ts';
import crypto from 'crypto';

class StreamHubStore {
  public users: Map<string, User> = new Map();
  public channels: Map<string, Channel> = new Map();
  public videos: Map<string, Video> = new Map();
  public subscriptions: Map<string, Subscription> = new Map();
  public reactions: Map<string, VideoReaction> = new Map();
  public comments: Map<string, Comment> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  // --- Seed Data ---
  private seedDefaultData() {
    // 1. Tech Creator: Alex Chen (@techpulse)
    const user1: User = {
      id: 'usr_techpulse',
      email: 'alex@streamhub.io',
      name: 'Alex Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      isAdmin: false,
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const chan1: Channel = {
      id: 'chn_techpulse',
      userId: user1.id,
      handle: 'techpulse',
      name: 'TechPulse Official',
      description: 'In-depth engineering breakdowns, architecture teardowns, and high-performance system designs.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
      bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=400&fit=crop',
      subscribersCount: 248000,
      isVerified: true,
      createdAt: user1.createdAt,
      updatedAt: new Date().toISOString(),
    };

    // 2. Gaming Creator: Marcus Vance (@pixelvoyage)
    const user2: User = {
      id: 'usr_pixelvoyage',
      email: 'marcus@streamhub.io',
      name: 'Marcus Vance',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      isAdmin: false,
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const chan2: Channel = {
      id: 'chn_pixelvoyage',
      userId: user2.id,
      handle: 'pixelvoyage',
      name: 'Pixel Voyage',
      description: 'Ultra-wide gameplay adventures, frame-rate deep dives, and next-gen Unreal Engine 5 walkthroughs.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop',
      subscribersCount: 512000,
      isVerified: true,
      createdAt: user2.createdAt,
      updatedAt: new Date().toISOString(),
    };

    // 3. Creative/Music Studio: Elena Rostova (@soundscapes)
    const user3: User = {
      id: 'usr_soundscapes',
      email: 'elena@streamhub.io',
      name: 'Elena Rostova',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      isAdmin: true,
      createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const chan3: Channel = {
      id: 'chn_soundscapes',
      userId: user3.id,
      handle: 'soundscapes',
      name: 'Sonic Horizons',
      description: 'Synthesizer jams, ambient sound design, and analog modular sessions in 4K lossless audio.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&h=400&fit=crop',
      subscribersCount: 184000,
      isVerified: true,
      createdAt: user3.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);

    this.channels.set(chan1.id, chan1);
    this.channels.set(chan2.id, chan2);
    this.channels.set(chan3.id, chan3);

    // Seed Demo Videos with multi-resolution test streams and thumbnails
    const seedVideos: Video[] = [
      {
        id: 'vid_arch_deepdive',
        channelId: chan1.id,
        title: 'Building a Petabyte-Scale Video Streaming Platform from Scratch',
        description: 'How we engineered a high-throughput, low-latency video transcoding pipeline with FFmpeg, BullMQ, and S3-compatible object storage. We explore chunked multipart uploads, adaptive bitrate HLS manifests, and anti-thundering-herd view counting.',
        category: 'Technology',
        tags: ['Architecture', 'FFmpeg', 'DistributedSystems', 'HLS', 'PostgreSQL'],
        visibility: 'PUBLIC',
        status: 'READY',
        masterPlaylistUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        thumbnailUrls: [
          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop',
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop'
        ],
        selectedThumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop',
        duration: 864, // 14m 24s
        viewsCount: 184520,
        likesCount: 12430,
        dislikesCount: 94,
        commentsCount: 382,
        publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'vid_cyberpunk_unreal',
        channelId: chan2.id,
        title: 'Cyberpunk 2077 Path Tracing 4K 120FPS - Ultimate Graphical Showcase',
        description: 'Full path-traced night city exploration across Kabuki, Watson, and City Center. Captured in uncompressed 4K master rendition with Dolby Atmos spatial sound.',
        category: 'Gaming',
        tags: ['Gaming', 'RTX', 'RayTracing', 'Cyberpunk', '4K'],
        visibility: 'PUBLIC',
        status: 'READY',
        masterPlaylistUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        thumbnailUrls: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop'
        ],
        selectedThumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
        duration: 1240, // 20m 40s
        viewsCount: 429100,
        likesCount: 38900,
        dislikesCount: 210,
        commentsCount: 914,
        publishedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'vid_synth_midnight',
        channelId: chan3.id,
        title: 'Analog Modular Synthesizer Live Session [Ambient Chillout / 4K]',
        description: 'Improvised ambient soundscape using Eurorack modular modules, Moog Sub 37, and tape echo pedals. Perfect for coding, deep focus, or relaxing under the night sky.',
        category: 'Music',
        tags: ['Synthesizer', 'Ambient', 'Chillout', 'Eurorack', 'MusicProduction'],
        visibility: 'PUBLIC',
        status: 'READY',
        masterPlaylistUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        thumbnailUrls: [
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=450&fit=crop'
        ],
        selectedThumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=450&fit=crop',
        duration: 2145, // 35m 45s
        viewsCount: 89340,
        likesCount: 9410,
        dislikesCount: 32,
        commentsCount: 167,
        publishedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'vid_distributed_postgres',
        channelId: chan1.id,
        title: 'PostgreSQL Indexing & High-Volume Cursor Pagination Masterclass',
        description: 'Why OFFSET/LIMIT degrades catastrophically at scale and how deterministic composite keys (createdAt, id) provide sub-millisecond query performance across millions of rows.',
        category: 'Technology',
        tags: ['PostgreSQL', 'Databases', 'Performance', 'Backend', 'SQL'],
        visibility: 'PUBLIC',
        status: 'READY',
        masterPlaylistUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        thumbnailUrls: [
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop'
        ],
        selectedThumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
        duration: 730,
        viewsCount: 97800,
        likesCount: 8200,
        dislikesCount: 45,
        commentsCount: 245,
        publishedAt: new Date(Date.now() - 21 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    seedVideos.forEach(v => this.videos.set(v.id, v));

    // Seed Initial Subscriptions
    this.subscriptions.set(`sub_${user1.id}_${chan2.id}`, {
      id: `sub_${user1.id}_${chan2.id}`,
      subscriberId: user1.id,
      channelId: chan2.id,
      createdAt: new Date().toISOString(),
    });
  }

  // --- User Operations ---
  public findUserByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  public findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  public createUser(userData: { email: string; name: string; passwordHash?: string; avatarUrl?: string }): User {
    const user: User = {
      id: `usr_${crypto.randomBytes(6).toString('hex')}`,
      email: userData.email,
      name: userData.name,
      passwordHash: userData.passwordHash,
      avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(userData.name)}`,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // --- Channel Operations ---
  public findChannelById(id: string): Channel | undefined {
    return this.channels.get(id);
  }

  public findChannelByUserId(userId: string): Channel | undefined {
    for (const channel of this.channels.values()) {
      if (channel.userId === userId) {
        return channel;
      }
    }
    return undefined;
  }

  public findChannelByHandle(handle: string): Channel | undefined {
    const cleanHandle = handle.replace(/^@/, '').toLowerCase();
    for (const channel of this.channels.values()) {
      if (channel.handle.toLowerCase() === cleanHandle) {
        return channel;
      }
    }
    return undefined;
  }

  public createChannel(data: { userId: string; handle: string; name: string; description?: string; avatarUrl?: string; bannerUrl?: string }): Channel {
    const cleanHandle = data.handle.replace(/^@/, '').toLowerCase().trim();
    const channel: Channel = {
      id: `chn_${crypto.randomBytes(6).toString('hex')}`,
      userId: data.userId,
      handle: cleanHandle,
      name: data.name,
      description: data.description || `Welcome to ${data.name}'s channel on StreamHub!`,
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanHandle}`,
      bannerUrl: data.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop',
      subscribersCount: 0,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.channels.set(channel.id, channel);
    return channel;
  }

  public updateChannel(id: string, updates: Partial<Channel>): Channel | undefined {
    const channel = this.channels.get(id);
    if (!channel) return undefined;

    if (updates.handle) {
      updates.handle = updates.handle.replace(/^@/, '').toLowerCase().trim();
    }

    const updated: Channel = {
      ...channel,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.channels.set(id, updated);
    return updated;
  }

  public listChannels(limit = 20): Channel[] {
    return Array.from(this.channels.values())
      .sort((a, b) => b.subscribersCount - a.subscribersCount)
      .slice(0, limit);
  }

  // --- Subscription Operations ---
  public isSubscribed(subscriberId: string, channelId: string): boolean {
    const key = `sub_${subscriberId}_${channelId}`;
    return this.subscriptions.has(key);
  }

  public toggleSubscription(subscriberId: string, channelId: string): { isSubscribed: boolean; newCount: number } {
    const key = `sub_${subscriberId}_${channelId}`;
    const channel = this.channels.get(channelId);
    if (!channel) throw new Error('Channel not found');

    if (this.subscriptions.has(key)) {
      this.subscriptions.delete(key);
      channel.subscribersCount = Math.max(0, channel.subscribersCount - 1);
      return { isSubscribed: false, newCount: channel.subscribersCount };
    } else {
      this.subscriptions.set(key, {
        id: key,
        subscriberId,
        channelId,
        createdAt: new Date().toISOString(),
      });
      channel.subscribersCount += 1;
      return { isSubscribed: true, newCount: channel.subscribersCount };
    }
  }

  // --- Video Operations ---
  public listVideos(options?: { channelId?: string; category?: string; query?: string; limit?: number }): (Video & { channel: Channel })[] {
    let result = Array.from(this.videos.values())
      .filter(v => v.visibility === 'PUBLIC' && v.status === 'READY');

    if (options?.channelId) {
      result = result.filter(v => v.channelId === options.channelId);
    }

    if (options?.category && options.category !== 'All') {
      result = result.filter(v => v.category.toLowerCase() === options.category!.toLowerCase());
    }

    if (options?.query) {
      const q = options.query.toLowerCase();
      result = result.filter(v => 
        v.title.toLowerCase().includes(q) || 
        (v.description && v.description.toLowerCase().includes(q)) ||
        v.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    const limit = options?.limit || 30;
    return result
      .slice(0, limit)
      .map(v => ({
        ...v,
        channel: this.channels.get(v.channelId)!
      }));
  }

  public findVideoById(id: string): (Video & { channel: Channel }) | undefined {
    const video = this.videos.get(id);
    if (!video) return undefined;
    const channel = this.channels.get(video.channelId);
    if (!channel) return undefined;
    return { ...video, channel };
  }
}

export const store = new StreamHubStore();
