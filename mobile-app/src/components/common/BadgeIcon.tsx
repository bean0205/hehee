import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useBadge } from '../../contexts/BadgeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface BadgeIconProps {
  size?: 'small' | 'medium';
  showName?: boolean;
  onPress?: () => void;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({
  size = 'small',
  showName = false,
  onPress,
}) => {
  const { colors } = useTheme();
  const { currentRank } = useBadge();

  const styles = React.useMemo(() => createStyles(colors, currentRank.color), [colors, currentRank]);

  const getSizeStyles = () => {
    switch (size) {
      case 'medium':
        return {
          containerPadding: spacing.xs,
          iconSize: 16,
          fontSize: typography.fontSize.xs,
          minWidth: 60,
        };
      default: // small
        return {
          containerPadding: 4,
          iconSize: 12,
          fontSize: 10,
          minWidth: 50,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const BadgeContent = (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: sizeStyles.containerPadding,
          paddingVertical: sizeStyles.containerPadding - 1,
          minWidth: showName ? sizeStyles.minWidth : 'auto',
        },
      ]}
    >
      <Text style={{ fontSize: sizeStyles.iconSize }}>{currentRank.icon}</Text>
      {showName && (
        <Text style={[styles.rankName, { fontSize: sizeStyles.fontSize }]}>
          {currentRank.nameVi}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {BadgeContent}
      </TouchableOpacity>
    );
  }

  return BadgeContent;
};

const createStyles = (colors: any, rankColor: string) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      backgroundColor: rankColor + '15',
      borderRadius: borderRadius.full,
      borderWidth: 1,
      borderColor: rankColor + '40',
    },
    rankName: {
      fontWeight: typography.fontWeight.semiBold,
      color: rankColor,
    },
  });
