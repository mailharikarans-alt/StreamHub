// StreamHub Authentication Service
import crypto from 'crypto';
import { store } from '../db/store.ts';
import { User, Channel, AuthSession } from '../types/index.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'streamhub-dev-secret-key-32charslong!!';

export class AuthService {
  // Hash password using PBKDF2 with salt
  public static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  // Verify password hash
  public static verifyPassword(password: string, storedHash: string): boolean {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return key === hash;
  }

  // Create tamper-proof session token
  public static createSessionToken(userId: string): string {
    const payload = JSON.stringify({
      userId,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    const encodedPayload = Buffer.from(payload).toString('base64url');
    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(encodedPayload)
      .digest('base64url');
    return `${encodedPayload}.${signature}`;
  }

  // Validate session token
  public static verifySessionToken(token: string): { userId: string } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 2) return null;
      const [encodedPayload, signature] = parts;
      const expectedSignature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(encodedPayload)
        .digest('base64url');

      if (signature !== expectedSignature) return null;

      const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
      if (payload.exp && Date.now() > payload.exp) {
        return null;
      }
      return { userId: payload.userId };
    } catch {
      return null;
    }
  }

  // Register new user & automatically provision their personal channel
  public static register(data: { email: string; password?: string; name: string; handle?: string }): AuthSession {
    const existing = store.findUserByEmail(data.email);
    if (existing) {
      throw new Error('A user with this email address already exists.');
    }

    // Determine unique handle
    let rawHandle = (data.handle || data.name.toLowerCase().replace(/[^a-z0-9_]/g, '')).replace(/^@/, '');
    if (!rawHandle || rawHandle.length < 3) {
      rawHandle = `creator_${crypto.randomBytes(3).toString('hex')}`;
    }

    let finalHandle = rawHandle;
    let counter = 1;
    while (store.findChannelByHandle(finalHandle)) {
      finalHandle = `${rawHandle}${counter++}`;
    }

    const passwordHash = data.password ? this.hashPassword(data.password) : undefined;
    const user = store.createUser({
      email: data.email,
      name: data.name,
      passwordHash,
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(finalHandle)}`,
    });

    const channel = store.createChannel({
      userId: user.id,
      handle: finalHandle,
      name: data.name,
      description: `Welcome to ${data.name}'s official channel on StreamHub!`,
      avatarUrl: user.avatarUrl,
    });

    const token = this.createSessionToken(user.id);
    return { user, channel, token };
  }

  // Authenticate user
  public static login(email: string, password?: string): AuthSession {
    const user = store.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (password && user.passwordHash) {
      const isValid = this.verifyPassword(password, user.passwordHash);
      if (!isValid) throw new Error('Invalid email or password.');
    }

    const channel = store.findChannelByUserId(user.id);
    if (!channel) {
      // Fallback create channel if missing
      const newChannel = store.createChannel({
        userId: user.id,
        handle: user.name.toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${user.id.slice(4, 8)}`,
        name: user.name,
      });
      const token = this.createSessionToken(user.id);
      return { user, channel: newChannel, token };
    }

    const token = this.createSessionToken(user.id);
    return { user, channel, token };
  }

  // Switch to one of the demo creators instantly
  public static switchDemo(emailOrHandle: string): AuthSession {
    let user = store.findUserByEmail(emailOrHandle);
    if (!user) {
      const channel = store.findChannelByHandle(emailOrHandle);
      if (channel) {
        user = store.findUserById(channel.userId);
      }
    }

    if (!user) {
      // Default to first user
      user = Array.from(store.users.values())[0];
    }

    const channel = store.findChannelByUserId(user.id) || Array.from(store.channels.values())[0];
    const token = this.createSessionToken(user.id);
    return { user, channel, token };
  }

  // Get current active session
  public static getSession(token: string): AuthSession | null {
    const payload = this.verifySessionToken(token);
    if (!payload) return null;

    const user = store.findUserById(payload.userId);
    if (!user) return null;

    const channel = store.findChannelByUserId(user.id);
    if (!channel) return null;

    return { user, channel, token };
  }
}
