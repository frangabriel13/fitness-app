import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import type { WorkoutStatus } from '@/types';
import { Spacing } from '@/constants/theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const COLOR_SUCCESS = '#4CAF50';

export interface DayCardProps {
  name: string;
  dayNumber: number;
  exerciseCount: number;
  totalSets: number;
  status: WorkoutStatus;
  onPress?: () => void;
}

export function DayCard({ name, dayNumber, exerciseCount, totalSets, status, onPress }: DayCardProps) {
  const theme = useTheme();
  const pressed = useSharedValue(0);

  const tap = Gesture.Tap()
    .enabled(!!onPress)
    .onBegin(() => {
      pressed.set(withTiming(1, { duration: 100 }));
    })
    .onFinalize(() => {
      pressed.set(withTiming(0, { duration: 150 }));
    })
    .onEnd(() => {
      if (onPress) runOnJS(onPress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.get(), [0, 1], [1, 0.72]),
  }));

  const statusColor =
    status === 'completed'
      ? COLOR_SUCCESS
      : status === 'in_progress'
        ? theme.accent
        : theme.backgroundSelected;

  const iconColor =
    status === 'completed'
      ? COLOR_SUCCESS
      : status === 'in_progress'
        ? theme.accent
        : theme.textSecondary;

  const icon =
    status === 'completed'
      ? 'circle-check'
      : status === 'in_progress'
        ? 'circle-half-stroke'
        : 'circle';

  const cardTint =
    status === 'completed'
      ? COLOR_SUCCESS + '0D'
      : status === 'in_progress'
        ? theme.accent + '0D'
        : undefined;

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.card,
          animatedStyle,
          { backgroundColor: cardTint ?? theme.backgroundElement, borderLeftColor: statusColor },
        ]}>
        {/* Day number badge */}
        <View style={[styles.badge, { backgroundColor: iconColor + '18' }]}>
          <ThemedText style={[styles.badgeNumber, { color: iconColor }]}>
            {dayNumber}
          </ThemedText>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ThemedText style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {name}
          </ThemedText>
          <ThemedText style={[styles.meta, { color: theme.textSecondary }]}>
            {exerciseCount} ejercicios · {totalSets} series
          </ThemedText>
        </View>

        {/* Status icon */}
        <FontAwesome6 name={icon as any} solid size={20} color={iconColor} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderLeftWidth: 4,
    paddingVertical: 14,
    paddingRight: 16,
    paddingLeft: 10,
    gap: Spacing.three,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeNumber: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  meta: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
});
