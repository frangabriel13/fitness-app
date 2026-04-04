import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ActiveSession, WorkoutLog } from '@/types';
import { MOCK_WORKOUT_LOGS_ANA } from '@/data/mock-workout-logs';
import { mmkvStorage } from './storage';

interface WorkoutState {
  // Mapa de todos los WorkoutLogs del programa actual: { "day_001_w1": WorkoutLog }
  workoutLogs: Record<string, WorkoutLog>;
  // Sesión activa en curso, null si no hay entrenamiento activo
  activeSession: ActiveSession | null;

  setWorkoutLogs: (logs: Record<string, WorkoutLog>) => void;
  updateWorkoutLog: (key: string, log: WorkoutLog) => void;
  setActiveSession: (session: ActiveSession | null) => void;
  clearAll: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      workoutLogs: MOCK_WORKOUT_LOGS_ANA,
      activeSession: null,

      setWorkoutLogs: (logs) => set({ workoutLogs: logs }),

      updateWorkoutLog: (key, log) =>
        set((state) => ({
          workoutLogs: { ...state.workoutLogs, [key]: log },
        })),

      setActiveSession: (session) => set({ activeSession: session }),

      clearAll: () => set({ workoutLogs: {}, activeSession: null }),
    }),
    {
      name: 'workout-store',
      storage: mmkvStorage,
    }
  )
);
