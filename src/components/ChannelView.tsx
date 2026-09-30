import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Bell, 
  Edit3, 
  Calendar, 
  Eye, 
  Film, 
  Share2, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
import { Channel, Video, User } from '../types.ts';
import { VideoCard } from './VideoCard.tsx';

interface ChannelViewProps {
  channel: Channel;
  videos: Video[];
  currentUser: User | null;
  onToggleSubscribe: (channelId: string) => void;
  onOpenEdit: () => void;
  onSelectVideo: (video: Video) => void;
  onSelectChannel: (handle: string) => void;
}

export const ChannelView: React.FC<ChannelViewProps> = ({
  channel,
  videos,
  currentUser,
  onToggleSubscribe,
  onOpenEdit,
  onSelectVideo,
  onSelectChannel,
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'about'>('videos');
  const [copiedLink, setCopiedLink] = useState(false);

  const isOwner = currentUser?.id === channel.userId;
  const isSubscribed = Boolean(channel.isSubscribed);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const totalViews = videos.reduce((acc, v) => acc + (v.viewsCount || 0), 0);

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="relative h-44 sm:h-64 md:h-72 w-full overflow-hidden bg-zinc-900 border-b border-zinc-800">
        <img
          src={channel.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&h=400&fit=crop'}
          alt={`${channel.name} banner`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
      </div>

      {/* Channel Info Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-800">
          {/* Avatar and Titles */}
          <div className="flex items-end gap-5">
            <div className="relative">
              <img
                src={channel.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={channel.name}
                className="h-28 w-28 sm:h-36 sm:sm:w-36 rounded-full border-4 border-zinc-950 object-cover shadow-2xl bg-zinc-900"
              />
              {channel.isVerified && (
                <div className="absolute bottom-1 right-1 rounded-full bg-zinc-950 p-1 shadow-md">
                  <CheckCircle2 className="h-6 w-6 fill-rose-500 text-zinc-950" />
                </div>
              )}
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {channel.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-zinc-400">
                <span className="font-mono text-rose-400 font-semibold">@{channel.handle}</span>
                <span>•</span>
                <span className="font-medium text-zinc-300">
                  {channel.subscriberCountFormatted || `${channel.subscribersCount} subscribers`}
                </span>
                <span>•</span>
                <span>{videos.length} videos</span>
              </div>

              {channel.description && (
                <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-2xl line-clamp-2">
                  {channel.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons: Subscribe / Edit Channel / Share */}
          <div className="flex items-center gap-2 sm:mb-2">
            {isOwner ? (
              <button
                onClick={onOpenEdit}
                className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-700 hover:border-zinc-500 transition-all shadow-sm"
              >
                <Edit3 className="h-4 w-4 text-rose-400" />
                <span>Customize Channel</span>
              </button>
            ) : (
              <button
                onClick={() => onToggleSubscribe(channel.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all shadow-sm ${
                  isSubscribed
                    ? 'border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'bg-white text-zinc-950 hover:bg-zinc-200'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell className="h-4 w-4 fill-zinc-300" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            )}

            <button
              onClick={handleShare}
              className="rounded-full border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              title="Share Channel"
            >
              <Share2 className="h-4 w-4" />
            </button>
            {copiedLink && (
              <span className="text-xs text-emerald-400 font-medium">Link copied!</span>
            )}
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-zinc-800 text-sm font-medium text-zinc-400 mt-2">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'videos'
                ? 'border-rose-500 text-white'
                : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <Film className="h-4 w-4" />
            <span>Videos ({videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 font-semibold transition-colors ${
              activeTab === 'about'
                ? 'border-rose-500 text-white'
                : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>About Channel</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'videos' ? (
            videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                {videos.map((vid) => (
                  <VideoCard
                    key={vid.id}
                    video={{ ...vid, channel }}
                    onSelectVideo={onSelectVideo}
                    onSelectChannel={onSelectChannel}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-500 mb-4">
                  <Film className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-200">No videos published yet</h3>
                <p className="text-sm text-zinc-400 max-w-sm mt-1">
                  {isOwner
                    ? 'Upload your first master video in Phase 2 to kick off automated transcoding.'
                    : 'This creator has not uploaded any public videos yet.'}
                </p>
              </div>
            )
          ) : (
            /* About Tab */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-zinc-300">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Description
                  </h4>
                  <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
                    {channel.description || 'No description provided.'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Channel Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5 flex items-center gap-3">
                      <div className="rounded-lg bg-rose-500/10 p-2 text-rose-400">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400">Subscribers</div>
                        <div className="font-semibold text-white">{channel.subscribersCount.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5 flex items-center gap-3">
                      <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                        <Eye className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400">Total Views</div>
                        <div className="font-semibold text-white">{totalViews.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4 h-fit">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  Stats & Info
                </h4>

                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span>Joined {new Date(channel.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Film className="h-4 w-4 text-zinc-400" />
                  <span>{videos.length} videos uploaded</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>{channel.isVerified ? 'Verified Creator' : 'Standard Creator'}</span>
                </div>

                <hr className="border-zinc-800" />

                <div className="text-xs text-zinc-500">
                  Channel ID: <span className="font-mono text-zinc-400">{channel.id}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
