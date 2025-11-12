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

interface PermissionRequestScreenProps {
  onComplete: () => void;
}

export const PermissionRequestScreen: React.FC<PermissionRequestScreenProps> = ({
  onComplete,
}) => {
  const requestLocationPermission = async () => {
    // In production, use expo-location
    Alert.alert(
      'Quyền truy cập vị trí',
      'PinYourWord cần quyền truy cập vị trí để giúp bạn đánh dấu những nơi bạn đã đến.',
      [
        {
          text: 'Không cho phép',
          style: 'cancel',
        },
        {
          text: 'Cho phép',
          onPress: requestPhotoPermission,
        },
      ]
    );
  };

  const requestPhotoPermission = async () => {
    // In production, use expo-image-picker
    Alert.alert(
      'Quyền truy cập ảnh',
      'PinYourWord cần quyền truy cập ảnh để bạn có thể thêm hình ảnh vào các ghim của mình.',
      [
        {
          text: 'Không cho phép',
          style: 'cancel',
          onPress: onComplete,
        },
        {
          text: 'Cho phép',
          onPress: onComplete,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🔐</Text>
        <Text style={styles.title}>Cho phép truy cập</Text>
        <Text style={styles.description}>
          Để sử dụng PinYourWord tốt nhất, chúng tôi cần một vài quyền truy cập.
        </Text>

        <View style={styles.permissionList}>
          <View style={styles.permissionItem}>
            <Text style={styles.permissionIcon}>📍</Text>
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Vị trí</Text>
              <Text style={styles.permissionDescription}>
                Để đánh dấu vị trí bạn đã đến và gợi ý địa điểm gần bạn
              </Text>
            </View>
          </View>

          <View style={styles.permissionItem}>
            <Text style={styles.permissionIcon}>📷</Text>
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Ảnh</Text>
              <Text style={styles.permissionDescription}>
                Để thêm ảnh vào ghim và lưu giữ kỷ niệm của bạn
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Cho phép truy cập"
          onPress={requestLocationPermission}
          fullWidth
        />
        <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
          <Text style={styles.skipText}>Bỏ qua</Text>
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
