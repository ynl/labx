import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RadioProps {
  /** Whether this radio option is selected. */
  checked?: boolean;
  /** Callback invoked when the radio is tapped. */
  onChange?: (checked: boolean) => void;
  /** Whether the radio is disabled. */
  disabled?: boolean;
  /** Text label displayed to the left of the checkmark. */
  label?: string;
  /** Additional styles applied to the outer container. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BRAND_COLOR = '#07c160';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Radio: React.FC<RadioProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  style,
}) => {
  const theme = useTheme();

  const handlePress = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      {label != null && label.length > 0 && (
        <Text
          style={[
            styles.label,
            { color: theme.textPrimary },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}

      {/* WeUI radio places the checkmark on the right side */}
      <View style={styles.checkArea}>
        {checked && (
          <View style={styles.checkmarkContainer}>
            <View style={[styles.checkmarkShort, { backgroundColor: BRAND_COLOR }]} />
            <View style={[styles.checkmarkLong, { backgroundColor: BRAND_COLOR }]} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    flex: 1,
    fontSize: 17,
  },
  checkArea: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkmarkContainer: {
    width: 16,
    height: 12,
    position: 'relative',
  },
  checkmarkShort: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    width: 7,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  checkmarkLong: {
    position: 'absolute',
    bottom: 2,
    left: 4,
    width: 13,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
});

export default Radio;
