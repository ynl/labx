import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon } from '../Icon';

export type ToastType = 'success' | 'fail' | 'loading' | 'text';

export interface ToastProps {
  visible: boolean;
  /** Toast style */
  type?: ToastType;
  /** Message text */
  content?: string;
  /** Auto-close duration in ms (0 = no auto-close). Default 2000. */
  duration?: number;
  /** Called when toast should be hidden */
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Toast({
  visible,
  type = 'success',
  content,
  duration = 2000,
  onClose,
  style,
}: ToastProps) {
  const { colors } = useTheme();

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => onClose?.(), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const renderIcon = () => {
    if (type === 'loading') {
      return (
        <ActivityIndicator
          size="large"
          color="#ffffff"
          style={styles.icon}
        />
      );
    }
    if (type === 'success') {
      return (
        <Icon
          name="success"
          size={36}
          color="#ffffff"
          style={styles.icon}
        />
      );
    }
    if (type === 'fail') {
      return (
        <Icon
          name="warn"
          size={36}
          color="#ffffff"
          style={styles.icon}
        />
      );
    }
    return null;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.toast, style]}>
          {renderIcon()}
          {content != null && (
            <Text style={styles.text} numberOfLines={2}>
              {content}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    backgroundColor: 'rgba(17,17,17,0.7)',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    maxWidth: 200,
  },
  icon: {
    marginBottom: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
