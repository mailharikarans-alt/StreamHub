import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Lock, AtSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api.ts';
import { Channel } from '../types.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any, channel: Channel) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'switch' | 'login' | 'register'>('switch');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoSwitch = async (demoEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.switchDemo(demoEmail);
      onSuccess(res.user, res.channel);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.register(name, email, handle, password);
      onSuccess(res.user, res.channel);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      onSuccess(res.user, res.channel);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      name: 'Alex Chen',
      handle: 'techpulse',
      email: 'alex@streamhub.io',
      role: 'Tech & Architecture Creator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      stats: '248K subscribers • Verified',
    },
    {
      name: 'Marcus Vance',
      handle: 'pixelvoyage',
      email: 'marcus@streamhub.io',
      role: 'Gaming & 4K Ray-Tracing',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      stats: '512K subscribers • Verified',
    },
    {
      name: 'Elena Rostova',
      handle: 'soundscapes',
      email: 'elena@streamhub.io',
      role: 'Modular Synth & Audio Engineer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      stats: '184K subscribers • Verified',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-500" />
              <span>{mode === 'switch' ? 'Select Creator Account' : mode === 'login' ? 'Sign In to StreamHub' : 'Create Channel & Account'}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {mode === 'switch' ? 'Instant 1-click test with pre-seeded channels' : 'Full access to subscribe, like, comment, and upload'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-xl mt-4 text-xs font-semibold">
          <button
            onClick={() => setMode('switch')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'switch' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Demo Creators
          </button>
          <button
            onClick={() => setMode('login')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            New Channel
          </button>
        </div>

        {/* 1. Quick Switch Demo Accounts */}
        {mode === 'switch' && (
          <div className="mt-5 space-y-3">
            <p className="text-xs text-zinc-400">
              Select any demo creator to instantly experience personalized channel management, ownership checks, and subscriptions:
            </p>

            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  disabled={loading}
                  onClick={() => handleDemoSwitch(account.email)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="h-10 w-10 rounded-full object-cover border border-zinc-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-zinc-100">{account.name}</span>
                        <CheckCircle2 className="h-3.5 w-3.5 fill-rose-500 text-zinc-950" />
                        <span className="text-xs text-rose-400 font-mono">@{account.handle}</span>
                      </div>
                      <div className="text-xs text-zinc-400">{account.stats}</div>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Sign In Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@streamhub.io"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-zinc-400" />
                Password (Optional for Demo)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 py-2.5 text-sm font-semibold text-white hover:from-rose-500 hover:to-rose-400 transition-all shadow-lg shadow-rose-950/40 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* 3. Register / New Channel Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-zinc-400" />
                Full Name / Channel Display Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Miller"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AtSign className="h-3.5 w-3.5 text-rose-400" />
                Channel Handle (e.g. @jordan_tech)
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="jordan_tech (auto-generated if empty)"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@example.com"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-zinc-400" />
                Password (Optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 py-2.5 text-sm font-semibold text-white hover:from-rose-500 hover:to-rose-400 transition-all shadow-lg shadow-rose-950/40 disabled:opacity-50"
            >
              {loading ? 'Creating Channel...' : 'Create Account & Launch Channel'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
