import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useTrainerAssignedPrograms } from '@/stores/program-store';
import type { ClientProfile, Program, TrainerProfile } from '@/types';
import { MOCK_USERS_MAP } from '@/data/mock-users';
import { Spacing } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

function ClientRow({ client, program }: { client: ClientProfile; program: Program | undefined }) {
  const theme = useTheme();
  return (
    <View style={[styles.clientRow, { backgroundColor: theme.backgroundSelected }]}>
      <View style={[styles.clientAvatar, { backgroundColor: theme.accent + '20' }]}>
        <ThemedText style={[styles.clientAvatarText, { color: theme.accent }]}>
          {client.displayName
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </ThemedText>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText style={{ fontWeight: '600', fontSize: 15 }}>
          {client.displayName}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {program ? `${program.name} · ${program.totalWeeks} sem` : 'Sin programa'}
        </ThemedText>
        {client.goal && (
          <ThemedText type="small" themeColor="textSecondary">
            Objetivo: {client.goal}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

export function TrainerProfileView({ trainer }: { trainer: TrainerProfile }) {
  const theme = useTheme();
  const assignedPrograms = useTrainerAssignedPrograms();

  const clients = trainer.clientIds
    .map((id) => MOCK_USERS_MAP[id])
    .filter((u): u is ClientProfile => u?.role === 'client');

  const programsByClient = Object.fromEntries(
    assignedPrograms.map((p) => [p.clientId, p])
  );

  return (
    <View style={styles.content}>
      {/* Avatar + name */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText style={styles.avatarText}>
            {trainer.displayName
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </ThemedText>
        </View>
        <ThemedText type="subtitle">{trainer.displayName}</ThemedText>
        <View style={[styles.rolePill, { backgroundColor: '#FF6B35' + '20' }]}>
          <ThemedText style={[styles.rolePillText, { color: '#FF6B35' }]}>
            Entrenador
          </ThemedText>
        </View>
      </View>

      {/* Bio */}
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.cardTitle}>
          BIOGRAFÍA
        </ThemedText>
        <ThemedText type="small">{trainer.biography}</ThemedText>
      </ThemedView>

      {/* Specialties */}
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.cardTitle}>
          ESPECIALIDADES
        </ThemedText>
        <View style={styles.specialtiesWrap}>
          {trainer.specialties.map((s) => (
            <View
              key={s}
              style={[styles.specialtyChip, { backgroundColor: theme.accent + '18' }]}>
              <ThemedText style={[styles.specialtyText, { color: theme.accent }]}>
                {s}
              </ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>

      {/* Invitation code */}
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.cardTitle}>
          CÓDIGO DE INVITACIÓN
        </ThemedText>
        <View style={[styles.codeBox, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText style={styles.codeText}>{trainer.invitationCode}</ThemedText>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          Compartí este código con tus clientes para que se vinculen
        </ThemedText>
      </ThemedView>

      {/* Clients list */}
      <ThemedView type="backgroundElement" style={styles.card}>
        <View style={styles.clientsHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            MIS CLIENTES
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {clients.length}
          </ThemedText>
        </View>
        <View style={styles.clientsList}>
          {clients.map((client) => (
            <ClientRow
              key={client.id}
              client={client}
              program={programsByClient[client.id]}
            />
          ))}
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.three,
  },
  avatarSection: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
  },
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rolePillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  cardTitle: {
    marginBottom: Spacing.one,
  },
  specialtiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  specialtyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  codeBox: {
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 12,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 4,
  },
  clientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  clientsList: {
    gap: 8,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
