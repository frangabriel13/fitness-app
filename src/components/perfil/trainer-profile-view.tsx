import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useTrainerAssignedPrograms } from '@/stores/program-store';
import type { ClientProfile, Program, TrainerProfile } from '@/types';
import { MOCK_USERS_MAP } from '@/data/mock-users';
import { RoleColors, Spacing } from '@/constants/theme';
import { Pressable, Share, StyleSheet, View } from 'react-native';
import { ProfileAvatar } from './profile-avatar';
import { ProfileCard } from './profile-card';

function ClientRow({ client, program }: { client: ClientProfile; program: Program | undefined }) {
  const theme = useTheme();
  return (
    <View style={styles.clientRow}>
      <ProfileAvatar
        displayName={client.displayName}
        photoUrl={client.photoUrl}
        size={40}
        backgroundColor={theme.accent + '20'}
        textColor={theme.accent}
      />
      <View style={styles.clientInfo}>
        <ThemedText style={styles.clientName}>{client.displayName}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {program ? `${program.name} · ${program.totalWeeks} sem` : 'Sin programa'}
        </ThemedText>
        {client.goal && (
          <ThemedText type="small" themeColor="textSecondary">{client.goal}</ThemedText>
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

  const handleShareCode = () => {
    Share.share({
      message: `Te invito a entrenar conmigo. Ingresá el código ${trainer.invitationCode} en la app para vincularte.`,
    });
  };

  return (
    <View style={styles.content}>
      {/* Avatar + name */}
      <View style={styles.avatarSection}>
        <ProfileAvatar displayName={trainer.displayName} photoUrl={trainer.photoUrl} size={80} />
        <ThemedText type="subtitle">{trainer.displayName}</ThemedText>
        <View style={[styles.rolePill, { backgroundColor: RoleColors.trainer + '20' }]}>
          <ThemedText style={[styles.rolePillText, { color: RoleColors.trainer }]}>
            Entrenador
          </ThemedText>
        </View>
      </View>

      {/* Bio */}
      <ProfileCard title="BIOGRAFÍA">
        <ThemedText type="small">{trainer.biography}</ThemedText>
      </ProfileCard>

      {/* Specialties */}
      <ProfileCard title="ESPECIALIDADES">
        <View style={styles.specialtiesWrap}>
          {trainer.specialties.map((s) => (
            <View key={s} style={[styles.specialtyChip, { backgroundColor: theme.accent + '18' }]}>
              <ThemedText style={[styles.specialtyText, { color: theme.accent }]}>{s}</ThemedText>
            </View>
          ))}
        </View>
      </ProfileCard>

      {/* Invitation code */}
      <ProfileCard title="CÓDIGO DE INVITACIÓN">
        <View style={[styles.codeBox, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText style={styles.codeText}>{trainer.invitationCode}</ThemedText>
        </View>
        <Pressable
          onPress={handleShareCode}
          style={({ pressed }) => [
            styles.shareButton,
            { backgroundColor: theme.accent + '15', opacity: pressed ? 0.7 : 1 },
          ]}>
          <ThemedText style={[styles.shareButtonText, { color: theme.accent }]}>
            Compartir código
          </ThemedText>
        </Pressable>
      </ProfileCard>

      {/* Clients list */}
      <ThemedView type="backgroundElement" style={styles.clientsCard}>
        <View style={styles.clientsHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">MIS CLIENTES</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">{clients.length}</ThemedText>
        </View>
        <View style={styles.clientsList}>
          {clients.map((client, index) => (
            <View key={client.id}>
              {index > 0 && (
                <View style={[styles.separator, { backgroundColor: theme.backgroundSelected }]} />
              )}
              <ClientRow client={client} program={programsByClient[client.id]} />
            </View>
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
  rolePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rolePillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  specialtiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  specialtyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
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
  shareButton: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: 12,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clientsCard: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  clientsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  clientsList: {
    gap: 0,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  separator: {
    height: 1,
  },
  clientInfo: {
    flex: 1,
    gap: Spacing.half,
  },
  clientName: {
    fontWeight: '600',
    fontSize: 15,
  },
});
