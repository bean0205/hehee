import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const SettingsScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const { isDarkMode, themeMode, setThemeMode, colors } = useTheme();
  const { t, language, setLanguage, availableLanguages } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Create styles with current theme colors
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      t('auth.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('settings.deleteAccount'),
      t('settings.deleteAccountConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            // Implement delete account logic
            Alert.alert(t('common.success'), t('settings.featureInDevelopment'));
          },
        },
      ]
    );
  };

  const SettingSection = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightElement,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingItemLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (showArrow && <Text style={styles.arrow}>›</Text>)}
    </TouchableOpacity>
  );

  const SettingToggle = ({
    icon,
    title,
    subtitle,
    value,
    onValueChange,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <SettingItem
      icon={icon}
      title={title}
      subtitle={subtitle}
      showArrow={false}
      rightElement={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.neutral.gray300, true: colors.primary.light }}
          thumbColor={value ? colors.primary.main : colors.neutral.gray100}
        />
      }
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.displayName || t('profile.profile')}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => Alert.alert(t('common.success'), t('settings.featureInDevelopment'))}
          >
            <Text style={styles.editButtonText}>{t('common.edit')}</Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <SettingSection title={t('settings.account')} />
        <View style={styles.section}>
          <SettingItem
            icon="👤"
            title={t('settings.personalInfo')}
            subtitle={t('settings.personalInfoDescription')}
            onPress={() => Alert.alert(t('common.success'), t('settings.featureInDevelopment'))}
          />
          <SettingItem
            icon="🔒"
            title={t('settings.changePassword')}
            subtitle={t('settings.changePasswordDescription')}
            onPress={() => Alert.alert(t('common.success'), t('settings.featureInDevelopment'))}
          />
          <SettingItem
            icon="🌐"
            title={t('settings.language')}
            subtitle={availableLanguages.find(l => l.code === language)?.name || 'Tiếng Việt'}
            onPress={() => {
              const languageButtons = availableLanguages.map(lang => ({
                text: `${lang.flag} ${lang.name}`,
                onPress: () => setLanguage(lang.code),
              }));
              
              Alert.alert(
                t('settings.selectLanguage'),
                '',
                [
                  ...languageButtons,
                  {
                    text: t('common.cancel'),
                    onPress: () => {},
                  },
                ]
              );
            }}
          />
        </View>

        {/* Preferences */}
        <SettingSection title={t('settings.preferences')} />
        <View style={styles.section}>
          <SettingToggle
            icon="🔔"
            title={t('settings.notifications')}
            subtitle={t('settings.notificationsDescription')}
            value={notifications}
            onValueChange={setNotifications}
          />
          <SettingToggle
            icon="📍"
            title={t('settings.locationServices')}
            subtitle={t('settings.locationServicesDescription')}
            value={locationServices}
            onValueChange={setLocationServices}
          />
          <SettingItem
            icon="🌙"
            title={t('settings.appearance')}
            subtitle={
              themeMode === 'auto'
                ? t('settings.appearanceDescription.auto')
                : themeMode === 'dark'
                ? t('settings.appearanceDescription.dark')
                : t('settings.appearanceDescription.light')
            }
            onPress={() => {
              Alert.alert(
                t('settings.selectAppearance'),
                '',
                [
                  {
                    text: t('settings.appearanceOptions.light'),
                    onPress: () => setThemeMode('light'),
                  },
                  {
                    text: t('settings.appearanceOptions.dark'),
                    onPress: () => setThemeMode('dark'),
                  },
                  {
                    text: t('settings.appearanceOptions.auto'),
                    onPress: () => setThemeMode('auto'),
                  },
                  {
                    text: t('common.cancel'),
                    onPress: () => {},
                  },
                ]
              );
            }}
          />
          <SettingToggle
            icon="💾"
            title={t('settings.autoSave')}
            subtitle={t('settings.autoSaveDescription')}
            value={autoSave}
            onValueChange={setAutoSave}
          />
        </View>

        {/* Privacy & Security */}
        <SettingSection title={t('settings.privacySecurity')} />
        <View style={styles.section}>
          <SettingItem
            icon="🔐"
            title={t('settings.privacy')}
            subtitle={t('settings.privacyDescription')}
            onPress={() => (navigation as any).navigate('PrivacySettings')}
          />
          <SettingItem
            icon="🛡️"
            title={t('settings.security')}
            subtitle={t('settings.securityDescription')}
            onPress={() => Alert.alert(t('common.success'), t('settings.featureInDevelopment'))}
          />
          <SettingItem
            icon="📜"
            title={t('settings.termsOfService')}
            onPress={() => Alert.alert(t('common.success'), t('settings.featureInDevelopment'))}
          />
          <SettingItem
            icon="📄"
            title={t('settings.privacyPolicy')}
            onPress={() => Alert.alert(t('common.success'), t('settings.featureInDevelopment'))}
          />
        </View>

        {/* Data & Storage */}
        <SettingSection title={t('settings.dataStorage')} />
        <View style={styles.section}>
          <SettingItem
            icon="📊"
            title={t('settings.storageUsage')}
            subtitle={t('settings.storageUsageValue')}
            onPress={() => Alert.alert(t('common.success'), t('settings.featureInDevelopment'))}
          />
          <SettingItem
            icon="🗑️"
            title={t('settings.clearCache')}
            subtitle={t('settings.clearCacheDescription')}
            onPress={() =>
              Alert.alert(t('settings.clearCache'), t('settings.clearCacheConfirm'), [
                { text: t('common.cancel'), onPress: () => {} },
                {
                  text: t('common.delete'),
                  onPress: () => Alert.alert(t('common.success'), t('settings.clearCacheSuccess')),
                },
              ])
            }
          />
          <SettingItem
            icon="☁️"
            title={t('settings.backupSync')}
            subtitle={t('settings.backupSyncDescription')}
            onPress={() => Alert.alert(t('common.success'), t('settings.featureInDevelopment'))}
          />
        </View>

        {/* Support */}
        <SettingSection title={t('settings.support')} />
        <View style={styles.section}>
          <SettingItem
            icon="❓"
            title={t('settings.help')}
            onPress={() => Alert.alert(t('common.success'), t('settings.featureInDevelopment'))}
          />
          <SettingItem
            icon="💬"
            title={t('settings.feedback')}
            subtitle={t('settings.feedbackDescription')}
            onPress={() => Alert.alert(t('common.success'), t('settings.featureInDevelopment'))}
          />
          <SettingItem
            icon="⭐"
            title={t('settings.rateApp')}
            onPress={() => Alert.alert(t('common.success'), t('settings.featureInDevelopment'))}
          />
          <SettingItem
            icon="ℹ️"
            title={t('settings.about')}
            subtitle={t('settings.aboutDescription')}
            onPress={() =>
              Alert.alert(
                'PinYourWord',
                `${t('settings.aboutDescription')}\n\n${t('common.appName')}\n\n© 2025 PinYourWord`
              )
            }
          />
        </View>

        {/* Danger Zone */}
        <SettingSection title={t('settings.dangerZone')} />
        <View style={styles.section}>
          <SettingItem
            icon="🚪"
            title={t('auth.logout')}
            onPress={handleLogout}
            showArrow={false}
          />
          <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
            <Text style={styles.settingIcon}>🗑️</Text>
            <Text style={styles.dangerText}>{t('settings.deleteAccount')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('settings.footer')}</Text>
          <Text style={styles.footerSubtext}>{t('settings.madeWithLove')}</Text>
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text.inverse,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold as any,
    color: colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  editButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  editButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold as any,
    color: colors.primary.main,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold as any,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: colors.background.card,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  arrow: {
    fontSize: 24,
    color: colors.text.disabled,
    marginLeft: spacing.sm,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dangerText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium as any,
    color: colors.error,
    marginLeft: spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.text.disabled,
  },
});
