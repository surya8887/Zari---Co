import api from '@/api/axios';
import type { LoginInput, RegisterInput, User } from '@/features/auth/validation';

export const authService = {
  async login(credentials: LoginInput): Promise<User> {
    const { data } = await api.post('/auth/login', credentials);
    return data.data.user; 
  },

  async register(details: RegisterInput): Promise<User> {
    const { data } = await api.post('/auth/register', details);
    return data.data.user;
  },

  async logout(): Promise<void> {
    await api.get('/auth/logout');
  },

  async getMe(): Promise<User> {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  async googleLogin(idToken: string): Promise<User> {
    const { data } = await api.post('/auth/google/login', { idToken });
    return data.data.user;
  },
};
