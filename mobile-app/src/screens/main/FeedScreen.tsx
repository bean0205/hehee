import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Avatar } from '../../components/common/Avatar';
import { BadgeIcon } from '../../components/common/BadgeIcon';
import { ImageViewerModal } from '../../components/common/ImageViewerModal';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock stories data
const mockStories = [
  { id: '1', nameKey: 'feed.yourStory', avatar: null, hasStory: false, isUser: true },
  { id: '2', name: 'Mai', avatar: null, hasStory: true, isViewed: false },
  { id: '3', name: 'Tuấn', avatar: null, hasStory: true, isViewed: false },
  { id: '4', name: 'Linh', avatar: null, hasStory: true, isViewed: true },
  { id: '5', name: 'Hùng', avatar: null, hasStory: true, isViewed: false },
  { id: '6', name: 'Thảo', avatar: null, hasStory: true, isViewed: true },
];

const getMockPosts = (t: any) => [
  {
    id: '1',
    type: 'pin_with_photos',
    user: {
      id: 'u1',
      name: t('mockData.feed.user1Name'),
      avatar: null,
      username: t('mockData.feed.user1Username')
    },
    location: {
      name: t('mockData.feed.location1'),
      city: t('mockData.feed.city1'),
      country: t('mockData.feed.country1'),
    },
    caption: t('mockData.feed.user1Caption'),
    photos: [
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
    ],
    rating: 5,
    status: 'visited',
    visitDate: '15/11/2024',
    likes: 142,
    comments: 23,
    isLiked: false,
    timestamp: '2 giờ trước',
    pinId: 'p1',
  },
  {
    id: '2',
    type: 'pin_with_photos',
    user: {
      id: 'u2',
      name: t('mockData.feed.user2Name'),
      avatar: null,
      username: t('mockData.feed.user2Username')
    },
    location: {
      name: t('mockData.feed.location2'),
      city: t('mockData.feed.city2'),
      country: t('mockData.feed.country2'),
    },
    caption: t('mockData.feed.user2Caption'),
    photos: [
      'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    ],
    rating: 5,
    status: 'visited',
    visitDate: '10/11/2024',
    likes: 256,
    comments: 45,
    isLiked: true,
    timestamp: '5 giờ trước',
    pinId: 'p2',
  },
  {
    id: '3',
    type: 'bucket_list',
    user: {
      id: 'u3',
      name: t('mockData.feed.user3Name'),
      avatar: null,
      username: t('mockData.feed.user3Username')
    },
    location: {
      name: t('mockData.feed.location3'),
      city: t('mockData.feed.city3'),
      country: t('mockData.feed.country3'),
    },
    caption: t('mockData.feed.user3Caption'),
    photos: [
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
    ],
    status: 'want_to_go',
    likes: 89,
    comments: 12,
    isLiked: false,
    timestamp: '1 ngày trước',
    pinId: 'p3',
  },
  {
    id: '4',
    type: 'achievement',
    user: {
      id: 'u4',
      name: t('mockData.feed.user4Name'),
      avatar: null,
      username: t('mockData.feed.user4Username')
    },
    achievement: {
      type: 'countries',
      count: 10,
      badge: '🌍',
      title: t('mockData.feed.achievementTitle', { count: 10 }),
    },
    caption: t('mockData.feed.user4Caption'),
    likes: 178,
    comments: 34,
    isLiked: true,
    timestamp: '1 ngày trước',
  },
  {
    id: '5',
    type: 'pin_with_photos',
    user: {
      id: 'u5',
      name: t('mockData.feed.user5Name'),
      avatar: null,
      username: t('mockData.feed.user5Username')
    },
    location: {
      name: t('mockData.feed.location6'),
      city: t('mockData.feed.city6'),
      country: t('mockData.feed.country6'),
    },
    caption: t('mockData.feed.user5Caption'),
    photos: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
      'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
      'https://images.unsplash.com/photo-1557129192-e4f1f62b5a3b?w=800',
    ],
    rating: 5,
    status: 'visited',
    visitDate: '20/10/2024',
    likes: 312,
    comments: 67,
    isLiked: false,
    timestamp: '2 ngày trước',
    pinId: 'p4',
  },
];

export const FeedScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(getMockPosts(t));
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    // TODO: Open comment modal
    console.log('Open comments for post:', postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Open share modal
    console.log('Share post:', postId);
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const handleLocationPress = (post: any) => {
    if (post.pinId) {
      navigation.navigate('PinDetails', { pinId: post.pinId });
    }
  };

  const handlePostPress = (post: any) => {
    navigation.navigate('PostDetails', { post });
  };

  const handleImagePress = (photos: string[], index: number) => {
    setSelectedImages(photos);
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  const renderStoryItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.storyItem} activeOpacity={0.7}>
        <LinearGradient
          colors={
            item.hasStory && !item.isViewed
              ? ['#F59E0B', '#EF4444', '#EC4899']
              : ['#E5E7EB', '#E5E7EB']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.storyGradientBorder}
        >
          <View style={styles.storyAvatarContainer}>
            <Avatar size={60} uri={item.avatar} />
            {item.isUser && (
              <View style={styles.addStoryButton}>
                <Text style={styles.addStoryIcon}>+</Text>
              </View>
            )}
          </View>
        </LinearGradient>
        <Text style={styles.storyName} numberOfLines={1}>
          {item.nameKey ? t(item.nameKey) : item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStories = () => {
    return (
      <View style={styles.storiesContainer}>
        <FlatList
          data={mockStories}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContent}
        />
      </View>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Text key={star} style={styles.star}>
            {star <= rating ? '⭐' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  const renderPhotoGallery = (photos: string[]) => {
    if (!photos || photos.length === 0) return null;

    if (photos.length === 1) {
      return (
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => handleImagePress(photos, 0)}
        >
          <Image
            source={{ uri: photos[0] }}
            style={styles.singlePhoto}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }

    if (photos.length === 2) {
      return (
        <View style={styles.photoGrid}>
          {photos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.95}
              onPress={() => handleImagePress(photos, index)}
              style={styles.halfPhotoContainer}
            >
              <Image
                source={{ uri: photo }}
                style={styles.halfPhoto}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    // 3+ photos
    return (
      <View style={styles.photoGrid}>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => handleImagePress(photos, 0)}
        >
          <Image
            source={{ uri: photos[0] }}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View style={styles.sidePhotos}>
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => handleImagePress(photos, 1)}
          >
            <Image
              source={{ uri: photos[1] }}
              style={styles.sidePhoto}
              resizeMode="cover"
            />
          </TouchableOpacity>
          {photos.length > 2 && (
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => handleImagePress(photos, 2)}
            >
              <Image
                source={{ uri: photos[2] }}
                style={styles.sidePhoto}
                resizeMode="cover"
              />
              {photos.length > 3 && (
                <View style={styles.morePhotosOverlay}>
                  <Text style={styles.morePhotosText}>+{photos.length - 3}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderPost = ({ item }: { item: any }) => {
    // Achievement post
    if (item.type === 'achievement') {
      return (
        <TouchableOpacity
          activeOpacity={0.98}
          onPress={() => handlePostPress(item)}
        >
          <View style={styles.postCard}>
            {/* Header */}
            <View style={styles.postHeader}>
              <TouchableOpacity
                style={styles.userInfo}
                onPress={() => handleUserPress(item.user.id)}
              >
                <Avatar size={40} uri={item.user.avatar} />
                <View style={styles.userDetails}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{item.user.name}</Text>
                    <BadgeIcon size="small" />
                  </View>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Achievement Content */}
            <LinearGradient
              colors={['#3B82F615', '#60A5FA15', '#93C5FD15']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.achievementContent}
            >
              <Text style={styles.achievementBadge}>{item.achievement.badge}</Text>
              <Text style={styles.achievementTitle}>{item.achievement.title}</Text>
              <Text style={styles.achievementCount}>{item.achievement.count}</Text>
            </LinearGradient>

            {/* Caption */}
            {item.caption && (
              <Text style={styles.caption}>{item.caption}</Text>
            )}

            {/* Actions */}
            <View style={styles.actionsBar}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleLike(item.id)}
              >
                <Text style={styles.actionIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
                <Text style={[styles.actionText, item.isLiked && styles.actionTextActive]}>
                  {item.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleComment(item.id)}
              >
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionText}>{item.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleShare(item.id)}
              >
                <Text style={styles.actionIcon}>📤</Text>
                <Text style={styles.actionText}>{t('feed.share')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // Regular pin post
    return (
      <View style={styles.postCard}>
        {/* Header */}
        <View style={styles.postHeader}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => handleUserPress(item.user.id)}
          >
            <Avatar size={40} uri={item.user.avatar} />
            <View style={styles.userDetails}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{item.user.name}</Text>
                <BadgeIcon size="small" />
              </View>
              <TouchableOpacity onPress={() => handleLocationPress(item)}>
                <Text style={styles.locationText}>
                  📍 {item.location.name}, {item.location.city}
                </Text>
              </TouchableOpacity>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </TouchableOpacity>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              item.status === 'visited'
                ? styles.visitedBadge
                : styles.wantToGoBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {item.status === 'visited' ? t('feed.visited') : t('feed.wantToGo')}
            </Text>
          </View>
        </View>

        {/* Photo Gallery */}
        {item.photos && renderPhotoGallery(item.photos)}

        {/* Post Details */}
        <TouchableOpacity
          activeOpacity={0.98}
          onPress={() => handlePostPress(item)}
        >
          <View style={styles.postDetails}>
            {/* Rating (if visited) */}
            {item.status === 'visited' && item.rating && (
              <View style={styles.ratingRow}>
                {renderStars(item.rating)}
                <Text style={styles.visitDate}>• {item.visitDate}</Text>
              </View>
            )}

            {/* Caption */}
            {item.caption && (
              <Text style={styles.caption} numberOfLines={3}>
                <Text style={styles.captionUsername}>{item.user.name}</Text>{' '}
                {item.caption}
              </Text>
            )}

            {/* View more link */}
            {item.caption && item.caption.length > 100 && (
              <Text style={styles.viewMore}>{t('feed.viewMore')}</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Actions Bar */}
        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Text style={styles.actionIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
            <Text style={[styles.actionText, item.isLiked && styles.actionTextActive]}>
              {item.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleComment(item.id)}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShare(item.id)}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>{t('feed.share')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <BlurView intensity={20} tint="light" style={styles.headerBlur}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('feed.feed')}</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Text style={styles.headerIcon}>🔍</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.notificationButton}>
                <Text style={styles.notificationIcon}>🔔</Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </LinearGradient>

      {/* Posts Feed */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
          />
        }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderStories()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['#F59E0B20', '#EC489920']}
              style={styles.emptyStateGradient}
            >
              <Text style={styles.emptyStateIcon}>🌍</Text>
              <Text style={styles.emptyStateText}>{t('feed.noPostsYet')}</Text>
              <Text style={styles.emptyStateSubtext}>
                {t('feed.followFriends')}
              </Text>
            </LinearGradient>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddPin')}
      >
        <LinearGradient
          colors={['#F59E0B', '#EF4444']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>+</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Image Viewer Modal */}
      <ImageViewerModal
        visible={imageViewerVisible}
        images={selectedImages}
        initialIndex={selectedImageIndex}
        onClose={() => setImageViewerVisible(false)}
      />
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.secondary,
    },
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    headerTitle: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
      letterSpacing: 0.5,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.neutral.white + '33', // 20% opacity
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerIcon: {
      fontSize: 20,
    },
    notificationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.neutral.white + '33', // 20% opacity
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    notificationIcon: {
      fontSize: 20,
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
    // Stories Section
    storiesContainer: {
      backgroundColor: colors.background.card,
      paddingVertical: spacing.md,
      marginBottom: spacing.sm,
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    storiesContent: {
      paddingHorizontal: spacing.md,
      gap: spacing.md,
    },
    storyItem: {
      alignItems: 'center',
      width: 80,
    },
    storyGradientBorder: {
      borderRadius: 40,
      padding: 3,
      marginBottom: spacing.xs,
    },
    storyAvatarContainer: {
      borderRadius: 37,
      borderWidth: 3,
      borderColor: colors.background.card,
      overflow: 'hidden',
      position: 'relative',
    },
    addStoryButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary.light,
      borderWidth: 2,
      borderColor: colors.background.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addStoryIcon: {
      fontSize: 14,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
      marginTop: -2,
    },
    storyName: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      textAlign: 'center',
      maxWidth: 70,
    },
    listContent: {
      paddingBottom: 120, // Space for navbar and FAB
    },
    // Post Card
    postCard: {
      backgroundColor: colors.background.card,
      marginHorizontal: spacing.sm,
      marginBottom: spacing.md,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 5,
    },
    postHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: spacing.md,
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
    userName: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    userNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    locationText: {
      fontSize: typography.fontSize.sm,
      color: colors.primary.light,
      marginTop: 2,
      fontWeight: typography.fontWeight.medium,
    },
    timestamp: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginTop: 2,
    },
    statusBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: borderRadius.full,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    visitedBadge: {
      backgroundColor: '#10B98120',
      borderWidth: 1,
      borderColor: '#10B98140',
    },
    wantToGoBadge: {
      backgroundColor: '#F59E0B20',
      borderWidth: 1,
      borderColor: '#F59E0B40',
    },
    statusText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      letterSpacing: 0.3,
    },
    // Photo Gallery
    singlePhoto: {
      width: '100%',
      height: 450,
      backgroundColor: colors.background.elevated,
    },
    photoGrid: {
      flexDirection: 'row',
      height: 320,
      gap: 4,
      paddingHorizontal: 2,
    },
    halfPhotoContainer: {
      flex: 1,
      height: 320,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
    },
    halfPhoto: {
      width: '100%',
      height: 320,
    },
    mainPhoto: {
      flex: 2,
      height: 320,
      marginRight: 2,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
    },
    sidePhotos: {
      flex: 1,
      gap: 4,
    },
    sidePhoto: {
      flex: 1,
      backgroundColor: colors.background.elevated,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
    },
    morePhotosOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.neutral.black + '99', // 60% opacity
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.md,
    },
    morePhotosText: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
      textShadowColor: colors.neutral.black + '4D', // 30% opacity
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    // Post Details
    postDetails: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
      backgroundColor: colors.background.secondary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
    },
    starsContainer: {
      flexDirection: 'row',
      gap: 2,
    },
    star: {
      fontSize: 14,
    },
    visitDate: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
      fontWeight: typography.fontWeight.medium,
    },
    caption: {
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      lineHeight: 22,
      letterSpacing: 0.2,
    },
    captionUsername: {
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    viewMore: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
      fontWeight: typography.fontWeight.semiBold,
    },
    // Achievement
    achievementContent: {
      alignItems: 'center',
      paddingVertical: spacing.xl * 1.5,
      marginHorizontal: spacing.md,
      marginVertical: spacing.md,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
    },
    achievementBadge: {
      fontSize: 80,
      marginBottom: spacing.md,
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    achievementTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    achievementCount: {
      fontSize: 48,
      fontWeight: typography.fontWeight.bold,
      color: colors.primary.light,
    },
    // Actions Bar
    actionsBar: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
      gap: spacing.xl,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
      marginTop: spacing.sm,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
    },
    actionIcon: {
      fontSize: 24,
    },
    actionText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.semiBold,
    },
    actionTextActive: {
      color: '#EF4444',
      fontWeight: typography.fontWeight.bold,
    },
    // Empty State
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl * 2,
      paddingHorizontal: spacing.xl,
      marginHorizontal: spacing.lg,
      marginTop: spacing.xl,
    },
    emptyStateGradient: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl * 2,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.xl,
      width: '100%',
    },
    emptyStateIcon: {
      fontSize: 80,
      marginBottom: spacing.lg,
    },
    emptyStateText: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    emptyStateSubtext: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    // FAB
    fab: {
      position: 'absolute',
      bottom: 100,
      right: spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    fabGradient: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fabIcon: {
      fontSize: 32,
      color: colors.neutral.white,
      fontWeight: typography.fontWeight.bold,
      marginTop: -2,
    },
  });

