/**
 * WeUI Badge Component for React Native
 *
 * Displays a small notification indicator – either a red dot or a number badge.
 * When wrapping children the badge is positioned at the top-right corner;
 * otherwise it renders inline.
 */

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
// Props
// ---------------------------------------------------------------------------

export interface BadgeProps {
  /** When provided, the badge displays this number. */
  count?: number;
  /** When true, shows a small red dot instead of a number. */
  dot?: boolean;
  /** Numbers above this value display as "N+". Defaults to 99. */
  maxCount?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

const BADGE_RED = '#fa5151';

export const Badge: React.FC<BadgeProps> = ({
  count,
  dot = false,
  maxCount = 99,
  style,
  children,
}) => {
  const _theme = useTheme();

  // Determine the label text (if any).
  const hasCount = count !== undefined && count > 0;
  const label = hasCount
    ? count > maxCount
      ? `${maxCount}+`
      : `${count}`
    : null;

  // Build the badge element.
  let badge: React.ReactNode = null;

  if (dot) {
    badge = (
      <View
        style={[
          styles.dot,
          children ? styles.positionAbsolute : null,
          style,
        ]}
      />
    );
  } else if (label) {
    badge = (
      <View
        style={[
          styles.badge,
          children ? styles.positionAbsolute : null,
          style,
        ]}
      >
        <Text style={styles.badgeText}>{label}</Text>
      </View>
    );
  }

  // When there are no children, render the badge standalone.
  if (!children) {
    return badge as React.ReactElement;
  }

  // Otherwise wrap the children and overlay the badge.
  return (
    <View style={styles.wrapper}>
      {children}
      {badge}
    </View>
  );
};

Badge.displayName = 'Badge';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'flex-start',
    position: 'relative',
  },

  // Dot variant
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BADGE_RED,
  },

  // Number variant
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BADGE_RED,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Absolute positioning when wrapping children
  positionAbsolute: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
});
