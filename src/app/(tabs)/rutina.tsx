import { ProgramView } from '@/components/rutina/program-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useScrollToTopOnFocus } from '@/hooks/use-scroll-to-top-on-focus';
import { useTheme } from '@/hooks/use-theme';
import { useActiveProgram } from '@/stores/program-store';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RutinaScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useScrollToTopOnFocus();
  const activeProgram = useActiveProgram();

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
        ref={scrollRef}
        showsVerticalScrollIndicator={false}>
        {/* Header — editorial, magazine-style */}
        <View style={styles.header}>
          <ThemedText style={styles.overline} themeColor="textSecondary">
            MI
          </ThemedText>
          <ThemedText style={[styles.heroTitle, { color: theme.text }]}>
            RUTINA
          </ThemedText>
          <View style={[styles.accentStripe, { backgroundColor: theme.accent }]} />
        </View>

        {/* Program content */}
        {activeProgram ? (
          <ProgramView key={activeProgram.id} program={activeProgram} />
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyIcon} themeColor="textSecondary">
              ○
            </ThemedText>
            <ThemedText style={styles.emptyText} themeColor="textSecondary">
              Sin programa activo
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
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: Spacing.five,
  },
  overline: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 46,
  },
  accentStripe: {
    width: 36,
    height: 3,
    borderRadius: 2,
    marginTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
