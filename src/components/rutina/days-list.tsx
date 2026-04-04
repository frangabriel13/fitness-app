import { ThemedText } from '@/components/themed-text';
import { DayCard } from '@/components/rutina/day-card';
import { interFont, Spacing } from '@/constants/theme';
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
      {/* Section header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={styles.sectionLabel} themeColor="textSecondary">
            SEMANA
          </ThemedText>
          <ThemedText style={[styles.weekNumber, { color: theme.accent }]}>
            {String(selectedWeek).padStart(2, '0')}
          </ThemedText>
        </View>

        <ThemedText style={[styles.dayCount, { color: theme.textSecondary }]}>
          {days.length} {days.length === 1 ? 'DÍA' : 'DÍAS'}
        </ThemedText>
      </View>

      {/* Thin separator */}
      <View style={[styles.separator, { backgroundColor: theme.backgroundSelected }]} />

      {/* Day cards */}
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
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  sectionLabel: {
    fontFamily: interFont('700'),
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  weekNumber: {
    fontFamily: interFont('900'),
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: -1,
  },
  dayCount: {
    fontFamily: interFont('700'),
    fontSize: 10,
    letterSpacing: 2,
  },
  separator: {
    height: 1,
    opacity: 0.4,
  },
  list: {
    gap: 12,
  },
});
