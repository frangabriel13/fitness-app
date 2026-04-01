import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import type { WeekStatus } from '@/utils/workout';
import { FontAwesome6 } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

export const CHIP_WIDTH = 58;
export const CHIP_GAP = 6;

const COLOR_SUCCESS = '#4CAF50';

function getChipColors(
  weekStatus: WeekStatus,
  isSelected: boolean,
  isCurrent: boolean,
  theme: ReturnType<typeof useTheme>
) {
  return {
    bg: isSelected
      ? theme.accent
      : weekStatus === 'completed'
        ? theme.backgroundSelected
        : theme.backgroundElement,
    border: !isSelected && isCurrent ? theme.accent : 'transparent',
    number: isSelected
      ? theme.background
      : isCurrent
        ? theme.accent
        : weekStatus === 'completed'
          ? theme.accentSubtle
          : weekStatus === 'upcoming'
            ? theme.textSecondary + '55'
            : theme.textSecondary,
    label: isSelected ? theme.background : isCurrent ? theme.accent : theme.textSecondary + '77',
  };
}

export interface WeekChipProps {
  week: number;
  weekStatus: WeekStatus;
  isSelected: boolean;
  isCurrent: boolean;
  onPress: () => void;
}

export function WeekChip({ week, weekStatus, isSelected, isCurrent, onPress }: WeekChipProps) {
  const theme = useTheme();
  const { bg, border, number: numberColor, label: labelColor } = getChipColors(weekStatus, isSelected, isCurrent, theme);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}>
      <View style={[styles.chip, { backgroundColor: bg, borderColor: border }]}>
        {/* Status icon zone */}
        <View style={styles.chipIconZone}>
          {weekStatus === 'completed' && !isSelected && (
            <FontAwesome6 name="check" size={9} color={COLOR_SUCCESS} solid />
          )}
          {isCurrent && !isSelected && (
            <View style={[styles.chipDot, { backgroundColor: theme.accent }]} />
          )}
          {isSelected && (
            <View style={[styles.chipDot, { backgroundColor: theme.background }]} />
          )}
        </View>

        {/* Week number */}
        <ThemedText style={[styles.chipNumber, { color: numberColor }]}>
          {week}
        </ThemedText>

        {/* Label */}
        <ThemedText style={[styles.chipLabel, { color: labelColor }]}>
          {isCurrent && !isSelected ? 'HOY' : 'sem'}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: CHIP_WIDTH,
    height: 70,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  chipIconZone: {
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  chipNumber: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  chipLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
