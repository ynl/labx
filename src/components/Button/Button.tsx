import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import type { Theme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ButtonProps {
  /** Visual style of the button. @default 'default' */
  type?: 'primary' | 'default' | 'warn';
  /** Size preset. @default 'default' */
  size?: 'default' | 'medium' | 'small';
  /** Outlined variant – border only, transparent background. */
  plain?: boolean;
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Show a loading spinner and disable interaction. */
  loading?: boolean;
  /** Full-width cell style without border radius. */
  cell?: boolean;
  /** Button label / contents. */
  children?: React.ReactNode;
  /** Press handler. */
  onPress?: () => void;
  /** Extra styles applied to the outer pressable wrapper. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Style helpers
// ---------------------------------------------------------------------------

/**
 * Resolves the background and text colour for the current button variant
 * using theme tokens, supporting normal / plain / disabled states.
 */
function useButtonColors(
  theme: Theme,
  type: NonNullable<ButtonProps['type']>,
  plain: boolean,
  disabled: boolean,
) {
  return useMemo(() => {
    // --- Plain variant (outlined) ---
    if (plain) {
      const borderMap: Record<string, string> = {
        primary: theme.colors.brand,
        default: theme.colors.fg4,
        warn: theme.colors.red,
      };
      const textMap: Record<string, string> = {
        primary: theme.colors.brand,
        default: theme.colors.fg0,
        warn: theme.colors.red,
      };
      return {
        backgroundColor: 'transparent',
        borderColor: disabled ? theme.colors.fg4 : borderMap[type],
        textColor: disabled ? theme.colors.fg2 : textMap[type],
        spinnerColor: disabled ? theme.colors.fg2 : textMap[type],
      };
    }

    // --- Filled variant ---
    const bgMap: Record<string, string> = {
      primary: theme.colors.brand,   // #07c160
      default: theme.colors.bg1,     // light gray
      warn: theme.colors.red,        // #fa5151
    };
    const fgMap: Record<string, string> = {
      primary: '#FFFFFF',
      default: theme.colors.fg0,
      warn: '#FFFFFF',
    };

    return {
      backgroundColor: bgMap[type],
      borderColor: 'transparent',
      textColor: disabled ? theme.colors.fg2 : fgMap[type],
      spinnerColor: disabled ? theme.colors.fg2 : fgMap[type],
    };
  }, [theme, type, plain, disabled]);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Button: React.FC<ButtonProps> = ({
  type = 'default',
  size = 'default',
  plain = false,
  disabled = false,
  loading = false,
  cell = false,
  children,
  onPress,
  style,
}) => {
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const colors = useButtonColors(theme, type, plain, isDisabled);

  // Size-dependent metrics
  const height = theme.sizes.buttonHeights[size];
  const fontSize = size === 'small' ? theme.typography.fontSizes.md : theme.typography.fontSizes.base;
  const paddingHorizontal =
    size === 'small'
      ? theme.spacing.md
      : size === 'medium'
        ? theme.spacing.lg
        : theme.spacing.xl;
  const borderRadius = cell ? 0 : theme.borderRadii.md;

  // Build the container style dynamically
  const containerStyle: ViewStyle = {
    height,
    paddingHorizontal,
    borderRadius,
    backgroundColor: colors.backgroundColor,
    borderWidth: plain ? StyleSheet.hairlineWidth * 2 : 0,
    borderColor: colors.borderColor,
    opacity: isDisabled ? theme.spacing.xs / 10 + 0.2 : 1,
    // 0.6 opacity for disabled – but we compute it from spacing.xs (4) just
    // to keep referencing the theme; for clarity: disabled opacity = 0.6.
  };

  // Override opacity more explicitly
  if (isDisabled) {
    containerStyle.opacity = 0.6;
  }

  const textStyle: TextStyle = {
    color: colors.textColor,
    fontSize,
    fontWeight: '600',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.base,
        containerStyle,
        cell && styles.cell,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.inner}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={colors.spinnerColor}
            style={styles.spinner}
          />
        )}
        {typeof children === 'string' ? (
          <Text style={textStyle} numberOfLines={1}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
};

// ---------------------------------------------------------------------------
// Static Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cell: {
    borderRadius: 0,
    width: '100%',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default Button;
