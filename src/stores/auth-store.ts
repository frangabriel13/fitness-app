import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User } from '@/types';
import { DEFAULT_USER_ID, MOCK_USERS_MAP } from '@/data/mock-users';
import { mmkvStorage } from './storage';

interface AuthState {
  currentUserId: string;
  isLoggedIn: boolean;
  switchUser: (userId: string) => void;
  login: (userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUserId: DEFAULT_USER_ID,
      isLoggedIn: false,
      switchUser: (userId) => set({ currentUserId: userId }),
      login: (userId) => set({ currentUserId: userId, isLoggedIn: true }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: 'auth-store',
      storage: mmkvStorage,
    }
  )
);

// --- Selector hooks ---

export function useCurrentUser(): User {
  const userId = useAuthStore((s) => s.currentUserId);
  return MOCK_USERS_MAP[userId]!;
}

