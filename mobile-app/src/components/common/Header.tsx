import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
}

export const Header: React.FC<HeaderProps> = ({
  title,
  actions = [],
  showBackButton = false,
  onBackPress,
  gradient = false,
  gradientColors = ['#3B82F6', '#60A5FA', '#93C5FD'],
  blur = false,
  blurIntensity = 20,
  backgroundColor,
  style,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  // Determine layout style: centered title when back button exists and no gradient/blur
  const isCenteredLayout = showBackButton && !gradient && !blur;

  // Apply reduced padding only for headers with back button (no gradient/blur)
  const hasBackButtonOnly = showBackButton && !gradient && !blur;
  
  const headerContent = (
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={isCenteredLayout ? 28 : 24}
              color={gradient || blur ? colors.neutral.white : colors.text.primary}
            />
          </TouchableOpacity>
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
            <TouchableOpacity
              key={index}
              style={[
                styles.headerButton,
                (gradient || blur) && styles.headerButtonLight,
              ]}
              onPress={action.onPress}
              testID={action.testID}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name={action.icon as any}
                size={25}
                color={gradient || blur ? colors.neutral.white : colors.text.primary}
              />
              {action.badge !== undefined && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {action.badge}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : isCenteredLayout ? (
          <View style={{ width: 30 }} />
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

const createStyles = (colors: any) =>
  StyleSheet.create({
    headerGradient: {
      paddingTop: spacing.lg + 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    headerBlur: {
      overflow: 'hidden',
    },
    headerSimple: {
      paddingTop: spacing.lg + 40,
      paddingBottom: spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      backgroundColor: colors.background.card,
    },
    headerSimpleWithBack: {
      // paddingBottom: spacing.sm,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      // paddingVertical: spacing.md,
      // minHeight: 45,
    },
    headerWithBack: {
      // paddingHorizontal: 0,
      // paddingVertical: spacing.lg,
      // paddingBottom: spacing.sm,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    headerLeftWithBack: {
      gap: spacing.xs,
      paddingLeft: 0,
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minWidth: 30,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      letterSpacing: 0.5,
    },
    headerTitleCentered: {
      fontSize: typography.fontSize.lg,
      flex: 0,
    },
    headerTitleLight: {
      color: colors.neutral.white,
    },
    headerTitleWithBack: {
      marginLeft: spacing.xs,
      flex: 1,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      // backgroundColor: colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    headerButtonLight: {
      // backgroundColor: colors.neutral.white + '33', // 20% opacity
    },
    notificationBadge: {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: colors.error,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.neutral.white,
    },
    notificationBadgeText: {
      fontSize: 10,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
    },
  });


