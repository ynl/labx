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

export interface NavbarItem {
  label: string;
  key?: string;
}

export interface NavbarProps {
  /** Tab items */
  items: NavbarItem[];
  /** Currently active index */
  activeIndex?: number;
  /** Called when a tab is pressed */
  onChange?: (index: number) => void;
  /** Active indicator color (defaults to brand green) */
  activeColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function Navbar({
  items,
  activeIndex = 0,
  onChange,
  activeColor,
  style,
}: NavbarProps) {
  const { colors } = useTheme();
  const accent = activeColor ?? colors.brand;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg2,
          borderBottomColor: colors.separator,
        },
        style,
      ]}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <Pressable
            key={item.key ?? index}
            style={styles.tab}
            onPress={() => onChange?.(index)}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? accent : colors.fg1 },
                isActive && styles.labelActive,
              ]}
            >
              {item.label}
            </Text>
            {isActive && (
              <View style={[styles.indicator, { backgroundColor: accent }]} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  label: {
    fontSize: 15,
  },
  labelActive: {
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: 24,
    borderRadius: 1,
  },
});
