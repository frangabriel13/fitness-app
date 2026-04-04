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
            paddingTop: insets.top + Spacing.two,
            paddingBottom: BottomTabInset + Spacing.four,
          },
        ]}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <ThemedText type="title" style={styles.titleText}>MI </ThemedText>
            <ThemedText type="title" style={[styles.titleText, { color: theme.accent }]}>
              RUTINA
            </ThemedText>
          </View>
        </View>

        {/* Program content */}
        {activeProgram ? (
          <ProgramView key={activeProgram.id} program={activeProgram} />
        ) : (
          <View style={styles.emptyState}>
            <ThemedText themeColor="textSecondary">
              No tenés un programa activo
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
    paddingHorizontal: Spacing.two,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
  },
});
