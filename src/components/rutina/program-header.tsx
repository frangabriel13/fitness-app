import { ThemedText } from '@/components/themed-text';
import { interFont, Spacing } from '@/constants/theme';
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
  const progress = totalWeeks > 0 ? completedWeeks / totalWeeks : 0;

  return (
    <View style={styles.container}>
      {/* Top accent strip */}
      <View style={[styles.topStrip, { backgroundColor: theme.accent }]} />

      <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
        {/* Label */}
        <ThemedText style={styles.label} themeColor="textSecondary">
          PROGRAMA ACTIVO
        </ThemedText>

        {/* Program name + progress fraction */}
        <View style={styles.heroRow}>
          <View style={styles.nameBlock}>
            <ThemedText style={[styles.name, { color: theme.text }]} numberOfLines={2}>
              {name}
            </ThemedText>
          </View>

          <View style={styles.fractionBlock}>
            <View style={styles.fractionRow}>
              <ThemedText style={[styles.fractionBig, { color: theme.accent }]}>
                {completedWeeks}
              </ThemedText>
              <ThemedText style={[styles.fractionSlash, { color: theme.textSecondary }]}>
                /
              </ThemedText>
              <ThemedText style={[styles.fractionTotal, { color: theme.textSecondary }]}>
                {totalWeeks}
              </ThemedText>
            </View>
            <ThemedText style={[styles.fractionLabel, { color: theme.textSecondary }]}>
              SEMANAS
            </ThemedText>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.accent,
                width: `${Math.max(progress * 100, 2)}%` as any,
              },
            ]}
          />
          {/* Glow dot at the end of progress */}
          {progress > 0 && progress < 1 && (
            <View
              style={[
                styles.progressDot,
                {
                  backgroundColor: theme.accent,
                  left: `${progress * 100}%` as any,
                },
              ]}
            />
          )}
        </View>

        {/* Meta pills */}
        <View style={styles.metaRow}>
          <View style={[styles.metaPill, { borderColor: theme.backgroundSelected }]}>
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              {microcycle.daysPerWeek} días / sem
            </ThemedText>
          </View>
          <View style={[styles.metaPill, { borderColor: theme.backgroundSelected }]}>
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              {totalWeeks} semanas
            </ThemedText>
          </View>
          <View style={[styles.metaPill, { borderColor: theme.backgroundSelected }]}>
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              {Math.round(progress * 100)}%
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  topStrip: {
    height: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginHorizontal: 1,
  },
  card: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  label: {
    fontFamily: interFont('700'),
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  nameBlock: {
    flex: 1,
    paddingTop: 2,
  },
  name: {
    fontFamily: interFont('800'),
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  fractionBlock: {
    alignItems: 'flex-end',
  },
  fractionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  fractionBig: {
    fontFamily: interFont('900'),
    fontSize: 42,
    lineHeight: 42,
    letterSpacing: -2,
  },
  fractionSlash: {
    fontFamily: interFont('400'),
    fontSize: 20,
    marginHorizontal: 3,
    opacity: 0.5,
  },
  fractionTotal: {
    fontFamily: interFont('600'),
    fontSize: 20,
    lineHeight: 24,
  },
  fractionLabel: {
    fontFamily: interFont('700'),
    fontSize: 9,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressDot: {
    position: 'absolute',
    top: -3,
    width: 9,
    height: 9,
    borderRadius: 5,
    marginLeft: -5,
    opacity: 0.6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  metaPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  metaText: {
    fontFamily: interFont('600'),
    fontSize: 11,
    letterSpacing: 0.3,
  },
});
