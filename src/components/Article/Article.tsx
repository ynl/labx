import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface ArticleProps {
  title?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Rich-text article layout following WeUI `.weui-article` style.
 * Use nested <Text> for paragraphs or pass any React Native content as children.
 */
export function Article({ title, children, style }: ArticleProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {title != null && (
        <Text style={[styles.title, { color: colors.fg0 }]}>{title}</Text>
      )}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

/** Styled paragraph element for Article */
export interface ArticleParagraphProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ArticleParagraph({ children, style }: ArticleParagraphProps) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.paragraph, { color: colors.fg0 }, style]}>
      {children}
    </Text>
  );
}

/** Section heading within an Article */
export interface ArticleHeadingProps {
  children?: React.ReactNode;
  level?: 1 | 2 | 3;
  style?: StyleProp<ViewStyle>;
}

export function ArticleHeading({
  children,
  level = 2,
  style,
}: ArticleHeadingProps) {
  const { colors } = useTheme();
  const sizes = { 1: 22, 2: 18, 3: 16 };
  return (
    <Text
      style={[
        styles.heading,
        { color: colors.fg0, fontSize: sizes[level] },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  body: {},
  paragraph: {
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 12,
  },
  heading: {
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
});
