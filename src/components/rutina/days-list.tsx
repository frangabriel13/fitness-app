import { ThemedText } from '@/components/themed-text';
import { DayCard } from '@/components/rutina/day-card';
import { Spacing } from '@/constants/theme';
import type { TrainingDay } from '@/types';
import type { WorkoutLog } from '@/types';
import { StyleSheet, View } from 'react-native';

type Props = {
  days: TrainingDay[];
  selectedWeek: number;
  workoutLogs: Record<string, WorkoutLog>;
};

export function DaysList({ days, selectedWeek, workoutLogs }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          DÍAS — SEMANA {selectedWeek}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {days.length} días
        </ThemedText>
      </View>
      <View style={styles.list}>
        {days.map((day) => {
          const logKey = `${day.id}_w${selectedWeek}`;
          const status = workoutLogs[logKey]?.status ?? 'not_started';
          const totalSets = day.exercises.reduce((acc, ex) => acc + ex.sets, 0);
          return (
            <DayCard
              key={day.id}
              name={day.name}
              dayNumber={day.dayNumber}
              exerciseCount={day.exercises.length}
              totalSets={totalSets}
              status={status}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.one,
  },
  list: {
    gap: Spacing.two,
  },
});
