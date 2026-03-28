import { createMMKV } from 'react-native-mmkv';
import { createJSONStorage } from 'zustand/middleware';

const mmkv = createMMKV();

/**
 * Adaptador de MMKV para el middleware `persist` de Zustand.
 * MMKV es ~30x más rápido que AsyncStorage y opera de forma síncrona.
 *
 * Uso en stores:
 *   storage: mmkvStorage
 */
export const mmkvStorage = createJSONStorage(() => ({
  setItem: (name: string, value: string) => mmkv.set(name, value),
  getItem: (name: string) => mmkv.getString(name) ?? null,
  removeItem: (name: string) => mmkv.remove(name),
}));
