import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InputProps {
  /** Label displayed on the left side of the input. */
  label?: string;
  /** Placeholder text shown when the input is empty. */
  placeholder?: string;
  /** Current value of the input. */
  value?: string;
  /** Callback invoked when the text changes. */
  onChangeText?: (text: string) => void;
  /** Input type that determines keyboard and secure entry behavior. */
  type?: 'text' | 'number' | 'phone' | 'password';
  /** Whether the input is disabled. */
  disabled?: boolean;
  /** Whether the input is in an error state. */
  error?: boolean;
  /** Error message displayed below the input when `error` is true. */
  errorMessage?: string;
  /** Maximum number of characters allowed. */
  maxLength?: number;
  /** Additional styles applied to the outer container. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getKeyboardType(type: InputProps['type']): KeyboardTypeOptions {
  switch (type) {
    case 'number':
      return 'numeric';
    case 'phone':
      return 'phone-pad';
    default:
      return 'default';
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  type = 'text',
  disabled = false,
  error = false,
  errorMessage,
  maxLength,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={style}>
      <View
        style={[
          styles.cell,
          {
            backgroundColor: theme.bgWhite,
            borderBottomColor: theme.borderColor,
          },
        ]}
      >
        {label != null && label.length > 0 && (
          <Text
            style={[
              styles.label,
              {
                color: theme.textPrimary,
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: disabled ? theme.textPlaceholder : theme.textPrimary,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.textPlaceholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={getKeyboardType(type)}
          secureTextEntry={type === 'password'}
          editable={!disabled}
          maxLength={maxLength}
        />
      </View>

      {error && errorMessage != null && errorMessage.length > 0 && (
        <Text style={[styles.errorText, { color: theme.brandCancel }]}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    width: 105,
    fontSize: 17,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 17,
    height: 48,
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
});

export default Input;
