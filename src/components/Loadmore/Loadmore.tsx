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

export interface LoadmoreProps {
  /** Display state */
  type?: 'loading' | 'nomore' | 'line';
  /** Custom text */
  text?: string;
  style?: StyleProp<ViewStyle>;
}

export function Loadmore({
  type = 'loading',
  text,
  style,
}: LoadmoreProps) {
  const { colors } = useTheme();

  const displayText =
    text ??
    (type === 'loading'
      ? '正在加载'
      : type === 'nomore'
        ? '— 没有更多了 —'
        : '');

  if (type === 'line') {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.line, { backgroundColor: colors.fg3 }]} />
        {displayText.length > 0 && (
          <Text style={[styles.lineText, { color: colors.fg2 }]}>
            {displayText}
          </Text>
        )}
        <View style={[styles.line, { backgroundColor: colors.fg3 }]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {type === 'loading' && (
        <ActivityIndicator
          size="small"
          color={colors.fg2}
          style={styles.spinner}
        />
      )}
      <Text style={[styles.text, { color: colors.fg2 }]}>{displayText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  spinner: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  lineText: {
    fontSize: 14,
    marginHorizontal: 12,
  },
});
