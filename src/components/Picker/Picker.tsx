/**
 * WeUI Picker Component for React Native
 *
 * A scrolling, multi-column picker presented as a bottom-sheet modal,
 * similar to the iOS date-picker style. Each column uses a ScrollView
 * with snap-to-interval behaviour for item selection.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PickerColumn {
  /** The values the user may choose from. */
  values: string[];
  /** Index of the initially selected value. @default 0 */
  defaultIndex?: number;
}

export interface PickerProps {
  /** Whether the picker modal is visible. */
  visible?: boolean;
  /** Column definitions. */
  columns: PickerColumn[];
  /** Called with the selected values (one per column) when the user confirms. */
  onConfirm?: (values: string[]) => void;
  /** Called when the user cancels / dismisses the picker. */
  onCancel?: () => void;
  /** Title text displayed between cancel and confirm buttons. */
  title?: string;
  /** Label for the confirm button. @default "确定" */
  confirmText?: string;
  /** Label for the cancel button. @default "取消" */
  cancelText?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const SCREEN_WIDTH = Dimensions.get('window').width;

// ---------------------------------------------------------------------------
// PickerColumnView (single column)
// ---------------------------------------------------------------------------

interface PickerColumnViewProps {
  column: PickerColumn;
  columnIndex: number;
  onValueChange: (columnIndex: number, valueIndex: number) => void;
  textColor: string;
  activeTextColor: string;
}

const PickerColumnView: React.FC<PickerColumnViewProps> = ({
  column,
  columnIndex,
  onValueChange,
  textColor,
  activeTextColor,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const [selectedIndex, setSelectedIndex] = useState(column.defaultIndex ?? 0);

  // Scroll to the default position on mount.
  useEffect(() => {
    const initialIndex = column.defaultIndex ?? 0;
    if (scrollRef.current && initialIndex > 0) {
      scrollRef.current.scrollTo({
        y: initialIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, column.values.length - 1));
      setSelectedIndex(clampedIndex);
      onValueChange(columnIndex, clampedIndex);
    },
    [column.values.length, columnIndex, onValueChange],
  );

  // Padding so the first and last items can be scrolled to the centre.
  const topPadding = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);
  const bottomPadding = topPadding;

  return (
    <View style={columnStyles.container}>
      <ScrollView
        ref={scrollRef}
        style={columnStyles.scrollView}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      >
        {column.values.map((value, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <View key={`${columnIndex}-${idx}`} style={columnStyles.item}>
              <Text
                style={[
                  columnStyles.itemText,
                  { color: isSelected ? activeTextColor : textColor },
                  isSelected && columnStyles.itemTextSelected,
                ]}
                numberOfLines={1}
              >
                {value}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const columnStyles = StyleSheet.create({
  container: {
    flex: 1,
    height: PICKER_HEIGHT,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
  },
  itemTextSelected: {
    fontWeight: '600',
  },
});

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const Picker: React.FC<PickerProps> = ({
  visible = false,
  columns,
  onConfirm,
  onCancel,
  title,
  confirmText = '\u786E\u5B9A',
  cancelText = '\u53D6\u6D88',
}) => {
  const theme = useTheme();

  // Track currently selected indices for each column.
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() =>
    columns.map((col) => col.defaultIndex ?? 0),
  );

  // Reset selected indices when columns change or picker opens.
  useEffect(() => {
    if (visible) {
      setSelectedIndices(columns.map((col) => col.defaultIndex ?? 0));
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleValueChange = useCallback(
    (columnIndex: number, valueIndex: number) => {
      setSelectedIndices((prev) => {
        const next = [...prev];
        next[columnIndex] = valueIndex;
        return next;
      });
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    const values = columns.map((col, i) => {
      const idx = selectedIndices[i] ?? 0;
      return col.values[idx] ?? '';
    });
    onConfirm?.(values);
  }, [columns, selectedIndices, onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  // ------------------------------------------
  // Theme-derived colors
  // ------------------------------------------

  const bgColor = theme.bgWhite;
  const headerBorderColor = theme.borderColor;
  const brandColor = theme.brandPrimary;
  const cancelColor = theme.textSecondary;
  const titleColor = theme.textPrimary;
  const textColor = theme.textSecondary;
  const activeTextColor = theme.textPrimary;
  const indicatorColor = theme.borderColor;

  // ------------------------------------------
  // Render
  // ------------------------------------------

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Bottom sheet */}
      <View style={[styles.sheet, { backgroundColor: bgColor }]}>
        {/* Header bar */}
        <View style={[styles.header, { borderBottomColor: headerBorderColor }]}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: cancelColor }]}>
              {cancelText}
            </Text>
          </TouchableOpacity>

          {title !== undefined && (
            <Text style={[styles.headerTitle, { color: titleColor }]} numberOfLines={1}>
              {title}
            </Text>
          )}

          <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: brandColor }]}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Column area */}
        <View style={styles.columnsContainer}>
          {/* Selection indicator (horizontal lines around the centre slot) */}
          <View
            pointerEvents="none"
            style={[
              styles.indicator,
              {
                top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
                borderTopColor: indicatorColor,
                borderBottomColor: indicatorColor,
              },
            ]}
          />

          {columns.map((col, idx) => (
            <PickerColumnView
              key={`picker-col-${idx}`}
              column={col}
              columnIndex={idx}
              onValueChange={handleValueChange}
              textColor={textColor}
              activeTextColor={activeTextColor}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerButtonText: {
    fontSize: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  columnsContainer: {
    flexDirection: 'row',
    height: PICKER_HEIGHT,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 1,
  },
});

export default Picker;
