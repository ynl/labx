import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface ProgressProps {
  /** Progress value between 0 and 100 */
  percent?: number;
  /** Whether to show the percentage text */
  showText?: boolean;
  /** Custom bar color (defaults to BRAND green) */
  activeColor?: string;
  /** Custom track color */
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function Progress({
  percent = 0,
  showText = true,
  activeColor,
  trackColor,
  style,
}: ProgressProps) {
  const { colors } = useTheme();
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.track,
          { backgroundColor: trackColor ?? colors.bg1 },
        ]}
      >
        <View
          style={[
            styles.bar,
            {
              backgroundColor: activeColor ?? colors.brand,
              width: `${clampedPercent}%`,
            },
          ]}
        />
      </View>
      {showText && (
        <Text style={[styles.text, { color: colors.fg1 }]}>
          {clampedPercent}%
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  track: {
    flex: 1,
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 1.5,
  },
  text: {
    fontSize: 14,
    marginLeft: 8,
    minWidth: 36,
    textAlign: 'right',
  },
});
