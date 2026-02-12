import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface GalleryImage {
  source: ImageSourcePropType;
  caption?: string;
}

export interface GalleryProps {
  visible: boolean;
  images: GalleryImage[];
  /** Initial image index */
  initialIndex?: number;
  onClose?: () => void;
  /** Show delete button */
  showDelete?: boolean;
  onDelete?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

export function Gallery({
  visible,
  images,
  initialIndex = 0,
  onClose,
  showDelete = false,
  onDelete,
  style,
}: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const idx = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (idx >= 0 && idx < images.length) {
      setCurrentIndex(idx);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.container, style]}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onMomentumScrollEnd={handleScroll}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <Pressable style={styles.imageWrap} onPress={onClose}>
              <Image
                source={item.source}
                style={styles.image}
                resizeMode="contain"
              />
            </Pressable>
          )}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.counter}>
            {currentIndex + 1} / {images.length}
          </Text>
          {images[currentIndex]?.caption != null && (
            <Text style={styles.caption} numberOfLines={2}>
              {images[currentIndex].caption}
            </Text>
          )}
          {showDelete && (
            <Pressable
              style={styles.deleteBtn}
              onPress={() => onDelete?.(currentIndex)}
            >
              <Text style={styles.deleteText}>删除</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imageWrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 16,
    alignItems: 'center',
  },
  counter: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 4,
  },
  caption: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
  deleteBtn: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  deleteText: {
    color: '#fa5151',
    fontSize: 16,
  },
});
