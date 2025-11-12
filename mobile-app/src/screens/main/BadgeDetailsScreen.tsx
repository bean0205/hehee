import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useBadge, BADGE_RANKS, ACHIEVEMENT_BADGES, POINTS_CONFIG } from '../../contexts/BadgeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const BadgeDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const {
    userStats,
    currentRank,
    nextRank,
    progressToNextRank,
    getEarnedBadges,
    getAvailableBadges,
  } = useBadge();

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const earnedBadges = getEarnedBadges();
  const availableBadges = getAvailableBadges();
  const unearnedBadges = availableBadges.filter(
    badge => !userStats.earnedBadges.includes(badge.id)
  );

  const renderRankProgress = () => {
    return (
      <View style={styles.rankCard}>
        <View style={styles.currentRankSection}>
          <Text style={styles.currentRankIcon}>{currentRank.icon}</Text>
          <View style={styles.rankInfo}>
            <Text style={styles.rankName}>{currentRank.nameVi}</Text>
            <Text style={styles.rankEnglish}>{currentRank.name}</Text>
            <Text style={styles.points}>
              {userStats.totalPoints.toLocaleString()} điểm
            </Text>
          </View>
        </View>

        {nextRank && (
          <>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressToNextRank}%`,
                      backgroundColor: currentRank.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressPercent}>{progressToNextRank}%</Text>
            </View>

            <View style={styles.nextRankSection}>
              <Text style={styles.nextRankLabel}>{t('badge.nextLevel')}</Text>
              <View style={styles.nextRankInfo}>
                <Text style={styles.nextRankIcon}>{nextRank.icon}</Text>
                <View>
                  <Text style={styles.nextRankName}>{nextRank.nameVi}</Text>
                  <Text style={styles.nextRankPoints}>
                    Cần {(nextRank.minPoints - userStats.totalPoints).toLocaleString()} điểm nữa
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {!nextRank && (
          <View style={styles.maxRankBanner}>
            <Text style={styles.maxRankText}>{t('badge.maxRankReached')}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderAllRanks = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('badge.allRanks')}</Text>
        {BADGE_RANKS.map((rank, index) => {
          const isCurrentRank = rank.id === currentRank.id;
          const isUnlocked = userStats.totalPoints >= rank.minPoints;

          return (
            <View
              key={rank.id}
              style={[
                styles.rankItem,
                isCurrentRank && styles.currentRankItem,
                !isUnlocked && styles.lockedRankItem,
              ]}
            >
              <View style={styles.rankItemHeader}>
                <Text style={[styles.rankItemIcon, !isUnlocked && styles.lockedIcon]}>
                  {rank.icon}
                </Text>
                <View style={styles.rankItemInfo}>
                  <Text style={[styles.rankItemName, !isUnlocked && styles.lockedText]}>
                    {rank.nameVi}
                  </Text>
                  <Text style={[styles.rankItemPoints, !isUnlocked && styles.lockedText]}>
                    {rank.minPoints.toLocaleString()} - {rank.maxPoints === Infinity ? '∞' : rank.maxPoints.toLocaleString()} điểm
                  </Text>
                </View>
                {isCurrentRank && (
                  <View style={[styles.currentBadge, { backgroundColor: rank.color }]}>
                    <Text style={styles.currentBadgeText}>{t('badge.current')}</Text>
                  </View>
                )}
                {!isUnlocked && (
                  <Text style={styles.lockIcon}>🔒</Text>
                )}
              </View>
              
              <View style={styles.benefitsList}>
                {rank.benefits.map((benefit, i) => (
                  <Text key={i} style={[styles.benefitItem, !isUnlocked && styles.lockedText]}>
                    • {benefit}
                  </Text>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderAchievements = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('badge.achievements')} ({earnedBadges.length}/{availableBadges.length})
        </Text>
        
        <View style={styles.achievementGrid}>
          {availableBadges.map((badge) => {
            const isEarned = userStats.earnedBadges.includes(badge.id);
            
            return (
              <TouchableOpacity
                key={badge.id}
                style={[
                  styles.achievementCard,
                  !isEarned && styles.lockedAchievement,
                ]}
                activeOpacity={0.7}
              >
                <Text style={[styles.achievementIcon, !isEarned && styles.lockedIcon]}>
                  {badge.icon}
                </Text>
                <Text style={[styles.achievementName, !isEarned && styles.lockedText]}>
                  {badge.name}
                </Text>
                <Text style={[styles.achievementDesc, !isEarned && styles.lockedText]}>
                  {badge.description}
                </Text>
                <Text style={[styles.achievementPoints, !isEarned && styles.lockedText]}>
                  +{badge.points} điểm
                </Text>
                {!isEarned && (
                  <View style={styles.achievementLock}>
                    <Text style={styles.lockIconSmall}>🔒</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderPointsGuide = () => {
    const pointsCategories = [
      {
        title: t('badge.createPin'),
        items: [
          { label: t('badge.visitedPin'), points: POINTS_CONFIG.CREATE_PIN_VISITED },
          { label: t('badge.wantToGoPin'), points: POINTS_CONFIG.CREATE_PIN_WANT_TO_GO },
          { label: t('badge.addPhoto'), points: POINTS_CONFIG.ADD_PHOTO },
          { label: t('badge.addVideo'), points: POINTS_CONFIG.ADD_VIDEO },
          { label: t('badge.writeDetailedNote'), points: POINTS_CONFIG.WRITE_DETAILED_NOTE },
          { label: t('badge.ratePlace'), points: POINTS_CONFIG.RATE_PLACE },
        ],
      },
      {
        title: t('badge.socialActivity'),
        items: [
          { label: t('badge.followUser'), points: POINTS_CONFIG.FOLLOW_USER },
          { label: t('badge.getFollower'), points: POINTS_CONFIG.GET_FOLLOWER },
          { label: t('badge.likePost'), points: POINTS_CONFIG.LIKE_POST },
          { label: t('badge.getLike'), points: POINTS_CONFIG.GET_LIKE },
          { label: t('badge.comment'), points: POINTS_CONFIG.COMMENT },
          { label: t('badge.getComment'), points: POINTS_CONFIG.GET_COMMENT },
          { label: t('badge.sharePost'), points: POINTS_CONFIG.SHARE_POST },
        ],
      },
      {
        title: t('badge.dailyActivity'),
        items: [
          { label: t('badge.dailyLogin'), points: POINTS_CONFIG.DAILY_LOGIN },
          { label: t('badge.weekStreak'), points: POINTS_CONFIG.WEEK_STREAK },
          { label: t('badge.monthStreak'), points: POINTS_CONFIG.MONTH_STREAK },
          { label: t('badge.completeProfile'), points: POINTS_CONFIG.COMPLETE_PROFILE },
        ],
      },
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('badge.howToEarnPoints')}</Text>
        {pointsCategories.map((category, index) => (
          <View key={index} style={styles.pointsCategory}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.items.map((item, i) => (
              <View key={i} style={styles.pointsItem}>
                <Text style={styles.pointsLabel}>{item.label}</Text>
                <Text style={styles.pointsValue}>+{item.points}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('badge.ranksAndAchievements')}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderRankProgress()}
        {renderAllRanks()}
        {renderAchievements()}
        {renderPointsGuide()}
      </ScrollView>
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
    backButton: {
      fontSize: 30,
      color: colors.text.primary,
    },
    headerTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
    },
    // Rank Card
    rankCard: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    currentRankSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    currentRankIcon: {
      fontSize: 64,
    },
    rankInfo: {
      flex: 1,
    },
    rankName: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    rankEnglish: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginTop: 2,
    },
    points: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.primary.main,
      marginTop: spacing.xs,
    },
    progressContainer: {
      marginBottom: spacing.md,
    },
    progressBar: {
      height: 12,
      backgroundColor: colors.background.elevated,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
      marginBottom: spacing.xs,
    },
    progressFill: {
      height: '100%',
      borderRadius: borderRadius.full,
    },
    progressPercent: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      textAlign: 'right',
    },
    nextRankSection: {
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
      paddingTop: spacing.md,
    },
    nextRankLabel: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    nextRankInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    nextRankIcon: {
      fontSize: 32,
    },
    nextRankName: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.primary,
    },
    nextRankPoints: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    maxRankBanner: {
      backgroundColor: colors.primary.main + '20',
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
    },
    maxRankText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.primary.main,
    },
    // Section
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    // Rank Items
    rankItem: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    currentRankItem: {
      borderWidth: 2,
      borderColor: colors.primary.main,
    },
    lockedRankItem: {
      opacity: 0.6,
    },
    rankItemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    rankItemIcon: {
      fontSize: 32,
      marginRight: spacing.sm,
    },
    rankItemInfo: {
      flex: 1,
    },
    rankItemName: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.primary,
    },
    rankItemPoints: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    currentBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
    },
    currentBadgeText: {
      fontSize: typography.fontSize.xs,
      color: '#fff',
      fontWeight: typography.fontWeight.semiBold,
    },
    lockIcon: {
      fontSize: 20,
      marginLeft: spacing.sm,
    },
    lockedIcon: {
      opacity: 0.3,
      filter: 'grayscale(100%)',
    },
    lockedText: {
      opacity: 0.5,
    },
    benefitsList: {
      marginTop: spacing.xs,
    },
    benefitItem: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginBottom: 2,
    },
    // Achievements
    achievementGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    achievementCard: {
      width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2,
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      alignItems: 'center',
      position: 'relative',
    },
    lockedAchievement: {
      opacity: 0.6,
    },
    achievementIcon: {
      fontSize: 48,
      marginBottom: spacing.xs,
    },
    achievementName: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: 4,
    },
    achievementDesc: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    achievementPoints: {
      fontSize: typography.fontSize.xs,
      color: colors.primary.main,
      fontWeight: typography.fontWeight.semiBold,
    },
    achievementLock: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
    },
    lockIconSmall: {
      fontSize: 16,
    },
    // Points Guide
    pointsCategory: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    categoryTitle: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    pointsItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.xs,
    },
    pointsLabel: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    pointsValue: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.status.success,
    },
  });
