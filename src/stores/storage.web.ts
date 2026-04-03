import { createJSONStorage } from 'zustand/middleware';

export const mmkvStorage = createJSONStorage(() => localStorage);
