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

export interface ActionSheetItem {
  label: string;
  /** 'destructive' renders in red */
  type?: 'default' | 'destructive';
  onPress?: () => void;
}

export interface ActionSheetProps {
  visible: boolean;
  title?: string;
  /** Menu items */
  menus?: ActionSheetItem[];
  /** Action items (shown after separator, e.g. Cancel) */
  actions?: ActionSheetItem[];
  onClose?: () => void;
  maskClosable?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ActionSheet({
  visible,
  title,
  menus = [],
  actions = [],
  onClose,
  maskClosable = true,
  style,
}: ActionSheetProps) {
  const { colors } = useTheme();

  const renderItem = (item: ActionSheetItem, index: number, isLast: boolean) => (
    <Pressable
      key={index}
      style={({ pressed }) => [
        styles.item,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.separator,
        },
        pressed && { backgroundColor: colors.bg1 },
      ]}
      onPress={() => {
        item.onPress?.();
        onClose?.();
      }}
    >
      <Text
        style={[
          styles.itemText,
          {
            color:
              item.type === 'destructive' ? colors.red : colors.fg0,
          },
        ]}
      >
        {item.label}
      </Text>
    </Pressable>
  );

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
        <Pressable style={[styles.sheet, style]} onPress={(e) => e.stopPropagation()}>
          {/* Menu section */}
          <View
            style={[
              styles.menuGroup,
              { backgroundColor: colors.bg2 },
            ]}
          >
            {title != null && (
              <View
                style={[
                  styles.titleWrap,
                  {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.separator,
                  },
                ]}
              >
                <Text style={[styles.titleText, { color: colors.fg1 }]}>
                  {title}
                </Text>
              </View>
            )}
            <ScrollView bounces={false} style={styles.scroll}>
              {menus.map((item, i) =>
                renderItem(item, i, i === menus.length - 1),
              )}
            </ScrollView>
          </View>

          {/* Action section (cancel, etc.) */}
          {actions.length > 0 && (
            <View
              style={[
                styles.actionGroup,
                { backgroundColor: colors.bg2 },
              ]}
            >
              {actions.map((item, i) =>
                renderItem(item, i, i === actions.length - 1),
              )}
            </View>
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
  sheet: {
    paddingBottom: 34, // safe area bottom
  },
  menuGroup: {
    borderRadius: 12,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  scroll: {
    maxHeight: 300,
  },
  actionGroup: {
    borderRadius: 12,
    marginHorizontal: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  titleWrap: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 13,
  },
  item: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 17,
  },
});
