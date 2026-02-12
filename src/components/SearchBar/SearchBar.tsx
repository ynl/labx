import React, { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  onFocus?: () => void;
  onCancel?: () => void;
  cancelText?: string;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function SearchBar({
  value: controlledValue,
  placeholder = '搜索',
  onChangeText,
  onSubmit,
  onFocus,
  onCancel,
  cancelText = '取消',
  autoFocus = false,
  style,
}: SearchBarProps) {
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(autoFocus);
  const [internalValue, setInternalValue] = useState('');

  const text = controlledValue ?? internalValue;

  const handleChange = (val: string) => {
    if (controlledValue === undefined) setInternalValue(val);
    onChangeText?.(val);
  };

  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
  };

  const handleCancel = () => {
    handleChange('');
    setFocused(false);
    inputRef.current?.blur();
    onCancel?.();
  };

  const handleClear = () => {
    handleChange('');
    inputRef.current?.focus();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg2 },
        style,
      ]}
    >
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: colors.bg3 },
        ]}
      >
        <Text style={[styles.searchIcon, { color: colors.fg2 }]}>⌕</Text>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.fg0 }]}
          value={text}
          placeholder={placeholder}
          placeholderTextColor={colors.fg2}
          onChangeText={handleChange}
          onFocus={handleFocus}
          onSubmitEditing={() => onSubmit?.(text)}
          returnKeyType="search"
          autoFocus={autoFocus}
        />
        {text.length > 0 && (
          <Pressable onPress={handleClear} hitSlop={8}>
            <Text style={[styles.clearIcon, { color: colors.fg2 }]}>✕</Text>
          </Pressable>
        )}
      </View>
      {focused && (
        <Pressable onPress={handleCancel} style={styles.cancelBtn}>
          <Text style={[styles.cancelText, { color: colors.link }]}>
            {cancelText}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 36,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 14,
    padding: 4,
  },
  cancelBtn: {
    marginLeft: 8,
    paddingHorizontal: 4,
  },
  cancelText: {
    fontSize: 16,
  },
});
