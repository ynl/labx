import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface HalfScreenDialogProps {
  visible: boolean;
  title?: string;
  subTitle?: string;
  onClose?: () => void;
  maskClosable?: boolean;
  /** Show close button at top-right */
  closable?: boolean;
  children?: React.ReactNode;
  /** Footer buttons/content */
  footer?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function HalfScreenDialog({
  visible,
  title,
  subTitle,
  onClose,
  maskClosable = true,
  closable = true,
  children,
  footer,
  style,
}: HalfScreenDialogProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
        onPress={maskClosable ? onClose : undefined}
      >
        <Pressable
          style={[
            styles.dialog,
            { backgroundColor: colors.bg2 },
            style,
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {title != null && (
                <Text
                  style={[styles.title, { color: colors.fg0 }]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
              )}
              {subTitle != null && (
                <Text
                  style={[styles.subTitle, { color: colors.fg1 }]}
                  numberOfLines={1}
                >
                  {subTitle}
                </Text>
              )}
            </View>
            {closable && (
              <Pressable
                style={[styles.closeBtn, { backgroundColor: colors.bg3 }]}
                onPress={onClose}
                hitSlop={8}
              >
                <Text style={[styles.closeIcon, { color: colors.fg1 }]}>
                  ✕
                </Text>
              </Pressable>
            )}
          </View>

          {/* Handle bar */}
          <View style={styles.handleWrap}>
            <View style={[styles.handle, { backgroundColor: colors.fg3 }]} />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            bounces={false}
          >
            {children}
          </ScrollView>

          {/* Footer */}
          {footer != null && (
            <View style={styles.footer}>{footer}</View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dialog: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '75%',
    minHeight: 200,
    overflow: 'hidden',
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subTitle: {
    fontSize: 14,
    marginTop: 4,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 8,
  },
});
