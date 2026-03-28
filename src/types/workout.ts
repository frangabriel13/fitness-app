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
