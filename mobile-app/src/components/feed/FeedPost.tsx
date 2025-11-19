import React, { useState, useRef, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Avatar } from '../common/Avatar';
import { PhotoGallery } from './photoGallery/PhotoGallery';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export interface FeedPostData {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  location?: {
    name: string;
    country?: string;
  };
  caption?: string;
  photos: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  timestamp: string;
}

interface FeedPostProps {
  post: FeedPostData;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onImagePress: (photos: string[], index: number) => void;
  onUserPress: (userId: string) => void;
  onLocationPress?: (location: any) => void;
}

/**
 * FeedPost Component - Optimized với React.memo
 *
 * Performance optimizations:
 * - React.memo để prevent re-renders
 * - Double-tap to like animation
 * - Haptic feedback (iOS)
 * - Debounced like action
 */
const FeedPostComponent: React.FC<FeedPostProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onImagePress,
  onUserPress,
  onLocationPress,
}) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [localLiked, setLocalLiked] = useState(post.isLiked);
  const [localLikeCount, setLocalLikeCount] = useState(post.likes);
  const [localBookmarked, setLocalBookmarked] = useState(post.isBookmarked);

  // Double-tap animation
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const lastTap = useRef<number | null>(null);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (!localLiked) {
        handleLike();

        // Animate heart
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.delay(500),
          Animated.spring(scaleAnim, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else {
      lastTap.current = now;
    }
  };

  const handleLike = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newLiked = !localLiked;
    setLocalLiked(newLiked);
    setLocalLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    onLike(post.id);
  };

  const handleBookmark = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setLocalBookmarked(!localBookmarked);
    onBookmark(post.id);
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMs = now.getTime() - postTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('feed.justNow');
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return postTime.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onUserPress(post.user.id)}
          activeOpacity={0.7}
        >
          <Avatar uri={post.user.avatar} size={40} />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>{post.user.name}</Text>
            {post.location && (
              <TouchableOpacity
                onPress={() => onLocationPress?.(post.location)}
                activeOpacity={0.7}
              >
                <View style={styles.locationContainer}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={12}
                    color={colors.primary.main}
                  />
                  <Text style={styles.locationText}>{post.location.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton} activeOpacity={0.7}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Photos - với double-tap to like */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleDoubleTap}
        style={styles.photosContainer}
      >
        <PhotoGallery photos={post.photos} onImagePress={onImagePress} />

        {/* Double-tap heart animation */}
        <Animated.View
          style={[
            styles.doubleTapHeart,
            {
              transform: [{ scale: scaleAnim }],
              opacity: scaleAnim,
            },
          ]}
          pointerEvents="none"
        >
          <MaterialCommunityIcons name="heart" size={100} color="white" />
        </Animated.View>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={localLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={localLiked ? colors.error : colors.text.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment(post.id)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="comment-outline"
              size={28}
              color={colors.text.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onShare(post.id)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="share-outline"
              size={28}
              color={colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleBookmark}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={localBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color={localBookmarked ? colors.accent.main : colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Likes + Caption */}
      <View style={styles.content}>
        {localLikeCount > 0 && (
          <Text style={styles.likes}>
            {localLikeCount.toLocaleString()} {t('feed.likes')}
          </Text>
        )}

        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>
              <Text style={styles.captionUsername}>{post.user.username}</Text>{' '}
              {post.caption}
            </Text>
          </View>
        )}

        {post.comments > 0 && (
          <TouchableOpacity
            onPress={() => onComment(post.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewComments}>
              {t('feed.viewAllComments', { count: post.comments })}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>
      </View>
    </View>
  );
};

// Memoize để prevent re-renders
export const FeedPost = memo(FeedPostComponent, (prevProps, nextProps) => {
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.isLiked === nextProps.post.isLiked &&
    prevProps.post.isBookmarked === nextProps.post.isBookmarked &&
    prevProps.post.likes === nextProps.post.likes &&
    prevProps.post.comments === nextProps.post.comments
  );
});

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.card,
      marginBottom: spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    userTextContainer: {
      marginLeft: spacing.sm,
      flex: 1,
    },
    userName: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.primary,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
      gap: 4,
    },
    locationText: {
      fontSize: typography.fontSize.sm,
      color: colors.primary.main,
      fontWeight: typography.fontWeight.medium,
    },
    moreButton: {
      padding: spacing.xs,
    },
    photosContainer: {
      position: 'relative',
    },
    doubleTapHeart: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -50,
      marginTop: -50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    leftActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    actionButton: {
      padding: spacing.xs,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
    },
    likes: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    captionContainer: {
      marginBottom: spacing.xs,
    },
    caption: {
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      lineHeight: 20,
    },
    captionUsername: {
      fontWeight: typography.fontWeight.semiBold,
    },
    viewComments: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    timestamp: {
      fontSize: typography.fontSize.xs,
      color: colors.text.disabled,
      textTransform: 'uppercase',
    },
  });
