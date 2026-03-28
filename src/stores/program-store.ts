import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Program } from '@/types';
import { mmkvStorage } from './storage';

interface ProgramState {
  currentProgram: Program | null;
  setCurrentProgram: (program: Program) => void;
  clearCurrentProgram: () => void;
}

export const useProgramStore = create<ProgramState>()(
  persist(
    (set) => ({
      currentProgram: null,
      setCurrentProgram: (program) => set({ currentProgram: program }),
      clearCurrentProgram: () => set({ currentProgram: null }),
    }),
    {
      name: 'program-store',
      storage: mmkvStorage,
    }
  )
);
