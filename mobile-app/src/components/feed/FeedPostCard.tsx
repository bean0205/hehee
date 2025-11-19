/**
 * FeedPostCard Component
 * Instagram-style post card with optimized UX
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../common/Avatar';
import { BadgeIcon } from '../common/BadgeIcon';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FeedPostCardProps {
  post: any;
  colors: any;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onUserPress: (userId: string) => void;
  onLocationPress: (post: any) => void;
  onImagePress: (photos: string[], index: number) => void;
  onOptionsPress: (postId: string) => void;
  isBookmarked: boolean;
  t: (key: string) => string;
}

export const FeedPostCard: React.FC<FeedPostCardProps> = ({
  post,
  colors,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onUserPress,
  onLocationPress,
  onImagePress,
  onOptionsPress,
  isBookmarked,
  t,
}) => {
  const [expandedCaption, setExpandedCaption] = useState(false);
  const likeAnimationScale = useRef(new Animated.Value(0)).current;
  const likeAnimationOpacity = useRef(new Animated.Value(0)).current;
  const doubleTapRef = useRef<any>();

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const triggerLikeAnimation = () => {
    likeAnimationScale.setValue(0);
    likeAnimationOpacity.setValue(1);

    Animated.parallel([
      Animated.spring(likeAnimationScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(likeAnimationOpacity, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleDoubleTap = useCallback((event: any) => {
    if (event.nativeEvent.state === State.ACTIVE && !post.isLiked) {
      onLike(post.id);
      triggerLikeAnimation();
    }
  }, [post.isLiked, post.id]);

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <FontAwesome
            key={star}
            name={star <= rating ? 'star' : 'star-o'}
            size={12}
            color={star <= rating ? '#F59E0B' : colors.text.disabled}
          />
        ))}
      </View>
    );
  };

  const renderPhotoGallery = () => {
    if (!post.photos || post.photos.length === 0) return null;

    // Single photo
    if (post.photos.length === 1) {
      return (
        <TapGestureHandler
          ref={doubleTapRef}
          onHandlerStateChange={handleDoubleTap}
          numberOfTaps={2}
        >
          <Animated.View>
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => onImagePress(post.photos, 0)}
            >
              <Image
                source={{ uri: post.photos[0] }}
                style={styles.singlePhoto}
                resizeMode="cover"
              />
            </TouchableOpacity>

            {/* Like Animation Overlay */}
            <Animated.View
              style={[
                styles.likeAnimationContainer,
                {
                  opacity: likeAnimationOpacity,
                  transform: [{ scale: likeAnimationScale }],
                },
              ]}
              pointerEvents="none"
            >
              <MaterialCommunityIcons name="heart" size={100} color="#EF4444" />
            </Animated.View>
          </Animated.View>
        </TapGestureHandler>
      );
    }

    // Multiple photos - Instagram style grid
    return (
      <View style={styles.photoGrid}>
        {post.photos.map((photo: string, index: number) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.95}
            onPress={() => onImagePress(post.photos, index)}
            style={[
              styles.gridPhoto,
              post.photos.length === 2 && styles.halfPhoto,
              post.photos.length >= 3 && index === 0 && styles.mainPhoto,
              post.photos.length >= 3 && index > 0 && styles.sidePhoto,
            ]}
          >
            <Image source={{ uri: photo }} style={styles.photoImage} resizeMode="cover" />
            {index === 2 && post.photos.length > 3 && (
              <View style={styles.morePhotosOverlay}>
                <Text style={styles.morePhotosText}>+{post.photos.length - 3}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderCaption = () => {
    if (!post.caption) return null;

    const shouldTruncate = post.caption.length > 120;
    const displayText = expandedCaption || !shouldTruncate
      ? post.caption
      : post.caption.substring(0, 120) + '...';

    return (
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          <Text style={styles.captionUsername}>{post.user.name} </Text>
          {displayText}
        </Text>
        {shouldTruncate && !expandedCaption && (
          <TouchableOpacity onPress={() => setExpandedCaption(true)}>
            <Text style={styles.seeMore}>See more</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.postCard}>
      {/* Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onUserPress(post.user.id)}
          activeOpacity={0.7}
        >
          <Avatar size={36} uri={post.user.avatar} />
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{post.user.name}</Text>
              <BadgeIcon size="small" />
              {/* Status badge inline */}
              {post.status && (
                <View
                  style={[
                    styles.statusDot,
                    post.status === 'visited' ? styles.visitedDot : styles.wantToGoDot,
                  ]}
                />
              )}
            </View>
            {post.location && (
              <TouchableOpacity onPress={() => onLocationPress(post)} activeOpacity={0.7}>
                <Text style={styles.locationText} numberOfLines={1}>
                  {post.location.name}, {post.location.city}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        {/* Options */}
        <TouchableOpacity onPress={() => onOptionsPress(post.id)} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Photo Gallery */}
      {renderPhotoGallery()}

      {/* Actions Bar - Instagram Style */}
      <View style={styles.actionsBar}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity
            onPress={() => onLike(post.id)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <MaterialCommunityIcons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={post.isLiked ? '#EF4444' : colors.text.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onComment(post.id)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <MaterialCommunityIcons
              name="comment-outline"
              size={27}
              color={colors.text.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onShare(post.id)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <MaterialCommunityIcons name="send-outline" size={26} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => onBookmark(post.id)}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <MaterialCommunityIcons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={26}
            color={isBookmarked ? colors.text.primary : colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Likes Count */}
      <View style={styles.likesContainer}>
        <Text style={styles.likesText}>
          {post.likes.toLocaleString()} {post.likes === 1 ? 'like' : 'likes'}
        </Text>
      </View>

      {/* Caption */}
      {renderCaption()}

      {/* Rating & Visit Date (if visited) */}
      {post.status === 'visited' && post.rating && (
        <View style={styles.metadataRow}>
          {renderStars(post.rating)}
          {post.visitDate && (
            <Text style={styles.visitDate}>• Visited {post.visitDate}</Text>
          )}
        </View>
      )}

      {/* View Comments */}
      {post.comments > 0 && (
        <TouchableOpacity onPress={() => onComment(post.id)}>
          <Text style={styles.viewComments}>
            View all {post.comments} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Timestamp */}
      <Text style={styles.timestamp}>{post.timestamp}</Text>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    postCard: {
      backgroundColor: colors.background.card,
      marginBottom: spacing.xs,
    },
    postHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    userDetails: {
      marginLeft: spacing.sm,
      flex: 1,
    },
    userNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    userName: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: spacing.xs,
    },
    visitedDot: {
      backgroundColor: '#10B981',
    },
    wantToGoDot: {
      backgroundColor: '#F59E0B',
    },
    locationText: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginTop: 2,
    },
    // Photo Gallery
    singlePhoto: {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH, // Square aspect ratio
      backgroundColor: colors.background.elevated,
    },
    photoGrid: {
      width: SCREEN_WIDTH,
      height: SCREEN_WIDTH,
      flexDirection: 'row',
      gap: 2,
    },
    gridPhoto: {
      backgroundColor: colors.background.elevated,
    },
    halfPhoto: {
      flex: 1,
    },
    mainPhoto: {
      flex: 2,
    },
    sidePhoto: {
      flex: 1,
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    morePhotosOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    morePhotosText: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: '#FFFFFF',
    },
    likeAnimationContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    },
    // Actions
    actionsBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xs,
      paddingBottom: spacing.xs / 2,
    },
    actionsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    // Likes
    likesContainer: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs / 2,
    },
    likesText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    // Caption
    captionContainer: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs / 2,
    },
    caption: {
      fontSize: typography.fontSize.sm,
      color: colors.text.primary,
      lineHeight: 18,
    },
    captionUsername: {
      fontWeight: typography.fontWeight.bold,
    },
    seeMore: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs / 2,
    },
    // Metadata
    metadataRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs / 2,
    },
    starsContainer: {
      flexDirection: 'row',
      gap: 2,
    },
    visitDate: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    // Comments
    viewComments: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs / 2,
    },
    // Timestamp
    timestamp: {
      fontSize: typography.fontSize.xs,
      color: colors.text.disabled,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xs / 2,
      paddingBottom: spacing.sm,
    },
  });
