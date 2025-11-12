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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Avatar } from '../../components/common/Avatar';
import { BadgeIcon } from '../../components/common/BadgeIcon';
import { ImageViewerModal } from '../../components/common/ImageViewerModal';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock posts data - Social Media style
const mockPosts = [
  {
    id: '1',
    type: 'pin_with_photos',
    user: { 
      id: 'u1', 
      name: 'Nguyễn Văn A', 
      avatar: null, 
      username: 'nguyenvana' 
    },
    location: {
      name: 'Hồ Hoàn Kiếm',
      city: 'Hà Nội',
      country: 'Việt Nam',
    },
    caption: 'Buổi sáng tuyệt vời ở Hồ Hoàn Kiếm! Không khí trong lành, view đẹp như tranh 🌅',
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
      name: 'Trần Thị B', 
      avatar: null, 
      username: 'tranthib' 
    },
    location: {
      name: 'Vịnh Hạ Long',
      city: 'Quảng Ninh',
      country: 'Việt Nam',
    },
    caption: 'Di sản thế giới! Cảnh đẹp không thể tả 🏝️✨',
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
      name: 'Lê Văn C', 
      avatar: null, 
      username: 'levanc' 
    },
    location: {
      name: 'Tháp Eiffel',
      city: 'Paris',
      country: 'Pháp',
    },
    caption: 'Ước mơ của tôi! Ai đã từng đến đây chưa? 🗼❤️',
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
      name: 'Phạm Minh D', 
      avatar: null, 
      username: 'phamminhd' 
    },
    achievement: {
      type: 'countries',
      count: 10,
      badge: '🌍',
      title: 'Khám phá 10 quốc gia',
    },
    caption: 'Milestone mới! 10 quốc gia đầu tiên rồi 🎉',
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
      name: 'Hoàng Thị E', 
      avatar: null, 
      username: 'hoangthie' 
    },
    location: {
      name: 'Phố cổ Hội An',
      city: 'Quảng Nam',
      country: 'Việt Nam',
    },
    caption: 'Phố cổ lung linh về đêm 🏮 Lần nào đến cũng thích!',
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
  const [posts, setPosts] = useState(mockPosts);
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
            <View style={styles.achievementContent}>
              <Text style={styles.achievementBadge}>{item.achievement.badge}</Text>
              <Text style={styles.achievementTitle}>{item.achievement.title}</Text>
              <Text style={styles.achievementCount}>{item.achievement.count}</Text>
            </View>

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
                <Text style={styles.actionText}>Chia sẻ</Text>
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
              {item.status === 'visited' ? '✓ Đã đến' : '⭐ Muốn đến'}
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
              <Text style={styles.viewMore}>Xem thêm</Text>
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
            <Text style={styles.actionText}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bảng tin</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

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
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📰</Text>
            <Text style={styles.emptyStateText}>Chưa có bài viết nào</Text>
            <Text style={styles.emptyStateSubtext}>
              Theo dõi bạn bè để xem hoạt động của họ
            </Text>
          </View>
        }
      />

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
      backgroundColor: colors.background.main,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl + 20,
      paddingBottom: spacing.md,
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    headerTitle: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    notificationButton: {
      padding: spacing.xs,
    },
    notificationIcon: {
      fontSize: 24,
    },
    listContent: {
      paddingBottom: 100, // Space for navbar
    },
    // Post Card
    postCard: {
      backgroundColor: colors.background.card,
      marginBottom: spacing.sm,
      paddingBottom: spacing.sm,
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
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.primary,
    },
    userNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    locationText: {
      fontSize: typography.fontSize.sm,
      color: colors.primary.main,
      marginTop: 2,
    },
    timestamp: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginTop: 2,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
    },
    visitedBadge: {
      backgroundColor: colors.status.success + '20',
    },
    wantToGoBadge: {
      backgroundColor: colors.accent.main + '20',
    },
    statusText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
    },
    // Photo Gallery
    singlePhoto: {
      width: '100%',
      height: 400,
      backgroundColor: colors.background.elevated,
    },
    photoGrid: {
      flexDirection: 'row',
      height: 300,
      gap: 2,
    },
    halfPhotoContainer: {
      flex: 1,
      height: 300,
    },
    halfPhoto: {
      width: '100%',
      height: 300,
    },
    mainPhoto: {
      flex: 2,
      height: 300,
      marginRight: 2,
    },
    sidePhotos: {
      flex: 1,
      gap: 2,
    },
    sidePhoto: {
      flex: 1,
      backgroundColor: colors.background.elevated,
    },
    morePhotosOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    morePhotosText: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: '#fff',
    },
    // Post Details
    postDetails: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    starsContainer: {
      flexDirection: 'row',
      gap: 2,
    },
    star: {
      fontSize: 16,
    },
    visitDate: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginLeft: spacing.sm,
    },
    caption: {
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      lineHeight: 20,
    },
    captionUsername: {
      fontWeight: typography.fontWeight.semiBold,
    },
    viewMore: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.xs,
      fontWeight: typography.fontWeight.medium,
    },
    // Achievement
    achievementContent: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      backgroundColor: colors.primary.main + '10',
      marginHorizontal: spacing.md,
      marginVertical: spacing.sm,
      borderRadius: borderRadius.lg,
    },
    achievementBadge: {
      fontSize: 64,
      marginBottom: spacing.sm,
    },
    achievementTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    achievementCount: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.primary.main,
    },
    // Actions Bar
    actionsBar: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
      gap: spacing.lg,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    actionIcon: {
      fontSize: 22,
    },
    actionText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
    },
    actionTextActive: {
      color: colors.status.error,
      fontWeight: typography.fontWeight.semiBold,
    },
    // Empty State
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl * 3,
      paddingHorizontal: spacing.xl,
    },
    emptyStateIcon: {
      fontSize: 64,
      marginBottom: spacing.lg,
    },
    emptyStateText: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    emptyStateSubtext: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      textAlign: 'center',
    },
  });

