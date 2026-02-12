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

export interface GridItem {
  icon?: React.ReactNode;
  label?: string;
  key?: string;
}

export interface GridProps {
  items: GridItem[];
  /** Number of columns per row. Default 3. */
  columns?: number;
  onPress?: (item: GridItem, index: number) => void;
  style?: StyleProp<ViewStyle>;
}

export function Grid({
  items,
  columns = 3,
  onPress,
  style,
}: GridProps) {
  const { colors } = useTheme();

  // Pad items to fill the last row
  const padded = [...items];
  while (padded.length % columns !== 0) {
    padded.push({ key: `__pad_${padded.length}` });
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg2, borderColor: colors.separator },
        style,
      ]}
    >
      {Array.from({ length: Math.ceil(padded.length / columns) }).map((_, rowIdx) => (
        <View
          key={rowIdx}
          style={[
            styles.row,
            rowIdx > 0 && {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.separator,
            },
          ]}
        >
          {padded.slice(rowIdx * columns, (rowIdx + 1) * columns).map((item, colIdx) => {
            const realIndex = rowIdx * columns + colIdx;
            const isPad = item.label == null && item.icon == null;

            return (
              <Pressable
                key={item.key ?? realIndex}
                style={({ pressed }) => [
                  styles.cell,
                  colIdx > 0 && {
                    borderLeftWidth: StyleSheet.hairlineWidth,
                    borderLeftColor: colors.separator,
                  },
                  pressed && !isPad && { backgroundColor: colors.bg1 },
                ]}
                onPress={isPad ? undefined : () => onPress?.(item, realIndex)}
                disabled={isPad}
              >
                {item.icon != null && (
                  <View style={styles.iconWrap}>{item.icon}</View>
                )}
                {item.label != null && (
                  <Text
                    style={[styles.label, { color: colors.fg0 }]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
  },
});
