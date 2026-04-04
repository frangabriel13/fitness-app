import { ThemedText } from '@/components/themed-text';
import { DayCard } from '@/components/rutina/day-card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TrainingDay, WorkoutLog } from '@/types';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

type Props = {
  days: TrainingDay[];
  selectedWeek: number;
  workoutLogs: Record<string, WorkoutLog>;
};

export function DaysList({ days, selectedWeek, workoutLogs }: Props) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLabel}>
          <ThemedText style={styles.sectionLabel} themeColor="textSecondary">
            SEMANA
          </ThemedText>
          <ThemedText style={[styles.weekNumber, { color: theme.accent }]}>
            {selectedWeek}
          </ThemedText>
        </View>
        <View style={[styles.countBadge, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText style={[styles.countText, { color: theme.textSecondary }]}>
            {days.length} días
          </ThemedText>
        </View>
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
              onPress={() => router.push(`/workout/${day.id}?week=${selectedWeek}`)}
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
  headerLabel: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.one,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  weekNumber: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
  },
  countBadge: {
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  list: {
    gap: Spacing.two,
  },
});
