import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Header } from '../../components/common/Header';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type VisibilityOption = 'me' | 'followers' | 'everyone';

export const PrivacySettingsScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [notesVisibility, setNotesVisibility] = useState<VisibilityOption>('followers');
  const [bucketListVisibility, setBucketListVisibility] = useState<VisibilityOption>('everyone');
  const [showEmail, setShowEmail] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);
  const [shareActivity, setShareActivity] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);

  const visibilityOptions: { value: VisibilityOption; label: string; icon: string }[] = [
    { value: 'me', label: t('privacy.onlyMe'), icon: '🔒' },
    { value: 'followers', label: t('privacy.followers'), icon: '👥' },
    { value: 'everyone', label: t('privacy.everyone'), icon: '🌍' },
  ];

  const SettingToggle = ({
    title,
    subtitle,
    value,
    onValueChange,
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.neutral.gray300, true: colors.primary.light }}
        thumbColor={value ? colors.primary.main : colors.neutral.gray100}
      />
    </View>
  );

  const renderVisibilitySelector = (
    title: string,
    description: string,
    value: VisibilityOption,
    onChange: (value: VisibilityOption) => void
  ) => (
    <View style={styles.visibilitySection}>
      <Text style={styles.visibilityTitle}>{title}</Text>
      <Text style={styles.visibilityDescription}>{description}</Text>
      <View style={styles.optionsContainer}>
        {visibilityOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              value === option.value && styles.optionButtonActive,
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <Text
              style={[
                styles.optionLabel,
                value === option.value && styles.optionLabelActive,
              ]}
            >
              {option.label}
            </Text>
            {value === option.value && (
              <View style={styles.checkMark}>
                <Text style={styles.checkMarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title={t('privacy.privacy')}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        gradient={false}
        blur={false}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacy.profileDisplay')}</Text>
          <SettingToggle
            title={t('privacy.publicProfile')}
            subtitle={t('privacy.allowOthersToView')}
            value={!isPrivateProfile}
            onValueChange={(value) => setIsPrivateProfile(!value)}
          />
          <SettingToggle
            title={t('privacy.showEmail')}
            subtitle={t('privacy.displayEmailOnProfile')}
            value={showEmail}
            onValueChange={setShowEmail}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacy.interactions')}</Text>
          <SettingToggle
            title={t('privacy.allowMessages')}
            subtitle={t('privacy.receiveMessagesFromUsers')}
            value={allowMessages}
            onValueChange={setAllowMessages}
          />
          <SettingToggle
            title={t('privacy.shareActivity')}
            subtitle={t('privacy.allowOthersToSeeActivity')}
            value={shareActivity}
            onValueChange={setShareActivity}
          />
        </View>

        {renderVisibilitySelector(
          t('privacy.whoCanSeeNotes'),
          t('privacy.personalNotesAndJournals'),
          notesVisibility,
          setNotesVisibility
        )}

        {renderVisibilitySelector(
          t('privacy.whoCanSeeBucketList'),
          t('privacy.placesYouWantToVisit'),
          bucketListVisibility,
          setBucketListVisibility
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('privacy.data')}</Text>
          <SettingToggle
            title={t('privacy.dataCollection')}
            subtitle={t('privacy.allowDataCollection')}
            value={dataCollection}
            onValueChange={setDataCollection}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            {t('privacy.privacyCommitment')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.background.card,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold as any,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.text.primary,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  visibilitySection: {
    backgroundColor: colors.background.card,
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  visibilityTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold as any,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  visibilityDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  optionsContainer: {
    gap: spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.main,
    backgroundColor: colors.background.secondary,
  },
  optionButtonActive: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.main + '10',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  optionLabel: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.text.secondary,
  },
  optionLabelActive: {
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semiBold as any,
  },
  checkMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkText: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: typography.fontWeight.bold as any,
  },
  infoSection: {
    backgroundColor: colors.primary.light + '20',
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl * 2,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
