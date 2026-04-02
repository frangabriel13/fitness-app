import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Program } from '@/types';
import { MOCK_PROGRAMS_MAP } from '@/data/mock-program';
import { mmkvStorage } from './storage';
import { useCurrentUser } from './auth-store';

interface ProgramState {
  programs: Record<string, Program>;
  setPrograms: (programs: Record<string, Program>) => void;
  setProgram: (program: Program) => void;
  clearAll: () => void;
}

export const useProgramStore = create<ProgramState>()(
  persist(
    (set) => ({
      programs: MOCK_PROGRAMS_MAP,

      setPrograms: (programs) => set({ programs }),

      setProgram: (program) =>
        set((state) => ({
          programs: { ...state.programs, [program.id]: program },
        })),

      clearAll: () => set({ programs: {} }),
    }),
    {
      name: 'program-store',
      storage: mmkvStorage,
    }
  )
);

// --- Selector hooks ---

/** Programa activo del usuario actual (solo para clientes) */
export function useActiveProgram(): Program | null {
  const user = useCurrentUser();
  const programs = useProgramStore((s) => s.programs);
  if (user.role === 'client' && user.activeProgramId) {
    return programs[user.activeProgramId] ?? null;
  }
  return null;
}

/** Templates del trainer actual */
export function useTrainerTemplates(): Program[] {
  const user = useCurrentUser();
  const programs = useProgramStore((s) => s.programs);
  if (user.role !== 'trainer') return [];
  return Object.values(programs).filter(
    (p) => p.trainerId === user.id && p.type === 'template'
  );
}

/** Programas asignados por el trainer actual */
export function useTrainerAssignedPrograms(): Program[] {
  const user = useCurrentUser();
  const programs = useProgramStore((s) => s.programs);
  if (user.role !== 'trainer') return [];
  return Object.values(programs).filter(
    (p) => p.trainerId === user.id && p.type === 'assigned'
  );
}
