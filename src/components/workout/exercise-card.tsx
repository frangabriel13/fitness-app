import { memo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { interFont, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Exercise } from '@/types';

function formatRest(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

type Props = {
  exercise: Exercise;
  theme: ReturnType<typeof useTheme>;
};

function ExerciseCardInner({ exercise, theme }: Props) {
  const pressed = useSharedValue(0);

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.set(withTiming(1, { duration: 100 }));
    })
    .onFinalize(() => {
      pressed.set(withTiming(0, { duration: 180 }));
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.97]) }],
    opacity: interpolate(pressed.get(), [0, 1], [1, 0.75]),
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.card,
          animatedStyle,
          { backgroundColor: theme.backgroundElement },
        ]}>
        {/* Top accent line */}
        <View style={[styles.accentLine, { backgroundColor: theme.accent + '44' }]} />

        <View style={styles.cardInner}>
          {/* Order badge */}
          <View style={[styles.orderBadge, { backgroundColor: theme.accent + '10' }]}>
            <ThemedText style={[styles.orderNumber, { color: theme.accent }]}>
              {exercise.order}
            </ThemedText>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <ThemedText style={[styles.exerciseName, { color: theme.text }]} numberOfLines={2}>
              {exercise.exerciseName}
            </ThemedText>
            <ThemedText style={[styles.muscleName, { color: theme.textSecondary }]} numberOfLines={1}>
              {exercise.agonistMuscle}
            </ThemedText>

            {/* Prescription data blocks */}
            <View style={styles.prescriptionRow}>
              {/* Sets × Reps */}
              <View style={styles.dataBlock}>
                <ThemedText style={[styles.dataValue, { color: theme.text }]}>
                  {exercise.sets}&times;{exercise.repRange}
                </ThemedText>
                <ThemedText style={[styles.dataLabel, { color: theme.textSecondary + '88' }]}>
                  SERIES
                </ThemedText>
              </View>

              <View style={[styles.dataDivider, { backgroundColor: theme.backgroundSelected }]} />

              {/* RIR */}
              <View style={styles.dataBlock}>
                <ThemedText style={[styles.dataValue, { color: theme.text }]}>
                  {exercise.targetRir}
                </ThemedText>
                <ThemedText style={[styles.dataLabel, { color: theme.textSecondary + '88' }]}>
                  RIR
                </ThemedText>
              </View>

              <View style={[styles.dataDivider, { backgroundColor: theme.backgroundSelected }]} />

              {/* Rest */}
              <View style={styles.dataBlock}>
                <View style={styles.restRow}>
                  <FontAwesome6 name="clock" size={10} color={theme.textSecondary + '66'} />
                  <ThemedText style={[styles.dataValue, { color: theme.text }]}>
                    {formatRest(exercise.restSeconds)}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.dataLabel, { color: theme.textSecondary + '88' }]}>
                  DESCANSO
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export const ExerciseCard = memo(ExerciseCardInner);

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  accentLine: {
    height: 2,
  },
  cardInner: {
    flexDirection: 'row',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  orderBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orderNumber: {
    fontFamily: interFont('900'),
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    gap: Spacing.one,
  },
  exerciseName: {
    fontFamily: interFont('700'),
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  muscleName: {
    fontFamily: interFont('600'),
    fontSize: 11,
    letterSpacing: 0.3,
  },
  prescriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  dataBlock: {
    alignItems: 'flex-start',
    gap: 1,
  },
  dataValue: {
    fontFamily: interFont('800'),
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.3,
  },
  dataLabel: {
    fontFamily: interFont('700'),
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  dataDivider: {
    width: 1,
    height: 20,
    opacity: 0.5,
  },
  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
