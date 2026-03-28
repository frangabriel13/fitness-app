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

**Universal fitness coaching app** built with Expo 55 (React Native 0.83 + React 19 + Web), targeting iOS, Android, and web from a single codebase. Trainers create exercise programs; clients log workouts against those programs.

### Routing
File-based routing via `expo-router`. All screens live in `src/app/`. The root layout (`src/app/_layout.tsx`) sets up the theme provider and tab navigation via `NativeTabs` (mobile) or custom `Tabs` (web). Two current tabs: Home (`index.tsx`) and Explore (`explore.tsx`).

### Theming
- Color palette, spacing scale, typography, and layout constants defined in `src/constants/theme.ts`
- Dark theme with hot pink accents — preserve this visual identity
- `useTheme()` hook (from `src/hooks/use-theme.ts`) returns the full Colors object for the current scheme
- `useColorScheme()` has platform-specific implementations (`.web.ts` variant handles hydration safety)
- Use `ThemedView` and `ThemedText` instead of raw React Native primitives so theming applies automatically
- `ThemedText` supports typed variants: `default`, `title`, `small`, `smallBold`, `subtitle`, `link`, `linkPrimary`, `code`

### Domain Model
- Types in `src/types/`: `program.ts` (Program, Microcycle, TrainingDay, Exercise) and `workout.ts` (WorkoutLog, SetLog, ActiveSession)
- **Program** → **Microcycle** → **TrainingDay[]** → **Exercise[]** (trainer-authored templates)
- **WorkoutLog** → **SetLog[]** (client-completed workout records, with status: `not_started` | `in_progress` | `completed`)
- **ActiveSession** tracks live workout state (current exercise/set, phase: `exercising` | `resting` | `completed`, rest timer)
- Helper functions in `src/utils/workout.ts`: `createEmptyWorkoutLog()`, `generateAllWorkoutLogs()`, `createActiveSession()`
- Mock data in `src/data/mock-program.ts` (temporary, will be replaced by backend)
- Units: weight in kg, effort tracked via RIR (Reps In Reserve)

### Components
- `src/components/ui/` — reusable UI building blocks
- Platform-specific variants use `.web.tsx` suffix (e.g., `app-tabs.tsx` vs `app-tabs.web.tsx`) — Expo resolves these automatically per platform
- Animations use `react-native-reanimated` (v4) and worklets — keep heavy animation logic in worklets

### Path Aliases
`@/*` maps to `./src/*` and `@/assets/*` maps to `./assets/*` — use these instead of relative imports.

### Experiments Enabled
`typedRoutes` and `reactCompiler` are enabled in `app.json`. Leverage typed route params and avoid patterns that break the React compiler (mutation of props, non-pure render functions).

### Key Constraints
- TypeScript strict mode is enabled
- Styling uses `StyleSheet.create()` — no Tailwind or CSS-in-JS libraries
- Platform branching: use `.web.tsx` file variants for web-specific behavior, `Platform.OS`/`Platform.select()` for inline checks
- `MaxContentWidth` (800px) and `BottomTabInset` (per-platform) constants in theme — use them for layout consistency
