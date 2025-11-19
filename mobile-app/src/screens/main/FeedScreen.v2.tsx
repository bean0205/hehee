import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Header } from '../../components/common/Header';
import { FeedStoryBar } from '../../components/feed/FeedStoryBar';
import { FeedFilterTabs, FeedFilter } from '../../components/feed/FeedFilterTabs';
import { FeedPost, FeedPostData } from '../../components/feed/FeedPost';
import { FeedSkeleton } from '../../components/feed/FeedSkeleton';
import { ImageViewerModal } from '../../components/feed/ImageViewerModal';
import { useFeedPagination } from '../../hooks/useFeedPagination';
import { spacing } from '../../theme/spacing';

/**
 * FeedScreen v2 - Refactored Version
 *
 * Improvements:
 * - Separated components (FeedPost, PhotoGallery, etc.)
 * - useFeedPagination hook for infinite scroll
 * - React.memo for performance
 * - Clean architecture (<200 lines)
 */
export const FeedScreenV2: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all');
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Stories mock data
  const [stories] = useState([
    {
      id: '1',
      user: { id: 'u1', name: 'Your Story', avatar: '' },
      hasViewed: false,
      isOwn: true,
    },
    {
      id: '2',
      user: { id: 'u2', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
      hasViewed: false,
    },
    {
      id: '3',
      user: { id: 'u3', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
      hasViewed: true,
    },
  ]);

  // Feed pagination
  const {
    data: posts,
    loading,
    refreshing,
    hasMore,
    loadMore,
    refresh,
  } = useFeedPagination<FeedPostData>({
    pageSize: 10,
    fetchFunction: fetchPosts,
  });

  // Load initial data
  useEffect(() => {
    loadMore();
  }, []);

  // Mock API call
  async function fetchPosts(page: number, pageSize: number): Promise<FeedPostData[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock posts
    return generateMockPosts(page, pageSize);
  }

  // Mock data generator
  function generateMockPosts(page: number, pageSize: number): FeedPostData[] {
    const posts: FeedPostData[] = [];
    const start = (page - 1) * pageSize;

    for (let i = start; i < start + pageSize; i++) {
      posts.push({
        id: `post-${i}`,
        user: {
          id: `user-${i % 5}`,
          name: `User ${i % 5}`,
          username: `user${i % 5}`,
          avatar: `https://i.pravatar.cc/150?img=${i % 70}`,
        },
        location: {
          name: ['Paris', 'Tokyo', 'New York', 'London', 'Sydney'][i % 5],
          country: ['France', 'Japan', 'USA', 'UK', 'Australia'][i % 5],
        },
        caption: `Amazing trip to ${['Paris', 'Tokyo', 'New York'][i % 3]}! #travel #adventure`,
        photos: Array.from({ length: Math.min((i % 5) + 1, 4) }, (_, j) =>
          `https://picsum.photos/seed/${i}-${j}/800/600`
        ),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        isLiked: Math.random() > 0.5,
        isBookmarked: Math.random() > 0.7,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    return posts;
  }

  // Handlers
  const handleLike = useCallback((postId: string) => {
    console.log('Like post:', postId);
    // TODO: API call
  }, []);

  const handleComment = useCallback((postId: string) => {
    console.log('Comment on post:', postId);
    // TODO: Navigate to comments
    // navigation.navigate('Comments', { postId });
  }, []);

  const handleShare = useCallback((postId: string) => {
    console.log('Share post:', postId);
    // TODO: Open share modal
  }, []);

  const handleBookmark = useCallback((postId: string) => {
    console.log('Bookmark post:', postId);
    // TODO: API call
  }, []);

  const handleImagePress = useCallback((photos: string[], index: number) => {
    setSelectedImages(photos);
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  }, []);

  const handleUserPress = useCallback((userId: string) => {
    console.log('Open user profile:', userId);
    // navigation.navigate('UserProfile', { userId });
  }, []);

  const handleLocationPress = useCallback((location: any) => {
    console.log('Open location:', location);
    // navigation.navigate('Location', { location });
  }, []);

  const handleStoryPress = useCallback((storyId: string, userId: string) => {
    console.log('Open story:', storyId, userId);
    // TODO: Navigate to story viewer
  }, []);

  const handleAddStory = useCallback(() => {
    console.log('Add story');
    // TODO: Open camera/image picker
  }, []);

  // Render post item
  const renderPost = useCallback(
    ({ item }: { item: FeedPostData }) => (
      <FeedPost
        post={item}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onBookmark={handleBookmark}
        onImagePress={handleImagePress}
        onUserPress={handleUserPress}
        onLocationPress={handleLocationPress}
      />
    ),
    [handleLike, handleComment, handleShare, handleBookmark, handleImagePress, handleUserPress, handleLocationPress]
  );

  // Key extractor
  const keyExtractor = useCallback((item: FeedPostData) => item.id, []);

  // Get item layout for performance
  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: 450, // Average post height
      offset: 450 * index,
      index,
    }),
    []
  );

  // List header
  const ListHeaderComponent = useCallback(
    () => (
      <>
        <FeedStoryBar
          stories={stories}
          colors={colors}
          onStoryPress={handleStoryPress}
          onAddStory={handleAddStory}
          t={t}
        />
        <FeedFilterTabs
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </>
    ),
    [stories, colors, activeFilter, handleStoryPress, handleAddStory, t]
  );

  // List empty component
  const ListEmptyComponent = useCallback(
    () => (!loading ? <FeedSkeleton count={3} /> : null),
    [loading]
  );

  // List footer component
  const ListFooterComponent = useCallback(
    () => (loading && hasMore ? <FeedSkeleton count={2} /> : null),
    [loading, hasMore]
  );

  return (
    <View style={styles.container}>
      <Header
        title={t('feed.feed')}
        gradientColors={['#3B82F6', '#60A5FA', '#93C5FD']}
        actions={[
          {
            icon: 'magnify',
            onPress: () => console.log('Search'),
          },
          {
            icon: 'bell-outline',
            onPress: () => console.log('Notifications'),
          },
        ]}
      />

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        // Performance optimizations
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        updateCellsBatchingPeriod={100}
        // Pull-to-refresh
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
        // Infinite scroll
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
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
  });
