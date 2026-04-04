/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0E0C18',
    background: '#F5F3FA',
    backgroundElement: '#EAE7F3',
    backgroundSelected: '#D8D3EA',
    textSecondary: '#6A6580',
    accent: '#009E8E',
    accentSubtle: '#5DD6C8',
  },
  dark: {
    text: '#F5F5F5',
    background: '#0A0A0A',
    backgroundElement: '#141414',
    backgroundSelected: '#1F1F1F',
    textSecondary: '#ABABAB',
    accent: '#00C9B1',
    accentSubtle: '#80E8DC',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
    /** Bebas Neue — display/titles */
    display: 'BebasNeue_400Regular',
    /** Inter Regular — body text */
    body: 'Inter_400Regular',
    /** Inter Bold — bold body text */
    bodyBold: 'Inter_700Bold',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    display: 'BebasNeue_400Regular',
    body: 'Inter_400Regular',
    bodyBold: 'Inter_700Bold',
  },
  web: {
    sans: 'var(--font-body)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
    display: 'var(--font-display)',
    body: 'var(--font-body)',
    bodyBold: 'var(--font-body)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

const INTER_WEIGHT_MAP = {
  '400': 'Inter_400Regular',
  '500': 'Inter_500Medium',
  '600': 'Inter_600SemiBold',
  '700': 'Inter_700Bold',
  '800': 'Inter_800ExtraBold',
  '900': 'Inter_900Black',
} as const;

/**
 * Returns the correct Inter fontFamily for a given weight.
 * On native: maps to the specific embedded font file.
 * On web: returns var(--font-body) — Inter Variable handles weight via CSS.
 */
export function interFont(weight: keyof typeof INTER_WEIGHT_MAP): string {
  if (Platform.OS === 'web') return 'var(--font-body)';
  return INTER_WEIGHT_MAP[weight];
}

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const RoleColors = {
  client: '#4CAF50',
  trainer: '#FF6B35',
  danger: '#E05252',
} as const;
