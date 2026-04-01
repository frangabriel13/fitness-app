import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DayCard } from '@/components/rutina/day-card';
import { WeekChip, CHIP_WIDTH, CHIP_GAP } from '@/components/rutina/week-chip';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { MOCK_PROGRAM } from '@/data/mock-program';
import { useTheme } from '@/hooks/use-theme';
import { useProgramStore } from '@/stores/program-store';
import { useWorkoutStore } from '@/stores/workout-store';
import { generateAllWorkoutLogs, getWeekStatus, getCurrentWeek } from '@/utils/workout';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RutinaScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const weekScrollRef = useRef<ScrollView>(null);

  const program = useProgramStore((s) => s.currentProgram) ?? MOCK_PROGRAM;
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
  const weekStatusMap = Object.fromEntries(weeks.map((w) => [w, getWeekStatus(w, days, workoutLogs)]));
  const completedCount = weeks.filter((w) => weekStatusMap[w] === 'completed').length;
  const progressRatio = completedCount / totalWeeks;

  // Auto-scroll to current week
  useEffect(() => {
    const x = Math.max(0, (currentWeek - 2) * (CHIP_WIDTH + CHIP_GAP));
    weekScrollRef.current?.scrollTo({ x, animated: false });
  }, [currentWeek]);

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + Spacing.two, paddingBottom: BottomTabInset + Spacing.four },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <ThemedText type="title" style={styles.titleText}>MI </ThemedText>
            <ThemedText type="title" style={[styles.titleText, { color: theme.accent }]}>RUTINA</ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {name} · {totalWeeks} semanas
          </ThemedText>
        </View>

        {/* Week selector */}
        <View style={styles.section}>
          {/* Section header */}
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" themeColor="textSecondary">SEMANAS</ThemedText>
            <View style={styles.progressLabel}>
              <View style={[styles.progressDot, { backgroundColor: theme.accent }]} />
              <ThemedText type="small" themeColor="textSecondary">
                {completedCount} de {totalWeeks} completadas
              </ThemedText>
            </View>
          </View>

          {/* Progress bar */}
          <View style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.accent, width: `${progressRatio * 100}%` },
              ]}
            />
          </View>

          {/* Week chips */}
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

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.three,
  },
  header: {
    gap: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titleText: {
    fontSize: 36,
    lineHeight: 38,
  },
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
