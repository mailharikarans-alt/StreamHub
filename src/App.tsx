import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Sparkles, 
  Tv, 
  Compass, 
  ShieldCheck, 
  ExternalLink,
  Flame,
  CheckCircle2,
  X
} from 'lucide-react';
import { api } from './services/api.ts';
import { User, Channel, Video } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { VideoCard } from './components/VideoCard.tsx';
import { ChannelView } from './components/ChannelView.tsx';
import { ChannelEditModal } from './components/ChannelEditModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [videos, setVideos] = useState<(Video & { channel: Channel })[]>([]);
  const [loading, setLoading] = useState(true);

  // Layout & Navigation State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannelHandle, setSelectedChannelHandle] = useState<string | null>(null);
  const [viewedChannel, setViewedChannel] = useState<Channel | null>(null);
  const [channelVideos, setChannelVideos] = useState<Video[]>([]);
  
  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchitectureModal, setShowArchitectureModal] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<(Video & { channel: Channel }) | null>(null);

  const categories = [
    'All',
    'Technology',
    'Gaming',
    'Music',
    'Distributed Systems',
    'Architecture',
    'Engineering'
  ];

  // Load initial data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      // 1. Session check
      const session = await api.getMe();
      if (session) {
        setCurrentUser(session.user);
        setCurrentChannel(session.channel);
      } else {
        // Auto sign-in to demo creator Alex Chen for effortless first-time exploration
        const demo = await api.switchDemo('alex@streamhub.io');
        setCurrentUser(demo.user);
        setCurrentChannel(demo.channel);
      }

      // 2. Fetch Channels
      const channelList = await api.getChannels();
      setChannels(channelList);

      // 3. Fetch Feed Videos
      const feed = await api.getVideos();
      setVideos(feed.videos);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter videos when category or search changes
  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const feed = await api.getVideos({
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          query: searchQuery || undefined,
        });
        setVideos(feed.videos);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };

    fetchFiltered();
  }, [selectedCategory, searchQuery]);

  // Load selected channel profile
  useEffect(() => {
    if (!selectedChannelHandle) {
      setViewedChannel(null);
      setChannelVideos([]);
      return;
    }

    const fetchChannelData = async () => {
      try {
        const chan = await api.getChannel(selectedChannelHandle);
        setViewedChannel(chan);
        const vids = await api.getChannelVideos(chan.id);
        setChannelVideos(vids);
      } catch (err) {
        console.error('Failed to load channel:', err);
      }
    };

    fetchChannelData();
  }, [selectedChannelHandle]);

  // Handle Subscription Toggle
  const handleToggleSubscribe = async (channelId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await api.toggleSubscription(channelId);
      
      // Update viewed channel state
      if (viewedChannel && viewedChannel.id === channelId) {
        setViewedChannel({
          ...viewedChannel,
          isSubscribed: res.isSubscribed,
          subscribersCount: res.subscribersCount,
        });
      }

      // Refresh channel list
      const updatedChannels = await api.getChannels();
      setChannels(updatedChannels);
    } catch (err: any) {
      console.error('Subscribe toggle error:', err);
    }
  };

  // Handle Channel Save / Update
  const handleSaveChannel = async (updates: Partial<Channel>) => {
    if (!currentChannel) return;
    const updated = await api.updateChannel(currentChannel.id, updates);
    setCurrentChannel(updated);
    if (viewedChannel && viewedChannel.id === updated.id) {
      setViewedChannel({ ...viewedChannel, ...updated });
    }
    const channelList = await api.getChannels();
    setChannels(channelList);
  };

  // Handle Tab navigation
  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedChannelHandle(null);
    if (tab.startsWith('explore-')) {
      const cat = tab.replace('explore-', '');
      if (cat === 'tech') setSelectedCategory('Technology');
      else if (cat === 'gaming') setSelectedCategory('Gaming');
      else if (cat === 'music') setSelectedCategory('Music');
      else if (cat === 'coding') setSelectedCategory('Distributed Systems');
    } else {
      setSelectedCategory('All');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500 selection:text-white flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        currentChannel={currentChannel}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenArchitecture={() => setShowArchitectureModal(true)}
        onSelectChannel={(handle) => setSelectedChannelHandle(handle)}
        onSearch={(q) => setSearchQuery(q)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onLogout={() => {
          api.logout();
          setCurrentUser(null);
          setCurrentChannel(null);
        }}
        onNavigateHome={() => {
          setSelectedChannelHandle(null);
          setActiveTab('home');
          setSelectedCategory('All');
          setSearchQuery('');
        }}
      />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          activeTab={activeTab}
          channels={channels}
          onSelectTab={handleSelectTab}
          onSelectChannel={(handle) => setSelectedChannelHandle(handle)}
          onOpenArchitecture={() => setShowArchitectureModal(true)}
        />

        {/* Content Area */}
        <main className={`flex-1 transition-all duration-200 ${sidebarOpen ? 'sm:ml-60' : 'sm:ml-16'} p-4 sm:p-6 overflow-x-hidden`}>
          {/* Phase 1 Status Banner */}
          <div className="mb-6 rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-950/40 via-zinc-900/60 to-zinc-900/40 p-4 sm:p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">StreamHub Phase 1 Live</h2>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      System Ready
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1 max-w-2xl">
                    Prisma PostgreSQL schema defined, docker-compose configured, multi-user authentication with auto channel creation, and live channel customization active.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowArchitectureModal(true)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Inspect System Spec</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIEW 1: CHANNEL PROFILE VIEW */}
          {selectedChannelHandle && viewedChannel ? (
            <ChannelView
              channel={viewedChannel}
              videos={channelVideos}
              currentUser={currentUser}
              onToggleSubscribe={handleToggleSubscribe}
              onOpenEdit={() => setShowEditModal(true)}
              onSelectVideo={(v) => setPlayingVideo({ ...v, channel: viewedChannel })}
              onSelectChannel={(handle) => setSelectedChannelHandle(handle)}
            />
          ) : (
            /* VIEW 2: HOME FEED & DISCOVERY */
            <div className="space-y-6">
              {/* Category Chips Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      selectedCategory === cat
                        ? 'bg-white text-zinc-950 shadow-md'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Video Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse space-y-3">
                      <div className="aspect-video w-full rounded-2xl bg-zinc-900" />
                      <div className="flex gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-900 shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 rounded bg-zinc-900" />
                          <div className="h-3 w-1/2 rounded bg-zinc-900" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                  {videos.map((vid) => (
                    <VideoCard
                      key={vid.id}
                      video={vid}
                      onSelectVideo={(v) => setPlayingVideo(v as any)}
                      onSelectChannel={(handle) => setSelectedChannelHandle(handle)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-500 mb-4">
                    <Compass className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-200">No videos found</h3>
                  <p className="text-sm text-zinc-400 mt-1 max-w-sm">
                    {searchQuery ? `No videos match "${searchQuery}".` : 'Try selecting a different category filter.'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="mt-4 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Floating Video Preview Drawer (Demonstrating Phase 1 readiness for Phase 2/3 player) */}
      {playingVideo && (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <Play className="h-3.5 w-3.5 fill-rose-400" />
              StreamHub Video Player
            </span>
            <button
              onClick={() => setPlayingVideo(null)}
              className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black mb-3">
            <img
              src={playingVideo.selectedThumbnail || playingVideo.thumbnailUrls[0]}
              alt={playingVideo.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center p-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white mb-2 shadow-lg">
                  <Play className="h-6 w-6 fill-white translate-x-0.5" />
                </div>
                <div className="text-xs font-semibold text-white">Ready for Phase 3 Player</div>
                <div className="text-[10px] text-zinc-300 font-mono mt-0.5 truncate max-w-[280px]">
                  {playingVideo.masterPlaylistUrl}
                </div>
              </div>
            </div>
          </div>

          <h4 className="text-xs font-bold text-white line-clamp-1">{playingVideo.title}</h4>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            By {playingVideo.channel?.name} • {playingVideo.viewsCount.toLocaleString()} views
          </p>
        </div>
      )}

      {/* MODALS */}
      {/* 1. Auth & Switch Demo Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user, channel) => {
          setCurrentUser(user);
          setCurrentChannel(channel);
        }}
      />

      {/* 2. Channel Customization Modal */}
      {currentChannel && (
        <ChannelEditModal
          channel={currentChannel}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveChannel}
        />
      )}

      {/* 3. System Architecture & Status Modal */}
      <ArchitectureModal
        isOpen={showArchitectureModal}
        onClose={() => setShowArchitectureModal(false)}
      />
    </div>
  );
}
