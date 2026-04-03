import { useWorkoutStore } from '@/stores/workout-store';
import { generateAllWorkoutLogs } from '@/utils/workout';
import type { Program } from '@/types';
import { useEffect } from 'react';

export function useInitializeWorkoutLogs(program: Program) {
  const workoutLogs = useWorkoutStore((s) => s.workoutLogs);
  const setWorkoutLogs = useWorkoutStore((s) => s.setWorkoutLogs);

  useEffect(() => {
    if (Object.keys(workoutLogs).length === 0) {
      setWorkoutLogs(generateAllWorkoutLogs(program));
    }
  }, [program, setWorkoutLogs, workoutLogs]);
}
