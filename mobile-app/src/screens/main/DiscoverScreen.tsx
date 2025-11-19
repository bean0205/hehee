import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Vibration,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Avatar } from '../../components/common/Avatar';
import { Header } from '../../components/common/Header';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;

// Mock data
const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'star' },
  { id: 'travel', name: 'Travel', icon: 'airplane' },
  { id: 'food', name: 'Food', icon: 'food' },
  { id: 'nature', name: 'Nature', icon: 'pine-tree' },
  { id: 'culture', name: 'Culture', icon: 'bank' },
  { id: 'adventure', name: 'Adventure', icon: 'hiking' },
  { id: 'urban', name: 'Urban', icon: 'city' },
];

const TABS = [
  { id: 'foryou', name: 'For You', icon: 'stars' },
  { id: 'following', name: 'Following', icon: 'account-heart' },
  { id: 'trending', name: 'Trending', icon: 'fire' },
  { id: 'places', name: 'Places', icon: 'map-marker' },
];

const getMockFeaturedUsers = (t: any) => [
  {
    id: 'f1',
    name: 'Sarah Chen',
    username: 'sarahexplores',
    avatar: null,
    bio: 'Travel photographer capturing the world',
    followersCount: 45200,
    isFollowing: false,
    coverGradient: ['#FF6B6B', '#4ECDC4'],
    stats: { pins: 234, followers: 45200, following: 892 },
  },
  {
    id: 'f2',
    name: 'Marco Silva',
    username: 'marcotravel',
    avatar: null,
    bio: 'Adventure seeker & digital nomad',
    followersCount: 32100,
    isFollowing: true,
    coverGradient: ['#A8E6CF', '#3FC1C9'],
    stats: { pins: 567, followers: 32100, following: 1205 },
  },
  {
    id: 'f3',
    name: 'Elena Rodriguez',
    username: 'elenajourney',
    avatar: null,
    bio: 'Exploring hidden gems worldwide',
    followersCount: 28500,
    isFollowing: false,
    coverGradient: ['#FFD93D', '#FF6B9D'],
    stats: { pins: 892, followers: 28500, following: 645 },
  },
];

const getMockTrendingPlaces = () => [
  {
    id: 'p1',
    name: 'Santorini, Greece',
    description: 'Stunning sunsets and white architecture',
    category: 'Travel',
    imageGradient: ['#1e3a8a', '#3b82f6', '#93c5fd'],
    pinsCount: 12450,
    visitorsCount: 892100,
    rating: 4.9,
    tags: ['Sunset', 'Beach', 'Architecture'],
  },
  {
    id: 'p2',
    name: 'Kyoto, Japan',
    description: 'Ancient temples and cherry blossoms',
    category: 'Culture',
    imageGradient: ['#7c2d12', '#dc2626', '#fca5a5'],
    pinsCount: 18920,
    visitorsCount: 1234500,
    rating: 4.8,
    tags: ['Temple', 'Culture', 'Spring'],
  },
  {
    id: 'p3',
    name: 'Iceland',
    description: 'Northern lights and natural wonders',
    category: 'Nature',
    imageGradient: ['#065f46', '#10b981', '#6ee7b7'],
    pinsCount: 9870,
    visitorsCount: 567800,
    rating: 4.9,
    tags: ['Nature', 'Aurora', 'Adventure'],
  },
];

const getMockUsers = (t: any) => [
  {
    id: 'u1',
    name: 'Alex Thompson',
    username: 'alexwanders',
    avatar: null,
    bio: 'Documenting my journey across 7 continents',
    followersCount: 8900,
    isFollowing: false,
  },
  {
    id: 'u2',
    name: 'Maria Garcia',
    username: 'mariapins',
    avatar: null,
    bio: 'Food lover | Travel enthusiast | Life enjoyer',
    followersCount: 15600,
    isFollowing: true,
  },
  {
    id: 'u3',
    name: 'James Wilson',
    username: 'jamestravel',
    avatar: null,
    bio: 'Capturing moments, one pin at a time',
    followersCount: 23400,
    isFollowing: false,
  },
];

// SkeletonLoader Component
const SkeletonLoader: React.FC<{ type: 'user' | 'place' }> = ({ type }) => {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  if (type === 'user') {
    return (
      <Animated.View style={[styles.skeletonUserCard, { opacity }]}>
        <View
          style={[
            styles.skeletonAvatar,
            { backgroundColor: colors.border.main },
          ]}
        />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <View
            style={[
              styles.skeletonLine,
              { width: '60%', backgroundColor: colors.border.main },
            ]}
          />
          <View
            style={[
              styles.skeletonLine,
              { width: '40%', backgroundColor: colors.border.main },
            ]}
          />
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.skeletonPlaceCard,
        { opacity, backgroundColor: colors.background.card },
      ]}
    >
      <View
        style={[
          styles.skeletonPlaceImage,
          { backgroundColor: colors.border.main },
        ]}
      />
      <View
        style={[
          styles.skeletonLine,
          { backgroundColor: colors.border.main, marginTop: spacing.md },
        ]}
      />
      <View
        style={[
          styles.skeletonLine,
          { width: '60%', backgroundColor: colors.border.main },
        ]}
      />
    </Animated.View>
  );
};

// FeaturedUserCard Component
interface FeaturedUserCardProps {
  item: any;
  onPress: (userId: string) => void;
  onFollowToggle: (userId: string) => void;
  isFollowing: boolean;
}

const FeaturedUserCard: React.FC<FeaturedUserCardProps> = ({
  item,
  onPress,
  onFollowToggle,
  isFollowing,
}) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.featuredCard}
        onPress={() => onPress(item.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={item.coverGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredCardGradient}
        >
          <View style={styles.featuredCardOverlay}>
            <Avatar size={72} uri={item.avatar} />
            <Text style={styles.featuredName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.featuredUsername} numberOfLines={1}>
              @{item.username}
            </Text>
            <Text style={styles.featuredBio} numberOfLines={2}>
              {item.bio}
            </Text>

            <View style={styles.featuredStats}>
              <View style={styles.featuredStat}>
                <Text style={styles.featuredStatValue}>{item.stats.pins}</Text>
                <Text style={styles.featuredStatLabel}>Pins</Text>
              </View>
              <View style={styles.featuredStatDivider} />
              <View style={styles.featuredStat}>
                <Text style={styles.featuredStatValue}>
                  {item.stats.followers > 999
                    ? `${(item.stats.followers / 1000).toFixed(1)}K`
                    : item.stats.followers}
                </Text>
                <Text style={styles.featuredStatLabel}>Followers</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.featuredFollowButton,
                isFollowing && styles.featuredFollowButtonActive,
              ]}
              onPress={(e) => {
                e.stopPropagation();
                onFollowToggle(item.id);
              }}
            >
              <MaterialCommunityIcons
                name={isFollowing ? 'check' : 'plus'}
                size={16}
                color={isFollowing ? colors.text.primary : '#FFFFFF'}
              />
              <Text
                style={[
                  styles.featuredFollowButtonText,
                  isFollowing && styles.featuredFollowButtonTextActive,
                ]}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// TrendingPlaceCard Component
interface TrendingPlaceCardProps {
  item: any;
  onPress: (placeId: string) => void;
}

const TrendingPlaceCard: React.FC<TrendingPlaceCardProps> = ({
  item,
  onPress,
}) => {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.placeCard}
        onPress={() => onPress(item.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={item.imageGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.placeCardImage}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.placeCardGradientOverlay}
          >
            <View style={styles.placeCardBadge}>
              <MaterialCommunityIcons
                name="fire"
                size={14}
                color="#FF6B6B"
              />
              <Text style={styles.placeCardBadgeText}>Trending</Text>
            </View>
          </LinearGradient>
        </LinearGradient>

        <View style={[styles.placeCardContent, { backgroundColor: colors.background.card }]}>
          <Text style={[styles.placeCardName, { color: colors.text.primary }]}>
            {item.name}
          </Text>
          <Text
            style={[styles.placeCardDescription, { color: colors.text.secondary }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <View style={styles.placeCardTags}>
            {item.tags.slice(0, 2).map((tag: string, index: number) => (
              <View
                key={index}
                style={[styles.placeCardTag, { backgroundColor: colors.primary.main + '15' }]}
              >
                <Text style={[styles.placeCardTagText, { color: colors.primary.main }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.placeCardFooter}>
            <View style={styles.placeCardStat}>
              <MaterialCommunityIcons
                name="map-marker"
                size={14}
                color={colors.text.disabled}
              />
              <Text style={[styles.placeCardStatText, { color: colors.text.disabled }]}>
                {item.pinsCount > 999
                  ? `${(item.pinsCount / 1000).toFixed(1)}K`
                  : item.pinsCount}{' '}
                pins
              </Text>
            </View>
            <View style={styles.placeCardRating}>
              <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
              <Text style={[styles.placeCardRatingText, { color: colors.text.primary }]}>
                {item.rating}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// UserCard Component
interface UserCardProps {
  item: any;
  isFollowing: boolean;
  onPress: (userId: string) => void;
  onFollowToggle: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  item,
  isFollowing,
  onPress,
  onFollowToggle,
}) => {
  const { colors } = useTheme();
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
      <TouchableOpacity
        style={[styles.userCard, { backgroundColor: colors.background.card }]}
        onPress={() => onPress(item.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={[colors.primary.main + '08', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.userCardGradient}
        >
          <Avatar size={56} uri={item.avatar} />
          <View style={styles.userInfo}>
            <View style={styles.userNameRow}>
              <Text style={[styles.userName, { color: colors.text.primary }]}>
                {item.name}
              </Text>
              <MaterialCommunityIcons
                name="check-decagram"
                size={14}
                color={colors.primary.main}
              />
            </View>
            <Text style={[styles.userUsername, { color: colors.text.secondary }]}>
              @{item.username}
            </Text>
            {item.bio && (
              <Text
                style={[styles.userBio, { color: colors.text.secondary }]}
                numberOfLines={2}
              >
                {item.bio}
              </Text>
            )}
            <View style={styles.userStatsRow}>
              <MaterialCommunityIcons
                name="account-group"
                size={12}
                color={colors.text.disabled}
              />
              <Text style={[styles.userStats, { color: colors.text.disabled }]}>
                {item.followersCount > 999
                  ? `${(item.followersCount / 1000).toFixed(1)}K`
                  : item.followersCount}{' '}
                followers
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.followButton,
              { backgroundColor: colors.primary.main },
              isFollowing && {
                backgroundColor: colors.background.elevated,
                borderWidth: 1.5,
                borderColor: colors.border.main,
              },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              onFollowToggle(item.id);
            }}
          >
            <MaterialCommunityIcons
              name={isFollowing ? 'check' : 'plus'}
              size={16}
              color={isFollowing ? colors.text.secondary : '#FFFFFF'}
            />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const DiscoverScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('foryou');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const featuredUsers = getMockFeaturedUsers(t);
  const trendingPlaces = getMockTrendingPlaces();
  const users = getMockUsers(t);

  const [followingUsers, setFollowingUsers] = useState<Set<string>>(
    new Set([
      ...featuredUsers.filter((u) => u.isFollowing).map((u) => u.id),
      ...users.filter((u) => u.isFollowing).map((u) => u.id),
    ])
  );

  // Animation refs
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  const searchFocusAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleTabPress = (tabId: string, index: number) => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
    setActiveTab(tabId);
    Animated.spring(tabIndicatorAnim, {
      toValue: index,
      useNativeDriver: true,
      tension: 300,
      friction: 30,
    }).start();
  };

  const handleFollowToggle = (userId: string) => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
    setFollowingUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const handlePlacePress = (placeId: string) => {
    // Navigate to place details
    console.log('Place pressed:', placeId);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleSearchFocus = () => {
    Animated.spring(searchFocusAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const handleSearchBlur = () => {
    Animated.spring(searchFocusAnim, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const tabWidth = SCREEN_WIDTH / TABS.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background.main }]}>
      <Header
        title="Discover"
        subtitle="Explore amazing places"
        gradient
        gradientColors={['#3B82F6', '#60A5FA', '#93C5FD']}
        actions={[
          {
            icon: 'bell-outline',
            onPress: () => console.log('Notifications'),
            badge: 3,
          },
          {
            icon: 'cog-outline',
            onPress: () => navigation.navigate('Settings'),
          },
        ]}
        elevation={8}
      />

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.background.main }]}>
        <View style={styles.tabs}>
          {TABS.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tab}
                onPress={() => handleTabPress(tab.id, index)}
              >
                <MaterialCommunityIcons
                  name={tab.icon as any}
                  size={20}
                  color={isActive ? colors.primary.main : colors.text.disabled}
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? colors.primary.main : colors.text.disabled,
                      fontWeight: isActive
                        ? typography.fontWeight.bold
                        : typography.fontWeight.medium,
                    },
                  ]}
                >
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Animated.View
          style={[
            styles.tabIndicator,
            { backgroundColor: colors.primary.main },
            {
              width: tabWidth - spacing.lg,
              transform: [
                {
                  translateX: tabIndicatorAnim.interpolate({
                    inputRange: TABS.map((_, i) => i),
                    outputRange: TABS.map((_, i) => i * tabWidth + spacing.sm),
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Animated.View
            style={[
              styles.searchBar,
              {
                borderColor: searchFocusAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.border.main, colors.primary.main],
                }),
                shadowOpacity: searchFocusAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.05, 0.15],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={[colors.primary.main + '08', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.searchGradient}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={22}
                color={colors.primary.main}
                style={styles.searchIcon}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.text.primary }]}
                placeholder="Search users, places, or tags..."
                placeholderTextColor={colors.text.disabled}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={20}
                    color={colors.text.disabled}
                  />
                </TouchableOpacity>
              )}
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected
                        ? colors.primary.main
                        : colors.background.card,
                      borderColor: isSelected
                        ? colors.primary.main
                        : colors.border.main,
                    },
                  ]}
                  onPress={() => {
                    if (Platform.OS === 'ios') {
                      Vibration.vibrate(10);
                    }
                    setSelectedCategory(category.id);
                  }}
                >
                  <MaterialCommunityIcons
                    name={category.icon as any}
                    size={16}
                    color={isSelected ? '#FFFFFF' : colors.text.secondary}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      {
                        color: isSelected ? '#FFFFFF' : colors.text.secondary,
                        fontWeight: isSelected
                          ? typography.fontWeight.bold
                          : typography.fontWeight.medium,
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Featured Users Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons
                name="star-circle"
                size={24}
                color={colors.primary.main}
              />
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Featured Creators
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary.main }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            >
              {[1, 2, 3].map((i) => (
                <SkeletonLoader key={i} type="user" />
              ))}
            </ScrollView>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            >
              {featuredUsers.map((user) => (
                <FeaturedUserCard
                  key={user.id}
                  item={user}
                  onPress={handleUserPress}
                  onFollowToggle={handleFollowToggle}
                  isFollowing={followingUsers.has(user.id)}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Trending Places Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons
                name="fire"
                size={24}
                color="#FF6B6B"
              />
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Trending Destinations
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary.main }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.placesList}>
              {[1, 2].map((i) => (
                <SkeletonLoader key={i} type="place" />
              ))}
            </View>
          ) : (
            <View style={styles.placesList}>
              {trendingPlaces.map((place) => (
                <TrendingPlaceCard
                  key={place.id}
                  item={place}
                  onPress={handlePlacePress}
                />
              ))}
            </View>
          )}
        </View>

        {/* Suggested Users Section */}
        <View style={[styles.section, { marginBottom: spacing.xl * 3 }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons
                name="account-multiple"
                size={24}
                color={colors.primary.main}
              />
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                People You May Know
              </Text>
            </View>
          </View>

          {users.map((user) => (
            <UserCard
              key={user.id}
              item={user}
              isFollowing={followingUsers.has(user.id)}
              onPress={handleUserPress}
              onFollowToggle={handleFollowToggle}
            />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    paddingTop: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
  },
  tabIndicator: {
    height: 3,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
    marginHorizontal: spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchBar: {
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    padding: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
  categoriesSection: {
    marginBottom: spacing.md,
  },
  categoriesContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
  },
  categoryChipText: {
    fontSize: typography.fontSize.sm,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  featuredList: {
    paddingLeft: spacing.lg,
    paddingRight: spacing.lg,
    gap: spacing.md,
  },
  featuredCard: {
    width: CARD_WIDTH,
    height: 280,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  featuredCardGradient: {
    flex: 1,
    padding: spacing.lg,
  },
  featuredCardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  featuredUsername: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: spacing.sm,
  },
  featuredBio: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  featuredStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  featuredStat: {
    alignItems: 'center',
  },
  featuredStatValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
  },
  featuredStatLabel: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  featuredStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  featuredFollowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredFollowButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  featuredFollowButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#000000',
  },
  featuredFollowButtonTextActive: {
    color: '#FFFFFF',
  },
  placesList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  placeCard: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: spacing.sm,
  },
  placeCardImage: {
    height: 200,
    justifyContent: 'flex-end',
  },
  placeCardGradientOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  placeCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  placeCardBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#FF6B6B',
  },
  placeCardContent: {
    padding: spacing.lg,
  },
  placeCardName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  placeCardDescription: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  placeCardTags: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  placeCardTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  placeCardTagText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  placeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeCardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  placeCardStatText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  placeCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  placeCardRatingText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  userCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  userCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: -0.3,
  },
  userUsername: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  userBio: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  userStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userStats: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  followButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  skeletonUserCard: {
    width: CARD_WIDTH,
    height: 100,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  skeletonLine: {
    height: 12,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  skeletonPlaceCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  skeletonPlaceImage: {
    height: 160,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
});
