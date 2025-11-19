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
 * AnimatedFilterTab - Individual filter tab with press animation
 */
const AnimatedFilterTab: React.FC<{
  tab: FilterTab;
  isActive: boolean;
  onPress: () => void;
  colors: any;
  t: (key: string) => string;
}> = ({ tab, isActive, onPress, colors, t }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.tab,
          isActive && styles.tabActive,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <MaterialCommunityIcons
          name={tab.icon}
          size={20}
          color={isActive ? colors.primary.main : colors.text.secondary}
        />
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
          {t(tab.labelKey)}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

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

  const handleFilterChange = (filter: FeedFilter) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onFilterChange(filter);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={110}
        snapToAlignment="start"
        bounces={false}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.id;

          return (
            <AnimatedFilterTab
              key={tab.id}
              tab={tab}
              isActive={isActive}
              onPress={() => handleFilterChange(tab.id)}
              colors={colors}
              t={t}
            />
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
      paddingVertical: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    scrollContent: {
      paddingHorizontal: spacing.md,
      gap: spacing.sm + 2,
      alignItems: 'center',
    },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md + 2,
      paddingVertical: spacing.sm + 2,
      borderRadius: borderRadius.full,
      backgroundColor: colors.background.elevated,
      gap: spacing.xs + 2,
      minWidth: 100,
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'transparent',
      shadowColor: colors.text.primary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    tabActive: {
      backgroundColor: colors.primary.main + '18',
      borderColor: colors.primary.main + '30',
      shadowColor: colors.primary.main,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    tabLabel: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.secondary,
      letterSpacing: 0.2,
    },
    tabLabelActive: {
      color: colors.primary.main,
      fontWeight: typography.fontWeight.bold,
    },
  });
