import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export interface DialogButton {
  label: string;
  type?: 'default' | 'primary';
  onPress?: () => void;
}

export interface DialogProps {
  visible: boolean;
  title?: string;
  content?: string;
  buttons?: DialogButton[];
  onClose?: () => void;
  maskClosable?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function Dialog({
  visible,
  title,
  content,
  buttons = [],
  onClose,
  maskClosable = false,
  style,
  children,
}: DialogProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
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
          {title != null && (
            <Text style={[styles.title, { color: colors.fg0 }]}>{title}</Text>
          )}
          {content != null && (
            <Text style={[styles.content, { color: colors.fg1 }]}>
              {content}
            </Text>
          )}
          {children}
          {buttons.length > 0 && (
            <View
              style={[
                styles.footer,
                { borderTopColor: colors.separator },
              ]}
            >
              {buttons.map((btn, idx) => (
                <Pressable
                  key={idx}
                  style={({ pressed }) => [
                    styles.button,
                    idx > 0 && {
                      borderLeftWidth: StyleSheet.hairlineWidth,
                      borderLeftColor: colors.separator,
                    },
                    pressed && { backgroundColor: colors.bg1 },
                  ]}
                  onPress={btn.onPress}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          btn.type === 'primary'
                            ? colors.brand
                            : colors.fg0,
                      },
                      btn.type === 'primary' && styles.buttonTextPrimary,
                    ]}
                  >
                    {btn.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** Convenience wrapper for weui-style alert (single button) */
export interface AlertProps {
  visible: boolean;
  title?: string;
  content?: string;
  confirmText?: string;
  onConfirm?: () => void;
}

export function Alert({
  visible,
  title,
  content,
  confirmText = '确定',
  onConfirm,
}: AlertProps) {
  return (
    <Dialog
      visible={visible}
      title={title}
      content={content}
      buttons={[{ label: confirmText, type: 'primary', onPress: onConfirm }]}
    />
  );
}

/** Convenience wrapper for weui-style confirm (two buttons) */
export interface ConfirmProps {
  visible: boolean;
  title?: string;
  content?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export function Confirm({
  visible,
  title,
  content,
  cancelText = '取消',
  confirmText = '确定',
  onCancel,
  onConfirm,
}: ConfirmProps) {
  return (
    <Dialog
      visible={visible}
      title={title}
      content={content}
      onClose={onCancel}
      buttons={[
        { label: cancelText, type: 'default', onPress: onCancel },
        { label: confirmText, type: 'primary', onPress: onConfirm },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  dialog: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  content: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 28,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
  },
  buttonTextPrimary: {
    fontWeight: '700',
  },
});
