import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Vibration,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

// Mock user data
const getMockUsers = (t: any) => [
  {
    id: 'u1',
    name: t('mockData.discover.user1Name'),
    username: t('mockData.discover.user1Username'),
    avatar: null,
    bio: t('mockData.discover.user1Bio'),
    followersCount: 234,
    isFollowing: false,
  },
  {
    id: 'u2',
    name: t('mockData.discover.user2Name'),
    username: t('mockData.discover.user2Username'),
    avatar: null,
    bio: t('mockData.discover.user2Bio'),
    followersCount: 1205,
    isFollowing: true,
  },
  {
    id: 'u3',
    name: t('mockData.discover.user3Name'),
    username: t('mockData.discover.user3Username'),
    avatar: null,
    bio: t('mockData.discover.user3Bio'),
    followersCount: 567,
    isFollowing: false,
  },
];

export const DiscoverScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mockUsers = getMockUsers(t);
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(
    new Set(mockUsers.filter((u) => u.isFollowing).map((u) => u.id))
  );

  // Animation refs
  const searchFocusAnim = React.useRef(new Animated.Value(0)).current;
  const cardAnimations = React.useRef(
    mockUsers.map(() => new Animated.Value(0))
  ).current;

  const styles = React.useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);

  React.useEffect(() => {
    // Animate cards entrance
    Animated.stagger(
      80,
      cardAnimations.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        })
      )
    ).start();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      // Filter mock users
      const results = mockUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(text.toLowerCase()) ||
          user.name.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleSearchFocus = () => {
    Animated.spring(searchFocusAnim, {
      toValue: 1,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleSearchBlur = () => {
    Animated.spring(searchFocusAnim, {
      toValue: 0,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  const renderUserCard = ({ item, index }: { item: any; index: number }) => {
    const isFollowing = followingUsers.has(item.id);
    const cardScale = cardAnimations[index] || new Animated.Value(1);
    const [pressAnim] = React.useState(new Animated.Value(1));

    const handlePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }).start();
    };

    return (
      <Animated.View
        style={{
          opacity: cardScale,
          transform: [
            {
              translateY: cardScale.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            { scale: pressAnim },
          ],
        }}
      >
        <TouchableOpacity
          style={styles.userCard}
          onPress={() => handleUserPress(item.id)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <LinearGradient
            colors={[colors.background.card, colors.background.card]}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <Avatar size={64} uri={item.avatar} />

              <View style={styles.userInfo}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={16}
                    color={colors.primary.main}
                  />
                </View>
                <Text style={styles.userUsername}>@{item.username}</Text>
                {item.bio && (
                  <Text style={styles.userBio} numberOfLines={2}>
                    {item.bio}
                  </Text>
                )}
                <View style={styles.userStatsRow}>
                  <MaterialCommunityIcons
                    name="account-group"
                    size={14}
                    color={colors.text.disabled}
                  />
                  <Text style={styles.userStats}>
                    {item.followersCount} {t('discover.followers')}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowing && styles.followButtonActive,
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleFollowToggle(item.id);
                }}
              >
                <MaterialCommunityIcons
                  name={isFollowing ? 'check' : 'plus'}
                  size={18}
                  color={
                    isFollowing ? colors.text.secondary : colors.neutral.white
                  }
                />
                <Text
                  style={[
                    styles.followButtonText,
                    isFollowing && styles.followButtonTextActive,
                  ]}
                >
                  {isFollowing ? t('discover.following') : t('discover.follow')}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('discover.discover')}
        // gradient={true}
        // blur={true}
        gradientColors={['#3B82F6', '#60A5FA', '#93C5FD']}
        actions={[
          {
            icon: 'cog-outline',
            onPress: () => navigation.navigate('Settings'),
          },
        ]}
      />

      {/* Enhanced Search Bar */}
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
            colors={[colors.primary.main + '08', colors.primary.main + '00']}
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
              style={styles.searchInput}
              placeholder={t('discover.searchUsers')}
              placeholderTextColor={colors.text.disabled}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => handleSearch('')}
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

      {/* Search Results */}
      <FlatList
        data={searchResults}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {searchQuery.length === 0 ? (
              <LinearGradient
                colors={[
                  colors.primary.main + '10',
                  colors.primary.main + '05',
                  colors.background.main,
                ]}
                style={styles.emptyGradient}
              >
                <View style={styles.emptyIconContainer}>
                  <MaterialCommunityIcons
                    name="account-search"
                    size={80}
                    color={colors.primary.main}
                  />
                </View>
                <Text style={styles.emptyStateText}>
                  {t('discover.searchUsers')}
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  {t('discover.searchPlaceholder')}
                </Text>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={[
                  colors.text.disabled + '10',
                  colors.text.disabled + '05',
                  colors.background.main,
                ]}
                style={styles.emptyGradient}
              >
                <View style={styles.emptyIconContainer}>
                  <MaterialCommunityIcons
                    name="account-off"
                    size={80}
                    color={colors.text.disabled}
                  />
                </View>
                <Text style={styles.emptyStateText}>
                  {t('discover.noResults')}
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  {t('discover.tryDifferentKeyword')}
                </Text>
              </LinearGradient>
            )}
          </View>
        }
      />
    </View>
  );
};

const createStyles = (colors: any, isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.main,
    },
    searchContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.background.main,
    },
    searchBar: {
      borderRadius: borderRadius.xl,
      borderWidth: 2,
      borderColor: colors.border.main,
      overflow: 'hidden',
      shadowColor: colors.neutral.black,
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
      color: colors.text.primary,
      fontWeight: typography.fontWeight.medium,
      padding: 0,
    },
    clearButton: {
      padding: spacing.xs,
    },
    listContent: {
      paddingVertical: spacing.sm,
      paddingBottom: 120,
    },
    userCard: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    cardGradient: {
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    cardContent: {
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
      color: colors.text.primary,
      letterSpacing: -0.3,
    },
    userUsername: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
      fontWeight: typography.fontWeight.medium,
    },
    userBio: {
      fontSize: typography.fontSize.sm,
      color: colors.text.primary,
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
      color: colors.text.disabled,
      fontWeight: typography.fontWeight.medium,
    },
    followButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.primary.main,
      shadowColor: colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    followButtonActive: {
      backgroundColor: colors.background.elevated,
      borderWidth: 1.5,
      borderColor: colors.border.main,
      shadowOpacity: 0,
    },
    followButtonText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
    },
    followButtonTextActive: {
      color: colors.text.secondary,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: spacing.xl * 2,
      paddingHorizontal: spacing.xl,
    },
    emptyGradient: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: spacing.xl * 2,
      borderRadius: borderRadius.xl,
    },
    emptyIconContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.background.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
      borderWidth: 2,
      borderColor: colors.border.light,
    },
    emptyStateText: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    emptyStateSubtext: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
      maxWidth: 280,
    },
  });
