import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useLanguage } from '../../i18n/LanguageContext';

export const SplashScreen: React.FC = () => {
  const { t } = useLanguage();

  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const loadingOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo animation - scale and fade in
    logoScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });

    // Title animation - fade in and slide up
    titleOpacity.value = withDelay(
      300,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      })
    );
    titleTranslateY.value = withDelay(
      300,
      withSpring(0, {
        damping: 15,
        stiffness: 100,
      })
    );

    // Subtitle animation - fade in and slide up
    subtitleOpacity.value = withDelay(
      600,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      })
    );
    subtitleTranslateY.value = withDelay(
      600,
      withSpring(0, {
        damping: 15,
        stiffness: 100,
      })
    );

    // Loading indicator animation
    loadingOpacity.value = withDelay(
      900,
      withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      })
    );
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const loadingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  return (
    <LinearGradient
      colors={[colors.primary.main, colors.primary.dark, '#1E40AF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo with animation */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="map-marker"
              size={64}
              color={colors.neutral.white}
            />
          </View>
        </Animated.View>

        {/* Title with animation */}
        <Animated.View style={titleAnimatedStyle}>
          <Text style={styles.title}>PinYourWord</Text>
        </Animated.View>

        {/* Subtitle with animation */}
        <Animated.View style={subtitleAnimatedStyle}>
          <Text style={styles.subtitle}>{t('splash.subtitle')}</Text>
        </Animated.View>

        {/* Loading indicator with animation */}
        <Animated.View style={[styles.loadingContainer, loadingAnimatedStyle]}>
          <ActivityIndicator size="small" color={colors.neutral.white} />
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing['2xl'],
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    marginBottom: spacing.md,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.neutral.white,
    opacity: 0.95,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    lineHeight: typography.lineHeight.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    marginTop: spacing['3xl'],
    alignItems: 'center',
  },
});
