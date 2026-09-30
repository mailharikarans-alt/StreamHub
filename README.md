# StreamHub 🎬

> A high-performance video sharing platform engineered for scale, inspired by YouTube's core experience with an original brand identity, zero-server-streaming architecture, and adaptive HLS playback.

---

## 🏗️ Phase 1 Summary & Architecture

StreamHub is designed around strict distributed systems principles:
1. **Never Stream Through App Server:** Video uploads stream directly from clients to S3-compatible object storage (MinIO locally, AWS S3/Cloudflare R2 in production) via presigned PUT/multipart URLs. Playback segments (`.ts`) and manifests (`.m3u8`) are served directly via storage/CDN.
2. **Asynchronous & Idempotent Transcoding:** High-resolution videos are processed in background workers via BullMQ and FFmpeg into 5 HLS renditions (`1080p`, `720p`, `480p`, `360p`, `240p`), with poster thumbnails and VTT seek scrub sheets.
3. **Anti-Thundering Herd View Counting:** Views are never written directly to PostgreSQL per play. Playback heartbeats are deduplicated per user/IP session in Redis and flushed in high-efficiency batched database transactions.
4. **Relational Data Integrity:** Unique composite constraints prevent double-likes (`[userId, videoId]`) and duplicate subscriptions (`[subscriberId, channelId]`). Cursor-based pagination (`[createdAt, id]`) avoids catastrophic `OFFSET/LIMIT` page drift.

---

## 📁 Project Folder Structure

```
├── .env.example              # Documented environment variables for all services
├── docker-compose.yml        # Turnkey orchestration: Postgres 16, Redis 7, MinIO, Worker
├── Dockerfile                # Production container for Web & API service
├── Dockerfile.worker         # Transcoder container with FFmpeg & BullMQ
├── index.html                # App entry with synced metadata & OpenGraph tags
├── metadata.json             # Applet capabilities & descriptor
├── package.json              # Full-stack dependencies & scripts
├── prisma/
│   └── schema.prisma         # Production PostgreSQL schema with relations & indexes
├── server/
│   ├── api/
│   │   ├── auth.routes.ts    # Sign up, login, session validation & demo switchers
│   │   ├── channel.routes.ts # Channel profiles, handle validation, subscriptions
│   │   ├── video.routes.ts   # Video listings, category filters, and search
│   │   └── system.routes.ts  # System health & docker service diagnostics
│   ├── db/
│   │   └── store.ts          # Schema-aligned repository store with rich seed data
│   ├── services/
│   │   ├── auth.service.ts   # PBKDF2 hashing, HMAC-SHA256 session tokens, auto-channel provisioning
│   │   └── channel.service.ts# Handle uniqueness checks, channel updates, subscriber counters
│   ├── types/
│   │   └── index.ts          # Domain interfaces (User, Channel, Video, Reaction, etc.)
│   └── worker/
│       └── index.ts          # Transcoder worker blueprint for Phase 2
├── server.ts                 # Full-stack entry point: Express API + Vite middleware
└── src/
    ├── components/
    │   ├── ArchitectureModal.tsx # Interactive visual system spec & live database inspector
    │   ├── AuthModal.tsx         # Sign up, sign in, and 1-click demo creator switcher
    │   ├── ChannelEditModal.tsx  # Channel customization (name, handle, avatar, banner)
    │   ├── ChannelView.tsx       # Channel header, tabs (Videos, About), subscriber counter
    │   ├── Navbar.tsx            # Sticky header, search, upload button, user dropdown
    │   ├── Sidebar.tsx           # Collapsible navigation, library links, channels list
    │   └── VideoCard.tsx         # Video preview, duration badge, verified creator tags
    ├── services/
    │   └── api.ts                # Typed client API service
    ├── types.ts                  # Client TypeScript interfaces
    ├── App.tsx                   # Master responsive application layout & router
    ├── main.tsx                  # React 19 bootstrap
    └── index.css                 # Tailwind CSS v4 setup
```

---

## 🚀 Running StreamHub

### Option A: Standalone Dev Mode (Fastest)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the full-stack server (Express + Vite on Port 3000):**
   ```bash
   npm run dev
   ```

3. Open **`http://localhost:3000`** in your browser.

---

### Option B: Docker Compose (Full Distributed Stack)

To run the complete production-grade topology with real PostgreSQL, Redis, MinIO, and Worker:

```bash
docker compose up -d
```

Services exposed:
- **StreamHub Web & API**: `http://localhost:3000`
- **MinIO Console**: `http://localhost:9001` (User: `minioadmin` / Pass: `minioadmin123`)
- **MinIO S3 API**: `http://localhost:9000`
- **PostgreSQL**: `localhost:5432` (`streamhub_db`)
- **Redis**: `localhost:6379`

---

## 🧪 Testing Phase 1 Deliverables

1. **Auto-Channel Provisioning on Signup:**
   - Click **"Sign In"** in the top navigation -> Select the **"New Channel"** tab.
   - Enter your name (e.g. `Dev Engineer`), email, and optional custom handle (e.g. `dev_engineer`).
   - Click **"Create Account & Launch Channel"**.
   - Notice: A new personal Channel is instantly provisioned with a generated avatar, unique `@handle`, and initial subscriber counter.

2. **Switching Between Seed Creators:**
   - Click the user avatar in the top right -> **"Switch Demo Account"** (or click the Sign In button).
   - Select **Alex Chen (@techpulse)**, **Marcus Vance (@pixelvoyage)**, or **Elena Rostova (@soundscapes)**.
   - Notice how channel ownership updates dynamically: when viewing your own channel, the **"Customize Channel"** button appears; when viewing other channels, the reactive **"Subscribe"** button appears.

3. **Live Channel Customization & Handle Validation:**
   - When signed in as the channel owner, navigate to your channel and click **"Customize Channel"**.
   - Modify the channel display name, avatar preset, banner preset, or description.
   - Try changing the handle: handles must be at least 3 characters and unique.
   - Save changes and observe immediate reactive updates across the navigation, sidebar, and channel banner.

4. **Subscriptions Engine:**
   - Visit another creator's channel (e.g. click **Pixel Voyage** in the sidebar).
   - Click **"Subscribe"**: observe the atomic subscriber counter increment.
   - Click **"Subscribed"** to toggle unsubscribe: observe the counter decrement.

5. **System Architecture & Database Inspector:**
   - Click the **"Architecture & DB"** badge in the top navigation.
   - Review live database records, Prisma schema models, docker-compose configuration, and the HLS video ingestion blueprint.

---

## 📋 Roadmap by Phases

- [x] **Phase 1: Architecture proposal, folder structure, DB schema, docker-compose, auth, channel creation, README**
- [ ] **Phase 2:** Upload pipeline, presigned S3 URLs, FFmpeg transcoding worker, HLS output, processing status
- [ ] **Phase 3:** Watch page with hls.js player, home feed, channel page, view counting
- [ ] **Phase 4:** Search, likes, comments, subscriptions, history, playlists
- [ ] **Phase 5:** Creator studio, analytics, recommendations, moderation, captions
- [ ] **Phase 6:** Tests, rate limiting, performance pass, deployment guide
