/**
 * WeUI Theme System – Public API
 *
 * Re-exports every token, type, provider, and hook needed to theme a
 * React Native application with the WeUI design system.
 */

// ---------------------------------------------------------------------------
// Design Tokens & Types
// ---------------------------------------------------------------------------

export {
  // Brand / global colors
  brandColors,
  // Semantic color palettes
  lightColors,
  darkColors,
  // Typography
  fontSizes,
  lineHeights,
  typography,
  // Spacing
  spacing,
  // Border radii
  borderRadii,
  // Component sizes
  buttonHeights,
  sizes,
  // Pre-built theme objects
  lightTheme,
  darkTheme,
  // Theme builder
  buildTheme,
} from './tokens';

export type {
  BrandColors,
  SemanticColors,
  ThemeColors,
  FontSizes,
  LineHeights,
  Typography,
  Spacing,
  BorderRadii,
  ButtonHeights,
  Sizes,
  ThemeMode,
  Theme,
} from './tokens';

// ---------------------------------------------------------------------------
// Provider & Hooks
// ---------------------------------------------------------------------------

export {
  ThemeProvider,
  useTheme,
  useThemeMode,
} from './ThemeProvider';

export type {
  ThemePreference,
  ThemeContextValue,
  ThemeProviderProps,
} from './ThemeProvider';
