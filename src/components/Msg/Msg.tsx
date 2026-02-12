import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon } from '../Icon';

export interface MsgProps {
  /** Message type determines the icon */
  type?: 'success' | 'warn' | 'info';
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Custom icon node (overrides type-based icon) */
  icon?: React.ReactNode;
  /** Extra content below description */
  extra?: React.ReactNode;
  /** Footer area (typically buttons) */
  footer?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Msg({
  type = 'success',
  title,
  description,
  icon,
  extra,
  footer,
  style,
}: MsgProps) {
  const { colors } = useTheme();

  const iconColor =
    type === 'success'
      ? colors.brand
      : type === 'warn'
        ? colors.red
        : colors.blue;

  const iconName =
    type === 'success'
      ? 'success'
      : type === 'warn'
        ? 'warn'
        : 'info';

  return (
    <View style={[styles.container, { backgroundColor: colors.bg2 }, style]}>
      <View style={styles.iconArea}>
        {icon ?? <Icon name={iconName} size={64} color={iconColor} />}
      </View>
      {title != null && (
        <Text style={[styles.title, { color: colors.fg0 }]}>{title}</Text>
      )}
      {description != null && (
        <Text style={[styles.desc, { color: colors.fg1 }]}>{description}</Text>
      )}
      {extra != null && <View style={styles.extra}>{extra}</View>}
      {footer != null && <View style={styles.footer}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  iconArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  extra: {
    marginTop: 24,
    alignItems: 'center',
  },
  footer: {
    marginTop: 48,
    paddingHorizontal: 16,
  },
});
