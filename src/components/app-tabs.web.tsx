import { FontAwesome6 } from '@expo/vector-icons';
import {
  TabList,
  TabListProps,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
  Tabs,
} from 'expo-router/ui';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FA6IconName = React.ComponentProps<typeof FontAwesome6>['name'];

interface TabButtonProps extends TabTriggerSlotProps {
  icon: FA6IconName;
  alwaysSolid?: boolean;
  label: string;
}

function getPressedStyle({ pressed }: { pressed: boolean }) {
  return pressed ? styles.pressed : undefined;
}

const TabButton = React.memo(function TabButton({ icon, alwaysSolid, label, isFocused, ...props }: TabButtonProps) {
  const theme = useTheme();
  const color = isFocused ? theme.accent : theme.textSecondary;

  return (
    <Pressable {...props} style={getPressedStyle}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <FontAwesome6 name={icon} solid={alwaysSolid ?? isFocused} size={14} color={color} />
        <ThemedText type="small" style={{ color }}>
          {label}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
});

function CustomTabList({ children }: TabListProps) {
  return (
    <View style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        {children}
      </ThemedView>
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={styles.tabSlot} />
      <TabList asChild>
        <CustomTabList>
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
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabSlot: {
    height: '100%',
  },
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
});
