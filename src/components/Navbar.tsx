import React, { useState } from 'react';
import { 
  Play, 
  Search, 
  Video as VideoIcon, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Settings, 
  Layers, 
  Sparkles,
  ChevronDown,
  Menu
} from 'lucide-react';
import { User, Channel } from '../types.ts';

interface NavbarProps {
  currentUser: User | null;
  currentChannel: Channel | null;
  onOpenAuth: () => void;
  onOpenArchitecture: () => void;
  onSelectChannel: (handle: string) => void;
  onSearch: (q: string) => void;
  onToggleSidebar: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentChannel,
  onOpenAuth,
  onOpenArchitecture,
  onSelectChannel,
  onSearch,
  onToggleSidebar,
  onLogout,
  onNavigateHome,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-4 backdrop-blur-md">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Toggle menu"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 group text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 text-white shadow-lg shadow-rose-900/30 group-hover:scale-105 transition-transform">
            <Play className="h-4 w-4 fill-white translate-x-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-lg">StreamHub</span>
              <span className="rounded-md bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-rose-400 border border-rose-500/20">
                Phase 1
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 block -mt-0.5">High-Performance Video</span>
          </div>
        </button>
      </div>

      {/* Middle: Global Search */}
      <form onSubmit={handleSubmitSearch} className="flex-1 max-w-xl mx-4 hidden sm:block">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search videos, creators, or engineering teardowns..."
            className="w-full rounded-full border border-zinc-700 bg-zinc-900/90 py-2 pl-4 pr-12 text-sm text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Right: Actions, System Spec & User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Architecture Spec Button */}
        <button
          onClick={onOpenArchitecture}
          className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-500/60 transition-colors"
          title="View Phase 1 Architecture & Status"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Layers className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Architecture & DB</span>
        </button>

        {/* Upload Trigger (preview for Phase 2) */}
        <button
          onClick={() => {
            if (!currentUser) onOpenAuth();
            else onOpenArchitecture();
          }}
          className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
          title="Upload Video Pipeline (Phase 2)"
        >
          <VideoIcon className="h-3.5 w-3.5 text-rose-400" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* Notifications */}
        <button 
          className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* User Account / Auth */}
        {currentUser && currentChannel ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-full p-1 border border-zinc-700 bg-zinc-900 hover:border-zinc-500 transition-colors focus:outline-none"
            >
              <img
                src={currentChannel.avatarUrl || currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentChannel.name}
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="text-xs font-medium text-zinc-200 hidden md:block max-w-[100px] truncate">
                {currentChannel.name}
              </span>
              <ChevronDown className="h-3 w-3 text-zinc-400 mr-1 hidden md:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="flex items-center gap-3 p-2.5 border-b border-zinc-800">
                  <img
                    src={currentChannel.avatarUrl || currentUser.avatarUrl}
                    alt={currentChannel.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-zinc-100 truncate">{currentChannel.name}</p>
                    <p className="text-xs text-rose-400 truncate font-mono">@{currentChannel.handle}</p>
                    <p className="text-[11px] text-zinc-400 truncate">{currentUser.email}</p>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => onSelectChannel(currentChannel.handle)}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                  >
                    <UserIcon className="h-4 w-4 text-zinc-400" />
                    View Your Channel
                  </button>

                  <button
                    onClick={onOpenAuth}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-amber-300 hover:bg-amber-950/40 transition-colors text-left"
                  >
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Switch Demo Account
                  </button>

                  <button
                    onClick={onOpenArchitecture}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 transition-colors text-left"
                  >
                    <Settings className="h-4 w-4 text-zinc-400" />
                    System Specifications
                  </button>
                </div>

                <div className="pt-1 border-t border-zinc-800">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
          >
            <UserIcon className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
