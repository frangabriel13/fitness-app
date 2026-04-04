import { DaysList } from '@/components/rutina/days-list';
import { WeekSelector } from '@/components/rutina/week-selector';
import { ThemedText } from '@/components/themed-text';
import { useInitializeWorkoutLogs } from '@/hooks/use-initialize-workout-logs';
import { useWorkoutStore } from '@/stores/workout-store';
import type { Program } from '@/types';
import { getCurrentWeek, getWeekStatus } from '@/utils/workout';
import { useState } from 'react';
import { View } from 'react-native';

export function ProgramView({ program }: { program: Program }) {
  useInitializeWorkoutLogs(program);

  const workoutLogs = useWorkoutStore((s) => s.workoutLogs);
  const { totalWeeks, name, microcycle } = program;
  const days = microcycle.trainingDays;

  const currentWeek = getCurrentWeek(totalWeeks, days, workoutLogs);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const weekStatusMap = Object.fromEntries(
    weeks.map((w) => [w, getWeekStatus(w, days, workoutLogs)])
  );
  const completedCount = weeks.filter((w) => weekStatusMap[w] === 'completed').length;

  return (
    <View style={{ gap: 12 }}>
      <ThemedText type="small" themeColor="textSecondary">
        {name} · {totalWeeks} semanas
      </ThemedText>

      <WeekSelector
        weeks={weeks}
        weekStatusMap={weekStatusMap}
        currentWeek={currentWeek}
        selectedWeek={selectedWeek}
        totalWeeks={totalWeeks}
        completedCount={completedCount}
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
