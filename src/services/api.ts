// StreamHub API Client
import { User, Channel, Video, SystemStatus } from '../types.ts';

const TOKEN_KEY = 'streamhub_auth_token';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem(TOKEN_KEY);
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: Request failed`);
    }

    return data as T;
  }

  // --- Auth APIs ---
  public async getMe(): Promise<{ user: User; channel: Channel } | null> {
    if (!this.token) return null;
    try {
      return await this.request<{ user: User; channel: Channel }>('/api/auth/me');
    } catch {
      this.setToken(null);
      return null;
    }
  }

  public async register(name: string, email: string, handle?: string, password?: string): Promise<{ user: User; channel: Channel; token: string }> {
    const res = await this.request<{ user: User; channel: Channel; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, handle, password }),
    });
    this.setToken(res.token);
    return res;
  }

  public async login(email: string, password?: string): Promise<{ user: User; channel: Channel; token: string }> {
    const res = await this.request<{ user: User; channel: Channel; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  }

  public async switchDemo(emailOrHandle: string): Promise<{ user: User; channel: Channel; token: string }> {
    const res = await this.request<{ user: User; channel: Channel; token: string }>('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ emailOrHandle }),
    });
    this.setToken(res.token);
    return res;
  }

  public logout(): void {
    this.setToken(null);
  }

  // --- Channel APIs ---
  public async getChannels(): Promise<Channel[]> {
    return this.request<Channel[]>('/api/channels');
  }

  public async getChannel(identifier: string): Promise<Channel> {
    return this.request<Channel>(`/api/channels/${encodeURIComponent(identifier)}`);
  }

  public async updateChannel(id: string, updates: Partial<Channel>): Promise<Channel> {
    return this.request<Channel>(`/api/channels/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  public async toggleSubscription(channelId: string): Promise<{ isSubscribed: boolean; subscribersCount: number }> {
    return this.request<{ isSubscribed: boolean; subscribersCount: number }>(`/api/channels/${channelId}/subscribe`, {
      method: 'POST',
    });
  }

  public async getChannelVideos(channelId: string): Promise<Video[]> {
    return this.request<Video[]>(`/api/channels/${channelId}/videos`);
  }

  // --- Video APIs ---
  public async getVideos(params?: { category?: string; query?: string }): Promise<{ videos: (Video & { channel: Channel })[] }> {
    const queryParams = new URLSearchParams();
    if (params?.category && params.category !== 'All') {
      queryParams.set('category', params.category);
    }
    if (params?.query) {
      queryParams.set('q', params.query);
    }
    const qs = queryParams.toString();
    return this.request<{ videos: (Video & { channel: Channel })[] }>(`/api/videos${qs ? `?${qs}` : ''}`);
  }

  public async getVideo(id: string): Promise<Video & { channel: Channel }> {
    return this.request<Video & { channel: Channel }>(`/api/videos/${id}`);
  }

  // --- System API ---
  public async getSystemStatus(): Promise<SystemStatus> {
    return this.request<SystemStatus>('/api/system/status');
  }
}

export const api = new ApiService();
