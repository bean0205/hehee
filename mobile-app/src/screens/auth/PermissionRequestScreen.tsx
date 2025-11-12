import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { useLanguage } from '../../i18n/LanguageContext';

interface PermissionRequestScreenProps {
  onComplete: () => void;
}

export const PermissionRequestScreen: React.FC<PermissionRequestScreenProps> = ({
  onComplete,
}) => {
  const { t } = useLanguage();

  const requestLocationPermission = async () => {
    // In production, use expo-location
    Alert.alert(
      t('permissions.locationPermissionTitle'),
      t('permissions.locationPermissionMessage'),
      [
        {
          text: t('permissions.deny'),
          style: 'cancel',
        },
        {
          text: t('permissions.allow'),
          onPress: requestPhotoPermission,
        },
      ]
    );
  };

  const requestPhotoPermission = async () => {
    // In production, use expo-image-picker
    Alert.alert(
      t('permissions.photosPermissionTitle'),
      t('permissions.photosPermissionMessage'),
      [
        {
          text: t('permissions.deny'),
          style: 'cancel',
          onPress: onComplete,
        },
        {
          text: t('permissions.allow'),
          onPress: onComplete,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🔐</Text>
        <Text style={styles.title}>{t('permissions.title')}</Text>
        <Text style={styles.description}>
          {t('permissions.description')}
        </Text>

        <View style={styles.permissionList}>
          <View style={styles.permissionItem}>
            <Text style={styles.permissionIcon}>📍</Text>
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>{t('permissions.locationTitle')}</Text>
              <Text style={styles.permissionDescription}>
                {t('permissions.locationDescription')}
              </Text>
            </View>
          </View>

          <View style={styles.permissionItem}>
            <Text style={styles.permissionIcon}>📷</Text>
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>{t('permissions.photosTitle')}</Text>
              <Text style={styles.permissionDescription}>
                {t('permissions.photosDescription')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={t('permissions.allowAccess')}
          onPress={requestLocationPermission}
          fullWidth
        />
        <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
          <Text style={styles.skipText}>{t('permissions.skip')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeight.lg,
  },
  permissionList: {
    width: '100%',
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.neutral.gray50,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  permissionIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  permissionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.sm,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  skipButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  skipText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
});
