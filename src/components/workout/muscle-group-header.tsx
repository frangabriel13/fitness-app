import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { interFont, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  muscleName: string;
  exerciseCount: number;
  groupIndex: number;
  theme: ReturnType<typeof useTheme>;
};

export function MuscleGroupHeader({ muscleName, exerciseCount, groupIndex, theme }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            {muscleName.toUpperCase()}
          </ThemedText>
          <ThemedText style={[styles.groupNumber, { color: theme.accent }]}>
            {String(groupIndex + 1).padStart(2, '0')}
          </ThemedText>
        </View>

        <ThemedText style={[styles.exerciseCount, { color: theme.textSecondary }]}>
          {exerciseCount} {exerciseCount === 1 ? 'EJERCICIO' : 'EJERCICIOS'}
        </ThemedText>
      </View>

      <View style={[styles.separator, { backgroundColor: theme.backgroundSelected }]} />
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
  groupNumber: {
    fontFamily: interFont('900'),
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: -1,
  },
  exerciseCount: {
    fontFamily: interFont('700'),
    fontSize: 10,
    letterSpacing: 2,
  },
  separator: {
    height: 1,
    opacity: 0.4,
  },
});
