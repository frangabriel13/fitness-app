import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ClientProfile, TrainerProfile, User } from '@/types';
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

export function useIsTrainer(): boolean {
  return useCurrentUser().role === 'trainer';
}

export function useIsClient(): boolean {
  return useCurrentUser().role === 'client';
}

/** Narrowed trainer profile (solo usar cuando se sabe que el usuario es trainer) */
export function useTrainerProfile(): TrainerProfile {
  const user = useCurrentUser();
  if (user.role !== 'trainer') {
    throw new Error('useTrainerProfile llamado con un usuario que no es trainer');
  }
  return user;
}

/** Narrowed client profile (solo usar cuando se sabe que el usuario es cliente) */
export function useClientProfile(): ClientProfile {
  const user = useCurrentUser();
  if (user.role !== 'client') {
    throw new Error('useClientProfile llamado con un usuario que no es cliente');
  }
  return user;
}
