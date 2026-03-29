import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { MOCK_PROGRAM } from '@/data/mock-program';
import { useTheme } from '@/hooks/use-theme';
import { useProgramStore } from '@/stores/program-store';
import { useWorkoutStore } from '@/stores/workout-store';
import type { TrainingDay, WorkoutLog, WorkoutStatus } from '@/types';
import { generateAllWorkoutLogs } from '@/utils/workout';
import { FontAwesome6 } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Helpers ─────────────────────────────────────────────────────────────────

type WeekStatus = 'completed' | 'active' | 'upcoming';

function getWeekStatus(
  week: number,
  days: TrainingDay[],
  logs: Record<string, WorkoutLog>
): WeekStatus {
  const statuses = days.map((d) => logs[`${d.id}_w${week}`]?.status ?? 'not_started');
  if (statuses.every((s) => s === 'completed')) return 'completed';
  if (statuses.some((s) => s !== 'not_started')) return 'active';
  return 'upcoming';
}

function getCurrentWeek(
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

// ─── Week chip ────────────────────────────────────────────────────────────────

const CHIP_WIDTH = 58;
const CHIP_GAP = 6;

interface WeekChipProps {
  week: number;
  weekStatus: WeekStatus;
  isSelected: boolean;
  isCurrent: boolean;
  onPress: () => void;
}

function WeekChip({ week, weekStatus, isSelected, isCurrent, onPress }: WeekChipProps) {
  const theme = useTheme();

  const bgColor = isSelected
    ? theme.accent
    : weekStatus === 'completed'
      ? theme.backgroundSelected
      : theme.backgroundElement;

  const borderColor = !isSelected && isCurrent ? theme.accent : 'transparent';

  const numberColor = isSelected
    ? theme.background
    : isCurrent
      ? theme.accent
      : weekStatus === 'completed'
        ? theme.accentSubtle
        : weekStatus === 'upcoming'
          ? theme.textSecondary + '55'
          : theme.textSecondary;

  const labelColor = isSelected
    ? theme.background
    : isCurrent
      ? theme.accent
      : theme.textSecondary + '77';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}>
      <View style={[styles.chip, { backgroundColor: bgColor, borderColor }]}>
        {/* Status icon zone */}
        <View style={styles.chipIconZone}>
          {weekStatus === 'completed' && !isSelected && (
            <FontAwesome6 name="check" size={9} color="#4CAF50" solid />
          )}
          {isCurrent && !isSelected && (
            <View style={[styles.chipDot, { backgroundColor: theme.accent }]} />
          )}
          {isSelected && (
            <View style={[styles.chipDot, { backgroundColor: theme.background }]} />
          )}
        </View>

        {/* Week number */}
        <ThemedText style={[styles.chipNumber, { color: numberColor }]}>
          {week}
        </ThemedText>

        {/* Label */}
        <ThemedText style={[styles.chipLabel, { color: labelColor }]}>
          {isCurrent && !isSelected ? 'HOY' : 'sem'}
        </ThemedText>
      </View>
    </Pressable>
  );
}

// ─── Day card ────────────────────────────────────────────────────────────────

interface DayCardProps {
  day: TrainingDay;
  status: WorkoutStatus;
}

function DayCard({ day, status }: DayCardProps) {
  const theme = useTheme();

  const statusConfig: Record<WorkoutStatus, { label: string; icon: string; color: string }> = {
    not_started: { label: 'Pendiente', icon: 'circle', color: theme.textSecondary },
    in_progress: { label: 'En progreso', icon: 'circle-half-stroke', color: theme.accent },
    completed: { label: 'Completado', icon: 'circle-check', color: '#4CAF50' },
  };

  const { label, icon, color } = statusConfig[status];
  const totalSets = day.exercises.reduce((acc, ex) => acc + ex.sets, 0);

  return (
    <View style={[styles.dayCard, { backgroundColor: theme.backgroundElement, borderLeftColor: color }]}>
      <View style={[styles.dayNumber, { backgroundColor: theme.backgroundSelected }]}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          D{day.dayNumber}
        </ThemedText>
      </View>
      <View style={styles.dayInfo}>
        <ThemedText type="subtitle">{day.name}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {day.exercises.length} ejercicios · {totalSets} series
        </ThemedText>
      </View>
      <View style={styles.statusBadge}>
        <FontAwesome6 name={icon as any} solid size={14} color={color} />
        <ThemedText type="small" style={{ color }}>
          {label}
        </ThemedText>
      </View>
    </View>
  );
}

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
  }, []);

  const { totalWeeks, name, microcycle } = program;
  const days = microcycle.trainingDays;

  const currentWeek = getCurrentWeek(totalWeeks, days, workoutLogs);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const completedCount = weeks.filter((w) => getWeekStatus(w, days, workoutLogs) === 'completed').length;
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
            <ThemedText type="title" style={styles.titleWhite}>MI </ThemedText>
            <ThemedText type="title" style={[styles.titleWhite, { color: theme.accent }]}>RUTINA</ThemedText>
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
            {weeks.map((week) => {
              const weekStatus = getWeekStatus(week, days, workoutLogs);
              return (
                <WeekChip
                  key={week}
                  week={week}
                  weekStatus={weekStatus}
                  isSelected={week === selectedWeek}
                  isCurrent={week === currentWeek}
                  onPress={() => setSelectedWeek(week)}
                />
              );
            })}
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
  titleWhite: {
    fontSize: 36,
    lineHeight: 38,
    color: '#F5F5F5',
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
  chip: {
    width: CHIP_WIDTH,
    height: 70,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  chipIconZone: {
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  chipNumber: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  chipLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  daysList: {
    gap: Spacing.one,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.two,
    borderLeftWidth: 3,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    gap: Spacing.two,
  },
  dayNumber: {
    width: 34,
    height: 34,
    borderRadius: Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInfo: {
    flex: 1,
    gap: 1,
  },
  statusBadge: {
    alignItems: 'center',
    gap: Spacing.half,
  },
});
