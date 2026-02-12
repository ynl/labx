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

export interface PanelProps {
  title?: string;
  children?: React.ReactNode;
  /** Footer link text */
  footerText?: string;
  onFooterPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Panel({
  title,
  children,
  footerText,
  onFooterPress,
  style,
}: PanelProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg2 },
        style,
      ]}
    >
      {title != null && (
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.separator },
          ]}
        >
          <Text style={[styles.title, { color: colors.fg0 }]}>{title}</Text>
        </View>
      )}
      <View style={styles.body}>{children}</View>
      {footerText != null && (
        <Pressable
          style={({ pressed }) => [
            styles.footer,
            { borderTopColor: colors.separator },
            pressed && { backgroundColor: colors.bg1 },
          ]}
          onPress={onFooterPress}
        >
          <Text style={[styles.footerText, { color: colors.link }]}>
            {footerText}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  body: {},
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerText: {
    fontSize: 14,
  },
});
