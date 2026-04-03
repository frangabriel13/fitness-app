import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ClientProfile } from '@/types';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export function ClientSelector({
  clients,
  selectedId,
  onSelect,
}: {
  clients: ClientProfile[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        SELECCIONAR CLIENTE
      </ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {clients.map((client) => {
            const isActive = client.id === selectedId;
            return (
              <Pressable
                key={client.id}
                onPress={() => onSelect(client.id)}
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
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.one,
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
});
