/**
 * WeUI Form Component for React Native
 *
 * A lightweight form container that applies WeUI "Cells"-style visual
 * grouping (white background, top/bottom borders, standard padding).
 *
 * Validation rule types are exported for consumers to build form-field
 * level validation on top of this container.
 */

import React from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Describes a single validation rule for a form field. */
export interface FormRule {
  /** If true the field must not be empty / undefined. */
  required?: boolean;
  /** Error message shown when this rule fails. */
  message?: string;
  /** RegExp the value must match. */
  pattern?: RegExp;
  /**
   * Custom validator function.
   * Return `true` for valid, `false` or a string error message for invalid.
   */
  validator?: (value: any) => boolean | string;
}

export interface FormProps {
  /** Form content (typically form field components). */
  children?: React.ReactNode;
  /** Additional styles applied to the outermost container. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Form: React.FC<FormProps> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bgWhite,
          borderTopColor: theme.borderColor,
          borderBottomColor: theme.borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 0,
  },
});

export default Form;
