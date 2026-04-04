import { ClientProfileView } from '@/components/perfil/client-profile-view';
import { TrainerProfileView } from '@/components/perfil/trainer-profile-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, RoleColors, Spacing } from '@/constants/theme';
import { useAuthStore, useCurrentUser } from '@/stores/auth-store';
import { useScrollToTopOnFocus } from '@/hooks/use-scroll-to-top-on-focus';
import { useTheme } from '@/hooks/use-theme';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PerfilScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);
  const scrollRef = useScrollToTopOnFocus();

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
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <ThemedText type="title" style={styles.titleText}>MI </ThemedText>
            <ThemedText type="title" style={[styles.titleText, { color: theme.accent }]}>
              PERFIL
            </ThemedText>
          </View>
        </View>

        {/* Role-specific content */}
        {user.role === 'trainer' ? (
          <TrainerProfileView trainer={user} />
        ) : (
          <ClientProfileView client={user} />
        )}

        {/* Logout */}
        <Pressable
          onPress={logout}
          style={({ pressed }) => [styles.logoutButton, { opacity: pressed ? 0.6 : 1 }]}>
          <ThemedText type="small" style={[styles.logoutText, { color: RoleColors.danger }]}>
            CERRAR SESIÓN
          </ThemedText>
        </Pressable>
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
  header: {
    marginBottom: Spacing.one,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titleText: {
    fontSize: 36,
    lineHeight: 38,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: Spacing.three,
  },
  logoutText: {
    letterSpacing: 1.5,
  },
});
