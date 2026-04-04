import { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { FontAwesome6 } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExerciseCard } from '@/components/workout/exercise-card';
import { MuscleGroupHeader } from '@/components/workout/muscle-group-header';
import { useTheme } from '@/hooks/use-theme';
import { interFont, MaxContentWidth, Spacing } from '@/constants/theme';
import { useActiveProgram } from '@/stores/program-store';
import type { Exercise } from '@/types';

// ─── Helpers ────────────────────────────────────────────────

interface MuscleGroup {
  muscle: string;
  exercises: Exercise[];
}

function groupByMuscle(exercises: Exercise[]): MuscleGroup[] {
  const map = new Map<string, Exercise[]>();
  for (const ex of exercises) {
    const key = ex.agonistMuscle;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ex);
  }
  return Array.from(map, ([muscle, exercises]) => ({ muscle, exercises }));
}

// ─── Animated Buttons ───────────────────────────────────────

function BackButton({ theme, onPress }: { theme: ReturnType<typeof useTheme>; onPress: () => void }) {
  const pressed = useSharedValue(0);

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

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.backBtn,
          animatedStyle,
          { backgroundColor: theme.backgroundElement + 'CC' },
        ]}>
        <FontAwesome6 name="arrow-left" size={15} color={theme.text} />
      </Animated.View>
    </GestureDetector>
  );
}

function CtaButton({ theme, onPress }: { theme: ReturnType<typeof useTheme>; onPress: () => void }) {
  const pressed = useSharedValue(0);

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.set(withTiming(1, { duration: 100 }));
    })
    .onFinalize(() => {
      pressed.set(withTiming(0, { duration: 180 }));
    })
    .onEnd(() => {
      runOnJS(onPress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.97]) }],
    opacity: interpolate(pressed.get(), [0, 1], [1, 0.85]),
  }));

  const glowShadow = Platform.select({
    ios: {
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
    },
    default: { elevation: 8 },
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[
          styles.ctaButton,
          animatedStyle,
          glowShadow,
          { backgroundColor: theme.accent },
        ]}>
        <FontAwesome6 name="play" size={14} color={theme.background} />
        <ThemedText style={[styles.ctaText, { color: theme.background }]}>
          COMENZAR ENTRENAMIENTO
        </ThemedText>
      </Animated.View>
    </GestureDetector>
  );
}

// ─── Stat Block ─────────────────────────────────────────────

function StatBlock({
  value,
  label,
  theme,
}: {
  value: string | number;
  label: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={styles.statBlock}>
      <ThemedText style={[styles.statValue, { color: theme.text }]}>
        {value}
      </ThemedText>
      <ThemedText style={[styles.statLabel, { color: theme.textSecondary }]}>
        {label}
      </ThemedText>
    </View>
  );
}

// ─── Screen ─────────────────────────────────────────────────

export default function WorkoutDetailScreen() {
  const { dayId, week } = useLocalSearchParams<{ dayId: string; week: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const program = useActiveProgram();
  const weekNumber = Number(week) || 1;
  const trainingDay = program?.microcycle.trainingDays.find((d) => d.id === dayId);

  const muscleGroups = useMemo(
    () => (trainingDay ? groupByMuscle(trainingDay.exercises) : []),
    [trainingDay],
  );

  if (!trainingDay) {
    return (
      <ThemedView style={styles.screen}>
        <View style={[styles.emptyNav, { paddingTop: insets.top + Spacing.two }]}>
          <BackButton theme={theme} onPress={() => router.back()} />
        </View>
        <View style={styles.emptyState}>
          <FontAwesome6 name="dumbbell" size={40} color={theme.textSecondary + '44'} />
          <ThemedText
            themeColor="textSecondary"
            style={[styles.emptyText, { marginTop: Spacing.three }]}>
            No se encontró el entrenamiento
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  const totalExercises = trainingDay.exercises.length;
  const totalSets = trainingDay.exercises.reduce((acc, ex) => acc + ex.sets, 0);

  return (
    <ThemedView style={styles.screen}>
      {/* ── Hero Header ── */}
      <View style={[styles.hero, { paddingTop: insets.top + Spacing.two }]}>
        {/* Top row: back + week badge */}
        <View style={styles.heroTopRow}>
          <BackButton theme={theme} onPress={() => router.back()} />
          <View style={[styles.weekBadge, { backgroundColor: theme.accent + '18' }]}>
            <ThemedText style={[styles.weekBadgeText, { color: theme.accent }]}>
              SEM {weekNumber}
            </ThemedText>
          </View>
        </View>

        {/* Editorial content */}
        <View style={styles.heroContent}>
          <ThemedText style={[styles.overline, { color: theme.textSecondary }]}>
            ENTRENAMIENTO
          </ThemedText>

          <View style={styles.heroTitleRow}>
            <ThemedText style={[styles.dayNumber, { color: theme.accent }]}>
              {String(trainingDay.dayNumber).padStart(2, '0')}
            </ThemedText>
            <ThemedText style={[styles.dayName, { color: theme.text }]} numberOfLines={2}>
              {trainingDay.name}
            </ThemedText>
          </View>

          <View style={[styles.accentStripe, { backgroundColor: theme.accent }]} />
        </View>

        {/* Bottom separator */}
        <View style={[styles.heroSeparator, { backgroundColor: theme.backgroundSelected }]} />
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Stats Ribbon */}
        <View style={styles.statsRibbon}>
          <StatBlock value={totalExercises} label="EJERCICIOS" theme={theme} />
          <View style={[styles.statDivider, { backgroundColor: theme.backgroundSelected }]} />
          <StatBlock value={totalSets} label="SERIES" theme={theme} />
          <View style={[styles.statDivider, { backgroundColor: theme.backgroundSelected }]} />
          <StatBlock value={muscleGroups.length} label="MÚSCULOS" theme={theme} />
        </View>

        {/* Exercise groups */}
        <View style={styles.groupsContainer}>
          {muscleGroups.map((group, groupIndex) => (
            <View key={group.muscle} style={styles.muscleGroup}>
              <MuscleGroupHeader
                muscleName={group.muscle}
                exerciseCount={group.exercises.length}
                groupIndex={groupIndex}
                theme={theme}
              />
              <View style={styles.exerciseList}>
                {group.exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} theme={theme} />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + Spacing.three,
            backgroundColor: theme.background,
            borderTopColor: theme.backgroundElement,
          },
        ]}>
        <CtaButton
          theme={theme}
          onPress={() => {
            // TODO: navigate to active workout session
          }}
        />
      </View>
    </ThemedView>
  );
}

// ─── Styles ─────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  // ── Hero ──
  hero: {
    paddingHorizontal: Spacing.four,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  weekBadgeText: {
    fontFamily: interFont('700'),
    fontSize: 9,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  heroContent: {
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
  },
  overline: {
    fontFamily: interFont('700'),
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.two,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  dayNumber: {
    fontFamily: interFont('900'),
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: -2,
  },
  dayName: {
    fontFamily: interFont('800'),
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.5,
    flex: 1,
  },
  accentStripe: {
    height: 3,
    width: 40,
    borderRadius: 2,
    marginTop: Spacing.two,
  },
  heroSeparator: {
    height: 1,
    opacity: 0.4,
  },

  // ── Stats Ribbon ──
  statsRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontFamily: interFont('900'),
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: -1,
  },
  statLabel: {
    fontFamily: interFont('700'),
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 28,
    opacity: 0.4,
  },

  // ── Exercise Groups ──
  scrollContent: {
    paddingHorizontal: Spacing.two,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  groupsContainer: {
    gap: Spacing.five,
  },
  muscleGroup: {
    gap: Spacing.three,
  },
  exerciseList: {
    gap: Spacing.two,
  },

  // ── Bottom CTA ──
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 14,
    gap: Spacing.two,
  },
  ctaText: {
    fontFamily: interFont('700'),
    fontSize: 14,
    letterSpacing: 1,
  },

  // ── Empty State ──
  emptyNav: {
    paddingHorizontal: Spacing.four,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: interFont('500'),
    fontSize: 15,
  },
});
