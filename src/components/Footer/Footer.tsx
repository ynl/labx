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

export interface FooterLink {
  label: string;
  onPress?: () => void;
}

export interface FooterProps {
  /** Copyright / bottom text */
  text?: string;
  /** Footer links */
  links?: FooterLink[];
  style?: StyleProp<ViewStyle>;
}

export function Footer({ text, links = [], style }: FooterProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {links.length > 0 && (
        <View style={styles.links}>
          {links.map((link, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <Text style={[styles.separator, { color: colors.fg2 }]}>
                  {' | '}
                </Text>
              )}
              <Pressable onPress={link.onPress}>
                <Text style={[styles.link, { color: colors.link }]}>
                  {link.label}
                </Text>
              </Pressable>
            </React.Fragment>
          ))}
        </View>
      )}
      {text != null && (
        <Text style={[styles.text, { color: colors.fg2 }]}>{text}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  link: {
    fontSize: 14,
  },
  separator: {
    fontSize: 14,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
