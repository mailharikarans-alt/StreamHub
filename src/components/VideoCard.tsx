import React from 'react';
import { CheckCircle2, Play } from 'lucide-react';
import { Video, Channel } from '../types.ts';

interface VideoCardProps {
  video: Video & { channel?: Channel };
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (handle: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelectVideo,
  onSelectChannel,
}) => {
  // Format duration seconds to MM:SS or HH:MM:SS
  const formatDuration = (seconds: number) => {
    const s = Math.floor(seconds);
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Format view count
  const formatViews = (views: number) => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1).replace(/\.0$/, '')}M views`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1).replace(/\.0$/, '')}K views`;
    return `${views} views`;
  };

  // Format relative time
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 30) return `${Math.floor(diffDays / 30)} months ago`;
    if (diffDays > 0) return `${diffDays} days ago`;
    if (diffHours > 0) return `${diffHours} hours ago`;
    return 'Just now';
  };

  const channel = video.channel;
  const thumbnail = video.selectedThumbnail || video.thumbnailUrls[0] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop';

  return (
    <div className="group flex flex-col cursor-pointer transition-all duration-150">
      {/* Thumbnail Container */}
      <div 
        onClick={() => onSelectVideo(video)}
        className="relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800/80 group-hover:border-zinc-700 transition-colors"
      >
        <img
          src={thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Play Overlay on Hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-600/90 text-white shadow-xl shadow-rose-950/60 backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="h-5 w-5 fill-white translate-x-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 rounded-md bg-zinc-950/85 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-100 backdrop-blur-sm font-mono tracking-tight">
          {formatDuration(video.duration)}
        </div>

        {/* Category Pill */}
        <div className="absolute top-2 left-2 rounded-md bg-zinc-950/70 px-2 py-0.5 text-[10px] font-medium text-zinc-300 backdrop-blur-sm border border-zinc-700/40">
          {video.category}
        </div>
      </div>

      {/* Video Details */}
      <div className="mt-3 flex gap-3">
        {/* Channel Avatar */}
        {channel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectChannel(channel.handle);
            }}
            className="shrink-0 focus:outline-none"
            title={channel.name}
          >
            <img
              src={channel.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={channel.name}
              className="h-9 w-9 rounded-full object-cover hover:ring-2 hover:ring-rose-500 transition-all"
            />
          </button>
        )}

        <div className="flex-1 overflow-hidden">
          {/* Title */}
          <h3 
            onClick={() => onSelectVideo(video)}
            className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-rose-400 transition-colors"
            title={video.title}
          >
            {video.title}
          </h3>

          {/* Channel Name */}
          {channel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectChannel(channel.handle);
              }}
              className="mt-1 flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none"
            >
              <span className="truncate max-w-[200px]">{channel.name}</span>
              {channel.isVerified && (
                <CheckCircle2 className="h-3.5 w-3.5 fill-rose-500 text-zinc-950 shrink-0" />
              )}
            </button>
          )}

          {/* Views & Date */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
            <span>{formatViews(video.viewsCount)}</span>
            <span>•</span>
            <span>{formatTimeAgo(video.publishedAt || video.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
