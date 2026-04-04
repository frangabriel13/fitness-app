import { ThemedText } from '@/components/themed-text';
import { WeekChip, CHIP_WIDTH, CHIP_GAP } from '@/components/rutina/week-chip';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { WeekStatus } from '@/utils/workout';
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Props = {
  weeks: number[];
  weekStatusMap: Record<number, WeekStatus>;
  currentWeek: number;
  selectedWeek: number;
  totalWeeks: number;
  completedCount: number;
  onSelectWeek: (week: number) => void;
};

export function WeekSelector({
  weeks,
  weekStatusMap,
  currentWeek,
  selectedWeek,
  totalWeeks,
  completedCount,
  onSelectWeek,
}: Props) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const progressRatio = completedCount / totalWeeks;

  useEffect(() => {
    const x = Math.max(0, (currentWeek - 2) * (CHIP_WIDTH + CHIP_GAP));
    scrollRef.current?.scrollTo({ x, animated: false });
  }, [currentWeek]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipStrip}>
        {weeks.map((week) => (
          <WeekChip
            key={week}
            week={week}
            weekStatus={weekStatusMap[week]}
            isSelected={week === selectedWeek}
            isCurrent={week === currentWeek}
            onPress={() => onSelectWeek(week)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  header: {
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
  chipStrip: {
    flexDirection: 'row',
    gap: CHIP_GAP,
    paddingHorizontal: Spacing.one,
  },
});
