import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function BuzonScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Buzón</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
