// StreamHub Auth Routes
import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service.ts';

export const authRouter = Router();

// Middleware to extract session
export const extractUser = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const session = AuthService.getSession(token);
    if (session) {
      (req as any).user = session.user;
      (req as any).channel = session.channel;
    }
  }
  next();
};

// Required Auth Guard
export const requireAuth = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.substring(7);
  const session = AuthService.getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid token.' });
  }

  (req as any).user = session.user;
  (req as any).channel = session.channel;
  next();
};

// POST /api/auth/register
authRouter.post('/register', (req: Request, res: Response) => {
  try {
    const { email, password, name, handle } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const session = AuthService.register({ email, password, name, handle });
    return res.status(201).json({
      user: session.user,
      channel: session.channel,
      token: session.token,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Registration failed.' });
  }
});

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const session = AuthService.login(email, password);
    return res.json({
      user: session.user,
      channel: session.channel,
      token: session.token,
    });
  } catch (err: any) {
    return res.status(401).json({ error: err.message || 'Authentication failed.' });
  }
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, (req: Request, res: Response) => {
  const user = (req as any).user;
  const channel = (req as any).channel;
  return res.json({ user, channel });
});

// POST /api/auth/switch-demo
authRouter.post('/switch-demo', (req: Request, res: Response) => {
  try {
    const { emailOrHandle } = req.body;
    const session = AuthService.switchDemo(emailOrHandle || 'alex@streamhub.io');
    return res.json({
      user: session.user,
      channel: session.channel,
      token: session.token,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', (req: Request, res: Response) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
});
