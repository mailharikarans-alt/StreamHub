// StreamHub Core Domain Types

export type VideoStatus = 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';
export type Visibility = 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
export type ReactionType = 'LIKE' | 'DISLIKE';
export type ReportStatus = 'PENDING' | 'REVIEWED' | 'ACTION_TAKEN' | 'DISMISSED';

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  name: string;
  avatarUrl?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Channel {
  id: string;
  userId: string;
  handle: string; // e.g. "techradar"
  name: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  subscribersCount: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  channelId: string;
  channel?: Channel;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  visibility: Visibility;
  status: VideoStatus;
  
  // Storage & Streaming
  rawUploadKey?: string;
  masterPlaylistUrl?: string;
  thumbnailUrls: string[];
  selectedThumbnail?: string;
  spriteSheetUrl?: string;
  vttStoryboardUrl?: string;
  captionsUrl?: string;
  duration: number; // in seconds
  
  // Counters
  viewsCount: number;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoReaction {
  id: string;
  userId: string;
  videoId: string;
  type: ReactionType;
  createdAt: string;
}

export interface Subscription {
  id: string;
  subscriberId: string;
  channelId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
    channelHandle?: string;
  };
  parentId?: string | null;
  content: string;
  likesCount: number;
  isPinned: boolean;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  channel: Channel;
  token: string;
}
