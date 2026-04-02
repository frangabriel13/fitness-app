import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DayCard } from '@/components/rutina/day-card';
import { WeekChip, CHIP_WIDTH, CHIP_GAP } from '@/components/rutina/week-chip';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { MOCK_PROGRAMS_MAP } from '@/data/mock-program';
import { MOCK_USERS_MAP } from '@/data/mock-users';
import { useTheme } from '@/hooks/use-theme';
import { useCurrentUser } from '@/stores/auth-store';
import { useActiveProgram, useProgramStore, useTrainerAssignedPrograms } from '@/stores/program-store';
import { useWorkoutStore } from '@/stores/workout-store';
import { generateAllWorkoutLogs, getWeekStatus, getCurrentWeek } from '@/utils/workout';
import type { ClientProfile, Program } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Trainer: Client selector ────────────────────────────────────────────────

function ClientSelector({
  clients,
  selectedId,
  onSelect,
}: {
  clients: ClientProfile[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const theme = useTheme();

  return (
    <View style={selectorStyles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        SELECCIONAR CLIENTE
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={selectorStyles.row}>
          {clients.map((client) => {
            const isActive = client.id === selectedId;
            return (
              <Pressable
                key={client.id}
                onPress={() => onSelect(client.id)}
                style={[
                  selectorStyles.chip,
                  {
                    backgroundColor: isActive
                      ? theme.accent + '20'
                      : theme.backgroundElement,
                    borderColor: isActive ? theme.accent : 'transparent',
                  },
                ]}>
                <ThemedText
                  style={[
                    selectorStyles.chipText,
                    { color: isActive ? theme.accent : theme.text },
                  ]}>
                  {client.displayName.split(' ')[0]}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const selectorStyles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.one,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

// ─── Program View (shared between trainer and client) ────────────────────────

function ProgramView({ program }: { program: Program }) {
  const theme = useTheme();
  const weekScrollRef = useRef<ScrollView>(null);

  const workoutLogs = useWorkoutStore((s) => s.workoutLogs);
  const setWorkoutLogs = useWorkoutStore((s) => s.setWorkoutLogs);

  useEffect(() => {
    if (Object.keys(workoutLogs).length === 0) {
      setWorkoutLogs(generateAllWorkoutLogs(program));
    }
  }, [program, setWorkoutLogs]);

  const { totalWeeks, name, microcycle } = program;
  const days = microcycle.trainingDays;

  const currentWeek = getCurrentWeek(totalWeeks, days, workoutLogs);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const weekStatusMap = Object.fromEntries(
    weeks.map((w) => [w, getWeekStatus(w, days, workoutLogs)])
  );
  const completedCount = weeks.filter((w) => weekStatusMap[w] === 'completed').length;
  const progressRatio = completedCount / totalWeeks;

  useEffect(() => {
    const x = Math.max(0, (currentWeek - 2) * (CHIP_WIDTH + CHIP_GAP));
    weekScrollRef.current?.scrollTo({ x, animated: false });
  }, [currentWeek]);

  return (
    <>
      {/* Header info */}
      <ThemedText type="small" themeColor="textSecondary">
        {name} · {totalWeeks} semanas
      </ThemedText>

      {/* Week selector */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            SEMANAS
          </ThemedText>
          <View style={styles.progressLabel}>
            <View style={[styles.progressDot, { backgroundColor: theme.accent }]} />
            <ThemedText type="small" themeColor="textSecondary">
              {completedCount} de {totalWeeks} completadas
            </ThemedText>
          </View>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: theme.accent, width: `${progressRatio * 100}%` },
            ]}
          />
        </View>

        <ScrollView
          ref={weekScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekStrip}>
          {weeks.map((week) => (
            <WeekChip
              key={week}
              week={week}
              weekStatus={weekStatusMap[week]}
              isSelected={week === selectedWeek}
              isCurrent={week === currentWeek}
              onPress={() => setSelectedWeek(week)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Days for selected week */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            DÍAS — SEMANA {selectedWeek}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {days.length} días
          </ThemedText>
        </View>
        <View style={styles.daysList}>
          {days.map((day) => {
            const logKey = `${day.id}_w${selectedWeek}`;
            const status = workoutLogs[logKey]?.status ?? 'not_started';
            return <DayCard key={day.id} day={day} status={status} />;
          })}
        </View>
      </View>
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RutinaScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();

  // Client view
  const activeProgram = useActiveProgram();

  // Trainer view
  const assignedPrograms = useTrainerAssignedPrograms();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const trainerClients =
    user.role === 'trainer'
      ? user.clientIds
          .map((id) => MOCK_USERS_MAP[id])
          .filter((u): u is ClientProfile => u?.role === 'client')
      : [];

  // Auto-select first client for trainer
  useEffect(() => {
    if (user.role === 'trainer' && trainerClients.length > 0 && !selectedClientId) {
      setSelectedClientId(trainerClients[0].id);
    }
  }, [user.role, trainerClients.length]);

  const selectedClientProgram =
    user.role === 'trainer' && selectedClientId
      ? assignedPrograms.find((p) => p.clientId === selectedClientId) ?? null
      : null;

  const programToShow = user.role === 'client' ? activeProgram : selectedClientProgram;

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + Spacing.two,
            paddingBottom: BottomTabInset + Spacing.four,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <ThemedText type="title" style={styles.titleText}>
              {user.role === 'trainer' ? 'MIS ' : 'MI '}
            </ThemedText>
            <ThemedText type="title" style={[styles.titleText, { color: theme.accent }]}>
              {user.role === 'trainer' ? 'CLIENTES' : 'RUTINA'}
            </ThemedText>
          </View>
        </View>

        {/* Trainer: client selector */}
        {user.role === 'trainer' && (
          <ClientSelector
            clients={trainerClients}
            selectedId={selectedClientId}
            onSelect={(id) => {
              setSelectedClientId(id);
              // Clear workout logs to regenerate for new client
              useWorkoutStore.getState().clearAll();
            }}
          />
        )}

        {/* Program content */}
        {programToShow ? (
          <ProgramView key={programToShow.id} program={programToShow} />
        ) : (
          <View style={styles.emptyState}>
            <ThemedText themeColor="textSecondary">
              {user.role === 'client'
                ? 'No tenés un programa activo'
                : 'Seleccioná un cliente para ver su programa'}
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.three,
  },
  header: {
    gap: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titleText: {
    fontSize: 36,
    lineHeight: 38,
  },
  section: {
    gap: Spacing.two,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.one,
  },
  progressLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: Spacing.one,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  weekStrip: {
    flexDirection: 'row',
    gap: CHIP_GAP,
    paddingHorizontal: Spacing.one,
  },
  daysList: {
    gap: Spacing.two,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
});
