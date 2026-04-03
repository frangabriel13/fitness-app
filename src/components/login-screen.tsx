import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { MOCK_USERS } from '@/data/mock-users';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/auth-store';
import { useWorkoutStore } from '@/stores/workout-store';

export function LoginScreen() {
  const theme = useTheme();
  const login = useAuthStore((s) => s.login);
  const clearWorkouts = useWorkoutStore((s) => s.clearAll);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const trimmed = email.trim().toLowerCase();
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === trimmed);
    if (!user) {
      setError('No encontramos una cuenta con ese email.');
      return;
    }
    if (!password) {
      setError('Ingresá tu contraseña.');
      return;
    }
    clearWorkouts();
    login(user.id);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.logo}>
            FitCoach
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Entrenamiento personalizado
          </ThemedText>
        </View>

        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundElement,
                color: theme.text,
                borderColor: theme.backgroundSelected,
              },
            ]}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundElement,
                color: theme.text,
                borderColor: theme.backgroundSelected,
              },
            ]}
            placeholder="Contraseña"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError('');
            }}
            secureTextEntry
          />

          {error ? (
            <ThemedText type="small" style={styles.errorText}>
              {error}
            </ThemedText>
          ) : null}

          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 },
            ]}>
            <ThemedText style={[styles.buttonText, { color: theme.background }]}>
              Iniciar sesión
            </ThemedText>
          </Pressable>
        </View>

        {__DEV__ && (
          <View style={[styles.devHint, { borderColor: theme.backgroundSelected }]}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.devTitle}>
              CUENTAS DE PRUEBA
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              carlos@fitcoach.com — Trainer
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              ana.garcia@gmail.com — Cliente
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Contraseña: cualquiera
            </ThemedText>
          </View>
        )}
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  logo: {
    letterSpacing: -1,
  },
  form: {
    gap: Spacing.three,
  },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  errorText: {
    color: '#FF5252',
  },
  button: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  devHint: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  devTitle: {
    marginBottom: Spacing.one,
  },
});
