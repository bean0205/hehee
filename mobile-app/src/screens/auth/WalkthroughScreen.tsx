import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const { width } = Dimensions.get('window');

interface WalkthroughScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: '👋',
    title: 'Chào mừng!',
    description: 'Khám phá thế giới và lưu giữ từng khoảnh khắc đáng nhớ trên bản đồ của bạn',
  },
  {
    icon: '📍',
    title: 'Ghi lại mọi hành trình',
    description: 'Đánh dấu những nơi bạn đã đến, thêm ảnh và ghi chú về trải nghiệm của bạn',
  },
  {
    icon: '✈️',
    title: 'Lên kế hoạch cho chuyến đi mơ ước',
    description: 'Tạo danh sách những nơi muốn đến và lập kế hoạch cho chuyến phiêu lưu tiếp theo',
  },
];

export const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            <Text style={styles.icon}>{slide.icon}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Bắt đầu' : 'Tiếp tục'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 100,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.lg,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral.gray300,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary.main,
    width: 24,
  },
  button: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.neutral.white,
  },
});
