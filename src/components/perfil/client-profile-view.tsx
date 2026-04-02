import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useActiveProgram } from '@/stores/program-store';
import type { ClientProfile, TrainerProfile } from '@/types';
import { MOCK_USERS_MAP } from '@/data/mock-users';
import { Spacing } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

function InfoRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={styles.infoRow}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
      <ThemedText style={{ fontSize: 15 }}>{value}</ThemedText>
    </View>
  );
}

export function ClientProfileView({ client }: { client: ClientProfile }) {
  const theme = useTheme();
  const activeProgram = useActiveProgram();
  const trainer = client.trainerId
    ? (MOCK_USERS_MAP[client.trainerId] as TrainerProfile | undefined)
    : null;

  return (
    <View style={styles.content}>
      {/* Avatar + name */}
      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText style={styles.avatarText}>
            {client.displayName
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </ThemedText>
        </View>
        <ThemedText type="subtitle">{client.displayName}</ThemedText>
        <View style={[styles.rolePill, { backgroundColor: '#4CAF50' + '20' }]}>
          <ThemedText style={[styles.rolePillText, { color: '#4CAF50' }]}>
            Cliente
          </ThemedText>
        </View>
      </View>

      {/* Personal info */}
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.cardTitle}>
          DATOS PERSONALES
        </ThemedText>
        <InfoRow label="Email" value={client.email} />
        <InfoRow label="Teléfono" value={client.phone} />
        <InfoRow label="Nacimiento" value={client.birthday} />
        {client.heightCm && <InfoRow label="Altura" value={`${client.heightCm} cm`} />}
        {client.weightKg && <InfoRow label="Peso" value={`${client.weightKg} kg`} />}
        {client.goal && <InfoRow label="Objetivo" value={client.goal} />}
      </ThemedView>

      {/* Trainer info */}
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.cardTitle}>
          MI ENTRENADOR
        </ThemedText>
        {trainer ? (
          <View style={styles.trainerRow}>
            <View style={[styles.trainerAvatar, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText style={{ fontWeight: '700', fontSize: 14 }}>
                {trainer.displayName
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </ThemedText>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText style={{ fontWeight: '600', fontSize: 15 }}>
                {trainer.displayName}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {trainer.specialties.join(' · ')}
              </ThemedText>
            </View>
          </View>
        ) : (
          <View style={styles.noTrainer}>
            <ThemedText themeColor="textSecondary">Sin entrenador vinculado</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Ingresa un código de invitación para vincularte
            </ThemedText>
          </View>
        )}
      </ThemedView>

      {/* Active program */}
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.cardTitle}>
          PROGRAMA ACTIVO
        </ThemedText>
        {activeProgram ? (
          <View style={styles.programInfo}>
            <ThemedText style={{ fontWeight: '600', fontSize: 15 }}>
              {activeProgram.name}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {activeProgram.totalWeeks} semanas ·{' '}
              {activeProgram.microcycle.daysPerWeek} días/semana
            </ThemedText>
          </View>
        ) : (
          <ThemedText themeColor="textSecondary">Sin programa activo</ThemedText>
        )}
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trainerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTrainer: {
    gap: 4,
  },
  programInfo: {
    gap: 4,
  },
});
