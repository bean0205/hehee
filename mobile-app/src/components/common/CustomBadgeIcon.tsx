import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface CustomBadgeIconProps {
  icon: string;
  color: string;
  size?: 'small' | 'medium';
}

export const CustomBadgeIcon: React.FC<CustomBadgeIconProps> = ({
  icon,
  color,
  size = 'small',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'medium':
        return {
          containerPadding: spacing.xs,
          iconSize: 16,
        };
      default: // small
        return {
          containerPadding: 4,
          iconSize: 12,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: sizeStyles.containerPadding,
          paddingVertical: sizeStyles.containerPadding - 1,
          backgroundColor: color + '15',
          borderColor: color + '40',
        },
      ]}
    >
      <Text style={{ fontSize: sizeStyles.iconSize }}>{icon}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
});
