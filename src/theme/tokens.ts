/**
 * WeUI Design Tokens for React Native
 *
 * Defines the complete set of design tokens following the WeUI design system,
 * including brand colors, semantic colors for light/dark modes, typography,
 * spacing, border radii, and component sizing.
 */

// ---------------------------------------------------------------------------
// Brand / Global Colors
// ---------------------------------------------------------------------------

export const brandColors = {
  /** WeChat signature green */
  brand: '#07c160',
  blue: '#10aeff',
  red: '#fa5151',
  orange: '#fa9d3b',
  yellow: '#ffc300',
  green: '#91d300',
  purple: '#6467f0',
  link: '#576b95',
} as const;

export type BrandColors = typeof brandColors;

// ---------------------------------------------------------------------------
// Semantic Colors (mode-dependent)
// ---------------------------------------------------------------------------

export interface SemanticColors {
  /** Primary page background */
  bg0: string;
  /** Secondary / card background */
  bg1: string;
  /** Elevated surface background */
  bg2: string;
  /** Tertiary background */
  bg3: string;
  /** Dark fill background */
  bg4: string;
  /** White / inverse background */
  bg5: string;

  /** Primary foreground / body text */
  fg0: string;
  /** Secondary text */
  fg1: string;
  /** Placeholder / disabled text */
  fg2: string;
  /** Very light foreground accent */
  fg3: string;
  /** Border / subtle divider color */
  fg4: string;
  /** Extremely subtle foreground */
  fg5: string;

  /** Line separator color */
  separator: string;
  /** Modal / overlay backdrop */
  overlay: string;
}

export const lightColors: SemanticColors = {
  bg0: '#ededed',
  bg1: '#f7f7f7',
  bg2: '#fff',
  bg3: '#f7f7f7',
  bg4: '#4c4c4c',
  bg5: '#fff',

  fg0: 'rgba(0,0,0,0.9)',
  fg1: 'rgba(0,0,0,0.55)',
  fg2: 'rgba(0,0,0,0.3)',
  fg3: 'rgba(0,0,0,0.1)',
  fg4: 'rgba(0,0,0,0.15)',
  fg5: 'rgba(0,0,0,0.05)',

  separator: 'rgba(0,0,0,0.1)',
  overlay: 'rgba(0,0,0,0.5)',
};

export const darkColors: SemanticColors = {
  bg0: '#111',
  bg1: '#1e1e1e',
  bg2: '#191919',
  bg3: '#202020',
  bg4: '#404040',
  bg5: '#2c2c2c',

  fg0: 'rgba(255,255,255,0.8)',
  fg1: 'rgba(255,255,255,0.5)',
  fg2: 'rgba(255,255,255,0.3)',
  fg3: 'rgba(255,255,255,0.1)',
  fg4: 'rgba(255,255,255,0.15)',
  fg5: 'rgba(255,255,255,0.05)',

  separator: 'rgba(255,255,255,0.05)',
  overlay: 'rgba(0,0,0,0.8)',
};

// ---------------------------------------------------------------------------
// Combined Color Palette (brand + semantic)
// ---------------------------------------------------------------------------

export interface ThemeColors extends SemanticColors {
  brand: string;
  blue: string;
  red: string;
  orange: string;
  yellow: string;
  green: string;
  purple: string;
  link: string;
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export interface FontSizes {
  /** 10 */
  xs: number;
  /** 12 */
  sm: number;
  /** 14 */
  md: number;
  /** 16 – base body size */
  base: number;
  /** 17 */
  lg: number;
  /** 20 */
  xl: number;
  /** 22 */
  xxl: number;
}

export interface LineHeights {
  /** 1.2 */
  tight: number;
  /** 1.4 */
  normal: number;
  /** 1.6 */
  relaxed: number;
}

export interface Typography {
  fontSizes: FontSizes;
  lineHeights: LineHeights;
}

export const fontSizes: FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 17,
  xl: 20,
  xxl: 22,
} as const;

export const lineHeights: LineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export const typography: Typography = {
  fontSizes,
  lineHeights,
} as const;

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

export interface Spacing {
  /** 0 */
  0: number;
  /** 4 */
  xs: number;
  /** 8 */
  sm: number;
  /** 12 */
  md: number;
  /** 16 */
  base: number;
  /** 20 */
  lg: number;
  /** 24 */
  xl: number;
  /** 32 */
  xxl: number;
}

export const spacing: Spacing = {
  0: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

// ---------------------------------------------------------------------------
// Border Radii
// ---------------------------------------------------------------------------

export interface BorderRadii {
  /** 4 */
  sm: number;
  /** 8 */
  md: number;
  /** 12 */
  lg: number;
  /** 16 */
  xl: number;
  /** 9999 – fully rounded / pill */
  full: number;
}

export const borderRadii: BorderRadii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// ---------------------------------------------------------------------------
// Component Sizes
// ---------------------------------------------------------------------------

export interface ButtonHeights {
  /** 48 – default full-width button */
  default: number;
  /** 40 */
  medium: number;
  /** 32 */
  small: number;
}

export const buttonHeights: ButtonHeights = {
  default: 48,
  medium: 40,
  small: 32,
} as const;

export interface Sizes {
  buttonHeights: ButtonHeights;
}

export const sizes: Sizes = {
  buttonHeights,
} as const;

// ---------------------------------------------------------------------------
// Aggregate Theme Type
// ---------------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  borderRadii: BorderRadii;
  sizes: Sizes;
}

// ---------------------------------------------------------------------------
// Theme Builders
// ---------------------------------------------------------------------------

function buildThemeColors(semantic: SemanticColors): ThemeColors {
  return {
    ...brandColors,
    ...semantic,
  };
}

export function buildTheme(mode: ThemeMode): Theme {
  const semantic = mode === 'dark' ? darkColors : lightColors;

  return {
    mode,
    colors: buildThemeColors(semantic),
    typography,
    spacing,
    borderRadii,
    sizes,
  };
}

export const lightTheme: Theme = buildTheme('light');
export const darkTheme: Theme = buildTheme('dark');
