import { ExerciseCard } from '@/components/rutina/exercise-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useActiveProgram } from '@/stores/program-store';
import { useWorkoutStore } from '@/stores/workout-store';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';

export default function DayDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { dayId, week } = useLocalSearchParams<{ dayId: string; week: string }>();
  const weekNumber = Number(week);

  const program = useActiveProgram();
  const workoutLogs = useWorkoutStore((s) => s.workoutLogs);

  const day = program?.microcycle.trainingDays.find((d) => d.id === dayId);
  const logKey = `${dayId}_w${weekNumber}`;
  const status = workoutLogs[logKey]?.status ?? 'not_started';
  const isCompleted = status === 'completed';

  if (!day) {
    return (
      <ThemedView style={styles.screen}>
        <ThemedText themeColor="textSecondary">Día no encontrado</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: false,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <ThemedText style={[styles.headerDayLabel, { color: theme.textSecondary }]}>
                DÍA {day.dayNumber}
              </ThemedText>
              <ThemedText style={[styles.headerDayName, { color: theme.text }]} numberOfLines={1}>
                {day.name}
              </ThemedText>
            </View>
          ),
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <FontAwesome6 name="chevron-left" size={18} color={theme.text} solid />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: Spacing.three,
            paddingBottom: (isCompleted ? Spacing.four : BottomTabInset + 80) + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Meta info */}
        <View style={styles.metaRow}>
          <View style={[styles.metaBadge, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              Semana {weekNumber}
            </ThemedText>
          </View>
          <View style={[styles.metaBadge, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              {day.exercises.length} ejercicios
            </ThemedText>
          </View>
          <View style={[styles.metaBadge, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText style={[styles.metaText, { color: theme.textSecondary }]}>
              {day.exercises.reduce((acc, ex) => acc + ex.sets, 0)} series
            </ThemedText>
          </View>
        </View>

        {/* Exercise list */}
        <View style={styles.exerciseList}>
          {day.exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </View>
      </ScrollView>

      {/* Start button */}
      {!isCompleted && (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.background,
              paddingBottom: insets.bottom + Spacing.three,
            },
          ]}>
          <Pressable
            style={({ pressed }) => [
              styles.startButton,
              { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
            ]}>
            <FontAwesome6 name="play" size={14} color={theme.background} solid />
            <ThemedText style={[styles.startButtonText, { color: theme.background }]}>
              INICIAR ENTRENAMIENTO
            </ThemedText>
          </Pressable>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerTitle: {
    alignItems: 'center',
    gap: 1,
  },
  headerDayLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerDayName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  backButton: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  container: {
    paddingHorizontal: Spacing.two,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.three,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  metaBadge: {
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  exerciseList: {
    gap: Spacing.two,
  },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128,128,128,0.2)',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: 14,
    paddingVertical: 16,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
