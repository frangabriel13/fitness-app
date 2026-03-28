import type { ActiveSession, Program, SetLog, TrainingDay, WorkoutLog } from '@/types';

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
