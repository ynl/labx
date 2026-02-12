/**
 * WeUI Cell / List Components for React Native
 *
 * The Cell is the fundamental building block in WeUI for list-style layouts.
 *
 * Layout: [Icon?] [Header] [Body (flex:1)] [Footer] [AccessoryArrow?]
 *
 * Components exported from this file:
 *   - Cells       – container / list wrapper with optional title
 *   - Cell        – individual list-item row
 *   - CellHeader  – left portion of a Cell
 *   - CellBody    – middle portion of a Cell (flex: 1)
 *   - CellFooter  – right portion of a Cell
 */

import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CellsProps {
  /** Optional section title displayed above the list. */
  title?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface CellProps {
  /** When true an accessory arrow ("›") is rendered on the right. */
  access?: boolean;
  /** When true the row is styled as a clickable link. */
  link?: boolean;
  /** Press handler – automatically wraps the row in a TouchableHighlight. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export interface CellHeaderProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface CellBodyProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface CellFooterProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// CellHeader
// ---------------------------------------------------------------------------

export const CellHeader: React.FC<CellHeaderProps> = ({ children, style }) => {
  return <View style={[styles.cellHeader, style]}>{children}</View>;
};

CellHeader.displayName = 'CellHeader';

// ---------------------------------------------------------------------------
// CellBody
// ---------------------------------------------------------------------------

export const CellBody: React.FC<CellBodyProps> = ({ children, style }) => {
  const theme = useTheme();

  const content =
    typeof children === 'string' ? (
      <Text style={[styles.cellBodyText, { color: theme.colors.fg0 }]}>
        {children}
      </Text>
    ) : (
      children
    );

  return <View style={[styles.cellBody, style]}>{content}</View>;
};

CellBody.displayName = 'CellBody';

// ---------------------------------------------------------------------------
// CellFooter
// ---------------------------------------------------------------------------

export const CellFooter: React.FC<CellFooterProps> = ({ children, style }) => {
  const theme = useTheme();

  const content =
    typeof children === 'string' ? (
      <Text style={[styles.cellFooterText, { color: theme.colors.fg1 }]}>
        {children}
      </Text>
    ) : (
      children
    );

  return <View style={[styles.cellFooter, style]}>{content}</View>;
};

CellFooter.displayName = 'CellFooter';

// ---------------------------------------------------------------------------
// Cell
// ---------------------------------------------------------------------------

export const Cell: React.FC<CellProps> = ({
  access = false,
  link = false,
  onPress,
  style,
  children,
}) => {
  const theme = useTheme();

  const row = (
    <View
      style={[
        styles.cell,
        { backgroundColor: theme.colors.bg2 },
        style,
      ]}
    >
      {children}
      {access && (
        <Text style={[styles.accessoryArrow, { color: theme.colors.fg2 }]}>
          {'\u203A'}
        </Text>
      )}
    </View>
  );

  if (onPress || link) {
    return (
      <TouchableHighlight
        underlayColor={theme.colors.bg3}
        onPress={onPress}
        activeOpacity={1}
      >
        {row}
      </TouchableHighlight>
    );
  }

  return row;
};

Cell.displayName = 'Cell';

// ---------------------------------------------------------------------------
// Cells (list wrapper)
// ---------------------------------------------------------------------------

export const Cells: React.FC<CellsProps> = ({ title, children, style }) => {
  const theme = useTheme();

  // Insert separator Views between each Cell child.
  const childArray = React.Children.toArray(children);
  const separated: React.ReactNode[] = [];

  childArray.forEach((child, index) => {
    separated.push(child);

    if (index < childArray.length - 1) {
      separated.push(
        <View
          key={`separator-${index}`}
          style={[
            styles.separator,
            { backgroundColor: theme.colors.separator },
          ]}
        />,
      );
    }
  });

  return (
    <View style={style}>
      {title !== undefined && (
        <Text style={[styles.cellsTitle, { color: theme.colors.fg1 }]}>
          {title}
        </Text>
      )}
      <View
        style={[
          styles.cellsContainer,
          { backgroundColor: theme.colors.bg2 },
        ]}
      >
        {separated}
      </View>
    </View>
  );
};

Cells.displayName = 'Cells';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  // Cells (container)
  cellsContainer: {
    overflow: 'hidden',
  },
  cellsTitle: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  // Cell (row)
  cell: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Separator between cells
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },

  // Sub-components
  cellHeader: {
    marginRight: 8,
  },
  cellBody: {
    flex: 1,
  },
  cellBodyText: {
    fontSize: 17,
  },
  cellFooter: {
    marginLeft: 8,
  },
  cellFooterText: {
    fontSize: 17,
  },

  // Accessory arrow
  accessoryArrow: {
    fontSize: 24,
    marginLeft: 8,
  },
});
