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
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type VisibilityOption = 'me' | 'followers' | 'everyone';

export const PrivacySettingsScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [notesVisibility, setNotesVisibility] = useState<VisibilityOption>('followers');
  const [bucketListVisibility, setBucketListVisibility] = useState<VisibilityOption>('everyone');
  const [showEmail, setShowEmail] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);
  const [shareActivity, setShareActivity] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);

  const visibilityOptions: { value: VisibilityOption; label: string; icon: string }[] = [
    { value: 'me', label: 'Chỉ mình tôi', icon: '🔒' },
    { value: 'followers', label: 'Người theo dõi', icon: '👥' },
    { value: 'everyone', label: 'Mọi người', icon: '🌍' },
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quyền riêng tư</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hiển thị Hồ sơ</Text>
          <SettingToggle
            title="Hồ sơ công khai"
            subtitle="Cho phép người khác xem hồ sơ của bạn"
            value={!isPrivateProfile}
            onValueChange={(value) => setIsPrivateProfile(!value)}
          />
          <SettingToggle
            title="Hiển thị email"
            subtitle="Hiển thị địa chỉ email trên hồ sơ"
            value={showEmail}
            onValueChange={setShowEmail}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tương tác</Text>
          <SettingToggle
            title="Cho phép tin nhắn"
            subtitle="Nhận tin nhắn từ người dùng khác"
            value={allowMessages}
            onValueChange={setAllowMessages}
          />
          <SettingToggle
            title="Chia sẻ hoạt động"
            subtitle="Cho phép người khác xem hoạt động của bạn"
            value={shareActivity}
            onValueChange={setShareActivity}
          />
        </View>

        {renderVisibilitySelector(
          '📝 Ai có thể xem Ghi chú của tôi?',
          'Ghi chú cá nhân và nhật ký du lịch của bạn',
          notesVisibility,
          setNotesVisibility
        )}

        {renderVisibilitySelector(
          '⭐ Ai có thể xem Bucket List của tôi?',
          'Danh sách những nơi bạn muốn đến',
          bucketListVisibility,
          setBucketListVisibility
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dữ liệu</Text>
          <SettingToggle
            title="Thu thập dữ liệu"
            subtitle="Cho phép thu thập dữ liệu để cải thiện trải nghiệm"
            value={dataCollection}
            onValueChange={setDataCollection}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Dữ liệu của bạn được mã hóa
            và bảo mật theo các tiêu chuẩn cao nhất.
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
  header: {
    backgroundColor: colors.background.card,
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.main,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  backText: {
    fontSize: typography.fontSize.lg,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium as any,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text.primary,
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
