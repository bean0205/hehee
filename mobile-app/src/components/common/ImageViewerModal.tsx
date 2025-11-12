import React from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Text,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageViewerModalProps {
  visible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  visible,
  images,
  initialIndex = 0,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Image Swiper */}
        <Swiper
          index={initialIndex}
          showsButtons={false}
          loop={false}
          dotColor="rgba(255, 255, 255, 0.4)"
          activeDotColor="#fff"
          paginationStyle={styles.pagination}
        >
          {images.map((uri, index) => (
            <View key={index} style={styles.slide}>
              <Image
                source={{ uri }}
                style={styles.image}
                resizeMode="contain"
              />
              {/* Image Counter */}
              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                  {index + 1} / {images.length}
                </Text>
              </View>
            </View>
          ))}
        </Swiper>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: spacing.lg,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: typography.fontWeight.bold,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  pagination: {
    bottom: 30,
  },
  counterContainer: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  counterText: {
    color: '#fff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
