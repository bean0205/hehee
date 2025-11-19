import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StatusBar,
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
import { spacing } from '../../theme/spacing';

export interface HeaderAction {
  icon: string;
  onPress: () => void;
  badge?: number | string;
  testID?: string;
}

export interface HeaderProps {
  title: string;
  actions?: HeaderAction[];
  showBackButton?: boolean;
  onBackPress?: () => void;
  gradient?: boolean;
  gradientColors?: string[];
  blur?: boolean;
  blurIntensity?: number;
  backgroundColor?: string;
  style?: ViewStyle;
  // New props for Instagram-style header
  variant?: 'default' | 'logo' | 'search';
  logo?: string; // Logo text or image
  subtitle?: string;
  showSearch?: boolean;
  onSearchPress?: () => void;
}

// Animated Button Component
const AnimatedButton: React.FC<{
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
  testID?: string;
  hitSlop?: any;
}> = ({ onPress, children, style, testID, hitSlop }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      testID={testID}
      hitSlop={hitSlop}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const Header: React.FC<HeaderProps> = ({
  title,
  actions = [],
  showBackButton = false,
  onBackPress,
  gradient = false,
  gradientColors = ['#667eea', '#764ba2', '#f093fb'],
  blur = false,
  blurIntensity = 20,
  backgroundColor,
  style,
  variant = 'default',
  logo,
  subtitle,
  showSearch = false,
  onSearchPress,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => createStyles(colors, insets), [colors, insets]);

  // Badge animation
  const badgeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Subtle pulse animation for badges
    Animated.loop(
      Animated.sequence([
        Animated.timing(badgeScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(badgeScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Determine layout style: centered title when back button exists and no gradient/blur
  const isCenteredLayout = showBackButton && !gradient && !blur;

  // Apply reduced padding only for headers with back button (no gradient/blur)
  const hasBackButtonOnly = showBackButton && !gradient && !blur;

  // Render Logo Header (Instagram style)
  const renderLogoHeader = () => (
    <View style={[styles.header, styles.logoHeader]}>
      <View style={styles.headerLeft}>
        {showBackButton && (
          <AnimatedButton
            onPress={onBackPress || (() => {})}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={26}
              color={colors.text.primary}
            />
          </AnimatedButton>
        )}
      </View>

      <View style={styles.logoContainer}>
        <Text style={styles.logoText} numberOfLines={1}>
          {logo || title}
        </Text>
        {subtitle && (
          <Text style={styles.logoSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.headerRight}>
        {showSearch && (
          <AnimatedButton
            onPress={onSearchPress || (() => {})}
            style={styles.headerButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={24}
              color={colors.text.primary}
            />
          </AnimatedButton>
        )}
        {actions.map((action, index) => (
          <AnimatedButton
            key={index}
            onPress={action.onPress}
            style={[styles.headerButton, { marginLeft: 8 }]}
            testID={action.testID}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name={action.icon as any}
              size={24}
              color={colors.text.primary}
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
        ))}
      </View>
    </View>
  );

  const headerContent = variant === 'logo' ? renderLogoHeader() : (
    <View style={[
      styles.header,
      hasBackButtonOnly && styles.headerWithBack,
      style
    ]}>
      {/* Left side: Back button */}
      <View style={[
        styles.headerLeft,
        hasBackButtonOnly && styles.headerLeftWithBack
      ]}>
        {showBackButton && (
          <AnimatedButton
            onPress={onBackPress || (() => {})}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={26}
              color={gradient || blur ? colors.neutral.white : colors.text.primary}
            />
          </AnimatedButton>
        )}
        {!isCenteredLayout && (
          <Text
            style={[
              styles.headerTitle,
              (gradient || blur) && styles.headerTitleLight,
              showBackButton && styles.headerTitleWithBack,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
      </View>

      {/* Center: Title (only when centered layout) */}
      {isCenteredLayout && (
        <View style={styles.headerCenter}>
          <Text
            style={[
              styles.headerTitle,
              styles.headerTitleCentered,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      )}

      {/* Right side: Action buttons or spacer */}
      <View style={styles.headerRight}>
        {actions.length > 0 ? (
          actions.map((action, index) => (
            <AnimatedButton
              key={index}
              onPress={action.onPress}
              style={[
                styles.headerButton,
                (gradient || blur) && styles.headerButtonLight,
                index > 0 && { marginLeft: 8 },
              ]}
              testID={action.testID}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name={action.icon as any}
                size={24}
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
        ) : isCenteredLayout ? (
          <View style={{ width: 40 }} />
        ) : null}
      </View>
    </View>
  );

  // With gradient and blur
  if (gradient && blur) {
    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
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
        colors={gradientColors}
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
        hasBackButtonOnly && styles.headerSimpleWithBack,
        backgroundColor && { backgroundColor },
        style,
      ]}
    >
      {headerContent}
    </View>
  );
};

const createStyles = (colors: any, insets: any) =>
  StyleSheet.create({
    headerGradient: {
      paddingTop: insets.top + spacing.md,
      shadowColor: colors.primary.main,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6,
    },
    headerBlur: {
      overflow: 'hidden',
    },
    headerSimple: {
      paddingTop: insets.top + spacing.md,
      paddingBottom: spacing.sm,
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
      backgroundColor: colors.background.card,
    },
    headerSimpleWithBack: {
      paddingTop: insets.top + spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
      minHeight: 50,
    },
    headerWithBack: {
      paddingBottom: spacing.xs,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
      minWidth: 40,
    },
    headerLeftWithBack: {
      gap: spacing.sm,
      paddingLeft: 0,
    },
    headerCenter: {
      flex: 2,
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: 40,
      justifyContent: 'flex-end',
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    headerTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      letterSpacing: -0.3,
    },
    headerTitleCentered: {
      fontSize: typography.fontSize.lg,
      flex: 0,
      fontWeight: typography.fontWeight.semiBold,
    },
    headerTitleLight: {
      color: colors.neutral.white,
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    headerTitleWithBack: {
      marginLeft: spacing.xs,
      flex: 1,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    headerButtonLight: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
    },
    notificationBadge: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: colors.error,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      paddingHorizontal: 4,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.background.card,
    },
    notificationBadgeText: {
      fontSize: 9,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
      includeFontPadding: false,
      textAlign: 'center',
    },
    // Logo Header Styles (Instagram style)
    logoHeader: {
      paddingHorizontal: spacing.md,
    },
    logoContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      fontFamily: Platform.select({
        ios: 'Cochin',
        android: 'serif',
      }),
      letterSpacing: 0.5,
    },
    logoSubtitle: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.secondary,
      marginTop: 2,
    },
  });


