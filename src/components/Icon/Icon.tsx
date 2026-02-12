import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IconType =
  | 'success'
  | 'success-no-circle'
  | 'info'
  | 'warn'
  | 'waiting'
  | 'cancel'
  | 'download'
  | 'search'
  | 'clear';

export interface IconProps {
  /** The icon variant to display. */
  type: IconType;
  /**
   * The overall size of the icon in density-independent pixels.
   * @default 24
   */
  size?: number;
  /**
   * Optional colour override. When omitted the default WeUI colour for the
   * given `type` is used.
   */
  color?: string;
  /** Extra styles applied to the outermost wrapper `View`. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the default background / accent colour for a given icon type based
 * on the current theme.
 */
function useIconColor(type: IconType, colorOverride?: string): string {
  const theme = useTheme();

  if (colorOverride) return colorOverride;

  const map: Record<IconType, string> = {
    success: theme.colors.brand,       // green  #07c160
    'success-no-circle': theme.colors.brand,
    info: theme.colors.blue,           // blue   #10aeff
    warn: theme.colors.orange,         // orange #fa9d3b
    waiting: theme.colors.blue,        // blue   #10aeff
    cancel: theme.colors.red,          // red    #fa5151
    download: theme.colors.brand,      // green  #07c160
    search: theme.colors.fg2,          // muted foreground
    clear: theme.colors.fg2,           // muted foreground
  };

  return map[type];
}

/**
 * The inner glyph character used for each icon type.  Using Unicode characters
 * keeps the component dependency-free (no SVG library required).
 */
const GLYPH_MAP: Record<IconType, string> = {
  success: '\u2713',            // checkmark ✓
  'success-no-circle': '\u2713',
  info: 'i',
  warn: '!',
  waiting: '\u25F4',            // ◴  clock-like quarter-circle
  cancel: '\u2715',             // ✕
  download: '\u2193',           // ↓
  search: '\u2315',             // ⌕
  clear: '\u2715',              // ✕
};

/**
 * Whether the icon type renders with a filled circular background.
 */
function hasCircle(type: IconType): boolean {
  switch (type) {
    case 'success-no-circle':
    case 'download':
    case 'search':
      return false;
    default:
      return true;
  }
}

/**
 * The warn icon uses a triangle shape rather than a circle.
 */
function isTriangle(type: IconType): boolean {
  return type === 'warn';
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface CircleIconProps {
  size: number;
  bgColor: string;
  glyph: string;
  glyphColor: string;
  glyphSize: number;
}

/** A filled circle with a centred glyph character. */
const CircleIcon: React.FC<CircleIconProps> = ({
  size,
  bgColor,
  glyph,
  glyphColor,
  glyphSize,
}) => (
  <View
    style={[
      styles.circleBase,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
      },
    ]}
  >
    <Text
      style={[
        styles.glyphText,
        {
          color: glyphColor,
          fontSize: glyphSize,
          lineHeight: size,
        },
      ]}
      allowFontScaling={false}
    >
      {glyph}
    </Text>
  </View>
);

interface TriangleIconProps {
  size: number;
  bgColor: string;
  glyph: string;
  glyphColor: string;
  glyphSize: number;
}

/**
 * A triangle shape built with CSS border tricks.  The exclamation mark glyph
 * is overlaid near the bottom-center of the triangle.
 */
const TriangleIcon: React.FC<TriangleIconProps> = ({
  size,
  bgColor,
  glyph,
  glyphColor,
  glyphSize,
}) => {
  const triangleHeight = size;
  const triangleBase = size;

  return (
    <View
      style={[
        styles.triangleWrapper,
        { width: triangleBase, height: triangleHeight },
      ]}
    >
      {/* Triangle drawn with borders */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: triangleBase / 2,
          borderRightWidth: triangleBase / 2,
          borderBottomWidth: triangleHeight,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: bgColor,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      {/* Glyph overlaid on triangle, positioned toward the bottom-center so
          it sits visually inside the triangle body. */}
      <Text
        style={[
          styles.glyphText,
          {
            color: glyphColor,
            fontSize: glyphSize,
            lineHeight: glyphSize * 1.2,
            position: 'absolute',
            bottom: triangleHeight * 0.12,
            alignSelf: 'center',
          },
        ]}
        allowFontScaling={false}
      >
        {glyph}
      </Text>
    </View>
  );
};

interface BareGlyphProps {
  size: number;
  color: string;
  glyph: string;
}

/** A glyph character rendered without any surrounding shape. */
const BareGlyph: React.FC<BareGlyphProps> = ({ size, color, glyph }) => (
  <View style={[styles.bareWrapper, { width: size, height: size }]}>
    <Text
      style={[
        styles.glyphText,
        {
          color,
          fontSize: size * 0.85,
          lineHeight: size,
        },
      ]}
      allowFontScaling={false}
    >
      {glyph}
    </Text>
  </View>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const Icon: React.FC<IconProps> = ({ type, size = 24, color, style }) => {
  const resolvedColor = useIconColor(type, color);
  const glyph = GLYPH_MAP[type];

  const content = (() => {
    if (isTriangle(type)) {
      return (
        <TriangleIcon
          size={size}
          bgColor={resolvedColor}
          glyph={glyph}
          glyphColor="#FFFFFF"
          glyphSize={size * 0.45}
        />
      );
    }

    if (hasCircle(type)) {
      return (
        <CircleIcon
          size={size}
          bgColor={resolvedColor}
          glyph={glyph}
          glyphColor="#FFFFFF"
          glyphSize={size * 0.55}
        />
      );
    }

    // Bare glyph (no circle)
    return <BareGlyph size={size} color={resolvedColor} glyph={glyph} />;
  })();

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {content}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBase: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glyphText: {
    textAlign: 'center',
    fontWeight: '700',
    includeFontPadding: false, // Android: remove extra padding
    textAlignVertical: 'center', // Android: vertically centre text
  },
  triangleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  bareWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Icon;
