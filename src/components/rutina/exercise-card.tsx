import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Exercise } from '@/types';
import { StyleSheet, View } from 'react-native';

type Props = {
  exercise: Exercise;
};

export function ExerciseCard({ exercise }: Props) {
  const theme = useTheme();
  const { order, exerciseName, agonistMuscle, sets, repRange, targetRir, restSeconds } = exercise;

  const restLabel = restSeconds >= 60
    ? `${Math.floor(restSeconds / 60)}min${restSeconds % 60 > 0 ? ` ${restSeconds % 60}s` : ''}`
    : `${restSeconds}s`;

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <View style={[styles.orderBadge, { backgroundColor: theme.backgroundSelected }]}>
        <ThemedText style={[styles.orderText, { color: theme.textSecondary }]}>
          {order}
        </ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {exerciseName}
        </ThemedText>
        <ThemedText style={[styles.muscle, { color: theme.accent }]}>
          {agonistMuscle}
        </ThemedText>

        <View style={styles.statsRow}>
          <Stat label="Series" value={String(sets)} theme={theme} />
          <Stat label="Reps" value={repRange} theme={theme} />
          <Stat label="RIR" value={String(targetRir)} theme={theme} />
          <Stat label="Descanso" value={restLabel} theme={theme} />
        </View>
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={styles.stat}>
      <ThemedText style={[styles.statValue, { color: theme.text }]}>{value}</ThemedText>
      <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  orderBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  orderText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  muscle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  stat: {
    alignItems: 'center',
    minWidth: 48,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
