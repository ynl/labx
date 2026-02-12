/**
 * WeUI Theme Provider for React Native
 *
 * Provides a React Context-based theming system with:
 * - Automatic detection of the system color scheme via `useColorScheme()`
 * - Manual override capability (`'light' | 'dark' | 'system'`)
 * - `useTheme()` hook returning the full resolved Theme object
 * - `useThemeMode()` hook returning the current effective mode and a setter
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import {
  buildTheme,
  lightTheme,
  type Theme,
  type ThemeMode,
} from './tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * `'system'` follows the OS color scheme; `'light'` / `'dark'` force a mode.
 */
export type ThemePreference = ThemeMode | 'system';

export interface ThemeContextValue {
  /** The fully-resolved theme object for the current mode. */
  theme: Theme;
  /** The effective mode after resolving `'system'`. */
  mode: ThemeMode;
  /** The raw preference that was set (`'light'`, `'dark'`, or `'system'`). */
  preference: ThemePreference;
  /** Update the theme preference. */
  setPreference: (pref: ThemePreference) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * Initial theme preference.
   * @default 'system'
   */
  defaultPreference?: ThemePreference;
}

export function ThemeProvider({
  children,
  defaultPreference = 'system',
}: ThemeProviderProps): React.JSX.Element {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [preference, setPreferenceState] = useState<ThemePreference>(defaultPreference);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
  }, []);

  const mode: ThemeMode = useMemo(() => {
    if (preference === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return preference;
  }, [preference, systemScheme]);

  const theme: Theme = useMemo(() => buildTheme(mode), [mode]);

  const value: ThemeContextValue = useMemo(
    () => ({ theme, mode, preference, setPreference }),
    [theme, mode, preference, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error(
      'useTheme / useThemeMode must be used within a <ThemeProvider>. ' +
        'Wrap your application root with <ThemeProvider>.',
    );
  }
  return ctx;
}

/**
 * Returns the fully-resolved `Theme` object for the current mode.
 *
 * @example
 * ```tsx
 * const theme = useTheme();
 * <View style={{ backgroundColor: theme.colors.bg0 }} />
 * ```
 */
export function useTheme(): Theme {
  return useThemeContext().theme;
}

/**
 * Returns the current effective theme mode and a setter to change it.
 *
 * @example
 * ```tsx
 * const { mode, preference, setPreference } = useThemeMode();
 * // Toggle between light and dark
 * setPreference(mode === 'light' ? 'dark' : 'light');
 * // Or follow the system
 * setPreference('system');
 * ```
 */
export function useThemeMode(): {
  /** The effective mode after resolving `'system'`. */
  mode: ThemeMode;
  /** The raw preference (`'light'`, `'dark'`, or `'system'`). */
  preference: ThemePreference;
  /** Update the theme preference. */
  setPreference: (pref: ThemePreference) => void;
} {
  const { mode, preference, setPreference } = useThemeContext();
  return { mode, preference, setPreference };
}

/**
 * Standalone helper for use outside of React components.
 * Returns the pre-built light theme (the default).
 * For dark, import `darkTheme` from `./tokens`.
 */
export { lightTheme, buildTheme } from './tokens';
