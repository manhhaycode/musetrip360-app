import { create } from 'zustand';
import { AuthToken } from '@/domain';

export interface AuthStore {
  accessToken: AuthToken | null;
  refreshToken: AuthToken | null;
  setAccessToken: (accessToken: AuthToken | null) => void;
  setRefreshToken: (refreshToken: AuthToken | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  setAccessToken: (accessToken) => set({ accessToken }),
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));
