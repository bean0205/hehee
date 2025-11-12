import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { usePin } from '../../contexts/PinContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBadge } from '../../contexts/BadgeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Avatar } from '../../components/common/Avatar';
import { PinCard } from '../../components/common/PinCard';
import { BadgeRank } from '../../components/common/BadgeRank';
import { BadgeIcon } from '../../components/common/BadgeIcon';
import { Header } from '../../components/common/Header';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const { pins } = usePin();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('list');
  const [filter, setFilter] = useState<'all' | 'visited' | 'wantToGo'>('all');

  // Create styles with current theme colors
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const filteredPins = pins.filter(pin => {
    if (filter === 'all') return true;
    return pin.status === filter;
  });

  // Calculate real stats
  const visitedPins = pins.filter(p => p.status === 'visited');
  
  // Extract unique countries and continents from pin names (simple heuristic)
  const countriesWithContinent = pins.map(p => {
    const name = p.name.toLowerCase();
    if (name.includes('nhật bản') || name.includes('tokyo') || name.includes('hàn quốc') || name.includes('seoul') || name.includes('singapore')) 
      return { country: 'Nhật Bản', continent: 'Châu Á' };
    if (name.includes('pháp') || name.includes('paris') || name.includes('anh') || name.includes('london') || name.includes('đức') || name.includes('berlin')) 
      return { country: 'Pháp', continent: 'Châu Âu' };
    if (name.includes('mỹ') || name.includes('new york') || name.includes('canada') || name.includes('toronto')) 
      return { country: 'Mỹ', continent: 'Bắc Mỹ' };
    if (name.includes('trung quốc') || name.includes('bắc kinh') || name.includes('ấn độ') || name.includes('delhi')) 
      return { country: 'Trung Quốc', continent: 'Châu Á' };
    if (name.includes('italy') || name.includes('rome') || name.includes('tây ban nha') || name.includes('madrid')) 
      return { country: 'Italy', continent: 'Châu Âu' };
    if (name.includes('úc') || name.includes('australia') || name.includes('sydney') || name.includes('new zealand')) 
      return { country: 'Úc', continent: 'Châu Đại Dương' };
    if (name.includes('brazil') || name.includes('rio') || name.includes('argentina') || name.includes('chile')) 
      return { country: 'Brazil', continent: 'Nam Mỹ' };
    if (name.includes('ai cập') || name.includes('cairo') || name.includes('nam phi') || name.includes('morocco')) 
      return { country: 'Ai Cập', continent: 'Châu Phi' };
    return { country: 'Việt Nam', continent: 'Châu Á' };
  });
  
  const countries = new Set(countriesWithContinent.map(c => c.country));
  const continents = new Set(countriesWithContinent.map(c => c.continent));
  
  // Calculate continent statistics (excluding Antarctica)
  const continentData = [
    { name: 'Châu Á', emoji: '🌏', totalCountries: 48, visited: countriesWithContinent.filter(c => c.continent === 'Châu Á').length > 0 },
    { name: 'Châu Âu', emoji: '🇪🇺', totalCountries: 44, visited: countriesWithContinent.filter(c => c.continent === 'Châu Âu').length > 0 },
    { name: 'Châu Phi', emoji: '🌍', totalCountries: 54, visited: countriesWithContinent.filter(c => c.continent === 'Châu Phi').length > 0 },
    { name: 'Bắc Mỹ', emoji: '🌎', totalCountries: 23, visited: countriesWithContinent.filter(c => c.continent === 'Bắc Mỹ').length > 0 },
    { name: 'Nam Mỹ', emoji: '🌎', totalCountries: 12, visited: countriesWithContinent.filter(c => c.continent === 'Nam Mỹ').length > 0 },
    { name: 'Châu Đại Dương', emoji: '🏝️', totalCountries: 14, visited: countriesWithContinent.filter(c => c.continent === 'Châu Đại Dương').length > 0 },
  ].map(continent => ({
    ...continent,
    visitedCountries: countriesWithContinent.filter(c => c.continent === continent.name).length,
    percentage: continent.totalCountries > 0 
      ? Math.round((countriesWithContinent.filter(c => c.continent === continent.name).length / continent.totalCountries) * 100)
      : 0
  }));
  
  // Count unique cities
  const cities = new Set(pins.map(p => p.name.split(',')[0].trim()));

  const stats = {
    countries: countries.size,
    cities: cities.size,
    totalPins: pins.length,
    visited: visitedPins.length,
    wantToGo: pins.filter(p => p.status === 'wantToGo').length,
    explorationPercentage: Math.round((countries.size / 195) * 100), // 195 countries in the world
    continents: continents.size,
    continentPercentage: Math.round((continents.size / 7) * 100), // 7 continents
  };

  return (
    <View style={styles.container}>
      <Header
        title={t('profile.profile') || 'Profile'}
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

      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://picsum.photos/400/150' }}
            style={styles.coverImage}
          />
          <View style={styles.profileInfo}>
          <Avatar uri={user?.avatar} size={80} style={styles.avatar} />
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{user?.displayName || 'User'}</Text>
            <BadgeIcon size="medium" showName={true} onPress={() => navigation.navigate('BadgeDetails')} />
          </View>
          <Text style={styles.username}>@{user?.username || 'username'}</Text>
          <Text style={styles.bio}>
            {user?.bio || 'Yêu thích du lịch và khám phá thế giới 🌍'}
          </Text>
        </View>
      </View>

      {/* Badge Rank - NEW */}
      <View style={styles.badgeSection}>
        <BadgeRank 
          size="large" 
          showProgress={true}
          onPress={() => navigation.navigate('BadgeDetails')}
        />
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.continents}</Text>
          <Text style={styles.statLabel}>{t('profile.continents')}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.countries}</Text>
          <Text style={styles.statLabel}>{t('profile.countries')}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.cities}</Text>
          <Text style={styles.statLabel}>{t('profile.cities')}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalPins}</Text>
          <Text style={styles.statLabel}>{t('profile.pins')}</Text>
        </View>
      </View>

      {/* Exploration Journey - Combined Section */}
      <View style={styles.continentSection}>
        
        
        {/* World Overview - Large Progress Bar */}
        <TouchableOpacity 
          style={styles.worldOverview}
          onPress={() => navigation.navigate('CountryExploration')}
          activeOpacity={0.7}
        >
          <View style={styles.explorationHeader}>
            <Text style={styles.explorationTitle}>{t('profile.explorationJourney')}</Text>
            <View style={styles.explorationHeaderRight}>
              <Text style={styles.explorationPercentage}>{stats.explorationPercentage}%</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${stats.explorationPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.explorationText}>
            {t('profile.explored', { count: stats.countries })}
          </Text>
        </TouchableOpacity>

        {/* Continent Grid */}
        <View style={styles.continentGrid}>
          {continentData.map((continent, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.continentCard}
              activeOpacity={0.7}
            >
              <Text style={styles.continentCardEmoji}>{continent.emoji}</Text>
              <Text style={styles.continentCardName}>{continent.name}</Text>
              <View style={styles.continentCardProgressBar}>
                <View 
                  style={[
                    styles.continentCardProgressFill, 
                    { 
                      width: `${continent.percentage}%`,
                      backgroundColor: continent.visited ? colors.primary.main : colors.neutral.gray300
                    }
                  ]} 
                />
              </View>
              <Text style={styles.continentCardStats}>
                {continent.visitedCountries}/{continent.totalCountries || 0}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tab Navigator */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'map' && styles.activeTab]}
          onPress={() => setActiveTab('map')}
        >
          <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>
            {t('profile.map')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
            {t('profile.list')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'list' && (
        <View style={styles.listContent}>
          {/* Filter */}
          <View style={styles.filterBar}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
                {t('common.all')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'visited' && styles.activeFilter]}
              onPress={() => setFilter('visited')}
            >
              <Text style={[styles.filterText, filter === 'visited' && styles.activeFilterText]}>
                {t('pin.visited')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'wantToGo' && styles.activeFilter]}
              onPress={() => setFilter('wantToGo')}
            >
              <Text style={[styles.filterText, filter === 'wantToGo' && styles.activeFilterText]}>
                {t('pin.wantToGo')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pin List */}
          {filteredPins.map(pin => (
            <PinCard
              key={pin.id}
              pin={pin}
              onPress={() => navigation.navigate('PinDetails', { pinId: pin.id })}
            />
          ))}

          {filteredPins.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{t('profile.noPinsYet')}</Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'map' && (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>{t('profile.mapViewPlaceholder')}</Text>
        </View>
      )}

      {/* Logout Button */}
      {/* <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>{t('auth.logout')}</Text>
      </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    marginBottom: spacing.md,
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  settingsButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsIcon: {
    fontSize: 20,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: -40,
  },
  avatar: {
    borderWidth: 4,
    borderColor: colors.background.card,
  },
  displayName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  username: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  bio: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  badgeSection: {
    padding: spacing.lg,
    backgroundColor: colors.background.main,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  explorationSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.main,
  },
  explorationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  explorationTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  explorationHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  explorationPercentage: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
  },
  chevron: {
    fontSize: typography.fontSize['2xl'],
    color: colors.text.disabled,
    fontWeight: typography.fontWeight.bold,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.lg,
  },
  explorationText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  continentSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.main,
  },
  continentHeader: {
    marginBottom: spacing.lg,
  },
  continentHeaderTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  continentHeaderSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  worldOverview: {
    marginBottom: spacing.lg,
  },
  continentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  continentCard: {
    width: '31%',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.main,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  continentCardEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  continentCardName: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  continentCardProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  continentCardProgressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  continentCardStats: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  worldCard: {
    borderColor: colors.primary.main,
    borderWidth: 2,
    backgroundColor: colors.primary.light || '#F0F9FF',
  },
  continentItem: {
    marginBottom: spacing.md,
  },
  continentItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  continentNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  continentEmoji: {
    fontSize: typography.fontSize.lg,
  },
  continentName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  continentStats: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  continentProgressBar: {
    height: 6,
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  continentProgressFill: {
    height: '100%',
    borderRadius: borderRadius.md,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.main,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary.main,
  },
  tabText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semiBold,
  },
  listContent: {
    padding: spacing.md,
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: colors.primary.main,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  activeFilterText: {
    color: colors.text.inverse,
    fontWeight: typography.fontWeight.semiBold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  mapPlaceholder: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
  },
  mapPlaceholderText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  logoutButton: {
    margin: spacing.xl,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.error,
  },
});
