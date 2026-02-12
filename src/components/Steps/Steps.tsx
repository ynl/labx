import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

export type StepStatus = 'pending' | 'active' | 'completed';

export interface StepItem {
  title: string;
  description?: string;
  status?: StepStatus;
}

export interface StepsProps {
  items: StepItem[];
  /** Current active step index (0-based). Items before this index are 'completed'. */
  current?: number;
  /** Layout direction */
  direction?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
}

export function Steps({
  items,
  current = 0,
  direction = 'horizontal',
  style,
}: StepsProps) {
  const { colors } = useTheme();

  const getStatus = (index: number): StepStatus => {
    if (index < current) return 'completed';
    if (index === current) return 'active';
    return 'pending';
  };

  const getDotColor = (status: StepStatus) => {
    if (status === 'completed' || status === 'active') return colors.brand;
    return colors.fg2;
  };

  if (direction === 'vertical') {
    return (
      <View style={[styles.verticalContainer, style]}>
        {items.map((item, index) => {
          const status = item.status ?? getStatus(index);
          const isLast = index === items.length - 1;
          const dotColor = getDotColor(status);
          const textColor = status === 'pending' ? colors.fg2 : colors.fg0;

          return (
            <View key={index} style={styles.verticalStep}>
              <View style={styles.verticalLeft}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: dotColor },
                    status === 'active' && styles.dotActive,
                  ]}
                />
                {!isLast && (
                  <View
                    style={[styles.verticalLine, { backgroundColor: colors.fg3 }]}
                  />
                )}
              </View>
              <View style={[styles.verticalContent, !isLast && { paddingBottom: 24 }]}>
                <Text style={[styles.stepTitle, { color: textColor }]}>
                  {item.title}
                </Text>
                {item.description != null && (
                  <Text style={[styles.stepDesc, { color: colors.fg1 }]}>
                    {item.description}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  // Horizontal
  return (
    <View style={[styles.horizontalContainer, style]}>
      {items.map((item, index) => {
        const status = item.status ?? getStatus(index);
        const isLast = index === items.length - 1;
        const dotColor = getDotColor(status);
        const textColor = status === 'pending' ? colors.fg2 : colors.fg0;

        return (
          <View key={index} style={styles.horizontalStep}>
            <View style={styles.horizontalTop}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: dotColor },
                  status === 'active' && styles.dotActive,
                ]}
              />
              {!isLast && (
                <View
                  style={[styles.horizontalLine, { backgroundColor: colors.fg3 }]}
                />
              )}
            </View>
            <Text
              style={[styles.stepTitleH, { color: textColor }]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Horizontal
  horizontalContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  horizontalStep: {
    flex: 1,
    alignItems: 'center',
  },
  horizontalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 4,
  },
  stepTitleH: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },

  // Vertical
  verticalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  verticalStep: {
    flexDirection: 'row',
  },
  verticalLeft: {
    alignItems: 'center',
    width: 20,
  },
  verticalLine: {
    flex: 1,
    width: 1,
    marginVertical: 4,
  },
  verticalContent: {
    flex: 1,
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 14,
  },
  stepDesc: {
    fontSize: 12,
    marginTop: 4,
  },

  // Common
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
