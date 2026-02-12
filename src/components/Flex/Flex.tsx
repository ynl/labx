import React from 'react';
import {
  StyleSheet,
  View,
  type FlexAlignType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export interface FlexProps {
  /** Flex direction. Default 'row'. */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Wrapping. Default 'nowrap'. */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** Justify content */
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  /** Align items */
  align?: FlexAlignType;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Flex({
  direction = 'row',
  wrap = 'nowrap',
  justify = 'flex-start',
  align = 'center',
  children,
  style,
}: FlexProps) {
  return (
    <View
      style={[
        styles.base,
        {
          flexDirection: direction,
          flexWrap: wrap,
          justifyContent: justify,
          alignItems: align,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export interface FlexItemProps {
  /** Flex grow. Default 1. */
  flex?: number;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function FlexItem({ flex = 1, children, style }: FlexItemProps) {
  return <View style={[{ flex }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
  },
});
