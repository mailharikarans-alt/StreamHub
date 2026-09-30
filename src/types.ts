// Client Types

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Channel {
  id: string;
  userId: string;
  handle: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  subscribersCount: number;
  isVerified: boolean;
  subscriberCountFormatted?: string;
  isSubscribed?: boolean;
  isOwner?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Video {
  id: string;
  channelId: string;
  channel?: Channel;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
  status: 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';
  masterPlaylistUrl?: string;
  thumbnailUrls: string[];
  selectedThumbnail?: string;
  duration: number;
  viewsCount: number;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  publishedAt?: string;
  createdAt: string;
}

export interface SystemStatus {
  status: string;
  version: string;
  timestamp: string;
  environment: string;
  services: {
    database: {
      engine: string;
      inMemoryStore: string;
      records: {
        users: number;
        channels: number;
        videos: number;
      };
    };
    redis: {
      configured: boolean;
      purpose: string;
    };
    storage: {
      configured: boolean;
      endpoint: string;
      buckets: string[];
    };
    transcoderWorker: {
      engine: string;
      renditions: string[];
    };
  };
  activePhase: {
    current: string;
    next: string;
  };
}
