import { ThemedText } from '@/components/themed-text';
import { RoleColors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWorkoutStore } from '@/stores/workout-store';
import { useActiveProgram } from '@/stores/program-store';
import type { ClientProfile, TrainerProfile } from '@/types';
import { MOCK_USERS_MAP } from '@/data/mock-users';
import { getCurrentWeek } from '@/utils/workout';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ProfileAvatar } from './profile-avatar';
import { ProfileCard } from './profile-card';

function formatBirthday(iso: string): string {
  const date = new Date(iso + 'T00:00:00');
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

function MetricTile({ value, unit, label }: { value: string; unit: string; label: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.metricTile, { backgroundColor: theme.backgroundSelected }]}>
      <View style={styles.metricValueRow}>
        <ThemedText style={styles.metricValue}>{value}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">{unit}</ThemedText>
      </View>
      <ThemedText type="small" themeColor="textSecondary">{label}</ThemedText>
    </View>
  );
}

function TrainerCard({ trainerId }: { trainerId: string | null }) {
  const theme = useTheme();
  const [code, setCode] = useState('');
  const trainer = trainerId
    ? (MOCK_USERS_MAP[trainerId] as TrainerProfile | undefined)
    : null;

  if (trainer) {
    return (
      <View style={styles.trainerRow}>
        <ProfileAvatar displayName={trainer.displayName} photoUrl={trainer.photoUrl} size={44} />
        <View style={styles.trainerInfo}>
          <ThemedText style={styles.nameText}>{trainer.displayName}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {trainer.specialties.join(' · ')}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.noTrainerState}>
      <ThemedText themeColor="textSecondary">Sin entrenador vinculado</ThemedText>
      <View style={styles.linkRow}>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Código de invitación"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="characters"
          style={[
            styles.codeInput,
            { color: theme.text, backgroundColor: theme.backgroundSelected },
          ]}
        />
        <Pressable
          onPress={() =>
            Alert.alert('Próximamente', 'La vinculación con entrenadores estará disponible en breve.')
          }
          style={({ pressed }) => [
            styles.linkButton,
            { backgroundColor: theme.accent, opacity: pressed ? 0.7 : 1 },
          ]}>
          <ThemedText style={styles.linkButtonText}>Vincular</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

export function ClientProfileView({ client }: { client: ClientProfile }) {
  const router = useRouter();
  const activeProgram = useActiveProgram();
  const workoutLogs = useWorkoutStore((s) => s.workoutLogs);

  const currentWeek = activeProgram
    ? getCurrentWeek(
        activeProgram.totalWeeks,
        activeProgram.microcycle.trainingDays,
        workoutLogs
      )
    : null;

  return (
    <View style={styles.content}>
      {/* Avatar + name */}
      <View style={styles.avatarSection}>
        <ProfileAvatar displayName={client.displayName} photoUrl={client.photoUrl} size={80} />
        <ThemedText type="subtitle">{client.displayName}</ThemedText>
        <View style={[styles.rolePill, { backgroundColor: RoleColors.client + '20' }]}>
          <ThemedText style={[styles.rolePillText, { color: RoleColors.client }]}>
            Cliente
          </ThemedText>
        </View>
      </View>

      {/* Personal info */}
      <ProfileCard title="DATOS PERSONALES">
        {(client.heightCm || client.weightKg) && (
          <View style={styles.metricsRow}>
            {client.heightCm && (
              <MetricTile value={String(client.heightCm)} unit="cm" label="Altura" />
            )}
            {client.weightKg && (
              <MetricTile value={String(client.weightKg)} unit="kg" label="Peso" />
            )}
          </View>
        )}
        <InfoRow label="Email" value={client.email} />
        <InfoRow label="Teléfono" value={client.phone} />
        <InfoRow label="Nacimiento" value={formatBirthday(client.birthday)} />
        {client.goal && <InfoRow label="Objetivo" value={client.goal} />}
      </ProfileCard>

      {/* Trainer info */}
      <ProfileCard title="MI ENTRENADOR">
        <TrainerCard trainerId={client.trainerId} />
      </ProfileCard>

      {/* Active program */}
      <ProfileCard title="PROGRAMA ACTIVO">
        {activeProgram ? (
          <Pressable
            onPress={() => router.push('/rutina')}
            style={({ pressed }) => [styles.programInfo, { opacity: pressed ? 0.7 : 1 }]}>
            <View style={styles.programHeader}>
              <ThemedText style={styles.nameText}>{activeProgram.name}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">→</ThemedText>
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              Semana {currentWeek} de {activeProgram.totalWeeks} ·{' '}
              {activeProgram.microcycle.daysPerWeek} días/semana
            </ThemedText>
          </Pressable>
        ) : (
          <ThemedText themeColor="textSecondary">Sin programa activo</ThemedText>
        )}
      </ProfileCard>
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
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  metricTile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: 12,
    gap: Spacing.half,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 15,
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trainerInfo: {
    flex: 1,
    gap: Spacing.half,
  },
  nameText: {
    fontWeight: '600',
    fontSize: 15,
  },
  noTrainerState: {
    gap: Spacing.two,
  },
  linkRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  codeInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: Spacing.two,
    fontSize: 15,
    letterSpacing: 1,
  },
  linkButton: {
    height: 40,
    paddingHorizontal: Spacing.three,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  programInfo: {
    gap: Spacing.half,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
