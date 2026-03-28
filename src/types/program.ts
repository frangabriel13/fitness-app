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
