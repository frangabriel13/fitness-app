import type { SetLog, WorkoutLog } from '@/types';

// Tuple compacto: [weight (kg | null), reps, rir]
type S = [number | null, number, number];

function makeSets(exerciseId: string, week: number, data: S[]): SetLog[] {
  return data.map(([weight, reps, rir], i) => ({
    id: `sl_${exerciseId}_w${week}_s${i + 1}`,
    exerciseId,
    setNumber: i + 1,
    weight,
    reps,
    rir,
  }));
}

function makeNullSets(exerciseId: string, week: number, count: number): SetLog[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `sl_${exerciseId}_w${week}_s${i + 1}`,
    exerciseId,
    setNumber: i + 1,
    weight: null,
    reps: null,
    rir: null,
  }));
}

function makeLog(
  trainingDayId: string,
  week: number,
  programId: string,
  status: WorkoutLog['status'],
  startedAt: string,
  completedAt: string | null,
  setLogs: SetLog[]
): [string, WorkoutLog] {
  return [
    `${trainingDayId}_w${week}`,
    {
      id: `wl_${trainingDayId}_w${week}`,
      programId,
      trainingDayId,
      weekNumber: week,
      startedAt,
      completedAt,
      status,
      setLogs,
    },
  ];
}

// ─── Ana García · prog_001 · Hipertrofia 4D ───────────────────────────────────
// Días: day_001 Pecho/Tríceps · day_002 Espalda/Bíceps
//       day_003 Piernas (Cuáds) · day_004 Hombros/Isquios

// ── Semana 1 ──────────────────────────────────────────────────────────────────

const day001_w1 = makeLog('day_001', 1, 'prog_001', 'completed', '2024-06-10T09:00:00Z', '2024-06-10T10:25:00Z', [
  ...makeSets('ex_001', 1, [[32.5,9,2],[32.5,9,2],[30,8,1],[30,8,1]]),       // Press banca barra
  ...makeSets('ex_002', 1, [[12,11,2],[12,11,2],[10,10,2]]),                  // Press inclinado mancuernas
  ...makeSets('ex_003', 1, [[10,13,1],[10,13,1],[9,12,1]]),                   // Aperturas polea
  ...makeSets('ex_004', 1, [[null,10,2],[null,10,2],[null,9,2]]),             // Fondos paralelas (bodyweight)
  ...makeSets('ex_005', 1, [[17.5,13,1],[17.5,13,1],[15,12,1]]),             // Extensión tríceps polea
]);

const day002_w1 = makeLog('day_002', 1, 'prog_001', 'completed', '2024-06-12T09:00:00Z', '2024-06-12T10:40:00Z', [
  ...makeSets('ex_006', 1, [[null,8,2],[null,7,2],[null,7,2],[null,6,1]]),   // Dominadas (bodyweight)
  ...makeSets('ex_007', 1, [[27.5,9,2],[27.5,9,2],[25,8,2],[25,8,1]]),      // Remo con barra
  ...makeSets('ex_008', 1, [[35,11,2],[35,11,2],[32.5,10,2]]),               // Remo polea baja
  ...makeSets('ex_009', 1, [[20,10,2],[20,10,2],[17.5,9,2]]),                // Curl con barra
  ...makeSets('ex_010', 1, [[9,11,1],[9,11,1],[8,10,1]]),                    // Curl inclinado mancuernas
]);

const day003_w1 = makeLog('day_003', 1, 'prog_001', 'completed', '2024-06-14T09:00:00Z', '2024-06-14T10:10:00Z', [
  ...makeSets('ex_011', 1, [[45,7,2],[45,7,2],[42.5,6,2],[42.5,6,1]]),      // Sentadilla barra
  ...makeSets('ex_012', 1, [[70,11,2],[70,11,2],[65,10,2]]),                 // Prensa de piernas
  ...makeSets('ex_013', 1, [[30,13,1],[30,13,1],[27.5,12,1]]),               // Extensión cuádriceps
  ...makeSets('ex_014', 1, [[40,13,1],[40,13,1],[40,12,1],[37.5,12,1]]),    // Elevación talones
]);

const day004_w1 = makeLog('day_004', 1, 'prog_001', 'completed', '2024-06-16T09:00:00Z', '2024-06-16T10:30:00Z', [
  ...makeSets('ex_015', 1, [[25,9,2],[25,9,2],[22.5,8,2],[22.5,8,1]]),      // Press militar barra
  ...makeSets('ex_016', 1, [[6,14,1],[6,13,1],[5,13,1],[5,12,1]]),          // Elevaciones laterales
  ...makeSets('ex_017', 1, [[8,13,1],[8,13,1],[7.5,12,1]]),                 // Pájaros en polea
  ...makeSets('ex_018', 1, [[37.5,9,2],[37.5,9,2],[35,8,2],[35,8,1]]),     // Peso muerto rumano
  ...makeSets('ex_019', 1, [[25,11,1],[25,11,1],[22.5,10,1]]),              // Curl femoral acostado
]);

// ── Semana 2 ──────────────────────────────────────────────────────────────────

const day001_w2 = makeLog('day_001', 2, 'prog_001', 'completed', '2024-06-17T09:00:00Z', '2024-06-17T10:30:00Z', [
  ...makeSets('ex_001', 2, [[35,9,2],[35,8,2],[32.5,8,1],[32.5,7,1]]),      // +2.5 kg
  ...makeSets('ex_002', 2, [[14,11,2],[12,10,2],[12,10,2]]),                 // +2 kg
  ...makeSets('ex_003', 2, [[10,14,1],[10,13,1],[9,13,1]]),
  ...makeSets('ex_004', 2, [[null,11,2],[null,10,2],[null,9,2]]),
  ...makeSets('ex_005', 2, [[20,13,1],[17.5,13,1],[17.5,12,1]]),
]);

const day002_w2 = makeLog('day_002', 2, 'prog_001', 'completed', '2024-06-19T09:00:00Z', '2024-06-19T10:45:00Z', [
  ...makeSets('ex_006', 2, [[null,9,2],[null,8,2],[null,7,2],[null,7,1]]),
  ...makeSets('ex_007', 2, [[30,9,2],[30,8,2],[27.5,8,2],[27.5,8,1]]),      // +2.5 kg
  ...makeSets('ex_008', 2, [[37.5,11,2],[35,11,2],[35,10,2]]),               // +2.5 kg
  ...makeSets('ex_009', 2, [[22.5,10,2],[20,10,2],[20,9,2]]),                // +2.5 kg
  ...makeSets('ex_010', 2, [[10,11,1],[9,11,1],[9,10,1]]),
]);

const day003_w2 = makeLog('day_003', 2, 'prog_001', 'completed', '2024-06-21T09:00:00Z', '2024-06-21T10:15:00Z', [
  ...makeSets('ex_011', 2, [[47.5,7,2],[47.5,6,2],[45,6,2],[45,6,1]]),      // +2.5 kg
  ...makeSets('ex_012', 2, [[75,11,2],[70,11,2],[70,10,2]]),                 // +5 kg
  ...makeSets('ex_013', 2, [[32.5,13,1],[30,13,1],[30,12,1]]),
  ...makeSets('ex_014', 2, [[42.5,13,1],[40,13,1],[40,13,1],[40,12,1]]),
]);

const day004_w2 = makeLog('day_004', 2, 'prog_001', 'completed', '2024-06-23T09:00:00Z', '2024-06-23T10:35:00Z', [
  ...makeSets('ex_015', 2, [[27.5,9,2],[25,9,2],[25,8,2],[22.5,8,1]]),      // +2.5 kg
  ...makeSets('ex_016', 2, [[7,13,1],[6,13,1],[6,13,1],[5,12,1]]),
  ...makeSets('ex_017', 2, [[9,13,1],[8,13,1],[8,12,1]]),
  ...makeSets('ex_018', 2, [[40,9,2],[40,8,2],[37.5,8,2],[37.5,8,1]]),      // +2.5 kg
  ...makeSets('ex_019', 2, [[27.5,11,1],[25,11,1],[25,10,1]]),
]);

// ── Semana 3 ──────────────────────────────────────────────────────────────────

const day001_w3 = makeLog('day_001', 3, 'prog_001', 'completed', '2024-06-24T09:00:00Z', '2024-06-24T10:30:00Z', [
  ...makeSets('ex_001', 3, [[35,10,2],[35,9,2],[32.5,8,1],[32.5,8,1]]),
  ...makeSets('ex_002', 3, [[14,11,2],[14,10,2],[12,10,1]]),
  ...makeSets('ex_003', 3, [[11,13,1],[10,13,1],[10,12,1]]),
  ...makeSets('ex_004', 3, [[null,11,2],[null,11,2],[null,10,2]]),
  ...makeSets('ex_005', 3, [[20,14,1],[20,13,1],[17.5,12,1]]),
]);

// Día 2 semana 3: en progreso
// ex_006 (4 sets) ✓ ex_007 (4 sets) ✓ ex_008 (3 sets) ✓
// ex_009: 2 de 3 series hechas · ex_010: sin empezar
const day002_w3 = makeLog('day_002', 3, 'prog_001', 'in_progress', '2024-06-26T09:00:00Z', null, [
  ...makeSets('ex_006', 3, [[null,9,2],[null,8,2],[null,8,2],[null,7,1]]),
  ...makeSets('ex_007', 3, [[30,10,2],[30,9,2],[27.5,8,2],[27.5,8,1]]),
  ...makeSets('ex_008', 3, [[37.5,11,2],[37.5,11,2],[35,10,2]]),
  ...makeSets('ex_009', 3, [[22.5,10,2],[22.5,9,2]]),                         // 2 series hechas
  ...makeNullSets('ex_009', 3, 1),                                             // serie 3: en progreso
  ...makeNullSets('ex_010', 3, 3),                                             // aún no empezado
]);

// ─── Exportaciones ────────────────────────────────────────────────────────────

export const MOCK_WORKOUT_LOGS_ANA: Record<string, WorkoutLog> = Object.fromEntries([
  day001_w1, day002_w1, day003_w1, day004_w1,
  day001_w2, day002_w2, day003_w2, day004_w2,
  day001_w3, day002_w3,
]);

/** Mapa de logs mock por userId — usado por el role switcher para re-sembrar al cambiar de usuario */
export const MOCK_WORKOUT_LOGS_BY_USER: Record<string, Record<string, WorkoutLog>> = {
  user_client_002: MOCK_WORKOUT_LOGS_ANA,
};
