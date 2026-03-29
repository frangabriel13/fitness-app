import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { MOCK_PROGRAM } from '@/data/mock-program';
import { useTheme } from '@/hooks/use-theme';
import { useProgramStore } from '@/stores/program-store';
import { useWorkoutStore } from '@/stores/workout-store';
import type { TrainingDay, WorkoutStatus } from '@/types';
import { generateAllWorkoutLogs } from '@/utils/workout';
import { FontAwesome6 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        <ThemedText type="small" themeColor="textSecondary">
          {day.exercises.length} ejercicios · {totalSets} series
        </ThemedText>
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
  const insets = useSafeAreaInsets();
  const [selectedWeek, setSelectedWeek] = useState(1);

  const program = useProgramStore((s) => s.currentProgram) ?? MOCK_PROGRAM;
  const workoutLogs = useWorkoutStore((s) => s.workoutLogs);
  const setWorkoutLogs = useWorkoutStore((s) => s.setWorkoutLogs);

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
    paddingHorizontal: Spacing.two,
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
  weekGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  weekChip: {
    width: 56,
    height: 56,
    borderRadius: Spacing.two,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  weekChipNumber: {
    fontSize: 18,
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
