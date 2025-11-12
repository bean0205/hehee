import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const mockUsers = getMockUsers(t);
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(
    new Set(mockUsers.filter((u) => u.isFollowing).map((u) => u.id))
  );

  const styles = React.useMemo(() => createStyles(colors), [colors]);

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
    // Navigate to user profile (will create later)
    // navigation.navigate('UserProfile', { userId });
  };

  const renderUserCard = ({ item }: { item: any }) => {
    const isFollowing = followingUsers.has(item.id);

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => handleUserPress(item.id)}
        activeOpacity={0.7}
      >
        <Avatar size={56} uri={item.avatar} />

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
          {item.bio && <Text style={styles.userBio} numberOfLines={1}>{item.bio}</Text>}
          <Text style={styles.userStats}>
            {item.followersCount} {t('discover.followers')}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.followButton,
            isFollowing && styles.followButtonActive,
          ]}
          onPress={() => handleFollowToggle(item.id)}
        >
          <Text
            style={[
              styles.followButtonText,
              isFollowing && styles.followButtonTextActive,
            ]}
          >
            {isFollowing ? t('discover.following') : t('discover.follow')}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('discover.discover')}
        gradient={true}
        // blur={true}
        gradientColors={['#3B82F6', '#60A5FA', '#93C5FD']}
        actions={[
          {
            icon: 'cog-outline',
            onPress: () => navigation.navigate('Settings'),
          },
        ]}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.text.secondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t('discover.searchUsers')}
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      <FlatList
        data={searchResults}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {searchQuery.length === 0 ? (
              <>
                <Text style={styles.emptyStateIcon}>🔎</Text>
                <Text style={styles.emptyStateText}>{t('discover.searchUsers')}</Text>
                <Text style={styles.emptyStateSubtext}>
                  {t('discover.searchPlaceholder')}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.emptyStateIcon}>😕</Text>
                <Text style={styles.emptyStateText}>{t('discover.noResults')}</Text>
                <Text style={styles.emptyStateSubtext}>
                  {t('discover.tryDifferentKeyword')}
                </Text>
              </>
            )}
          </View>
        }
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
    searchContainer: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.background.card,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.main,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border.main,
    },
    searchIcon: {
      fontSize: 20,
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      padding: 0,
    },
    clearIcon: {
      fontSize: 20,
      color: colors.text.secondary,
      padding: spacing.xs,
    },
    listContent: {
      paddingVertical: spacing.sm,
      paddingBottom: 100, // Space for navbar
    },
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.background.card,
      marginHorizontal: spacing.md,
      marginVertical: spacing.xs,
      borderRadius: borderRadius.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    userInfo: {
      flex: 1,
      marginLeft: spacing.md,
    },
    userName: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.primary,
      marginBottom: 2,
    },
    userUsername: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    userBio: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    userStats: {
      fontSize: typography.fontSize.xs,
      color: colors.text.disabled,
    },
    followButton: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      backgroundColor: colors.primary.main,
      minWidth: 100,
      alignItems: 'center',
    },
    followButtonActive: {
      backgroundColor: colors.background.main,
      borderWidth: 1,
      borderColor: colors.border.main,
    },
    followButtonText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.inverse,
    },
    followButtonTextActive: {
      color: colors.text.secondary,
    },
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
