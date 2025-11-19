import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { PhotoGalleryProps } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_MARGIN = 4;

/**
 * Smart PhotoGallery với layouts tự động:
 * - 1 ảnh: Full width
 * - 2 ảnh: 50/50 split
 * - 3 ảnh: 2/3 left, 1/3 right stacked
 * - 4+ ảnh: Grid 2x2 với "+N more" overlay
 */
export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, onImagePress }) => {
  if (!photos || photos.length === 0) return null;

  const photoCount = photos.length;

  // 1 photo - Full width
  if (photoCount === 1) {
    return (
      <TouchableOpacity
        style={styles.singlePhoto}
        onPress={() => onImagePress(photos, 0)}
        activeOpacity={0.95}
      >
        <Image source={{ uri: photos[0] }} style={styles.singleImage} resizeMode="cover" />
      </TouchableOpacity>
    );
  }

  // 2 photos - 50/50 split
  if (photoCount === 2) {
    return (
      <View style={styles.twoPhotosContainer}>
        <TouchableOpacity
          style={styles.halfPhoto}
          onPress={() => onImagePress(photos, 0)}
          activeOpacity={0.95}
        >
          <Image source={{ uri: photos[0] }} style={styles.halfImage} resizeMode="cover" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.halfPhoto}
          onPress={() => onImagePress(photos, 1)}
          activeOpacity={0.95}
        >
          <Image source={{ uri: photos[1] }} style={styles.halfImage} resizeMode="cover" />
        </TouchableOpacity>
      </View>
    );
  }

  // 3 photos - Big left, 2 small right
  if (photoCount === 3) {
    return (
      <View style={styles.threePhotosContainer}>
        <TouchableOpacity
          style={styles.bigPhoto}
          onPress={() => onImagePress(photos, 0)}
          activeOpacity={0.95}
        >
          <Image source={{ uri: photos[0] }} style={styles.bigImage} resizeMode="cover" />
        </TouchableOpacity>
        <View style={styles.smallPhotosColumn}>
          <TouchableOpacity
            style={styles.smallPhoto}
            onPress={() => onImagePress(photos, 1)}
            activeOpacity={0.95}
          >
            <Image source={{ uri: photos[1] }} style={styles.smallImage} resizeMode="cover" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.smallPhoto}
            onPress={() => onImagePress(photos, 2)}
            activeOpacity={0.95}
          >
            <Image source={{ uri: photos[2] }} style={styles.smallImage} resizeMode="cover" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 4+ photos - Grid 2x2 với overlay "+N more"
  const displayPhotos = photos.slice(0, 4);
  const remainingCount = photoCount - 4;

  return (
    <View style={styles.gridContainer}>
      {displayPhotos.map((photo, index) => (
        <TouchableOpacity
          key={index}
          style={styles.gridPhoto}
          onPress={() => onImagePress(photos, index)}
          activeOpacity={0.95}
        >
          <Image source={{ uri: photo }} style={styles.gridImage} resizeMode="cover" />
          {index === 3 && remainingCount > 0 && (
            <View style={styles.overlay}>
              <View style={styles.overlayContent}>
                <Image source={{ uri: photo }} style={styles.overlayBlurImage} blurRadius={10} />
                <View style={styles.overlayTextContainer}>
                  <Image
                    source={require('../../../../assets/icon.png')}
                    style={styles.overlayIcon}
                  />
                  <View style={styles.overlayCountBadge}>
                    <Image
                      source={require('../../../../assets/icon.png')}
                      style={styles.overlayIconSmall}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // Single Photo
  singlePhoto: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75, // 4:3 aspect ratio
    backgroundColor: '#f0f0f0',
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },

  // Two Photos
  twoPhotosContainer: {
    flexDirection: 'row',
    gap: PHOTO_MARGIN,
  },
  halfPhoto: {
    flex: 1,
    height: SCREEN_WIDTH * 0.6,
    backgroundColor: '#f0f0f0',
  },
  halfImage: {
    width: '100%',
    height: '100%',
  },

  // Three Photos
  threePhotosContainer: {
    flexDirection: 'row',
    gap: PHOTO_MARGIN,
    height: SCREEN_WIDTH * 0.6,
  },
  bigPhoto: {
    flex: 2,
    backgroundColor: '#f0f0f0',
  },
  bigImage: {
    width: '100%',
    height: '100%',
  },
  smallPhotosColumn: {
    flex: 1,
    gap: PHOTO_MARGIN,
  },
  smallPhoto: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  smallImage: {
    width: '100%',
    height: '100%',
  },

  // Grid (4+ photos)
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PHOTO_MARGIN,
  },
  gridPhoto: {
    width: (SCREEN_WIDTH - PHOTO_MARGIN) / 2,
    height: (SCREEN_WIDTH - PHOTO_MARGIN) / 2,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },

  // Overlay for "+N more"
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBlurImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  overlayTextContainer: {
    alignItems: 'center',
    gap: 8,
  },
  overlayIcon: {
    width: 48,
    height: 48,
    tintColor: 'white',
    opacity: 0.9,
  },
  overlayCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  overlayIconSmall: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
});
