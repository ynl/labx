import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface LoadingProps {
  /** Optional text shown beside the spinner */
  text?: string;
  /** Spinner size */
  size?: 'small' | 'large';
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export function Loading({ text, size = 'small', style }: LoadingProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={colors.brand} />
      {text != null && (
        <Text style={[styles.text, { color: colors.fg1 }]}>{text}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  text: {
    fontSize: 14,
    marginLeft: 8,
  },
});
