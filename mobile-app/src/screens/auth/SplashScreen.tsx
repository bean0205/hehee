import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>📍</Text>
      <Text style={styles.title}>PinYourWord</Text>
      <Text style={styles.subtitle}>Ghi lại mọi hành trình của bạn</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.white,
    opacity: 0.9,
  },
});
