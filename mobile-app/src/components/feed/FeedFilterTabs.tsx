import React, { memo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export type FeedFilter = 'all' | 'following' | 'popular' | 'nearby';

export interface FilterTab {
  id: FeedFilter;
  labelKey: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

interface FeedFilterTabsProps {
  activeFilter: FeedFilter;
  onFilterChange: (filter: FeedFilter) => void;
}

const FILTER_TABS: FilterTab[] = [
  { id: 'all', labelKey: 'feed.filters.all', icon: 'view-grid' },
  { id: 'following', labelKey: 'feed.filters.following', icon: 'account-group' },
  { id: 'popular', labelKey: 'feed.filters.popular', icon: 'fire' },
  { id: 'nearby', labelKey: 'feed.filters.nearby', icon: 'map-marker-radius' },
];

/**
 * FeedFilterTabs - Filter tabs cho Feed
 *
 * Features:
 * - All, Following, Popular, Nearby
 * - Animated indicator
 * - Haptic feedback
 * - Icon + Label
 */
const FeedFilterTabsComponent: React.FC<FeedFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const indicatorPosition = useRef(new Animated.Value(0)).current;

  const handleFilterChange = (filter: FeedFilter, index: number) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animate indicator
    Animated.spring(indicatorPosition, {
      toValue: index,
      tension: 80,
      friction: 10,
      useNativeDriver: true,
    }).start();

    onFilterChange(filter);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {FILTER_TABS.map((tab, index) => {
          const isActive = activeFilter === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => handleFilterChange(tab.id, index)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={tab.icon}
                size={20}
                color={isActive ? colors.primary.main : colors.text.secondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {t(tab.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export const FeedFilterTabs = memo(FeedFilterTabsComponent);

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
      paddingVertical: spacing.sm,
    },
    scrollContent: {
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
    },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background.elevated,
      gap: spacing.xs,
      minWidth: 90,
      justifyContent: 'center',
    },
    tabActive: {
      backgroundColor: colors.primary.main + '15',
    },
    tabLabel: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.secondary,
    },
    tabLabelActive: {
      color: colors.primary.main,
    },
  });
