import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { LoginScreen } from '@/components/login-screen';
import { useAuthStore } from '@/stores/auth-store';

function AppContent() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  if (!isLoggedIn) return <LoginScreen />;
  return (
    <>
      <AnimatedSplashOverlay />
      <AppTabs />
    </>
  );
}

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
