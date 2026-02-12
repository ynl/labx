import React from 'react';
import {
  Platform,
  StyleSheet,
  Switch as RNSwitch,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WeuiSwitchProps {
  /** Whether the switch is turned on. */
  checked?: boolean;
  /** Callback invoked when the value changes. */
  onChange?: (value: boolean) => void;
  /** Whether the switch is disabled. */
  disabled?: boolean;
  /** Additional styles applied to the outer container. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** WeUI brand green used for the active track. */
const BRAND_COLOR = '#07c160';
const INACTIVE_TRACK_IOS = '#e5e5ea';
const INACTIVE_TRACK_ANDROID = '#d1d1d6';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const WeuiSwitch: React.FC<WeuiSwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <RNSwitch
        value={checked}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{
          false: Platform.OS === 'ios' ? INACTIVE_TRACK_IOS : INACTIVE_TRACK_ANDROID,
          true: BRAND_COLOR,
        }}
        thumbColor={Platform.OS === 'android' ? (checked ? '#fff' : '#f4f3f4') : undefined}
        ios_backgroundColor={INACTIVE_TRACK_IOS}
        style={disabled ? styles.disabled : undefined}
      />
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default WeuiSwitch;
