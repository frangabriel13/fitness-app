import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { DevRoleSwitcher } from '@/components/dev/role-switcher';

export default function TabLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
      {__DEV__ && <DevRoleSwitcher />}
    </ThemeProvider>
  );
}
