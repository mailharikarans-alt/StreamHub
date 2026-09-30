import React from 'react';
import { 
  Home, 
  Flame, 
  Tv, 
  History, 
  Clock, 
  ThumbsUp, 
  Compass, 
  CheckCircle2, 
  Cpu, 
  Gamepad2, 
  Music, 
  Code2,
  Server
} from 'lucide-react';
import { Channel } from '../types.ts';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  channels: Channel[];
  onSelectTab: (tab: string) => void;
  onSelectChannel: (handle: string) => void;
  onOpenArchitecture: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  activeTab,
  channels,
  onSelectTab,
  onSelectChannel,
  onOpenArchitecture,
}) => {
  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-30 flex flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-200 overflow-y-auto ${
        isOpen ? 'w-60 px-3 py-4' : 'w-16 px-1.5 py-4 items-center'
      }`}
    >
      {/* Primary Links */}
      <div className="space-y-1 w-full">
        <button
          onClick={() => onSelectTab('home')}
          className={`w-full flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'home'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
          } ${!isOpen ? 'justify-center px-0' : ''}`}
          title="Home"
        >
          <Home className="h-5 w-5 text-rose-500" />
          {isOpen && <span>Home</span>}
        </button>

        <button
          onClick={() => onSelectTab('trending')}
          className={`w-full flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'trending'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
          } ${!isOpen ? 'justify-center px-0' : ''}`}
          title="Trending"
        >
          <Flame className="h-5 w-5 text-amber-500" />
          {isOpen && <span>Trending</span>}
        </button>

        <button
          onClick={() => onSelectTab('subscriptions')}
          className={`w-full flex items-center gap-4 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'subscriptions'
              ? 'bg-zinc-800 text-white font-semibold'
              : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
          } ${!isOpen ? 'justify-center px-0' : ''}`}
          title="Subscriptions"
        >
          <Tv className="h-5 w-5 text-emerald-500" />
          {isOpen && <span>Subscriptions</span>}
        </button>
      </div>

      <hr className="my-3 border-zinc-800 w-full" />

      {/* Library Section */}
      <div className="space-y-1 w-full">
        {isOpen && (
          <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Library
          </h4>
        )}
        <button
          onClick={() => onSelectTab('history')}
          className={`w-full flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors ${
            !isOpen ? 'justify-center px-0' : ''
          }`}
          title="History"
        >
          <History className="h-4 w-4" />
          {isOpen && <span>History</span>}
        </button>

        <button
          onClick={() => onSelectTab('watch-later')}
          className={`w-full flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors ${
            !isOpen ? 'justify-center px-0' : ''
          }`}
          title="Watch Later"
        >
          <Clock className="h-4 w-4" />
          {isOpen && <span>Watch Later</span>}
        </button>

        <button
          onClick={() => onSelectTab('liked')}
          className={`w-full flex items-center gap-4 rounded-xl px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors ${
            !isOpen ? 'justify-center px-0' : ''
          }`}
          title="Liked Videos"
        >
          <ThumbsUp className="h-4 w-4" />
          {isOpen && <span>Liked Videos</span>}
        </button>
      </div>

      <hr className="my-3 border-zinc-800 w-full" />

      {/* Explore / Categories */}
      {isOpen && (
        <div className="space-y-1 w-full">
          <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Compass className="h-3 w-3" />
            Explore
          </h4>
          <button
            onClick={() => onSelectTab('explore-tech')}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span>Technology</span>
          </button>
          <button
            onClick={() => onSelectTab('explore-gaming')}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <Gamepad2 className="h-4 w-4 text-purple-400" />
            <span>Gaming</span>
          </button>
          <button
            onClick={() => onSelectTab('explore-music')}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <Music className="h-4 w-4 text-pink-400" />
            <span>Music</span>
          </button>
          <button
            onClick={() => onSelectTab('explore-coding')}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
          >
            <Code2 className="h-4 w-4 text-emerald-400" />
            <span>Engineering</span>
          </button>
        </div>
      )}

      {/* Featured / Subscribed Channels */}
      {isOpen && channels.length > 0 && (
        <>
          <hr className="my-3 border-zinc-800 w-full" />
          <div className="space-y-1 w-full">
            <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Creators & Channels
            </h4>
            {channels.map((chan) => (
              <button
                key={chan.id}
                onClick={() => onSelectChannel(chan.handle)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors text-left"
              >
                <img
                  src={chan.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={chan.name}
                  className="h-6 w-6 rounded-full object-cover shrink-0"
                />
                <div className="truncate flex-1">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-xs font-medium">{chan.name}</span>
                    {chan.isVerified && <CheckCircle2 className="h-3 w-3 fill-rose-500 text-zinc-950 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-zinc-400 block truncate">@{chan.handle}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Architecture Spec link in footer of sidebar */}
      <div className="mt-auto pt-4 w-full">
        {isOpen ? (
          <button
            onClick={onOpenArchitecture}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-left hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <Server className="h-3.5 w-3.5" />
              <span>Phase 1 Architecture</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              Postgres, Redis, MinIO, BullMQ, Auth & Channels
            </p>
          </button>
        ) : (
          <button
            onClick={onOpenArchitecture}
            className="p-2 text-zinc-400 hover:text-emerald-400"
            title="System Architecture"
          >
            <Server className="h-5 w-5" />
          </button>
        )}
      </div>
    </aside>
  );
};
