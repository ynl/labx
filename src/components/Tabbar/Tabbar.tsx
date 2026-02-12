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

export interface TabbarItem {
  label: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  badge?: number | boolean;
  key?: string;
}

export interface TabbarProps {
  items: TabbarItem[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  activeColor?: string;
  inactiveColor?: string;
  style?: StyleProp<ViewStyle>;
}

export function Tabbar({
  items,
  activeIndex = 0,
  onChange,
  activeColor,
  inactiveColor,
  style,
}: TabbarProps) {
  const { colors } = useTheme();
  const active = activeColor ?? colors.brand;
  const inactive = inactiveColor ?? colors.fg1;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg2,
          borderTopColor: colors.separator,
        },
        style,
      ]}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        const color = isActive ? active : inactive;

        return (
          <Pressable
            key={item.key ?? index}
            style={styles.tab}
            onPress={() => onChange?.(index)}
          >
            <View style={styles.iconWrap}>
              {isActive
                ? (item.activeIcon ?? item.icon ?? null)
                : (item.icon ?? null)}
              {item.badge != null && item.badge !== false && (
                <View
                  style={[
                    typeof item.badge === 'number'
                      ? styles.badgeNumber
                      : styles.badgeDot,
                    { backgroundColor: colors.red },
                  ]}
                >
                  {typeof item.badge === 'number' && (
                    <Text style={styles.badgeText}>
                      {item.badge > 99 ? '99+' : item.badge}
                    </Text>
                  )}
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                { color },
                isActive && styles.labelActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 20, // safe area
    paddingTop: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
  labelActive: {
    fontWeight: '600',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeNumber: {
    position: 'absolute',
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
});
