import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useActiveProgram } from '@/stores/program-store';
import type { Exercise } from '@/types';

function formatRest(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function ExerciseRow({ exercise, theme }: { exercise: Exercise; theme: ReturnType<typeof useTheme> }) {
  const totalSets = exercise.sets;

  return (
    <View style={[styles.exerciseRow, { backgroundColor: theme.backgroundElement }]}>
      {/* Order badge */}
      <View style={[styles.orderBadge, { backgroundColor: theme.accent + '18' }]}>
        <ThemedText style={[styles.orderText, { color: theme.accent }]}>
          {exercise.order}
        </ThemedText>
      </View>

      {/* Content */}
      <View style={styles.exerciseContent}>
        <ThemedText style={styles.exerciseName} numberOfLines={2}>
          {exercise.exerciseName}
        </ThemedText>
        <ThemedText style={[styles.exerciseMuscle, { color: theme.textSecondary }]} numberOfLines={1}>
          {exercise.agonistMuscle}
        </ThemedText>

        {/* Prescription */}
        <View style={styles.prescriptionRow}>
          <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText style={[styles.pillText, { color: theme.textSecondary }]}>
              {totalSets}&times;{exercise.repRange}
            </ThemedText>
          </View>
          <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
            <ThemedText style={[styles.pillText, { color: theme.textSecondary }]}>
              RIR {exercise.targetRir}
            </ThemedText>
          </View>
          <View style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
            <FontAwesome6 name="clock" size={9} color={theme.textSecondary} />
            <ThemedText style={[styles.pillText, { color: theme.textSecondary }]}>
              {formatRest(exercise.restSeconds)}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function WorkoutDetailScreen() {
  const { dayId, week } = useLocalSearchParams<{ dayId: string; week: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const program = useActiveProgram();
  const weekNumber = Number(week) || 1;
  const trainingDay = program?.microcycle.trainingDays.find((d) => d.id === dayId);

  if (!trainingDay) {
    return (
      <ThemedView style={styles.screen}>
        <View style={[styles.headerBar, { paddingTop: insets.top + Spacing.two }]}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={16}
            style={[styles.closeBtn, { backgroundColor: theme.backgroundElement }]}>
            <FontAwesome6 name="xmark" size={16} color={theme.text} />
          </Pressable>
        </View>
        <View style={styles.emptyState}>
          <FontAwesome6 name="dumbbell" size={40} color={theme.textSecondary + '44'} />
          <ThemedText themeColor="textSecondary" style={{ marginTop: Spacing.three }}>
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
      {/* Header */}
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: insets.top + Spacing.two,
            borderBottomColor: theme.backgroundElement,
          },
        ]}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={16}
          style={[styles.closeBtn, { backgroundColor: theme.backgroundElement }]}>
          <FontAwesome6 name="xmark" size={16} color={theme.text} />
        </Pressable>

        <View style={styles.headerCenter}>
          <ThemedText style={styles.headerTitle} numberOfLines={1}>
            {trainingDay.name}
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            Día {trainingDay.dayNumber}
          </ThemedText>
        </View>

        <View style={[styles.weekBadge, { backgroundColor: theme.accent + '18' }]}>
          <ThemedText style={[styles.weekBadgeText, { color: theme.accent }]}>
            SEM {weekNumber}
          </ThemedText>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryChip, { backgroundColor: theme.backgroundElement }]}>
            <FontAwesome6 name="dumbbell" size={12} color={theme.accent} />
            <ThemedText style={[styles.summaryText, { color: theme.text }]}>
              {totalExercises} ejercicios
            </ThemedText>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: theme.backgroundElement }]}>
            <FontAwesome6 name="layer-group" size={12} color={theme.accent} />
            <ThemedText style={[styles.summaryText, { color: theme.text }]}>
              {totalSets} series
            </ThemedText>
          </View>
        </View>

        {/* Section label */}
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          EJERCICIOS
        </ThemedText>

        {/* Exercise list */}
        <View style={styles.exerciseList}>
          {trainingDay.exercises.map((exercise) => (
            <ExerciseRow key={exercise.id} exercise={exercise} theme={theme} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + Spacing.three,
            backgroundColor: theme.background,
            borderTopColor: theme.backgroundElement,
          },
        ]}>
        <Pressable
          onPress={() => {
            // TODO: navigate to active workout session
          }}
          style={({ pressed }) => [
            styles.ctaButton,
            { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
          ]}>
          <FontAwesome6 name="play" size={14} color={theme.background} />
          <ThemedText style={[styles.ctaText, { color: theme.background }]}>
            COMENZAR ENTRENAMIENTO
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  weekBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  weekBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.two,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
  },
  summaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.one,
    marginBottom: Spacing.two,
  },
  exerciseList: {
    gap: Spacing.two,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  orderBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    fontSize: 18,
    fontWeight: '800',
  },
  exerciseContent: {
    flex: 1,
    gap: Spacing.one,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  exerciseMuscle: {
    fontSize: 12,
    fontWeight: '500',
  },
  prescriptionRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: Spacing.one,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
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
    height: 52,
    borderRadius: 14,
    gap: Spacing.two,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
