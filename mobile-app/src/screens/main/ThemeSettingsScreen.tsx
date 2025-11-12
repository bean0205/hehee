import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const ThemeSettingsScreen = ({ navigation }: any) => {
  const { themeMode, setThemeMode, colors } = useTheme();
  
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giao diện</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Chế độ hiển thị</Text>
          <Text style={styles.sectionDescription}>
            Chọn giao diện phù hợp với sở thích của bạn
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <ThemeOption
            icon="☀️"
            title="Sáng"
            description="Giao diện sáng cho môi trường đầy đủ ánh sáng"
            value="light"
            selected={themeMode === 'light'}
          />
          <ThemeOption
            icon="🌙"
            title="Tối"
            description="Giao diện tối dễ chịu cho mắt trong điều kiện ánh sáng yếu"
            value="dark"
            selected={themeMode === 'dark'}
          />
          <ThemeOption
            icon="🌓"
            title="Tự động"
            description="Tự động chuyển đổi theo cài đặt hệ thống của thiết bị"
            value="auto"
            selected={themeMode === 'auto'}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Chế độ tự động sẽ tự động thay đổi giao diện dựa trên cài đặt hệ thống
            của thiết bị. Điều này giúp tiết kiệm pin và bảo vệ mắt bạn.
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
