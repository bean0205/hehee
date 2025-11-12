import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

// Mock user data
const mockUsers = [
  {
    id: 'u1',
    name: 'Nguyễn Văn A',
    username: 'nguyenvana',
    avatar: null,
    bio: 'Yêu thích du lịch khắp Việt Nam',
    followersCount: 234,
    isFollowing: false,
  },
  {
    id: 'u2',
    name: 'Trần Thị B',
    username: 'tranthib',
    avatar: null,
    bio: 'Travel blogger | 30+ quốc gia',
    followersCount: 1205,
    isFollowing: true,
  },
  {
    id: 'u3',
    name: 'Lê Văn C',
    username: 'levanc',
    avatar: null,
    bio: 'Nhiếp ảnh gia phong cảnh',
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
            {item.followersCount} người theo dõi
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
            {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Khám phá</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm người dùng (@username)"
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
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
                <Text style={styles.emptyStateText}>Tìm kiếm người dùng</Text>
                <Text style={styles.emptyStateSubtext}>
                  Nhập tên hoặc @username để tìm kiếm
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.emptyStateIcon}>😕</Text>
                <Text style={styles.emptyStateText}>Không tìm thấy kết quả</Text>
                <Text style={styles.emptyStateSubtext}>
                  Thử tìm kiếm với từ khóa khác
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
    header: {
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
