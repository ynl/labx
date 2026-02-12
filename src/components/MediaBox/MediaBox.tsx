import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface MediaBoxProps {
  /** Layout type: horizontal (image left) or vertical (text only) */
  type?: 'appmsg' | 'text' | 'small_appmsg';
  /** Title text */
  title?: string;
  /** Description / body text */
  description?: string;
  /** Thumbnail image source */
  thumb?: ImageSourcePropType;
  /** Extra info line (e.g. "5 min read · March 1") */
  info?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function MediaBox({
  type = 'appmsg',
  title,
  description,
  thumb,
  info,
  onPress,
  style,
  children,
}: MediaBoxProps) {
  const { colors } = useTheme();

  if (type === 'text') {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.container,
          { borderBottomColor: colors.separator },
          pressed && { backgroundColor: colors.bg1 },
          style,
        ]}
        onPress={onPress}
      >
        {title != null && (
          <Text style={[styles.title, { color: colors.fg0 }]}>{title}</Text>
        )}
        {description != null && (
          <Text style={[styles.desc, { color: colors.fg1 }]} numberOfLines={3}>
            {description}
          </Text>
        )}
        {info != null && (
          <Text style={[styles.info, { color: colors.fg2 }]}>{info}</Text>
        )}
        {children}
      </Pressable>
    );
  }

  if (type === 'small_appmsg') {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.containerRow,
          { borderBottomColor: colors.separator },
          pressed && { backgroundColor: colors.bg1 },
          style,
        ]}
        onPress={onPress}
      >
        <View style={styles.bodySmall}>
          {title != null && (
            <Text
              style={[styles.titleSmall, { color: colors.fg0 }]}
              numberOfLines={2}
            >
              {title}
            </Text>
          )}
          {info != null && (
            <Text style={[styles.info, { color: colors.fg2 }]}>{info}</Text>
          )}
        </View>
        {thumb != null && <Image source={thumb} style={styles.thumbSmall} />}
        {children}
      </Pressable>
    );
  }

  // type === 'appmsg' (default)
  return (
    <Pressable
      style={({ pressed }) => [
        styles.containerRow,
        { borderBottomColor: colors.separator },
        pressed && { backgroundColor: colors.bg1 },
        style,
      ]}
      onPress={onPress}
    >
      {thumb != null && <Image source={thumb} style={styles.thumb} />}
      <View style={styles.body}>
        {title != null && (
          <Text
            style={[styles.title, { color: colors.fg0 }]}
            numberOfLines={2}
          >
            {title}
          </Text>
        )}
        {description != null && (
          <Text
            style={[styles.desc, { color: colors.fg1 }]}
            numberOfLines={3}
          >
            {description}
          </Text>
        )}
        {info != null && (
          <Text style={[styles.info, { color: colors.fg2 }]}>{info}</Text>
        )}
      </View>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  containerRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'flex-start',
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  thumbSmall: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginLeft: 12,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  bodySmall: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '400',
    marginBottom: 4,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  info: {
    fontSize: 12,
    marginTop: 4,
  },
});
