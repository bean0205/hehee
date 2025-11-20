import React, { useState, useRef } from 'react';
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
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Avatar } from '../../components/common/Avatar';
import { BadgeIcon } from '../../components/common/BadgeIcon';
import { ImageViewerModal } from '../../components/common/ImageViewerModal';
import { Header } from '../../components/common/Header';
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

// Filter tabs
const FILTER_TABS = [
  { id: 'all', labelKey: 'feed.filters.all', icon: 'earth' },
  { id: 'following', labelKey: 'feed.filters.following', icon: 'account-group' },
  { id: 'popular', labelKey: 'feed.filters.popular', icon: 'fire' },
  { id: 'nearby', labelKey: 'feed.filters.nearby', icon: 'map-marker-radius' },
];

// Mock suggested users
const mockSuggestedUsers = [
  { id: 'su1', name: 'Emma Wilson', username: '@emma_travels', avatar: null, mutualFriends: 5 },
  { id: 'su2', name: 'John Smith', username: '@johnexplorer', avatar: null, mutualFriends: 3 },
  { id: 'su3', name: 'Sarah Lee', username: '@sarahwanders', avatar: null, mutualFriends: 8 },
];

// Mock comments
const getMockComments = (t: any) => [
  { id: 'c1', user: { name: 'Mai', avatar: null }, text: t('mockData.feed.comment1') },
  { id: 'c2', user: { name: 'Tuấn', avatar: null }, text: t('mockData.feed.comment2') },
];

// Mock notifications
const getMockNotifications = (t: any) => [
  {
    id: 'n1',
    type: 'like',
    user: { name: 'Mai', avatar: null },
    text: t('mockData.feed.notification1'),
    timestamp: '5 phút trước',
    read: false,
  },
  {
    id: 'n2',
    type: 'comment',
    user: { name: 'Tuấn', avatar: null },
    text: t('mockData.feed.notification2'),
    timestamp: '1 giờ trước',
    read: false,
  },
  {
    id: 'n3',
    type: 'follow',
    user: { name: 'Linh', avatar: null },
    text: t('mockData.feed.notification3'),
    timestamp: '2 giờ trước',
    read: true,
  },
  {
    id: 'n4',
    type: 'achievement',
    text: t('mockData.feed.notification4'),
    timestamp: '1 ngày trước',
    read: true,
  },
];

// Mock search results
const getMockSearchResults = (t: any) => ({
  users: [
    { id: 'u1', name: 'Nguyễn Văn A', username: '@nguyenvana', avatar: null, isFollowing: true },
    { id: 'u2', name: 'Trần Thị B', username: '@tranthib', avatar: null, isFollowing: false },
  ],
  locations: [
    { id: 'l1', name: 'Vịnh Hạ Long', city: 'Hà Nội', country: 'Việt Nam', pins: 1234 },
    { id: 'l2', name: 'Tokyo', city: 'Tokyo', country: 'Nhật Bản', pins: 5678 },
  ],
  posts: [
    { id: 'p1', text: 'Trải nghiệm tuyệt vời tại Vịnh Hạ Long', image: null },
  ],
});

export const FeedScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(getMockPosts(t));
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<string[]>([]);
  const [optionsMenuPost, setOptionsMenuPost] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestedUsers, setShowSuggestedUsers] = useState(true);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTab, setSearchTab] = useState<'all' | 'users' | 'locations' | 'posts'>('all');
  const [notifications, setNotifications] = useState(getMockNotifications(t));
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostForComment, setSelectedPostForComment] = useState<string | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedPostForShare, setSelectedPostForShare] = useState<string | null>(null);

  // Animation refs
  const likeAnimationScale = useRef(new Animated.Value(0)).current;
  const likeAnimationOpacity = useRef(new Animated.Value(0)).current;

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

    // Trigger like animation
    triggerLikeAnimation();
  };

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

  const handleDoubleTap = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post && !post.isLiked) {
      handleLike(postId);
    }
  };

  const handleComment = (postId: string) => {
    setSelectedPostForComment(postId);
    setCommentModalVisible(true);
  };

  const handleShare = (postId: string) => {
    setSelectedPostForShare(postId);
    setShareModalVisible(true);
  };

  const handleStoryPress = (story: any) => {
    setSelectedStory(story);
    setStoryViewerVisible(true);
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleBookmark = (postId: string) => {
    setBookmarkedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
    setOptionsMenuPost(null);
  };

  const handleFollow = (userId: string) => {
    setFollowedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
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

  // Render Filter Tabs
  const renderFilterTabs = () => {
    return (
      <View style={styles.filterTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          {FILTER_TABS.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.filterTab,
                activeFilter === tab.id && styles.filterTabActive,
              ]}
              onPress={() => handleFilterChange(tab.id)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={tab.icon as any}
                size={18}
                color={
                  activeFilter === tab.id
                    ? colors.neutral.white
                    : colors.text.secondary
                }
              />
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === tab.id && styles.filterTabTextActive,
                ]}
              >
                {t(tab.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render Suggested Users
  const renderSuggestedUsers = () => {
    if (!showSuggestedUsers) return null;

    return (
      <View style={styles.suggestedUsersContainer}>
        <View style={styles.suggestedUsersHeader}>
          <Text style={styles.suggestedUsersTitle}>
            {t('feed.suggestedForYou')}
          </Text>
          <TouchableOpacity onPress={() => setShowSuggestedUsers(false)}>
            <MaterialCommunityIcons
              name="close"
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestedUsersContent}
        >
          {mockSuggestedUsers.map(user => (
            <View key={user.id} style={styles.suggestedUserCard}>
              <Avatar size={80} uri={user.avatar} />
              <Text style={styles.suggestedUserName} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={styles.suggestedUserUsername} numberOfLines={1}>
                {user.username}
              </Text>
              <Text style={styles.suggestedUserMutual}>
                {t('feed.mutualFriends', { count: user.mutualFriends })}
              </Text>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  followedUsers.includes(user.id) && styles.followingButton,
                ]}
                onPress={() => handleFollow(user.id)}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    followedUsers.includes(user.id) && styles.followingButtonText,
                  ]}
                >
                  {followedUsers.includes(user.id)
                    ? t('feed.following')
                    : t('feed.follow')}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render Skeleton Loading
  const renderSkeletonPost = () => {
    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <View style={styles.skeletonAvatar} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <View style={styles.skeletonText} />
              <View style={[styles.skeletonText, { width: '60%', marginTop: 4 }]} />
            </View>
          </View>
        </View>
        <View style={styles.skeletonImage} />
        <View style={{ padding: spacing.md }}>
          <View style={styles.skeletonText} />
          <View style={[styles.skeletonText, { width: '80%', marginTop: 4 }]} />
        </View>
      </View>
    );
  };

  // Render Comments Preview
  const renderCommentsPreview = (postId: string) => {
    const comments = getMockComments(t);
    if (comments.length === 0) return null;

    return (
      <View style={styles.commentsPreview}>
        {comments.slice(0, 2).map(comment => (
          <View key={comment.id} style={styles.commentPreviewItem}>
            <Text style={styles.commentPreviewText}>
              <Text style={styles.commentPreviewUsername}>{comment.user.name}</Text>{' '}
              {comment.text}
            </Text>
          </View>
        ))}
        <TouchableOpacity onPress={() => handleComment(postId)}>
          <Text style={styles.viewAllComments}>
            {t('feed.viewAllComments')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render Options Menu
  const renderOptionsMenu = () => {
    if (!optionsMenuPost) return null;

    const post = posts.find(p => p.id === optionsMenuPost);
    const isBookmarked = bookmarkedPosts.includes(optionsMenuPost);

    return (
      <Modal
        visible={!!optionsMenuPost}
        transparent
        animationType="fade"
        onRequestClose={() => setOptionsMenuPost(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOptionsMenuPost(null)}
        >
          <View style={styles.optionsMenu}>
            <TouchableOpacity
              style={styles.optionsMenuItem}
              onPress={() => handleBookmark(optionsMenuPost)}
            >
              <MaterialCommunityIcons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={colors.text.primary}
              />
              <Text style={styles.optionsMenuText}>
                {isBookmarked ? t('feed.unsave') : t('feed.save')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionsMenuItem}
              onPress={() => {
                setOptionsMenuPost(null);
                handleShare(optionsMenuPost);
              }}
            >
              <MaterialCommunityIcons
                name="share-variant"
                size={24}
                color={colors.text.primary}
              />
              <Text style={styles.optionsMenuText}>{t('feed.share')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionsMenuItem}
              onPress={() => {
                setOptionsMenuPost(null);
                console.log('Report post');
              }}
            >
              <MaterialCommunityIcons
                name="flag-outline"
                size={24}
                color={colors.error.main}
              />
              <Text style={[styles.optionsMenuText, { color: colors.error.main }]}>
                {t('feed.report')}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    );
  };

  // Render Search Modal
  const renderSearchModal = () => {
    const searchResults = getMockSearchResults(t);

    return (
      <Modal
        visible={searchVisible}
        animationType="slide"
        onRequestClose={() => setSearchVisible(false)}
      >
        <View style={styles.searchModalContainer}>
          {/* Search Header */}
          <View style={[styles.searchHeader, { paddingTop: insets.top + spacing.md }]}>
            <TouchableOpacity onPress={() => setSearchVisible(false)}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <View style={styles.searchInputContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={colors.text.secondary}
              />
              <Text style={styles.searchInput}>
                {searchQuery || t('feed.search.placeholder')}
              </Text>
            </View>
          </View>

          {/* Search Tabs */}
          <View style={styles.searchTabsContainer}>
            {['all', 'users', 'locations', 'posts'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.searchTab,
                  searchTab === tab && styles.searchTabActive,
                ]}
                onPress={() => setSearchTab(tab as any)}
              >
                <Text
                  style={[
                    styles.searchTabText,
                    searchTab === tab && styles.searchTabTextActive,
                  ]}
                >
                  {t(`feed.search.${tab}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search Results */}
          <ScrollView style={styles.searchResults}>
            {/* Users Section */}
            {(searchTab === 'all' || searchTab === 'users') && (
              <View style={styles.searchSection}>
                <Text style={styles.searchSectionTitle}>
                  {t('feed.search.users')}
                </Text>
                {searchResults.users.map(user => (
                  <TouchableOpacity
                    key={user.id}
                    style={styles.searchResultItem}
                    onPress={() => {
                      setSearchVisible(false);
                      handleUserPress(user.id);
                    }}
                  >
                    <Avatar size={50} uri={user.avatar} />
                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultName}>{user.name}</Text>
                      <Text style={styles.searchResultUsername}>
                        {user.username}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.searchFollowButton,
                        user.isFollowing && styles.searchFollowingButton,
                      ]}
                      onPress={() => handleFollow(user.id)}
                    >
                      <Text
                        style={[
                          styles.searchFollowButtonText,
                          user.isFollowing && styles.searchFollowingButtonText,
                        ]}
                      >
                        {user.isFollowing ? t('feed.following') : t('feed.follow')}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Locations Section */}
            {(searchTab === 'all' || searchTab === 'locations') && (
              <View style={styles.searchSection}>
                <Text style={styles.searchSectionTitle}>
                  {t('feed.search.locations')}
                </Text>
                {searchResults.locations.map(location => (
                  <TouchableOpacity
                    key={location.id}
                    style={styles.searchResultItem}
                    onPress={() => setSearchVisible(false)}
                  >
                    <View style={styles.searchLocationIcon}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={24}
                        color={colors.primary.main}
                      />
                    </View>
                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultName}>
                        {location.name}
                      </Text>
                      <Text style={styles.searchResultUsername}>
                        {location.city}, {location.country}
                      </Text>
                    </View>
                    <Text style={styles.searchLocationPins}>
                      {location.pins} pins
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  // Render Notifications Modal
  const renderNotificationsModal = () => {
    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type: string) => {
      switch (type) {
        case 'like':
          return { name: 'heart', color: '#EF4444' };
        case 'comment':
          return { name: 'comment', color: colors.primary.main };
        case 'follow':
          return { name: 'account-plus', color: colors.success.main };
        case 'achievement':
          return { name: 'trophy', color: '#F59E0B' };
        default:
          return { name: 'bell', color: colors.text.secondary };
      }
    };

    return (
      <Modal
        visible={notificationsVisible}
        animationType="slide"
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <View style={styles.notificationsModalContainer}>
          {/* Notifications Header */}
          <View style={[styles.notificationsHeader, { paddingTop: insets.top + spacing.md }]}>
            <TouchableOpacity onPress={() => setNotificationsVisible(false)}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.notificationsTitle}>
              {t('feed.notifications.title')}
            </Text>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={handleMarkAllNotificationsAsRead}>
                <Text style={styles.notificationsMarkAllRead}>
                  {t('feed.notifications.markAllRead')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Notifications List */}
          <ScrollView style={styles.notificationsList}>
            {notifications.length === 0 ? (
              <View style={styles.notificationsEmpty}>
                <MaterialCommunityIcons
                  name="bell-off-outline"
                  size={80}
                  color={colors.text.disabled}
                />
                <Text style={styles.notificationsEmptyText}>
                  {t('feed.notifications.empty')}
                </Text>
              </View>
            ) : (
              notifications.map(notification => {
                const icon = getNotificationIcon(notification.type);
                return (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      !notification.read && styles.notificationItemUnread,
                    ]}
                    onPress={() => handleMarkNotificationAsRead(notification.id)}
                  >
                    {notification.user ? (
                      <View style={styles.notificationAvatarContainer}>
                        <Avatar size={50} uri={notification.user.avatar} />
                        <View
                          style={[
                            styles.notificationIconBadge,
                            { backgroundColor: icon.color },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={icon.name as any}
                            size={14}
                            color={colors.neutral.white}
                          />
                        </View>
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.notificationIcon,
                          { backgroundColor: icon.color + '20' },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={icon.name as any}
                          size={24}
                          color={icon.color}
                        />
                      </View>
                    )}

                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationText}>
                        {notification.user && (
                          <Text style={styles.notificationUsername}>
                            {notification.user.name}{' '}
                          </Text>
                        )}
                        {notification.text}
                      </Text>
                      <Text style={styles.notificationTimestamp}>
                        {notification.timestamp}
                      </Text>
                    </View>

                    {!notification.read && (
                      <View style={styles.notificationUnreadDot} />
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderStoryItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.storyItem}
        activeOpacity={0.7}
        onPress={() => handleStoryPress(item)}
      >
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
          <FontAwesome
            key={star}
            name={star <= rating ? 'star' : 'star-o'}
            size={14}
            color={star <= rating ? '#F59E0B' : colors.text.disabled}
          />
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
                <MaterialCommunityIcons
                  name={item.isLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={item.isLiked ? '#EF4444' : colors.text.secondary}
                />
                <Text style={[styles.actionText, item.isLiked && styles.actionTextActive]}>
                  {item.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleComment(item.id)}
              >
                <MaterialCommunityIcons
                  name="comment-outline"
                  size={24}
                  color={colors.text.secondary}
                />
                <Text style={styles.actionText}>{item.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleShare(item.id)}
              >
                <MaterialCommunityIcons
                  name="share-variant"
                  size={24}
                  color={colors.text.secondary}
                />
                <Text style={styles.actionText}>{t('feed.share')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // Regular pin post
    let lastTap = 0;
    const handleImageDoubleTap = () => {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;

      if (now - lastTap < DOUBLE_TAP_DELAY) {
        handleDoubleTap(item.id);
      }
      lastTap = now;
    };

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
              <TouchableOpacity onPress={() => handleLocationPress(item)} style={styles.locationRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color={colors.primary.light}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.locationText}>
                  {item.location.name}, {item.location.city}
                </Text>
              </TouchableOpacity>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </TouchableOpacity>

          {/* Options Button */}
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={() => setOptionsMenuPost(item.id)}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadgeRow}>
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

        {/* Photo Gallery with Double Tap */}
        <Pressable onPress={handleImageDoubleTap}>
          {item.photos && renderPhotoGallery(item.photos)}

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
            <MaterialCommunityIcons
              name="heart"
              size={100}
              color="#EF4444"
            />
          </Animated.View>
        </Pressable>

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
          <View style={styles.actionsLeft}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleLike(item.id)}
            >
              <MaterialCommunityIcons
                name={item.isLiked ? 'heart' : 'heart-outline'}
                size={26}
                color={item.isLiked ? '#EF4444' : colors.text.secondary}
              />
              <Text style={[styles.actionText, item.isLiked && styles.actionTextActive]}>
                {item.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleComment(item.id)}
            >
              <MaterialCommunityIcons
                name="comment-outline"
                size={26}
                color={colors.text.secondary}
              />
              <Text style={styles.actionText}>{item.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleShare(item.id)}
            >
              <MaterialCommunityIcons
                name="share-variant"
                size={26}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleBookmark(item.id)}
          >
            <MaterialCommunityIcons
              name={bookmarkedPosts.includes(item.id) ? 'bookmark' : 'bookmark-outline'}
              size={26}
              color={bookmarkedPosts.includes(item.id) ? colors.primary.main : colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Comments Preview */}
        {renderCommentsPreview(item.id)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('feed.feed')}
        subtitle="Share your adventures"
        gradient
        gradientColors={['#1E3A8A', '#3B82F6', '#60A5FA']}
        actions={[
          {
            icon: 'magnify',
            onPress: () => setSearchVisible(true),
          },
          {
            icon: 'bell-outline',
            onPress: () => setNotificationsVisible(true),
            badge: notifications.filter(n => !n.read).length,
          },
        ]}
        elevation={6}
      />

      {/* Posts Feed */}
      <FlatList
        data={loading ? [] : posts}
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
        ListHeaderComponent={
          <>
            {renderStories()}
            {renderFilterTabs()}
            {renderSuggestedUsers()}
            {loading && (
              <View>
                {renderSkeletonPost()}
                {renderSkeletonPost()}
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['#F59E0B20', '#EC489920']}
              style={styles.emptyStateGradient}
            >
              <MaterialCommunityIcons
                name="earth"
                size={80}
                color={colors.text.secondary}
                style={{ marginBottom: spacing.lg }}
              />
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

      {/* Modals */}
      {renderOptionsMenu()}
      {renderSearchModal()}
      {renderNotificationsModal()}

      {/* Story Viewer Modal - Simple placeholder */}
      <Modal
        visible={storyViewerVisible}
        animationType="fade"
        onRequestClose={() => setStoryViewerVisible(false)}
      >
        <View style={styles.storyViewerContainer}>
          <TouchableOpacity
            style={[styles.storyViewerClose, { top: insets.top + spacing.lg }]}
            onPress={() => setStoryViewerVisible(false)}
          >
            <MaterialCommunityIcons
              name="close"
              size={30}
              color={colors.neutral.white}
            />
          </TouchableOpacity>
          <Text style={styles.storyViewerText}>
            {t('feed.storyViewer.comingSoon')}
          </Text>
        </View>
      </Modal>

      {/* Comment Modal */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <View style={styles.commentModalContainer}>
          <View style={[styles.commentModalHeader, { paddingTop: insets.top + spacing.md }]}>
            <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.commentModalTitle}>
              {t('feed.comments.title')}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.commentsList}>
            {getMockComments(t).map(comment => (
              <View key={comment.id} style={styles.commentItem}>
                <Avatar size={40} uri={comment.user.avatar} />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUsername}>{comment.user.name}</Text>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <Text style={styles.commentTime}>5 phút trước</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.commentInputContainer}>
            <Avatar size={36} uri={null} />
            <View style={styles.commentInputWrapper}>
              <Text style={styles.commentInputPlaceholder}>
                {t('feed.comments.placeholder')}
              </Text>
            </View>
            <TouchableOpacity style={styles.commentSendButton}>
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={colors.primary.main}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal
        visible={shareModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShareModalVisible(false)}
        >
          <View style={styles.shareModal}>
            <View style={styles.shareModalHeader}>
              <Text style={styles.shareModalTitle}>{t('feed.share.title')}</Text>
            </View>

            <ScrollView style={styles.shareOptions}>
              <TouchableOpacity style={styles.shareOption}>
                <View style={[styles.shareOptionIcon, { backgroundColor: '#25D366' + '20' }]}>
                  <MaterialCommunityIcons
                    name="whatsapp"
                    size={28}
                    color="#25D366"
                  />
                </View>
                <Text style={styles.shareOptionText}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareOption}>
                <View style={[styles.shareOptionIcon, { backgroundColor: '#1DA1F2' + '20' }]}>
                  <MaterialCommunityIcons
                    name="twitter"
                    size={28}
                    color="#1DA1F2"
                  />
                </View>
                <Text style={styles.shareOptionText}>Twitter</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareOption}>
                <View style={[styles.shareOptionIcon, { backgroundColor: '#1877F2' + '20' }]}>
                  <MaterialCommunityIcons
                    name="facebook"
                    size={28}
                    color="#1877F2"
                  />
                </View>
                <Text style={styles.shareOptionText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareOption}>
                <View style={[styles.shareOptionIcon, { backgroundColor: colors.text.secondary + '20' }]}>
                  <MaterialCommunityIcons
                    name="link-variant"
                    size={28}
                    color={colors.text.secondary}
                  />
                </View>
                <Text style={styles.shareOptionText}>{t('feed.share.copyLink')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.secondary,
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
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.xs,
    },
    optionsButton: {
      padding: spacing.xs,
      marginLeft: spacing.sm,
    },
    statusBadgeRow: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
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
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    locationText: {
      fontSize: typography.fontSize.sm,
      color: colors.primary.light,
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
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
      marginTop: spacing.sm,
    },
    actionsLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
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
    // Like Animation
    likeAnimationContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    },
    // Filter Tabs
    filterTabsContainer: {
      backgroundColor: colors.background.card,
      paddingVertical: spacing.sm,
      marginBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    filterTabsContent: {
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },
    filterTab: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    filterTabActive: {
      backgroundColor: colors.primary.main,
      borderColor: colors.primary.main,
    },
    filterTabText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.secondary,
    },
    filterTabTextActive: {
      color: colors.neutral.white,
      fontWeight: typography.fontWeight.bold,
    },
    // Suggested Users
    suggestedUsersContainer: {
      backgroundColor: colors.background.card,
      paddingVertical: spacing.md,
      marginBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    suggestedUsersHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    suggestedUsersTitle: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    suggestedUsersContent: {
      paddingHorizontal: spacing.md,
      gap: spacing.md,
    },
    suggestedUserCard: {
      width: 160,
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    suggestedUserName: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    suggestedUserUsername: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginTop: 2,
      textAlign: 'center',
    },
    suggestedUserMutual: {
      fontSize: typography.fontSize.xs,
      color: colors.text.disabled,
      marginTop: 4,
      textAlign: 'center',
    },
    followButton: {
      backgroundColor: colors.primary.main,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
      marginTop: spacing.sm,
      width: '100%',
    },
    followingButton: {
      backgroundColor: colors.background.card,
      borderWidth: 1,
      borderColor: colors.border.main,
    },
    followButtonText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
      textAlign: 'center',
    },
    followingButtonText: {
      color: colors.text.primary,
    },
    // Comments Preview
    commentsPreview: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
    },
    commentPreviewItem: {
      marginBottom: spacing.xs,
    },
    commentPreviewText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.primary,
      lineHeight: 18,
    },
    commentPreviewUsername: {
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    viewAllComments: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
      marginTop: spacing.xs,
    },
    // Options Menu Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'flex-end',
    },
    optionsMenu: {
      backgroundColor: colors.background.card,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      paddingVertical: spacing.lg,
      paddingBottom: spacing.xl + spacing.lg,
    },
    optionsMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    optionsMenuText: {
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      fontWeight: typography.fontWeight.medium,
    },
    // Skeleton Loading
    skeletonAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.background.elevated,
    },
    skeletonText: {
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.background.elevated,
      width: '100%',
    },
    skeletonImage: {
      width: '100%',
      height: 320,
      backgroundColor: colors.background.elevated,
    },
    // Search Modal
    searchModalContainer: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    searchHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      gap: spacing.md,
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.background.secondary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
    },
    searchInput: {
      flex: 1,
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
    },
    searchTabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.sm,
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    searchTab: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background.secondary,
    },
    searchTabActive: {
      backgroundColor: colors.primary.main,
    },
    searchTabText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.secondary,
    },
    searchTabTextActive: {
      color: colors.neutral.white,
    },
    searchResults: {
      flex: 1,
    },
    searchSection: {
      paddingVertical: spacing.md,
    },
    searchSectionTitle: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    searchResultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.md,
    },
    searchResultInfo: {
      flex: 1,
    },
    searchResultName: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.primary,
    },
    searchResultUsername: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginTop: 2,
    },
    searchFollowButton: {
      backgroundColor: colors.primary.main,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
    },
    searchFollowingButton: {
      backgroundColor: colors.background.secondary,
      borderWidth: 1,
      borderColor: colors.border.main,
    },
    searchFollowButtonText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
    },
    searchFollowingButtonText: {
      color: colors.text.primary,
    },
    searchLocationIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchLocationPins: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    // Notifications Modal
    notificationsModalContainer: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    notificationsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    notificationsTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    notificationsMarkAllRead: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.primary.main,
    },
    notificationsList: {
      flex: 1,
    },
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    notificationItemUnread: {
      backgroundColor: colors.primary.main + '08',
    },
    notificationAvatarContainer: {
      position: 'relative',
    },
    notificationIconBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.background.primary,
    },
    notificationIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationContent: {
      flex: 1,
    },
    notificationText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.primary,
      lineHeight: 20,
    },
    notificationUsername: {
      fontWeight: typography.fontWeight.bold,
    },
    notificationTimestamp: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    notificationUnreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary.main,
      marginTop: 6,
    },
    notificationsEmpty: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl * 3,
    },
    notificationsEmptyText: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      marginTop: spacing.md,
    },
    // Story Viewer Modal
    storyViewerContainer: {
      flex: 1,
      backgroundColor: colors.neutral.black,
      justifyContent: 'center',
      alignItems: 'center',
    },
    storyViewerClose: {
      position: 'absolute',
      right: spacing.lg,
      zIndex: 100,
    },
    storyViewerText: {
      fontSize: typography.fontSize.xl,
      color: colors.neutral.white,
      fontWeight: typography.fontWeight.bold,
    },
    // Comment Modal
    commentModalContainer: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    commentModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    commentModalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    commentsList: {
      flex: 1,
    },
    commentItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.sm,
    },
    commentContent: {
      flex: 1,
    },
    commentUsername: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: 2,
    },
    commentText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.primary,
      lineHeight: 20,
    },
    commentTime: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    commentInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.sm,
      backgroundColor: colors.background.card,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
    },
    commentInputWrapper: {
      flex: 1,
      backgroundColor: colors.background.secondary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
    },
    commentInputPlaceholder: {
      fontSize: typography.fontSize.sm,
      color: colors.text.disabled,
    },
    commentSendButton: {
      padding: spacing.xs,
    },
    // Share Modal
    shareModal: {
      backgroundColor: colors.background.card,
      borderTopLeftRadius: borderRadius.xl,
      borderTopRightRadius: borderRadius.xl,
      paddingVertical: spacing.lg,
      paddingBottom: spacing.xl + spacing.lg,
      maxHeight: '50%',
    },
    shareModalHeader: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    shareModalTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      textAlign: 'center',
    },
    shareOptions: {
      paddingTop: spacing.md,
    },
    shareOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    shareOptionIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    shareOptionText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      color: colors.text.primary,
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

