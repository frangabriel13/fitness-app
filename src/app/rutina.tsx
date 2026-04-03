import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ClientSelector } from '@/components/rutina/client-selector';
import { ProgramView } from '@/components/rutina/program-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { MOCK_USERS_MAP } from '@/data/mock-users';
import { useTheme } from '@/hooks/use-theme';
import { useCurrentUser } from '@/stores/auth-store';
import { useActiveProgram, useTrainerAssignedPrograms } from '@/stores/program-store';
import { useWorkoutStore } from '@/stores/workout-store';
import { useScrollToTopOnFocus } from '@/hooks/use-scroll-to-top-on-focus';
import type { ClientProfile } from '@/types';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RutinaScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const scrollRef = useScrollToTopOnFocus();

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
        ref={scrollRef}
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
    paddingHorizontal: 8,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
});
