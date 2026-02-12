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

export interface CheckboxProps {
  /** Whether the checkbox is checked. */
  checked?: boolean;
  /** Callback invoked when the checkbox is toggled. */
  onChange?: (checked: boolean) => void;
  /** Whether the checkbox is disabled. */
  disabled?: boolean;
  /** Text label displayed to the right of the checkbox. */
  label?: string;
  /** Additional styles applied to the outer container. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHECK_SIZE = 23;
const BRAND_COLOR = '#07c160';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Checkbox: React.FC<CheckboxProps> = ({
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
      <View
        style={[
          styles.checkCircle,
          checked
            ? styles.checkedCircle
            : { borderColor: theme.textPlaceholder },
        ]}
      >
        {checked && (
          <View style={styles.checkmarkContainer}>
            {/* Checkmark rendered using two rotated bars */}
            <View style={styles.checkmarkShort} />
            <View style={styles.checkmarkLong} />
          </View>
        )}
      </View>

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
  },
  disabled: {
    opacity: 0.4,
  },
  checkCircle: {
    width: CHECK_SIZE,
    height: CHECK_SIZE,
    borderRadius: CHECK_SIZE / 2,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCircle: {
    backgroundColor: BRAND_COLOR,
    borderColor: BRAND_COLOR,
  },
  checkmarkContainer: {
    width: 12,
    height: 10,
    position: 'relative',
  },
  checkmarkShort: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    width: 6,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  checkmarkLong: {
    position: 'absolute',
    bottom: 2,
    left: 3,
    width: 10,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
  label: {
    fontSize: 17,
    marginLeft: 8,
  },
});

export default Checkbox;
