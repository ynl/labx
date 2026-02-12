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

export interface PreviewItem {
  label: string;
  value: string;
}

export interface PreviewProps {
  /** Headline value (e.g. total price) */
  title?: string;
  /** Headline value label */
  titleLabel?: string;
  /** List of key-value pairs */
  items?: PreviewItem[];
  /** Footer button text */
  footerText?: string;
  onFooterPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Preview({
  title,
  titleLabel,
  items = [],
  footerText,
  onFooterPress,
  style,
}: PreviewProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg2 },
        style,
      ]}
    >
      {/* Headline */}
      {(title != null || titleLabel != null) && (
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.separator },
          ]}
        >
          {titleLabel != null && (
            <Text style={[styles.headerLabel, { color: colors.fg1 }]}>
              {titleLabel}
            </Text>
          )}
          {title != null && (
            <Text style={[styles.headerValue, { color: colors.fg0 }]}>
              {title}
            </Text>
          )}
        </View>
      )}

      {/* Items */}
      <View style={styles.body}>
        {items.map((item, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={[styles.label, { color: colors.fg1 }]}>
              {item.label}
            </Text>
            <Text
              style={[styles.value, { color: colors.fg0 }]}
              numberOfLines={1}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Footer */}
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
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'flex-end',
  },
  headerLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  headerValue: {
    fontSize: 26,
    fontWeight: '400',
  },
  body: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    marginRight: 16,
  },
  value: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerText: {
    fontSize: 14,
  },
});
