import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import type { WorkoutStatus } from '@/types';
import { interFont, Spacing } from '@/constants/theme';
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
      pressed.set(withTiming(0, { duration: 180 }));
    })
    .onEnd(() => {
      if (onPress) runOnJS(onPress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.97]) }],
    opacity: interpolate(pressed.get(), [0, 1], [1, 0.75]),
  }));

  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';

  const accentColor = isCompleted
    ? COLOR_SUCCESS
    : isInProgress
      ? theme.accent
      : theme.backgroundSelected;

  const iconColor = isCompleted
    ? COLOR_SUCCESS
    : isInProgress
      ? theme.accent
      : theme.textSecondary + '44';

  const icon = isCompleted
    ? 'circle-check'
    : isInProgress
      ? 'bolt'
      : 'chevron-right';

  const dayNumberColor = isCompleted
    ? COLOR_SUCCESS + '22'
    : isInProgress
      ? theme.accent + '18'
      : theme.textSecondary + '0F';

  const dayNumberTextColor = isCompleted
    ? COLOR_SUCCESS
    : isInProgress
      ? theme.accent
      : theme.textSecondary + '55';

  const cardBg = isCompleted
    ? COLOR_SUCCESS + '08'
    : isInProgress
      ? theme.accent + '08'
      : theme.backgroundElement;

  // Glow shadow for in-progress cards
  const glowShadow = isInProgress
    ? Platform.select({
        ios: {
          shadowColor: theme.accent,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        default: { elevation: 4 },
      })
    : undefined;

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.card,
          animatedStyle,
          glowShadow,
          { backgroundColor: cardBg },
        ]}>
        {/* Top accent line */}
        <View style={[styles.topAccent, { backgroundColor: accentColor }]} />

        <View style={styles.cardInner}>
          {/* Left: Day number block */}
          <View style={[styles.dayBadge, { backgroundColor: dayNumberColor }]}>
            <ThemedText style={[styles.dayLabel, { color: dayNumberTextColor }]}>
              DÍA
            </ThemedText>
            <ThemedText style={[styles.dayNumber, { color: dayNumberTextColor }]}>
              {dayNumber}
            </ThemedText>
          </View>

          {/* Center: Content */}
          <View style={styles.content}>
            <ThemedText
              style={[
                styles.name,
                { color: isCompleted ? theme.text + 'AA' : theme.text },
              ]}
              numberOfLines={1}>
              {name}
            </ThemedText>
            <View style={styles.metaRow}>
              <ThemedText style={[styles.meta, { color: theme.textSecondary }]}>
                {exerciseCount} ejercicios
              </ThemedText>
              <View style={[styles.metaDot, { backgroundColor: theme.textSecondary + '44' }]} />
              <ThemedText style={[styles.meta, { color: theme.textSecondary }]}>
                {totalSets} series
              </ThemedText>
            </View>
          </View>

          {/* Right: Status icon */}
          <View style={styles.iconZone}>
            <FontAwesome6
              name={icon as any}
              solid={isCompleted}
              size={isCompleted || isInProgress ? 18 : 14}
              color={iconColor}
            />
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  topAccent: {
    height: 2,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  dayBadge: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    flexShrink: 0,
  },
  dayLabel: {
    fontFamily: interFont('700'),
    fontSize: 8,
    letterSpacing: 1.5,
    lineHeight: 10,
  },
  dayNumber: {
    fontFamily: interFont('900'),
    fontSize: 24,
    lineHeight: 26,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: interFont('700'),
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    fontFamily: interFont('500'),
    fontSize: 12,
    lineHeight: 16,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  iconZone: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
