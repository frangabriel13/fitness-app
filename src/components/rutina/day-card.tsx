import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import type { TrainingDay, WorkoutStatus } from '@/types';
import { FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Spacing } from '@/constants/theme';

const COLOR_SUCCESS = '#4CAF50';

export interface DayCardProps {
  day: TrainingDay;
  status: WorkoutStatus;
}

export function DayCard({ day, status }: DayCardProps) {
  const theme = useTheme();

  const statusConfig: Record<WorkoutStatus, { label: string; icon: string; color: string }> = {
    not_started: { label: 'Pendiente', icon: 'circle', color: theme.textSecondary },
    in_progress: { label: 'En progreso', icon: 'circle-half-stroke', color: theme.accent },
    completed: { label: 'Completado', icon: 'circle-check', color: COLOR_SUCCESS },
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

const styles = StyleSheet.create({
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
