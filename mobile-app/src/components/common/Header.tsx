import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

// Constants
const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };
const BADGE_PULSE_DURATION = 2000;
const ANIMATION_CONFIG = {
  tension: 300,
  friction: 20,
};

export interface HeaderAction {
  icon: string;
  onPress: () => void;
  badge?: number | string;
  testID?: string;
  disabled?: boolean;
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: HeaderAction[];
  showBackButton?: boolean;
  onBackPress?: () => void;
  gradient?: boolean;
  gradientColors?: string[];
  blur?: boolean;
  blurIntensity?: number;
  backgroundColor?: string;
  transparent?: boolean;
  centerTitle?: boolean;
  style?: ViewStyle;
  elevation?: number;
}

// Animated Button Component
const AnimatedButton: React.FC<{
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
  testID?: string;
  disabled?: boolean;
}> = ({ onPress, children, style, testID, disabled = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
      ...ANIMATION_CONFIG,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      ...ANIMATION_CONFIG,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      testID={testID}
      hitSlop={HIT_SLOP}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }], opacity: disabled ? 0.5 : 1 }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions = [],
  showBackButton = false,
  onBackPress,
  gradient = false,
  gradientColors,
  blur = false,
  blurIntensity = 20,
  backgroundColor,
  transparent = false,
  centerTitle = false,
  style,
  elevation = 4,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // Default gradient colors from theme
  const defaultGradientColors = [colors.primary.main, colors.primary.dark || colors.primary.main];
  const finalGradientColors = gradientColors || defaultGradientColors;

  const styles = React.useMemo(() => createStyles(colors, insets, elevation), [colors, insets, elevation]);

  // Badge animation - only animate when badge exists
  const badgeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const hasBadge = actions.some(action => action.badge !== undefined);
    if (!hasBadge) return;

    // Subtle pulse animation for badges
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(badgeScale, {
          toValue: 1.15,
          duration: BADGE_PULSE_DURATION / 2,
          useNativeDriver: true,
        }),
        Animated.timing(badgeScale, {
          toValue: 1,
          duration: BADGE_PULSE_DURATION / 2,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [actions]);

  // Determine if title should be centered
  const shouldCenterTitle = centerTitle || (showBackButton && !gradient && !blur);

  const headerContent = (
    <View style={[styles.header, transparent && styles.headerTransparent]}>
      {/* Left side: Back button + Title (if not centered) */}
      <View style={styles.headerLeft}>
        {showBackButton && (
          <AnimatedButton
            onPress={onBackPress || (() => {})}
            style={[
              styles.backButton,
              gradient || blur ? styles.backButtonLight : styles.backButtonDefault,
            ]}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={gradient || blur ? colors.neutral.white : colors.text.primary}
            />
          </AnimatedButton>
        )}
        {!shouldCenterTitle && (
          <View style={[styles.titleContainer, showBackButton && styles.titleWithBack]}>
            <Text
              style={[
                styles.headerTitle,
                (gradient || blur) && styles.headerTitleLight,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.headerSubtitle,
                  (gradient || blur) && styles.headerSubtitleLight,
                ]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Center: Title (only when centered layout) */}
      {shouldCenterTitle && (
        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.headerTitle,
              styles.headerTitleCentered,
              (gradient || blur) && styles.headerTitleLight,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.headerSubtitle,
                styles.headerSubtitleCentered,
                (gradient || blur) && styles.headerSubtitleLight,
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}

      {/* Right side: Action buttons */}
      <View style={styles.headerRight}>
        {actions.length > 0 ? (
          actions.map((action, index) => (
            <AnimatedButton
              key={index}
              onPress={action.onPress}
              style={[
                styles.headerButton,
                gradient || blur ? styles.headerButtonLight : styles.headerButtonDefault,
              ]}
              testID={action.testID}
              disabled={action.disabled}
            >
              <MaterialCommunityIcons
                name={action.icon as any}
                size={22}
                color={gradient || blur ? colors.neutral.white : colors.text.primary}
              />
              {action.badge !== undefined && (
                <Animated.View
                  style={[
                    styles.notificationBadge,
                    { transform: [{ scale: badgeScale }] }
                  ]}
                >
                  <Text style={styles.notificationBadgeText}>
                    {typeof action.badge === 'number' && action.badge > 99 ? '99+' : action.badge}
                  </Text>
                </Animated.View>
              )}
            </AnimatedButton>
          ))
        ) : shouldCenterTitle ? (
          <View style={styles.spacer} />
        ) : null}
      </View>
    </View>
  );

  // Transparent mode (for scroll-based headers)
  if (transparent) {
    return <View style={[styles.headerTransparentContainer, style]}>{headerContent}</View>;
  }

  // With gradient and blur
  if (gradient && blur) {
    return (
      <LinearGradient
        colors={finalGradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, style]}
      >
        <BlurView intensity={blurIntensity} tint="light" style={styles.headerBlur}>
          {headerContent}
        </BlurView>
      </LinearGradient>
    );
  }

  // With gradient only
  if (gradient) {
    return (
      <LinearGradient
        colors={finalGradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, style]}
      >
        {headerContent}
      </LinearGradient>
    );
  }

  // Simple header with background color
  return (
    <View
      style={[
        styles.headerSimple,
        backgroundColor && { backgroundColor },
        style,
      ]}
    >
      {headerContent}
    </View>
  );
};

const createStyles = (colors: any, insets: any, elevation: number) =>
  StyleSheet.create({
    // Container styles
    headerGradient: {
      paddingTop: insets.top + spacing.md,
      shadowColor: colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: elevation,
    },
    headerBlur: {
      overflow: 'hidden',
    },
    headerSimple: {
      paddingTop: insets.top + spacing.md,
      backgroundColor: colors.background.card,
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: elevation,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border.light,
    },
    headerTransparentContainer: {
      paddingTop: insets.top,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    },
    headerTransparent: {
      backgroundColor: 'transparent',
    },

    // Main header content
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      minHeight: 56,
    },

    // Left section
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
      minWidth: 0,
    },

    // Center section
    headerCenter: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl * 2,
      pointerEvents: 'none',
    },

    // Right section
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      justifyContent: 'flex-end',
    },
    spacer: {
      width: 44,
    },

    // Back button
    backButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButtonDefault: {
      // No background/border for clean look
    },
    backButtonLight: {
      // No background/border for clean look
    },

    // Title
    titleContainer: {
      flex: 1,
      minWidth: 0,
    },
    titleWithBack: {
      marginLeft: spacing.xs,
    },
    headerTitle: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      letterSpacing: -0.5,
      lineHeight: typography.fontSize['2xl'] * 1.2,
    },
    headerTitleCentered: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      textAlign: 'center',
    },
    headerTitleLight: {
      color: colors.neutral.white,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },

    // Subtitle
    headerSubtitle: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.secondary,
      marginTop: 2,
      letterSpacing: -0.2,
    },
    headerSubtitleCentered: {
      textAlign: 'center',
    },
    headerSubtitleLight: {
      color: 'rgba(255, 255, 255, 0.9)',
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },

    // Action buttons
    headerButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    headerButtonDefault: {
      // No background/border for clean look
    },
    headerButtonLight: {
      // No background/border for clean look
    },

    // Badge
    notificationBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: colors.error,
      borderRadius: borderRadius.full,
      minWidth: 20,
      height: 20,
      paddingHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2.5,
      borderColor: colors.background.card,
      shadowColor: colors.error,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 6,
    },
    notificationBadgeText: {
      fontSize: 10,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
      includeFontPadding: false,
      textAlign: 'center',
    },
  });
