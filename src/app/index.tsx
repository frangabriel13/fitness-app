import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCurrentUser } from '@/stores/auth-store';
import { useActiveProgram, useTrainerAssignedPrograms } from '@/stores/program-store';
import { MOCK_USERS_MAP } from '@/data/mock-users';
import type { ClientProfile } from '@/types';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  const theme = useTheme();
  return (
    <ThemedView type="backgroundElement" style={statStyles.card}>
      <ThemedText
        style={[statStyles.value, { color: color ?? theme.accent }]}>
        {value}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </ThemedView>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: Spacing.three,
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
  },
});

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: BottomTabInset + Spacing.four,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <ThemedText type="small" themeColor="textSecondary">
            {getGreeting()}
          </ThemedText>
          <View style={styles.nameRow}>
            <ThemedText type="subtitle">{user.displayName.split(' ')[0]}</ThemedText>
            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor:
                    user.role === 'trainer' ? '#FF6B35' + '20' : '#4CAF50' + '20',
                },
              ]}>
              <ThemedText
                style={[
                  styles.roleBadgeText,
                  {
                    color: user.role === 'trainer' ? '#FF6B35' : '#4CAF50',
                  },
                ]}>
                {user.role === 'trainer' ? 'Entrenador' : 'Cliente'}
              </ThemedText>
            </View>
          </View>
        </View>

        {user.role === 'client' ? (
          <ClientHome client={user} />
        ) : (
          <TrainerHome />
        )}
      </ScrollView>
    </ThemedView>
  );
}

function ClientHome({ client }: { client: ClientProfile }) {
  const theme = useTheme();
  const activeProgram = useActiveProgram();

  return (
    <>
      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard
          label="Programa"
          value={activeProgram ? activeProgram.name.slice(0, 8) : '—'}
        />
        <StatCard
          label="Semanas"
          value={activeProgram ? String(activeProgram.totalWeeks) : '—'}
        />
        <StatCard
          label="Días/sem"
          value={
            activeProgram
              ? String(activeProgram.microcycle.daysPerWeek)
              : '—'
          }
        />
      </View>

      {/* Program card */}
      {activeProgram && (
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            PROGRAMA ACTIVO
          </ThemedText>
          <ThemedText style={{ fontWeight: '600', fontSize: 18 }}>
            {activeProgram.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {activeProgram.totalWeeks} semanas ·{' '}
            {activeProgram.microcycle.daysPerWeek} días por semana ·{' '}
            {activeProgram.microcycle.trainingDays.reduce(
              (acc, d) => acc + d.exercises.length,
              0
            )}{' '}
            ejercicios totales
          </ThemedText>
        </ThemedView>
      )}

      {/* Trainer info */}
      {client.trainerId && (
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            MI ENTRENADOR
          </ThemedText>
          <ThemedText style={{ fontWeight: '600', fontSize: 15 }}>
            {MOCK_USERS_MAP[client.trainerId]?.displayName ?? 'Desconocido'}
          </ThemedText>
        </ThemedView>
      )}

      {!client.trainerId && (
        <ThemedView type="backgroundElement" style={styles.card}>
          <ThemedText themeColor="textSecondary">
            No estás vinculado a un entrenador
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Pedí un código de invitación a tu entrenador para vincularte
          </ThemedText>
        </ThemedView>
      )}
    </>
  );
}

function TrainerHome() {
  const theme = useTheme();
  const user = useCurrentUser();
  const assignedPrograms = useTrainerAssignedPrograms();

  const clients =
    user.role === 'trainer'
      ? user.clientIds
          .map((id) => MOCK_USERS_MAP[id])
          .filter((u): u is ClientProfile => u?.role === 'client')
      : [];

  return (
    <>
      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard label="Clientes" value={String(clients.length)} />
        <StatCard label="Programas" value={String(assignedPrograms.length)} />
        <StatCard label="Templates" value="1" />
      </View>

      {/* Recent clients */}
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          ACTIVIDAD RECIENTE
        </ThemedText>
        {clients.map((client) => {
          const program = assignedPrograms.find((p) => p.clientId === client.id);
          return (
            <View key={client.id} style={styles.activityRow}>
              <View
                style={[
                  styles.activityDot,
                  { backgroundColor: theme.accent },
                ]}
              />
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontWeight: '600', fontSize: 14 }}>
                  {client.displayName}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {program ? program.name : 'Sin programa'}
                  {client.goal ? ` · ${client.goal}` : ''}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </ThemedView>
    </>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
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
  greeting: {
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
