import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import type { WeekStatus } from '@/utils/workout';
import { FontAwesome6 } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

export const CHIP_WIDTH = 60;
export const CHIP_GAP = 6;

const COLOR_SUCCESS = '#4CAF50';

function getChipColors(
  weekStatus: WeekStatus,
  isSelected: boolean,
  isCurrent: boolean,
  theme: ReturnType<typeof useTheme>
) {
  if (isSelected) {
    return {
      bg: theme.accent,
      border: 'transparent',
      number: theme.background,
      label: theme.background + 'BB',
      dot: theme.background,
    };
  }
  if (weekStatus === 'completed') {
    return {
      bg: theme.backgroundElement,
      border: 'transparent',
      number: theme.accentSubtle,
      label: COLOR_SUCCESS,
      dot: COLOR_SUCCESS,
    };
  }
  if (isCurrent) {
    return {
      bg: theme.backgroundElement,
      border: theme.accent,
      number: theme.accent,
      label: theme.accent,
      dot: theme.accent,
    };
  }
  // upcoming
  return {
    bg: theme.backgroundElement,
    border: 'transparent',
    number: theme.textSecondary + 'AA',
    label: theme.textSecondary + '66',
    dot: 'transparent',
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
  const { bg, border, number: numberColor, label: labelColor, dot: dotColor } =
    getChipColors(weekStatus, isSelected, isCurrent, theme);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.65 : 1 }]}>
      <View style={[styles.chip, { backgroundColor: bg, borderColor: border }]}>
        {/* Status indicator row */}
        <View style={styles.indicatorZone}>
          {weekStatus === 'completed' && !isSelected && (
            <FontAwesome6 name="check" size={9} color={COLOR_SUCCESS} solid />
          )}
          {(isCurrent || isSelected) && (
            <View style={[styles.dot, { backgroundColor: dotColor }]} />
          )}
        </View>

        {/* Week number */}
        <ThemedText style={[styles.number, { color: numberColor }]}>
          {week}
        </ThemedText>

        {/* Label */}
        <ThemedText style={[styles.label, { color: labelColor }]}>
          {isCurrent && !isSelected ? 'HOY' : 'sem'}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: CHIP_WIDTH,
    height: 72,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  indicatorZone: {
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  number: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
