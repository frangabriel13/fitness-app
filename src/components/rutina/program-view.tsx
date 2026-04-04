import { ProgramHeader } from '@/components/rutina/program-header';
import { WeekSelector } from '@/components/rutina/week-selector';
import { DaysList } from '@/components/rutina/days-list';
import { Spacing } from '@/constants/theme';
import { useInitializeWorkoutLogs } from '@/hooks/use-initialize-workout-logs';
import { useWorkoutStore } from '@/stores/workout-store';
import { getWeekStatus, getCurrentWeek } from '@/utils/workout';
import type { Program } from '@/types';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export function ProgramView({ program }: { program: Program }) {
  useInitializeWorkoutLogs(program);

  const workoutLogs = useWorkoutStore((s) => s.workoutLogs);
  const { totalWeeks, microcycle } = program;
  const days = microcycle.trainingDays;

  const currentWeek = getCurrentWeek(totalWeeks, days, workoutLogs);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const weekStatusMap = Object.fromEntries(
    weeks.map((w) => [w, getWeekStatus(w, days, workoutLogs)])
  );
  const completedWeeks = weeks.filter((w) => weekStatusMap[w] === 'completed').length;

  return (
    <View style={styles.container}>
      <ProgramHeader program={program} completedWeeks={completedWeeks} />

      <WeekSelector
        weeks={weeks}
        weekStatusMap={weekStatusMap}
        currentWeek={currentWeek}
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
      />

      <DaysList
        days={days}
        selectedWeek={selectedWeek}
        workoutLogs={workoutLogs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
});
