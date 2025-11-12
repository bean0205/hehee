import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
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

  const headerContent = (
    <View style={[styles.header, style]}>
      {/* Left side: Back button and Title */}
      <View style={styles.headerLeft}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={gradient || blur ? colors.neutral.white : colors.text.primary}
            />
          </TouchableOpacity>
        )}
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
      </View>

      {/* Right side: Action buttons */}
      <View style={styles.headerRight}>
        {actions.map((action, index) => (
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
              size={20}
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
        ))}
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
      paddingTop: spacing.xl + 20,
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
      paddingTop: spacing.xl + 20,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      minHeight: 56,
    },
    headerLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minWidth: 40,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      letterSpacing: 0.5,
      flex: 1,
    },
    headerTitleLight: {
      color: colors.neutral.white,
    },
    headerTitleWithBack: {
      marginLeft: spacing.xs,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    headerButtonLight: {
      backgroundColor: colors.neutral.white + '33', // 20% opacity
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

