import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TextareaProps {
  /** Placeholder text shown when the textarea is empty. */
  placeholder?: string;
  /** Current value of the textarea. */
  value?: string;
  /** Callback invoked when the text changes. */
  onChangeText?: (text: string) => void;
  /** Maximum number of characters allowed. */
  maxLength?: number;
  /** Number of visible text lines (determines height). @default 3 */
  rows?: number;
  /** Whether to display the character counter. */
  showCount?: boolean;
  /** Whether the textarea is disabled. */
  disabled?: boolean;
  /** Additional styles applied to the outer container. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Approximate line height for a single row of text at font size 17. */
const LINE_HEIGHT = 24;
const DEFAULT_ROWS = 3;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Textarea: React.FC<TextareaProps> = ({
  placeholder,
  value,
  onChangeText,
  maxLength,
  rows = DEFAULT_ROWS,
  showCount = false,
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  const currentLength = value?.length ?? 0;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bgWhite },
        style,
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            color: disabled ? theme.textPlaceholder : theme.textPrimary,
            height: LINE_HEIGHT * rows,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.textPlaceholder}
        value={value}
        onChangeText={onChangeText}
        multiline
        maxLength={maxLength}
        editable={!disabled}
        textAlignVertical="top"
      />

      {showCount && (
        <Text style={[styles.counter, { color: theme.textSecondary }]}>
          {maxLength != null
            ? `${currentLength}/${maxLength}`
            : `${currentLength}`}
        </Text>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    fontSize: 17,
    lineHeight: LINE_HEIGHT,
    padding: 0,
  },
  counter: {
    fontSize: 14,
    textAlign: 'right',
    marginTop: 8,
  },
});

export default Textarea;
