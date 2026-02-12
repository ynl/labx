/**
 * WeUI Uploader Component for React Native
 *
 * Displays a grid of image thumbnails (80x80) with upload status overlays
 * and an add (+) button to trigger new uploads.
 */

import React, { useMemo } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UploaderFile {
  /** URI of the image to display. */
  url: string;
  /** Upload status. When omitted, treated as `'done'`. */
  status?: 'uploading' | 'failed' | 'done';
  /** Upload progress from 0 to 100 (only relevant when status is `'uploading'`). */
  progress?: number;
}

export interface UploaderProps {
  /** Array of files / images to display. */
  files?: UploaderFile[];
  /** Maximum number of files allowed. @default 9 */
  maxCount?: number;
  /** Called when the add (+) button is pressed. */
  onAdd?: () => void;
  /** Called with the index of the file to remove. */
  onRemove?: (index: number) => void;
  /** Called with the index of the file to preview. */
  onPreview?: (index: number) => void;
  /** Optional title shown above the grid. */
  title?: string;
  /** Additional styles applied to the outermost container. */
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const THUMBNAIL_SIZE = 80;
const THUMBNAIL_GAP = 10;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ThumbnailProps {
  file: UploaderFile;
  index: number;
  onRemove?: (index: number) => void;
  onPreview?: (index: number) => void;
  overlayColor: string;
  failedColor: string;
  textColor: string;
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  file,
  index,
  onRemove,
  onPreview,
  overlayColor,
  failedColor,
  textColor,
}) => {
  const status = file.status ?? 'done';
  const progress = file.progress ?? 0;

  return (
    <View style={styles.thumbnailWrapper}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPreview?.(index)}
        style={styles.thumbnailTouchable}
      >
        <Image source={{ uri: file.url }} style={styles.thumbnailImage} />

        {/* Uploading overlay */}
        {status === 'uploading' && (
          <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
            {/* Simple progress bar */}
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(Math.max(progress, 0), 100)}%` as any },
                ]}
              />
            </View>
          </View>
        )}

        {/* Failed overlay */}
        {status === 'failed' && (
          <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
            <Text style={[styles.failedIcon, { color: failedColor }]}>!</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Remove button */}
      {onRemove && (
        <TouchableOpacity
          style={styles.removeButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={() => onRemove(index)}
        >
          <View style={styles.removeButtonInner}>
            <Text style={styles.removeButtonText}>{'\u00D7'}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const Uploader: React.FC<UploaderProps> = ({
  files = [],
  maxCount = 9,
  onAdd,
  onRemove,
  onPreview,
  title,
  style,
}) => {
  const theme = useTheme();

  const showAddButton = files.length < maxCount;

  const themeColors = useMemo(
    () => ({
      overlayColor: 'rgba(0,0,0,0.5)',
      failedColor: theme.brandCancel,
      textColor: theme.textSecondary,
      borderColor: theme.borderColor,
      bgColor: theme.bgDefault,
      titleColor: theme.textSecondary,
      addColor: theme.textPlaceholder,
    }),
    [theme],
  );

  return (
    <View style={[styles.container, style]}>
      {/* Title row */}
      {title !== undefined && (
        <View style={styles.titleRow}>
          <Text style={[styles.titleText, { color: themeColors.titleColor }]}>
            {title}
          </Text>
          <Text style={[styles.countText, { color: themeColors.titleColor }]}>
            {files.length}/{maxCount}
          </Text>
        </View>
      )}

      {/* Grid */}
      <View style={styles.grid}>
        {files.map((file, index) => (
          <Thumbnail
            key={`uploader-thumb-${index}`}
            file={file}
            index={index}
            onRemove={onRemove}
            onPreview={onPreview}
            overlayColor={themeColors.overlayColor}
            failedColor={themeColors.failedColor}
            textColor={themeColors.textColor}
          />
        ))}

        {/* Add button */}
        {showAddButton && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onAdd}
            style={[
              styles.addButton,
              {
                borderColor: themeColors.borderColor,
                backgroundColor: themeColors.bgColor,
              },
            ]}
          >
            <Text style={[styles.addIcon, { color: themeColors.addColor }]}>+</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontSize: 14,
  },
  countText: {
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  thumbnailWrapper: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    marginRight: THUMBNAIL_GAP,
    marginBottom: THUMBNAIL_GAP,
    position: 'relative',
  },
  thumbnailTouchable: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 4,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  progressBarBackground: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  failedIcon: {
    fontSize: 24,
    fontWeight: '700',
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    zIndex: 1,
  },
  removeButtonInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
  },
  addButton: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THUMBNAIL_GAP,
    marginBottom: THUMBNAIL_GAP,
  },
  addIcon: {
    fontSize: 36,
    fontWeight: '200',
    lineHeight: 40,
  },
});

export default Uploader;
