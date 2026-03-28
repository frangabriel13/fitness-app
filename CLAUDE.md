# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in browser
npm run lint       # ESLint via Expo config
```

## Architecture

**Universal app** built with Expo (React Native + Web), targeting iOS, Android, and web from a single codebase.

### Routing
File-based routing via `expo-router`. All screens live in `src/app/`. The root layout (`src/app/_layout.tsx`) sets up the theme provider and tab navigation. Two current tabs: Home (`index.tsx`) and Explore (`explore.tsx`).

### Theming
- Color palette and spacing scale defined in `src/constants/theme.ts`
- Dark theme with hot pink accents — preserve this visual identity
- `useColorScheme()` hook drives light/dark switching
- Use `ThemedView` and `ThemedText` instead of raw React Native primitives so theming applies automatically

### Components
- `src/components/ui/` — reusable UI building blocks
- Platform-specific variants use `.web.tsx` suffix (e.g., `app-tabs.tsx` vs `app-tabs.web.tsx`)
- Animations use `react-native-reanimated` (v4) and worklets — keep heavy animation logic in worklets

### Path Aliases
`@/*` maps to `./src/*` and `@/assets/*` maps to `./assets/*` — use these instead of relative imports.

### Experiments Enabled
`typedRoutes` and `reactCompiler` are enabled in `app.json`. Leverage typed route params and avoid patterns that break the React compiler (mutation of props, non-pure render functions).
