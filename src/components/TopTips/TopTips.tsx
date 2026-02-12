import React, { useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface TopTipsProps {
  visible: boolean;
  /** Tip message */
  content?: string;
  /** Background color (defaults to RED) */
  type?: 'warn' | 'info' | 'success';
  /** Auto-hide duration in ms. 0 = no auto-hide. Default 3000. */
  duration?: number;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function TopTips({
  visible,
  content,
  type = 'warn',
  duration = 3000,
  onClose,
  style,
}: TopTipsProps) {
  const { colors } = useTheme();
  const translateY = React.useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : -50,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => onClose?.(), duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const bgColor =
    type === 'success'
      ? colors.brand
      : type === 'info'
        ? colors.blue
        : colors.red;

  if (!visible && !content) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bgColor, transform: [{ translateY }] },
        style,
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text} numberOfLines={1}>
        {content}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
});
