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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const { width, height } = Dimensions.get('window');

interface WalkthroughScreenProps {
  onComplete: () => void;
}

export const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();

  const slides = [
    {
      icon: 'earth',
      title: t('walkthrough.discoverWorld'),
      description: t('walkthrough.discoverDescription'),
      gradient: ['#667eea', '#764ba2', '#f093fb'],
      decorIcons: [
        { name: 'airplane', library: 'MaterialCommunityIcons' },
        { name: 'map', library: 'MaterialCommunityIcons' },
        { name: 'camera', library: 'MaterialCommunityIcons' },
      ],
    },
    {
      icon: 'map-marker',
      title: t('walkthrough.markPlaces'),
      description: t('walkthrough.markPlacesDescription'),
      gradient: ['#f093fb', '#f5576c', '#ffd676'],
      decorIcons: [
        { name: 'terrain', library: 'MaterialCommunityIcons' },
        { name: 'beach', library: 'MaterialCommunityIcons' },
        { name: 'city-variant', library: 'MaterialCommunityIcons' },
      ],
    },
    {
      icon: 'target',
      title: t('walkthrough.planTrip'),
      description: t('walkthrough.planTripDescription'),
      gradient: ['#ffd676', '#43e97b', '#38f9d7'],
      decorIcons: [
        { name: 'bag-personal', library: 'MaterialCommunityIcons' },
        { name: 'compass', library: 'MaterialCommunityIcons' },
        { name: 'tent', library: 'MaterialCommunityIcons' },
      ],
    },
    {
      icon: 'account-group',
      title: t('walkthrough.connectFriends'),
      description: t('walkthrough.connectFriendsDescription'),
      gradient: ['#38f9d7', '#667eea', '#a8edea'],
      decorIcons: [
        { name: 'handshake', library: 'MaterialCommunityIcons' },
        { name: 'comment', library: 'MaterialCommunityIcons' },
        { name: 'heart', library: 'MaterialCommunityIcons' },
      ],
    },
  ];
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
        colors={slides[currentIndex].gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Skip button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={styles.skipBlur}>
            <Text style={styles.skipText}>{t('common.skip')}</Text>
          </BlurView>
        </TouchableOpacity>
      )}

      {/* Decorative icons */}
      <View style={styles.decorContainer} pointerEvents="none">
        {slides[currentIndex].decorIcons.map((icon, idx) => (
          <MaterialCommunityIcons
            key={idx}
            name={icon.name as any}
            size={40}
            color={colors.neutral.white}
            style={[styles.decorIcon, styles[`decorIcon${idx + 1}` as keyof typeof styles]]}
          />
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
                  <MaterialCommunityIcons
                    name={slide.icon as any}
                    size={70}
                    color={colors.neutral.white}
                  />
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
            <MaterialCommunityIcons
              name={currentIndex === slides.length - 1 ? 'rocket-launch' : 'arrow-right'}
              size={20}
              color={colors.neutral.white}
              style={{ marginRight: spacing.xs }}
            />
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Bắt đầu ngay' : 'Tiếp tục'}
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
    color: colors.neutral.white,
  },
  decorContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  decorIcon: {
    position: 'absolute',
    opacity: 0.15,
  },
  decorIcon1: {
    top: height * 0.15,
    left: width * 0.1,
  },
  decorIcon2: {
    top: height * 0.25,
    right: width * 0.15,
  },
  decorIcon3: {
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
    backgroundColor: colors.neutral.white + '40', // 25% opacity
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: spacing.md,
    textShadowColor: colors.neutral.black + '33', // 20% opacity
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: typography.fontSize.lg,
    color: colors.neutral.white,
    textAlign: 'center',
    lineHeight: 28,
    opacity: 0.95,
    textShadowColor: colors.neutral.black + '26', // 15% opacity
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
    backgroundColor: colors.neutral.white + '4D', // 30% opacity
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: colors.neutral.white,
    width: 30,
  },
  button: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: spacing.md + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    letterSpacing: 0.5,
  },
});
