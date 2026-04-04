import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCurrentUser } from '@/stores/auth-store';
import { MOCK_USERS_MAP } from '@/data/mock-users';
import type { ClientProfile } from '@/types';
import { useScrollToTopOnFocus } from '@/hooks/use-scroll-to-top-on-focus';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProgresoScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const scrollRef = useScrollToTopOnFocus();

  // Trainer: client selector
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const trainerClients =
    user.role === 'trainer'
      ? user.clientIds
          .map((id) => MOCK_USERS_MAP[id])
          .filter((u): u is ClientProfile => u?.role === 'client')
      : [];

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + Spacing.two,
            paddingBottom: BottomTabInset + Spacing.four,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.titleRow}>
          <ThemedText type="title" style={styles.titleText}>MI </ThemedText>
          <ThemedText type="title" style={[styles.titleText, { color: theme.accent }]}>
            PROGRESO
          </ThemedText>
        </View>

        {/* Trainer: client picker */}
        {user.role === 'trainer' && (
          <View style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              SELECCIONAR CLIENTE
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                {trainerClients.map((client) => {
                  const isActive = client.id === selectedClientId;
                  return (
                    <Pressable
                      key={client.id}
                      onPress={() => setSelectedClientId(client.id)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isActive
                            ? theme.accent + '20'
                            : theme.backgroundElement,
                          borderColor: isActive ? theme.accent : 'transparent',
                        },
                      ]}>
                      <ThemedText
                        style={[
                          styles.chipText,
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
        )}

        {/* Placeholder */}
        <ThemedView type="backgroundElement" style={styles.placeholder}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            {user.role === 'trainer'
              ? selectedClientId
                ? `Progreso de ${MOCK_USERS_MAP[selectedClientId]?.displayName ?? 'cliente'}`
                : 'Seleccioná un cliente'
              : 'Tu progreso'}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={{ textAlign: 'center' }}>
            Próximamente: gráficos de volumen, cargas y frecuencia de entrenamiento
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    paddingHorizontal: Spacing.two,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.three,
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
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.two,
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
  placeholder: {
    borderRadius: 16,
    padding: Spacing.six,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
