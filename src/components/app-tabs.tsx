import { FontAwesome6 } from '@expo/vector-icons';
import { Tabs, TabList, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FA6IconName = React.ComponentProps<typeof FontAwesome6>['name'];

interface TabButtonProps extends TabTriggerSlotProps {
  icon: FA6IconName;
  alwaysSolid?: boolean;
  label: string;
}

function TabButton({ icon, alwaysSolid, label, isFocused, ...props }: TabButtonProps) {
  const theme = useTheme();
  const color = isFocused ? theme.accent : theme.textSecondary;

  return (
    <Pressable {...props} style={styles.tabButton}>
      <FontAwesome6 name={icon} solid={alwaysSolid ?? isFocused} size={22} color={color} />
      <ThemedText type="small" themeColor={isFocused ? 'accent' : 'textSecondary'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function BottomTabBar({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.backgroundElement, paddingBottom: insets.bottom || Spacing.two }]}>
      <View style={styles.tabBarInner}>{children}</View>
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <BottomTabBar>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="house" label="Inicio" />
          </TabTrigger>
          <TabTrigger name="progreso" href="/progreso" asChild>
            <TabButton icon="chart-line" alwaysSolid label="Progreso" />
          </TabTrigger>
          <TabTrigger name="rutina" href="/rutina" asChild>
            <TabButton icon="dumbbell" alwaysSolid label="Rutina" />
          </TabTrigger>
          <TabTrigger name="perfil" href="/perfil" asChild>
            <TabButton icon="circle-user" label="Perfil" />
          </TabTrigger>
        </BottomTabBar>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128,128,128,0.2)',
  },
  tabBarInner: {
    flexDirection: 'row',
    paddingTop: Spacing.two,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.half,
    paddingVertical: Spacing.one,
  },
});
