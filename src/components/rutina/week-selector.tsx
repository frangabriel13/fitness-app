import { ThemedText } from '@/components/themed-text';
import { WeekChip, CHIP_WIDTH, CHIP_GAP } from '@/components/rutina/week-chip';
import { interFont, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { WeekStatus } from '@/utils/workout';
import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Props = {
  weeks: number[];
  weekStatusMap: Record<number, WeekStatus>;
  currentWeek: number;
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
};

export function WeekSelector({
  weeks,
  weekStatusMap,
  currentWeek,
  selectedWeek,
  onSelectWeek,
}: Props) {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const x = Math.max(0, (currentWeek - 2) * (CHIP_WIDTH + CHIP_GAP));
    scrollRef.current?.scrollTo({ x, animated: false });
  }, [currentWeek]);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <ThemedText style={styles.sectionLabel} themeColor="textSecondary">
          SEMANAS
        </ThemedText>
        <View style={[styles.labelLine, { backgroundColor: theme.backgroundSelected }]} />
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
    gap: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionLabel: {
    fontFamily: interFont('700'),
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  labelLine: {
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
  chipStrip: {
    flexDirection: 'row',
    gap: CHIP_GAP,
    paddingHorizontal: Spacing.half,
  },
});
