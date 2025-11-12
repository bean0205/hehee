import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components/common/Button';

export const AuthHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>📍</Text>
        <Text style={styles.title}>PinYourWord</Text>
        <Text style={styles.subtitle}>Ghi lại mọi hành trình của bạn</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="🔍 Đăng nhập với Google"
          onPress={() => {}}
          variant="primary"
          fullWidth
          style={styles.button}
        />
        
        <Button
          title="🍎 Đăng nhập với Apple"
          onPress={() => {}}
          variant="secondary"
          fullWidth
          style={styles.button}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>hoặc</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.emailButtonText}>Đăng nhập bằng Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>
            Chưa có tài khoản? <Text style={styles.registerTextBold}>Đăng ký ngay</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral.gray300,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  emailButton: {
    borderWidth: 1,
    borderColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emailButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary.main,
  },
  registerLink: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  registerText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  registerTextBold: {
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary.main,
  },
});
