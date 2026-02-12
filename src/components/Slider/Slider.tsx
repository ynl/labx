/**
 * WeUI Slider Component for React Native
 *
 * A range slider built with PanResponder. Features a colored active track,
 * a circular thumb with shadow, and an optional value label on the right.
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SliderProps {
  /** Current value of the slider. */
  value?: number;
  /** Minimum value. @default 0 */
  min?: number;
  /** Maximum value. @default 100 */
  max?: number;
  /** Step increment. @default 1 */
  step?: number;
  /** Called when the value changes during a gesture. */
  onChange?: (value: number) => void;
  /** Show the current numeric value to the right of the track. */
  showValue?: boolean;
  /** If true the slider cannot be interacted with. */
  disabled?: boolean;
  /** Additional styles applied to the outermost container. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TRACK_HEIGHT = 2;
const THUMB_SIZE = 28;
const THUMB_BORDER_RADIUS = THUMB_SIZE / 2;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Clamp `v` between `lo` and `hi`, then round to the nearest `step`. */
function clampAndStep(v: number, lo: number, hi: number, step: number): number {
  const clamped = Math.min(Math.max(v, lo), hi);
  if (step <= 0) return clamped;
  const stepped = Math.round((clamped - lo) / step) * step + lo;
  // Avoid floating-point drift past the boundaries.
  return Math.min(Math.max(stepped, lo), hi);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  showValue = false,
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  // Track the current value internally so the thumb moves smoothly even when
  // the parent doesn't feed back a new `value` on every frame.
  const [internalValue, setInternalValue] = useState<number>(controlledValue ?? min);
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

  // We need to know the width of the track to convert pixel offsets to values.
  const trackWidth = useRef<number>(0);

  // Store the value at the point the user started dragging so we can compute
  // deltas from the original position rather than accumulating rounding errors.
  const startValue = useRef<number>(currentValue);

  // ------------------------------------------
  // Ratio helpers
  // ------------------------------------------

  const ratio = useMemo(() => {
    if (max === min) return 0;
    return (currentValue - min) / (max - min);
  }, [currentValue, min, max]);

  // ------------------------------------------
  // Update helper
  // ------------------------------------------

  const updateValue = useCallback(
    (nextValue: number) => {
      setInternalValue(nextValue);
      onChange?.(nextValue);
    },
    [onChange],
  );

  // ------------------------------------------
  // PanResponder
  // ------------------------------------------

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: () => {
          startValue.current = currentValue;
        },
        onPanResponderMove: (_evt, gestureState) => {
          if (trackWidth.current === 0) return;
          const deltaRatio = gestureState.dx / trackWidth.current;
          const deltaValue = deltaRatio * (max - min);
          const nextValue = clampAndStep(startValue.current + deltaValue, min, max, step);
          updateValue(nextValue);
        },
        onPanResponderRelease: (_evt, gestureState) => {
          if (trackWidth.current === 0) return;
          const deltaRatio = gestureState.dx / trackWidth.current;
          const deltaValue = deltaRatio * (max - min);
          const nextValue = clampAndStep(startValue.current + deltaValue, min, max, step);
          updateValue(nextValue);
        },
      }),
    [disabled, currentValue, min, max, step, updateValue],
  );

  // ------------------------------------------
  // Layout
  // ------------------------------------------

  const handleTrackLayout = useCallback((e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  }, []);

  // ------------------------------------------
  // Styles
  // ------------------------------------------

  const brandColor = theme.brandPrimary;
  const inactiveColor = theme.borderColor;

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        activeTrack: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: brandColor,
          width: `${ratio * 100}%` as unknown as number,
        },
        thumb: {
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: THUMB_BORDER_RADIUS,
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
          position: 'absolute',
          top: -(THUMB_SIZE - TRACK_HEIGHT) / 2,
          left: `${ratio * 100}%` as unknown as number,
          marginLeft: -(THUMB_SIZE / 2),
        },
        valueText: {
          color: theme.textSecondary,
        },
      }),
    [brandColor, ratio, theme.textSecondary],
  );

  // ------------------------------------------
  // Render
  // ------------------------------------------

  return (
    <View
      style={[
        styles.container,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.trackContainer}>
        <View
          style={[styles.track, { backgroundColor: inactiveColor }]}
          onLayout={handleTrackLayout}
        >
          {/* Active portion of the track */}
          <View
            style={[
              styles.activeTrackBase,
              { backgroundColor: brandColor, width: `${ratio * 100}%` as any },
            ]}
          />

          {/* Draggable thumb */}
          <View
            {...panResponder.panHandlers}
            style={[
              styles.thumbBase,
              { left: `${ratio * 100}%` as any },
            ]}
          />
        </View>
      </View>

      {showValue && (
        <View style={styles.valueLabelContainer}>
          <Text style={[styles.valueLabel, { color: theme.textSecondary }]}>
            {currentValue}
          </Text>
        </View>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Static Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.4,
  },
  trackContainer: {
    flex: 1,
    justifyContent: 'center',
    height: THUMB_SIZE,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    overflow: 'visible',
    position: 'relative',
  },
  activeTrackBase: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumbBase: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_BORDER_RADIUS,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: -(THUMB_SIZE - TRACK_HEIGHT) / 2,
    marginLeft: -(THUMB_SIZE / 2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  valueLabelContainer: {
    marginLeft: 12,
    minWidth: 32,
    alignItems: 'flex-end',
  },
  valueLabel: {
    fontSize: 14,
  },
});

export default Slider;
