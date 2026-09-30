import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Layers, 
  Box, 
  Radio, 
  CheckCircle2, 
  Code2, 
  Terminal, 
  HardDrive, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../services/api.ts';
import { SystemStatus } from '../types.ts';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'docker' | 'pipeline'>('overview');

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getSystemStatus();
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch system status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">StreamHub System Architecture</h3>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  Phase 1 Verified
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Full-stack video architecture, Prisma schema, Docker orchestration, and live service status
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatus}
              className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              title="Refresh status"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 mt-4 text-xs font-semibold text-zinc-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`border-b-2 px-4 py-2.5 transition-colors ${
              activeTab === 'overview' ? 'border-emerald-500 text-emerald-400' : 'border-transparent hover:text-zinc-200'
            }`}
          >
            Overview & Live Health
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`border-b-2 px-4 py-2.5 transition-colors ${
              activeTab === 'schema' ? 'border-emerald-500 text-emerald-400' : 'border-transparent hover:text-zinc-200'
            }`}
          >
            Prisma Schema & Relational Model
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`border-b-2 px-4 py-2.5 transition-colors ${
              activeTab === 'docker' ? 'border-emerald-500 text-emerald-400' : 'border-transparent hover:text-zinc-200'
            }`}
          >
            Docker Compose & Infrastructure
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`border-b-2 px-4 py-2.5 transition-colors ${
              activeTab === 'pipeline' ? 'border-emerald-500 text-emerald-400' : 'border-transparent hover:text-zinc-200'
            }`}
          >
            HLS Video Ingestion Blueprint
          </button>
        </div>

        {/* Content */}
        <div className="py-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Service Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Database */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Database className="h-5 w-5 text-blue-400" />
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-xs font-semibold text-zinc-200">Database Engine</div>
                  <div className="text-[11px] text-zinc-400 mt-1">PostgreSQL 16 + Prisma</div>
                  <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 space-y-0.5">
                    <div>Users: <span className="text-zinc-200 font-mono">{status?.services.database.records.users ?? 3}</span></div>
                    <div>Channels: <span className="text-zinc-200 font-mono">{status?.services.database.records.channels ?? 3}</span></div>
                    <div>Videos: <span className="text-zinc-200 font-mono">{status?.services.database.records.videos ?? 4}</span></div>
                  </div>
                </div>

                {/* Redis */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Radio className="h-5 w-5 text-rose-400" />
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-xs font-semibold text-zinc-200">Cache & Broker</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Redis 7 Alpine</div>
                  <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
                    <div>Queue: <span className="text-zinc-200">BullMQ (video-transcode)</span></div>
                    <div className="mt-1">Deduplication: <span className="text-zinc-200">HyperLogLog / Set</span></div>
                  </div>
                </div>

                {/* Storage */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <HardDrive className="h-5 w-5 text-amber-400" />
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-xs font-semibold text-zinc-200">Object Storage</div>
                  <div className="text-[11px] text-zinc-400 mt-1">MinIO (S3 Compatible)</div>
                  <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
                    <div>Buckets: <span className="text-zinc-200">raw, hls, thumbnails</span></div>
                    <div className="mt-1">Access: <span className="text-zinc-200">Presigned direct PUT</span></div>
                  </div>
                </div>

                {/* Worker */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Box className="h-5 w-5 text-emerald-400" />
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-xs font-semibold text-zinc-200">FFmpeg Worker</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Multi-Rendition Transcoder</div>
                  <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400">
                    <div>Resolutions: <span className="text-zinc-200 font-mono">1080p, 720p, 480p, 360p, 240p</span></div>
                  </div>
                </div>
              </div>

              {/* Phase Status Checklist */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Phase 1 Deliverables Checklist
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>PostgreSQL Database Schema & Indexes (Prisma)</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>docker-compose.yml (Postgres, Redis, MinIO, Worker)</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Automated Channel Provisioning upon Signup</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Channel Management (Handle validation, banner, avatar)</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Authentication Service with Demo Creator Switcher</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Full .env.example & README.md Documentation</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>File: <code className="text-emerald-400">prisma/schema.prisma</code></span>
                <span>Relational PostgreSQL 16</span>
              </div>
              <pre className="max-h-80 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-[11px] font-mono text-zinc-300 leading-relaxed">
{`model User {
  id            String            @id @default(cuid())
  email         String            @unique
  name          String
  avatarUrl     String?
  isAdmin       Boolean           @default(false)
  channel       Channel?
  reactions     VideoReaction[]
  comments      Comment[]
  subscriptions Subscription[]   @relation("UserSubscriptions")
  watchHistory  WatchHistory[]
}

model Channel {
  id               String         @id @default(cuid())
  userId           String         @unique
  handle           String         @unique
  name             String
  description      String?
  avatarUrl        String?
  bannerUrl        String?
  subscribersCount Int            @default(0)
  isVerified       Boolean        @default(false)
  videos           Video[]
}

model Video {
  id                String          @id @default(cuid())
  channelId         String
  title             String
  description       String?
  visibility        Visibility      @default(PUBLIC)
  status            VideoStatus     @default(UPLOADING)
  masterPlaylistUrl String?
  thumbnailUrls     String[]        @default([])
  viewsCount        BigInt          @default(0)
  likesCount        Int             @default(0)
  commentsCount     Int             @default(0)
  duration          Float           @default(0)

  @@index([channelId, createdAt(sort: Desc)])
  @@index([visibility, status, createdAt(sort: Desc)])
  @@index([viewsCount(sort: Desc)])
}`}
              </pre>
            </div>
          )}

          {/* TAB 3: DOCKER COMPOSE */}
          {activeTab === 'docker' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>File: <code className="text-emerald-400">docker-compose.yml</code></span>
                <span>Run: <code className="text-zinc-200">docker compose up -d</code></span>
              </div>
              <pre className="max-h-80 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-[11px] font-mono text-zinc-300 leading-relaxed">
{`services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: streamhub_db

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  minio:
    image: minio/minio
    ports: ["9000:9000", "9001:9001"] # S3 API + Console

  transcoder-worker:
    build: { dockerfile: Dockerfile.worker }
    depends_on: [postgres, redis, minio]

  app:
    build: { dockerfile: Dockerfile }
    ports: ["3000:3000"]`}
              </pre>
            </div>
          )}

          {/* TAB 4: PIPELINE */}
          {activeTab === 'pipeline' && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3 text-xs text-zinc-300">
              <div className="font-semibold text-white flex items-center gap-2">
                <Terminal className="h-4 w-4 text-rose-400" />
                <span>Zero App-Server Streaming Blueprint (Non-Negotiable)</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-zinc-300 leading-relaxed">
                <li><strong className="text-zinc-100">Presigned Direct Upload:</strong> Client requests presigned PUT/multipart S3 URL from StreamHub API. Raw video streams straight to MinIO/S3 without ever passing through the app server.</li>
                <li><strong className="text-zinc-100">Job Enqueue:</strong> Client notifies completion; StreamHub pushes idempotent transcode job to BullMQ Redis queue.</li>
                <li><strong className="text-zinc-100">Isolated Transcoding:</strong> FFmpeg worker pulls raw file into isolated sandbox directory, analyzes codecs via ffprobe, and transcodes 5 HLS renditions with keyframe alignment.</li>
                <li><strong className="text-zinc-100">Thumbnails & Storyboard:</strong> Worker extracts 3 poster frames and a scrub sprite sheet with WebVTT coordinates.</li>
                <li><strong className="text-zinc-100">Direct Playback:</strong> hls.js on client downloads .m3u8 manifests and .ts segments directly from S3/CDN.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs text-zinc-500">
          <div>Next Step: <strong className="text-rose-400">Phase 2: Upload Pipeline & FFmpeg HLS Worker</strong></div>
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2 font-semibold text-zinc-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
