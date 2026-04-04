import { ThemedText } from '@/components/themed-text';
import { WeekChip, CHIP_WIDTH, CHIP_GAP } from '@/components/rutina/week-chip';
import { Spacing } from '@/constants/theme';
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
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const x = Math.max(0, (currentWeek - 2) * (CHIP_WIDTH + CHIP_GAP));
    scrollRef.current?.scrollTo({ x, animated: false });
  }, [currentWeek]);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.sectionLabel} themeColor="textSecondary">
        SEMANAS
      </ThemedText>

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
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.one,
  },
  chipStrip: {
    flexDirection: 'row',
    gap: CHIP_GAP,
    paddingHorizontal: Spacing.one,
  },
});
