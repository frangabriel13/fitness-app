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
File-based routing via `expo-router`. All screens live in `src/app/`. The root layout (`src/app/_layout.tsx`) sets up the theme provider, the animated splash overlay, and tab navigation via platform-specific `AppTabs` (`app-tabs.tsx` native / `app-tabs.web.tsx` web).

Four tabs:
- `index.tsx` — Home (stats dashboard, varies by role)
- `rutina.tsx` — Routine (program view; trainer gets client selector first)
- `progreso.tsx` — Progress (trainer gets client selector first)
- `perfil.tsx` — Profile (`ClientProfileView` or `TrainerProfileView`)

### Dual-Role Architecture
The app is fully dual-role. Every screen branches on the authenticated user's role:
- **Trainer**: has `clientIds[]`, creates program templates (`type: 'template'`), assigns them to clients (`type: 'assigned'`), has `invitationCode`
- **Client**: has single `activeProgramId`, linked to trainer via `trainerId`

Role-specific selector hooks (`useIsTrainer()`, `useTrainerProfile()`, `useClientProfile()`) are in the auth store. `useTrainerProfile()` / `useClientProfile()` throw if the role doesn't match — only call them after a role check.

### State Management
Three Zustand stores, all persisted to MMKV via `src/store/mmkv-storage.ts` (synchronous, ~30× faster than AsyncStorage):

- **`auth-store.ts`** — current user session. Key selectors: `useCurrentUser()`, `useIsTrainer()`, `useIsClient()`
- **`program-store.ts`** — program templates and client assignments. Key selectors: `useActiveProgram()`, `useTrainerTemplates()`, `useTrainerAssignedPrograms()`
- **`workout-store.ts`** — `WorkoutLog` map and `ActiveSession`. Logs are keyed `{trainingDayId}_w{weekNumber}` (e.g. `"day_001_w1"`)

### Theming
- Color palette, spacing scale, typography, and layout constants in `src/constants/theme.ts`
- Dark theme — preserve this visual identity
- `useTheme()` (from `src/hooks/use-theme.ts`) returns the full `Colors` object
- `useColorScheme()` has a `.web.ts` variant for hydration safety
- Use `ThemedView` and `ThemedText` instead of raw RN primitives
  - `ThemedText` variants: `default`, `title`, `small`, `smallBold`, `subtitle`, `link`, `linkPrimary`, `code`
  - `ThemedView` accepts any `ThemeColor` key as `type`: `background`, `backgroundElement`, `backgroundSelected`, `text`, `textSecondary`, `accent`, `accentSubtle`
- Spacing scale: `half:2, one:4, two:8, three:16, four:24, five:32, six:64`

### Domain Model
- Types in `src/types/`: `program.ts` and `workout.ts`
- **Program** → **Microcycle** → **TrainingDay[]** → **Exercise[]**
- **WorkoutLog** → **SetLog[]** (status: `not_started` | `in_progress` | `completed`)
- **ActiveSession** tracks live state (current exercise/set index, phase: `exercising` | `resting` | `completed`, rest timer)
- Utilities in `src/utils/workout.ts`: `createEmptyWorkoutLog()`, `generateAllWorkoutLogs()`, `createActiveSession()`, `getWeekStatus()`, `getCurrentWeek()`
- Mock data in `src/data/`: `mock-program.ts` (programs) and `mock-users.ts` (1 trainer + 4 clients, default view is `user_client_002`)
- Units: weight in kg, effort via RIR (Reps In Reserve)

### Components
- `src/components/ui/` — reusable primitives
- `src/components/rutina/` — `day-card.tsx`, `week-chip.tsx`
- `src/components/perfil/` — `client-profile-view.tsx`, `trainer-profile-view.tsx`
- `src/components/dev/role-switcher.tsx` — floating FAB + modal for switching mock users; only rendered in `__DEV__`, clears workout state on switch
- Platform-specific variants use `.web.tsx` suffix — Expo resolves these automatically
- Icons: `FontAwesome6` from `@expo/vector-icons`; `SymbolView` from `expo-symbols` for platform-adaptive icons (SF Symbols on iOS, Material on Android)
- Animations: `react-native-reanimated` v4, `Keyframe` API, `Easing.elastic()`, worklet callbacks via `scheduleOnRN`

### Path Aliases
`@/*` → `./src/*` and `@/assets/*` → `./assets/*` — use these instead of relative imports.

### Experiments Enabled
`typedRoutes` and `reactCompiler` are enabled in `app.json`. Avoid patterns that break the React compiler (prop mutation, non-pure render functions).

### Key Constraints
- TypeScript strict mode
- Styling uses `StyleSheet.create()` — no Tailwind or CSS-in-JS
- Platform branching: `.web.tsx` file variants for web-specific behavior, `Platform.OS`/`Platform.select()` for inline checks
- `MaxContentWidth` (800px) and `BottomTabInset` (`ios:50, android:80`) from theme — use them for layout consistency
