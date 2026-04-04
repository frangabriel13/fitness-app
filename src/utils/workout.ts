import type { Program, SetLog, TrainingDay, WorkoutLog } from '@/types';

export type WeekStatus = 'completed' | 'active' | 'upcoming';

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
 * Determina el estado de progreso de una semana basado en sus logs.
 */
export function getWeekStatus(
  week: number,
  days: TrainingDay[],
  logs: Record<string, WorkoutLog>
): WeekStatus {
  const statuses = days.map((d) => logs[`${d.id}_w${week}`]?.status ?? 'not_started');
  if (statuses.every((s) => s === 'completed')) return 'completed';
  if (statuses.some((s) => s !== 'not_started')) return 'active';
  return 'upcoming';
}

/**
 * Retorna la primera semana no completada, o la última si todas están completas.
 */
export function getCurrentWeek(
  totalWeeks: number,
  days: TrainingDay[],
  logs: Record<string, WorkoutLog>
): number {
  for (let w = 1; w <= totalWeeks; w++) {
    const allDone = days.every((d) => logs[`${d.id}_w${w}`]?.status === 'completed');
    if (!allDone) return w;
  }
  return totalWeeks;
}
