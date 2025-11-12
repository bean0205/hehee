import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useBadge, BADGE_RANKS } from '../../contexts/BadgeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface BadgeRankProps {
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  onPress?: () => void;
}

export const BadgeRank: React.FC<BadgeRankProps> = ({
  size = 'medium',
  showProgress = false,
  onPress,
}) => {
  const { colors } = useTheme();
  const { currentRank, nextRank, progressToNextRank, userStats } = useBadge();

  const styles = React.useMemo(() => createStyles(colors, currentRank.color), [colors, currentRank]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: 20,
          fontSize: typography.fontSize.xs,
          padding: spacing.xs,
        };
      case 'large':
        return {
          iconSize: 40,
          fontSize: typography.fontSize.lg,
          padding: spacing.md,
        };
      default:
        return {
          iconSize: 28,
          fontSize: typography.fontSize.sm,
          padding: spacing.sm,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const BadgeContent = (
    <View style={[styles.container, { padding: sizeStyles.padding }]}>
      <View style={styles.badgeWrapper}>
        <Text style={{ fontSize: sizeStyles.iconSize }}>{currentRank.icon}</Text>
        <View style={styles.rankInfo}>
          <Text style={[styles.rankName, { fontSize: sizeStyles.fontSize }]}>
            {currentRank.nameVi}
          </Text>
          <Text style={styles.points}>{userStats.totalPoints} điểm</Text>
        </View>
      </View>

      {showProgress && nextRank && (
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressToNextRank}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {nextRank.minPoints - userStats.totalPoints} điểm nữa để đạt{' '}
            <Text style={styles.nextRankName}>{nextRank.nameVi}</Text>
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {BadgeContent}
      </TouchableOpacity>
    );
  }

  return BadgeContent;
};

const createStyles = (colors: any, rankColor: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      borderLeftWidth: 4,
      borderLeftColor: rankColor,
    },
    badgeWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    rankInfo: {
      flex: 1,
    },
    rankName: {
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    points: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      marginTop: 2,
    },
    progressSection: {
      marginTop: spacing.sm,
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.background.elevated,
      borderRadius: borderRadius.full,
      overflow: 'hidden',
      marginBottom: spacing.xs,
    },
    progressFill: {
      height: '100%',
      backgroundColor: rankColor,
      borderRadius: borderRadius.full,
    },
    progressText: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
    },
    nextRankName: {
      fontWeight: typography.fontWeight.semiBold,
      color: rankColor,
    },
  });
