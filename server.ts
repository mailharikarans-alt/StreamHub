import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './server/api/auth.routes.ts';
import { channelRouter } from './server/api/channel.routes.ts';
import { videoRouter } from './server/api/video.routes.ts';
import { systemRouter } from './server/api/system.routes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Endpoints
  app.use('/api/auth', authRouter);
  app.use('/api/channels', channelRouter);
  app.use('/api/videos', videoRouter);
  app.use('/api/system', systemRouter);

  if (!isProd) {
    // Development mode: Mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StreamHub Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start StreamHub server:', err);
  process.exit(1);
});
