import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, borderRadius } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FeedSkeletonProps {
  count?: number;
}

/**
 * FeedSkeleton - Loading placeholder cho Feed
 *
 * Features:
 * - Shimmer animation
 * - Multiple skeletons
 * - Responsive layout
 */
export const FeedSkeleton: React.FC<FeedSkeletonProps> = ({ count = 3 }) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmer.start();

    return () => shimmer.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonPost = () => (
    <View style={styles.skeletonContainer}>
      {/* Header */}
      <View style={styles.skeletonHeader}>
        <Animated.View
          style={[styles.skeletonAvatar, { opacity: shimmerOpacity }]}
        />
        <View style={styles.skeletonHeaderText}>
          <Animated.View
            style={[styles.skeletonTitle, { opacity: shimmerOpacity }]}
          />
          <Animated.View
            style={[styles.skeletonSubtitle, { opacity: shimmerOpacity }]}
          />
        </View>
      </View>

      {/* Image */}
      <Animated.View
        style={[styles.skeletonImage, { opacity: shimmerOpacity }]}
      />

      {/* Actions */}
      <View style={styles.skeletonActions}>
        <Animated.View
          style={[styles.skeletonActionButton, { opacity: shimmerOpacity }]}
        />
        <Animated.View
          style={[styles.skeletonActionButton, { opacity: shimmerOpacity }]}
        />
        <Animated.View
          style={[styles.skeletonActionButton, { opacity: shimmerOpacity }]}
        />
      </View>

      {/* Content */}
      <View style={styles.skeletonContent}>
        <Animated.View
          style={[styles.skeletonLine, { opacity: shimmerOpacity }]}
        />
        <Animated.View
          style={[
            styles.skeletonLine,
            styles.skeletonLineShort,
            { opacity: shimmerOpacity },
          ]}
        />
      </View>
    </View>
  );

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonPost key={index} />
      ))}
    </>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    skeletonContainer: {
      backgroundColor: colors.background.card,
      marginBottom: spacing.md,
    },

    // Header
    skeletonHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    skeletonAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background.elevated,
    },
    skeletonHeaderText: {
      marginLeft: spacing.sm,
      flex: 1,
    },
    skeletonTitle: {
      height: 14,
      width: '40%',
      backgroundColor: colors.background.elevated,
      borderRadius: borderRadius.sm,
      marginBottom: 6,
    },
    skeletonSubtitle: {
      height: 12,
      width: '60%',
      backgroundColor: colors.background.elevated,
      borderRadius: borderRadius.sm,
    },

    // Image
    skeletonImage: {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH * 0.75,
      backgroundColor: colors.background.elevated,
    },

    // Actions
    skeletonActions: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.md,
    },
    skeletonActionButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.background.elevated,
    },

    // Content
    skeletonContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
    },
    skeletonLine: {
      height: 12,
      backgroundColor: colors.background.elevated,
      borderRadius: borderRadius.sm,
      marginBottom: 6,
      width: '90%',
    },
    skeletonLineShort: {
      width: '60%',
    },
  });
