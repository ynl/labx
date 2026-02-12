import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface InformationBarProps {
  /** Info message */
  content: string;
  /** Bar type changes styling */
  type?: 'info' | 'warn' | 'success';
  /** Whether close button is shown */
  closable?: boolean;
  onClose?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function InformationBar({
  content,
  type = 'info',
  closable = true,
  onClose,
  onPress,
  style,
}: InformationBarProps) {
  const { colors } = useTheme();

  const bgColor =
    type === 'warn'
      ? colors.orange
      : type === 'success'
        ? colors.brand
        : colors.blue;

  return (
    <Pressable
      style={[styles.container, { backgroundColor: bgColor }, style]}
      onPress={onPress}
    >
      <Text style={styles.content} numberOfLines={1}>
        {content}
      </Text>
      {closable && (
        <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  content: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  closeBtn: {
    marginLeft: 8,
    padding: 4,
  },
  closeIcon: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '700',
  },
});
