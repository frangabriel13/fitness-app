import { FontAwesome6 } from '@expo/vector-icons';
import { Tabs, TabList, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FA6IconName = React.ComponentProps<typeof FontAwesome6>['name'];

interface TabButtonProps extends TabTriggerSlotProps {
  icon: FA6IconName;
  alwaysSolid?: boolean;
  label: string;
}

function triggerHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

const TabButton = React.memo(function TabButton({ icon, alwaysSolid, label, isFocused, onPress, ...props }: TabButtonProps) {
  const theme = useTheme();
  const color = isFocused ? theme.accent : theme.textSecondary;
  const pressed = useSharedValue(0);

  const tap = Gesture.Tap()
    .onBegin(() => {
      pressed.set(withTiming(1, { duration: 80 }));
    })
    .onFinalize(() => {
      pressed.set(withTiming(0, { duration: 150 }));
    })
    .onEnd(() => {
      runOnJS(triggerHaptic)();
      if (onPress) runOnJS(onPress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.get(), [0, 1], [1, 0.7]),
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View {...props} style={[styles.tabButton, animatedStyle]}>
        <FontAwesome6 name={icon} solid={alwaysSolid ?? isFocused} size={22} color={color} />
        <ThemedText type="small" style={{ color }}>
          {label}
        </ThemedText>
      </Animated.View>
    </GestureDetector>
  );
});

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
      <TabSlot style={styles.tabSlot} />
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
  tabSlot: {
    flex: 1,
  },
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
