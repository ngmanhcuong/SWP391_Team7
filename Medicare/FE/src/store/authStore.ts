import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { useChatStore } from './chatStore';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        set({ user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        useChatStore.getState().reset(); // xóa lịch sử trợ lý sức khỏe khi đăng xuất
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage', partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }) }
  )
);
