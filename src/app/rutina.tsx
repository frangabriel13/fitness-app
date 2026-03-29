import { FontAwesome6 } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { MOCK_PROGRAM } from '@/data/mock-program';
import { useTheme } from '@/hooks/use-theme';
import { useProgramStore } from '@/stores/program-store';
import { useWorkoutStore } from '@/stores/workout-store';
import { generateAllWorkoutLogs } from '@/utils/workout';
import type { TrainingDay, WorkoutStatus } from '@/types';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

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
    <View
      style={[
        styles.dayCard,
        { backgroundColor: theme.backgroundElement, borderLeftColor: color },
      ]}>
      {/* Day number bubble */}
      <View style={[styles.dayNumber, { backgroundColor: theme.backgroundSelected }]}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          D{day.dayNumber}
        </ThemedText>
      </View>

      {/* Info */}
      <View style={styles.dayInfo}>
        <ThemedText type="subtitle">{day.name}</ThemedText>
        <View style={styles.dayMeta}>
          <ThemedText type="small" themeColor="textSecondary">
            {day.exercises.length} ejercicios · {totalSets} series
          </ThemedText>
        </View>
      </View>

      {/* Status */}
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
  const [selectedWeek, setSelectedWeek] = useState(1);

  const program = useProgramStore((s) => s.currentProgram) ?? MOCK_PROGRAM;
  const workoutLogs = useWorkoutStore((s) => s.workoutLogs);
  const setWorkoutLogs = useWorkoutStore((s) => s.setWorkoutLogs);

  // Initialize logs if empty
  useEffect(() => {
    if (Object.keys(workoutLogs).length === 0) {
      setWorkoutLogs(generateAllWorkoutLogs(program));
    }
  }, []);

  const { totalWeeks, name, microcycle } = program;
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const days = microcycle.trainingDays;

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: BottomTabInset + Spacing.four }]}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
            PROGRAMA ACTUAL
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Mi Rutina
          </ThemedText>
          <View style={[styles.programBadge, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="smallBold" themeColor="accent">
              {name}
            </ThemedText>
          </View>
        </View>

        {/* Duration card */}
        <View style={[styles.durationCard, { backgroundColor: theme.backgroundElement }]}>
          <View style={styles.durationRow}>
            <View style={[styles.durationDot, { backgroundColor: theme.accent }]} />
            <ThemedText type="smallBold" themeColor="textSecondary">
              DURACIÓN DEL MACROCICLO
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.durationNumber}>
            {totalWeeks}{' '}
            <ThemedText type="subtitle" themeColor="textSecondary">
              semanas
            </ThemedText>
          </ThemedText>
        </View>

        {/* Week selector */}
        <View style={styles.sectionHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            SEMANAS
          </ThemedText>
          <ThemedText type="small" themeColor="accent">
            Semana {selectedWeek} seleccionada
          </ThemedText>
        </View>

        <View style={styles.weekGrid}>
          {weeks.map((week) => {
            const isSelected = week === selectedWeek;
            return (
              <Pressable
                key={week}
                onPress={() => setSelectedWeek(week)}
                style={({ pressed }) => [
                  styles.weekChip,
                  {
                    backgroundColor: isSelected ? theme.accent : theme.backgroundElement,
                    borderColor: isSelected ? theme.accent : 'transparent',
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}>
                <ThemedText
                  type="smallBold"
                  style={[
                    styles.weekChipNumber,
                    { color: isSelected ? theme.background : theme.textSecondary },
                  ]}>
                  {week}
                </ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: isSelected ? theme.background : theme.textSecondary, opacity: 0.8 }}>
                  sem
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {/* Days for selected week */}
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
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: Spacing.three,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.three,
  },
  header: {
    paddingTop: Spacing.four,
    gap: Spacing.two,
  },
  eyebrow: {
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 36,
  },
  programBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.three,
  },
  durationCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  durationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  durationNumber: {
    fontSize: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.one,
  },
  weekGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  weekChip: {
    width: 64,
    height: 64,
    borderRadius: Spacing.two,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  weekChipNumber: {
    fontSize: 20,
  },
  daysList: {
    gap: Spacing.two,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.two,
    borderLeftWidth: 3,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  dayNumber: {
    width: 36,
    height: 36,
    borderRadius: Spacing.one,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInfo: {
    flex: 1,
    gap: Spacing.half,
  },
  dayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  statusBadge: {
    alignItems: 'center',
    gap: Spacing.half,
  },
});
