import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Program } from '@/types';
import { StyleSheet, View } from 'react-native';

type Props = {
  program: Program;
  completedWeeks: number;
};

export function ProgramHeader({ program, completedWeeks }: Props) {
  const theme = useTheme();
  const { name, totalWeeks, microcycle } = program;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderLeftColor: theme.accent },
      ]}>
      <ThemedText style={styles.label} themeColor="textSecondary">
        PROGRAMA
      </ThemedText>

      <View style={styles.mainRow}>
        <ThemedText style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {name}
        </ThemedText>
        <View style={styles.counter}>
          <ThemedText style={[styles.counterNumber, { color: theme.accent }]}>
            {completedWeeks}
          </ThemedText>
          <ThemedText style={[styles.counterFraction, { color: theme.textSecondary }]}>
            / {totalWeeks}
          </ThemedText>
          <ThemedText style={[styles.counterLabel, { color: theme.textSecondary }]}>
            semanas
          </ThemedText>
        </View>
      </View>

      <View style={styles.pills}>
        <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText style={[styles.pillText, { color: theme.textSecondary }]}>
            {totalWeeks} sem
          </ThemedText>
        </View>
        <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText style={[styles.pillText, { color: theme.textSecondary }]}>
            {microcycle.daysPerWeek} días / sem
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderLeftWidth: 3,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  counter: {
    alignItems: 'flex-end',
    gap: 1,
  },
  counterNumber: {
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 40,
  },
  counterFraction: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
  counterLabel: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  pills: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
});
