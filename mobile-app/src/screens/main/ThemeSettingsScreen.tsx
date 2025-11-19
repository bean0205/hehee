import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Header } from '../../components/common/Header';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const ThemeSettingsScreen = ({ navigation }: any) => {
  const { themeMode, setThemeMode, colors } = useTheme();
  const { t } = useLanguage();

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const ThemeOption = ({
    icon,
    title,
    description,
    value,
    selected,
  }: {
    icon: string;
    title: string;
    description: string;
    value: 'light' | 'dark' | 'auto';
    selected: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.option, selected && styles.optionSelected]}
      onPress={() => setThemeMode(value)}
    >
      <View style={styles.optionContent}>
        <Text style={styles.optionIcon}>{icon}</Text>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionDescription}>{description}</Text>
        </View>
      </View>
      {selected && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title={t('theme.appearance')}
        subtitle="Customize your experience"
        showBackButton
        onBackPress={() => navigation.goBack()}
        centerTitle
        elevation={2}
      />

      <View style={styles.content}>
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>{t('theme.displayMode')}</Text>
          <Text style={styles.sectionDescription}>
            {t('theme.chooseTheme')}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <ThemeOption
            icon="☀️"
            title={t('theme.light')}
            description={t('theme.lightDescription')}
            value="light"
            selected={themeMode === 'light'}
          />
          <ThemeOption
            icon="🌙"
            title={t('theme.dark')}
            description={t('theme.darkDescription')}
            value="dark"
            selected={themeMode === 'dark'}
          />
          <ThemeOption
            icon="🌓"
            title={t('theme.auto')}
            description={t('theme.autoDescription')}
            value="auto"
            selected={themeMode === 'auto'}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            {t('theme.tip')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  previewSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.base,
  },
  optionsContainer: {
    gap: spacing.md,
  },
  option: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.main + '10',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold as any,
    color: colors.text.primary,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.sm,
  },
  checkmark: {
    fontSize: 24,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.bold as any,
  },
  infoBox: {
    marginTop: spacing.xl,
    backgroundColor: colors.info + '15',
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.base,
  },
});
