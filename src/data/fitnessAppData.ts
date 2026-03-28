// ============================================================
// TYPES — Estructura de datos para la app fitness
// ============================================================

// --- Plantilla (lo que diseña el trainer) ---

export interface Program {
  id: string;
  name: string;
  totalWeeks: number;       // Duración del macrociclo
  clientId: string;
  trainerId: string;
  microcycle: Microcycle;
}

export interface Microcycle {
  id: string;
  daysPerWeek: number;
  trainingDays: TrainingDay[];
}

export interface TrainingDay {
  id: string;
  dayNumber: number;         // 1, 2, 3... dentro de la semana
  name: string;              // Ej: "Pecho y Tríceps"
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  order: number;
  agonistMuscle: string;     // Músculo agonista
  exerciseName: string;
  sets: number;              // Cantidad de series
  repRange: string;          // Ej: "8-12"
  targetRir: number;         // RIR objetivo
  restSeconds: number;       // Descanso entre series en segundos
}

// --- Registro (lo que completa el cliente) ---

export type WorkoutStatus = 'not_started' | 'in_progress' | 'completed';

export interface WorkoutLog {
  id: string;
  programId: string;
  trainingDayId: string;
  weekNumber: number;
  startedAt: string | null;
  completedAt: string | null;
  status: WorkoutStatus;
  setLogs: SetLog[];
}

export interface SetLog {
  id: string;
  exerciseId: string;
  setNumber: number;          // 1, 2, 3...
  weight: number | null;      // Kg usados
  reps: number | null;        // Repeticiones reales
  rir: number | null;         // RIR percibido
}

// --- Estado de la sesión activa ---

export interface ActiveSession {
  workoutLogId: string;
  currentExerciseIndex: number;
  currentSetIndex: number;
  phase: 'exercising' | 'resting' | 'completed';
  restTimeRemaining: number;   // Segundos restantes del timer
}

// ============================================================
// MOCK DATA — Datos hardcodeados para desarrollo
// ============================================================

export const MOCK_PROGRAM: Program = {
  id: 'prog_001',
  name: 'Hipertrofia - Fase 1',
  totalWeeks: 8,
  clientId: 'client_001',
  trainerId: 'trainer_001',
  microcycle: {
    id: 'micro_001',
    daysPerWeek: 4,
    trainingDays: [
      {
        id: 'day_001',
        dayNumber: 1,
        name: 'Pecho y Tríceps',
        exercises: [
          {
            id: 'ex_001',
            order: 1,
            agonistMuscle: 'Pectoral mayor',
            exerciseName: 'Press banca con barra',
            sets: 4,
            repRange: '8-10',
            targetRir: 2,
            restSeconds: 120,
          },
          {
            id: 'ex_002',
            order: 2,
            agonistMuscle: 'Pectoral mayor (porción clavicular)',
            exerciseName: 'Press inclinado con mancuernas',
            sets: 3,
            repRange: '10-12',
            targetRir: 2,
            restSeconds: 90,
          },
          {
            id: 'ex_003',
            order: 3,
            agonistMuscle: 'Pectoral mayor',
            exerciseName: 'Aperturas en polea',
            sets: 3,
            repRange: '12-15',
            targetRir: 1,
            restSeconds: 60,
          },
          {
            id: 'ex_004',
            order: 4,
            agonistMuscle: 'Tríceps braquial',
            exerciseName: 'Fondos en paralelas',
            sets: 3,
            repRange: '8-12',
            targetRir: 2,
            restSeconds: 90,
          },
          {
            id: 'ex_005',
            order: 5,
            agonistMuscle: 'Tríceps braquial (cabeza larga)',
            exerciseName: 'Extensión de tríceps en polea con cuerda',
            sets: 3,
            repRange: '12-15',
            targetRir: 1,
            restSeconds: 60,
          },
        ],
      },
      {
        id: 'day_002',
        dayNumber: 2,
        name: 'Espalda y Bíceps',
        exercises: [
          {
            id: 'ex_006',
            order: 1,
            agonistMuscle: 'Dorsal ancho',
            exerciseName: 'Dominadas',
            sets: 4,
            repRange: '6-10',
            targetRir: 2,
            restSeconds: 120,
          },
          {
            id: 'ex_007',
            order: 2,
            agonistMuscle: 'Dorsal ancho',
            exerciseName: 'Remo con barra',
            sets: 4,
            repRange: '8-10',
            targetRir: 2,
            restSeconds: 90,
          },
          {
            id: 'ex_008',
            order: 3,
            agonistMuscle: 'Trapecio medio / Romboides',
            exerciseName: 'Remo en polea baja (agarre neutro)',
            sets: 3,
            repRange: '10-12',
            targetRir: 2,
            restSeconds: 90,
          },
          {
            id: 'ex_009',
            order: 4,
            agonistMuscle: 'Bíceps braquial',
            exerciseName: 'Curl con barra',
            sets: 3,
            repRange: '8-12',
            targetRir: 2,
            restSeconds: 60,
          },
          {
            id: 'ex_010',
            order: 5,
            agonistMuscle: 'Bíceps braquial (cabeza larga)',
            exerciseName: 'Curl inclinado con mancuernas',
            sets: 3,
            repRange: '10-12',
            targetRir: 1,
            restSeconds: 60,
          },
        ],
      },
      {
        id: 'day_003',
        dayNumber: 3,
        name: 'Piernas (Cuádriceps)',
        exercises: [
          {
            id: 'ex_011',
            order: 1,
            agonistMuscle: 'Cuádriceps',
            exerciseName: 'Sentadilla con barra',
            sets: 4,
            repRange: '6-8',
            targetRir: 2,
            restSeconds: 180,
          },
          {
            id: 'ex_012',
            order: 2,
            agonistMuscle: 'Cuádriceps',
            exerciseName: 'Prensa de piernas',
            sets: 3,
            repRange: '10-12',
            targetRir: 2,
            restSeconds: 120,
          },
          {
            id: 'ex_013',
            order: 3,
            agonistMuscle: 'Cuádriceps (recto femoral)',
            exerciseName: 'Extensión de cuádriceps',
            sets: 3,
            repRange: '12-15',
            targetRir: 1,
            restSeconds: 60,
          },
          {
            id: 'ex_014',
            order: 4,
            agonistMuscle: 'Gastrocnemio / Sóleo',
            exerciseName: 'Elevación de talones de pie',
            sets: 4,
            repRange: '12-15',
            targetRir: 1,
            restSeconds: 60,
          },
        ],
      },
      {
        id: 'day_004',
        dayNumber: 4,
        name: 'Hombros y Piernas (Isquios)',
        exercises: [
          {
            id: 'ex_015',
            order: 1,
            agonistMuscle: 'Deltoides anterior',
            exerciseName: 'Press militar con barra',
            sets: 4,
            repRange: '8-10',
            targetRir: 2,
            restSeconds: 120,
          },
          {
            id: 'ex_016',
            order: 2,
            agonistMuscle: 'Deltoides lateral',
            exerciseName: 'Elevaciones laterales',
            sets: 4,
            repRange: '12-15',
            targetRir: 1,
            restSeconds: 60,
          },
          {
            id: 'ex_017',
            order: 3,
            agonistMuscle: 'Deltoides posterior',
            exerciseName: 'Pájaros en polea',
            sets: 3,
            repRange: '12-15',
            targetRir: 1,
            restSeconds: 60,
          },
          {
            id: 'ex_018',
            order: 4,
            agonistMuscle: 'Isquiotibiales',
            exerciseName: 'Peso muerto rumano',
            sets: 4,
            repRange: '8-10',
            targetRir: 2,
            restSeconds: 120,
          },
          {
            id: 'ex_019',
            order: 5,
            agonistMuscle: 'Isquiotibiales',
            exerciseName: 'Curl femoral acostado',
            sets: 3,
            repRange: '10-12',
            targetRir: 1,
            restSeconds: 60,
          },
        ],
      },
    ],
  },
};

// ============================================================
// HELPERS — Funciones para generar y manejar WorkoutLogs
// ============================================================

/**
 * Genera un WorkoutLog vacío para un día y semana específicos.
 * Crea SetLogs vacíos para cada serie de cada ejercicio.
 */
export function createEmptyWorkoutLog(
  program: Program,
  trainingDay: TrainingDay,
  weekNumber: number
): WorkoutLog {
  const setLogs: SetLog[] = [];

  trainingDay.exercises.forEach((exercise) => {
    for (let s = 1; s <= exercise.sets; s++) {
      setLogs.push({
        id: `sl_${exercise.id}_w${weekNumber}_s${s}`,
        exerciseId: exercise.id,
        setNumber: s,
        weight: null,
        reps: null,
        rir: null,
      });
    }
  });

  return {
    id: `wl_${trainingDay.id}_w${weekNumber}`,
    programId: program.id,
    trainingDayId: trainingDay.id,
    weekNumber,
    startedAt: null,
    completedAt: null,
    status: 'not_started',
    setLogs,
  };
}

/**
 * Genera todos los WorkoutLogs vacíos para un programa completo.
 * Retorna un mapa: { "day_001_w1": WorkoutLog, "day_001_w2": WorkoutLog, ... }
 */
export function generateAllWorkoutLogs(
  program: Program
): Record<string, WorkoutLog> {
  const logs: Record<string, WorkoutLog> = {};

  for (let week = 1; week <= program.totalWeeks; week++) {
    program.microcycle.trainingDays.forEach((day) => {
      const key = `${day.id}_w${week}`;
      logs[key] = createEmptyWorkoutLog(program, day, week);
    });
  }

  return logs;
}

/**
 * Crea el estado inicial de una sesión activa.
 */
export function createActiveSession(workoutLogId: string): ActiveSession {
  return {
    workoutLogId,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    phase: 'exercising',
    restTimeRemaining: 0,
  };
}

// ============================================================
// Ejemplo de uso rápido:
//
// const logs = generateAllWorkoutLogs(MOCK_PROGRAM);
// const todayLog = logs['day_001_w1'];  // Día 1, Semana 1
// todayLog.status = 'in_progress';
// todayLog.startedAt = new Date().toISOString();
//
// // El cliente completa la serie 1 del press banca:
// todayLog.setLogs[0].weight = 80;
// todayLog.setLogs[0].reps = 10;
// todayLog.setLogs[0].rir = 2;
//
// // Arranca el timer de descanso (120 seg para press banca)
// // Al terminar el timer -> pasa a la serie 2 (setLogs[1])
// // Cuando termina todas las series -> pasa al ejercicio 2
// ============================================================