import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const { width, height } = Dimensions.get('window');

interface WalkthroughScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: '🌍',
    title: 'Khám phá Thế giới',
    description: 'Ghi lại từng khoảnh khắc đáng nhớ và chia sẻ những trải nghiệm tuyệt vời của bạn',
    gradient: ['#667eea', '#764ba2', '#f093fb'],
    decorEmoji: ['✈️', '🗺️', '📸'],
  },
  {
    icon: '📍',
    title: 'Đánh dấu địa điểm',
    description: 'Thêm pin vào bản đồ, lưu ảnh và tạo kỷ niệm cho mỗi chuyến đi của bạn',
    gradient: ['#f093fb', '#f5576c', '#ffd676'],
    decorEmoji: ['🏔️', '🏖️', '🌆'],
  },
  {
    icon: '🎯',
    title: 'Lập kế hoạch chuyến đi',
    description: 'Tạo danh sách ước mơ và lên kế hoạch cho những cuộc phiêu lưu tiếp theo',
    gradient: ['#ffd676', '#43e97b', '#38f9d7'],
    decorEmoji: ['🎒', '🧭', '⛺'],
  },
  {
    icon: '👥',
    title: 'Kết nối bạn bè',
    description: 'Theo dõi bạn bè, xem hoạt động và cùng nhau khám phá thế giới',
    gradient: ['#38f9d7', '#667eea', '#a8edea'],
    decorEmoji: ['🤝', '💬', '❤️'],
  },
];

export const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors, isDarkMode } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={slides[currentIndex].gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Skip button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={styles.skipBlur}>
            <Text style={styles.skipText}>Bỏ qua</Text>
          </BlurView>
        </TouchableOpacity>
      )}

      {/* Decorative emojis */}
      <View style={styles.decorContainer} pointerEvents="none">
        {slides[currentIndex].decorEmoji.map((emoji, idx) => (
          <Text key={idx} style={[styles.decorEmoji, styles[`decorEmoji${idx + 1}` as keyof typeof styles]]}>
            {emoji}
          </Text>
        ))}
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {slides.map((slide, index) => (
            <View key={index} style={[styles.slide, { width }]}>
              <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                  <Text style={styles.icon}>{slide.icon}</Text>
                </View>
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      <BlurView intensity={100} tint={isDarkMode ? 'dark' : 'light'} style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <Animated.View
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
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? '🚀 Bắt đầu ngay' : 'Tiếp tục'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  skipButton: {
    position: 'absolute',
    top: spacing.xl + 40,
    right: spacing.lg,
    zIndex: 10,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  skipBlur: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  skipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: '#FFFFFF',
  },
  decorContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  decorEmoji: {
    position: 'absolute',
    fontSize: 40,
    opacity: 0.15,
  },
  decorEmoji1: {
    top: height * 0.15,
    left: width * 0.1,
  },
  decorEmoji2: {
    top: height * 0.25,
    right: width * 0.15,
  },
  decorEmoji3: {
    bottom: height * 0.35,
    left: width * 0.2,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl * 1.5,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    fontSize: 70,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: typography.fontSize.lg,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    paddingHorizontal: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl + 20,
    paddingTop: spacing.lg,
    zIndex: 3,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 30,
  },
  button: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
