import { ClientProfileView } from '@/components/perfil/client-profile-view';
import { TrainerProfileView } from '@/components/perfil/trainer-profile-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useCurrentUser } from '@/stores/auth-store';
import { useScrollToTopOnFocus } from '@/hooks/use-scroll-to-top-on-focus';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PerfilScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const user = useCurrentUser();
  const scrollRef = useScrollToTopOnFocus();

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: BottomTabInset + Spacing.four,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.titleText}>MI </ThemedText>
          <ThemedText type="title" style={[styles.titleText, { color: theme.accent }]}>
            PERFIL
          </ThemedText>
        </View>

        {/* Role-specific content */}
        {user.role === 'trainer' ? (
          <TrainerProfileView trainer={user} />
        ) : (
          <ClientProfileView client={user} />
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
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titleText: {
    fontSize: 36,
    lineHeight: 38,
  },
});
