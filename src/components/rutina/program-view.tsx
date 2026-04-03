import { ThemedText } from '@/components/themed-text';
import { DayCard } from '@/components/rutina/day-card';
import { WeekChip, CHIP_WIDTH, CHIP_GAP } from '@/components/rutina/week-chip';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWorkoutStore } from '@/stores/workout-store';
import { generateAllWorkoutLogs, getWeekStatus, getCurrentWeek } from '@/utils/workout';
import type { Program } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export function ProgramView({ program }: { program: Program }) {
  const theme = useTheme();
  const weekScrollRef = useRef<ScrollView>(null);

  const workoutLogs = useWorkoutStore((s) => s.workoutLogs);
  const setWorkoutLogs = useWorkoutStore((s) => s.setWorkoutLogs);

  useEffect(() => {
    if (Object.keys(workoutLogs).length === 0) {
      setWorkoutLogs(generateAllWorkoutLogs(program));
    }
  }, [program, setWorkoutLogs]);

  const { totalWeeks, name, microcycle } = program;
  const days = microcycle.trainingDays;

  const currentWeek = getCurrentWeek(totalWeeks, days, workoutLogs);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const weekStatusMap = Object.fromEntries(
    weeks.map((w) => [w, getWeekStatus(w, days, workoutLogs)])
  );
  const completedCount = weeks.filter((w) => weekStatusMap[w] === 'completed').length;
  const progressRatio = completedCount / totalWeeks;

  useEffect(() => {
    const x = Math.max(0, (currentWeek - 2) * (CHIP_WIDTH + CHIP_GAP));
    weekScrollRef.current?.scrollTo({ x, animated: false });
  }, [currentWeek]);

  return (
    <>
      {/* Header info */}
      <ThemedText type="small" themeColor="textSecondary">
        {name} · {totalWeeks} semanas
      </ThemedText>

      {/* Week selector */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            SEMANAS
          </ThemedText>
          <View style={styles.progressLabel}>
            <View style={[styles.progressDot, { backgroundColor: theme.accent }]} />
            <ThemedText type="small" themeColor="textSecondary">
              {completedCount} de {totalWeeks} completadas
            </ThemedText>
          </View>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.accent, width: `${progressRatio * 100}%` },
            ]}
          />
        </View>

        <ScrollView
          ref={weekScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekStrip}>
          {weeks.map((week) => (
            <WeekChip
              key={week}
              week={week}
              weekStatus={weekStatusMap[week]}
              isSelected={week === selectedWeek}
              isCurrent={week === currentWeek}
              onPress={() => setSelectedWeek(week)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Days for selected week */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            DÍAS — SEMANA {selectedWeek}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {days.length} días
          </ThemedText>
        </View>
        <View style={styles.daysList}>
          {days.map((day) => {
            const logKey = `${day.id}_w${selectedWeek}`;
            const status = workoutLogs[logKey]?.status ?? 'not_started';
            return <DayCard key={day.id} day={day} status={status} />;
          })}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.one,
  },
  progressLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: Spacing.one,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  weekStrip: {
    flexDirection: 'row',
    gap: CHIP_GAP,
    paddingHorizontal: Spacing.one,
  },
  daysList: {
    gap: Spacing.two,
  },
});
