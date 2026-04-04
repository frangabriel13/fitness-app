import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import type { WeekStatus } from '@/utils/workout';
import { FontAwesome6 } from '@expo/vector-icons';
import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const CHIP_WIDTH = 62;
export const CHIP_GAP = 8;

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
      border: theme.accent,
      number: '#000000',
      label: '#000000' + '99',
      indicator: '#000000',
    };
  }
  if (weekStatus === 'completed') {
    return {
      bg: theme.backgroundElement,
      border: COLOR_SUCCESS + '30',
      number: theme.textSecondary + 'BB',
      label: COLOR_SUCCESS + 'CC',
      indicator: COLOR_SUCCESS,
    };
  }
  if (isCurrent) {
    return {
      bg: theme.backgroundElement,
      border: theme.accent + '60',
      number: theme.accent,
      label: theme.accent + 'BB',
      indicator: theme.accent,
    };
  }
  // upcoming
  return {
    bg: theme.backgroundElement,
    border: 'transparent',
    number: theme.textSecondary + '55',
    label: theme.textSecondary + '33',
    indicator: 'transparent',
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
  const pressed = useSharedValue(0);
  const colors = getChipColors(weekStatus, isSelected, isCurrent, theme);

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.set(withTiming(1, { duration: 80 }));
    })
    .onFinalize(() => {
      pressed.set(withTiming(0, { duration: 120 }));
    })
    .onEnd(() => {
      runOnJS(onPress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.92]) }],
    opacity: interpolate(pressed.get(), [0, 1], [1, 0.7]),
  }));

  const shadowStyle = isSelected
    ? Platform.select({
        ios: {
          shadowColor: theme.accent,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
        },
        default: {
          elevation: 8,
        },
      })
    : undefined;

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.chip,
          animatedStyle,
          shadowStyle,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border,
          },
        ]}>
        {/* Bottom status bar */}
        <View style={[styles.bottomBar, { backgroundColor: colors.indicator }]} />

        {/* Status icon for completed */}
        <View style={styles.statusZone}>
          {weekStatus === 'completed' && !isSelected && (
            <FontAwesome6 name="check" size={8} color={COLOR_SUCCESS} solid />
          )}
        </View>

        {/* Week number */}
        <ThemedText style={[styles.number, { color: colors.number }]}>
          {week}
        </ThemedText>

        {/* Label */}
        <ThemedText style={[styles.label, { color: colors.label }]}>
          {isCurrent && !isSelected ? 'ACTUAL' : 'SEM'}
        </ThemedText>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: CHIP_WIDTH,
    height: 80,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    overflow: 'hidden',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 2.5,
    borderRadius: 2,
  },
  statusZone: {
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
