import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { register, isLoading } = useAuth();
  const { t } = useLanguage();
  const { colors, isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', username: '', password: '', confirmPassword: '' });

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handleRegister = async () => {
    // Validate
    const newErrors = { email: '', username: '', password: '', confirmPassword: '' };
    if (!email) newErrors.email = t('validation.emailRequired');
    if (!username) newErrors.username = t('validation.usernameRequired');
    if (!password) newErrors.password = t('validation.passwordRequired');
    if (password !== confirmPassword) newErrors.confirmPassword = t('validation.passwordNotMatch');
    
    setErrors(newErrors);
    if (Object.values(newErrors).some(e => e)) return;

    try {
      await register(email, password, username);
    } catch (error) {
      Alert.alert(t('errors.error'), t('errors.registerFailed'));
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative Elements */}
      <View style={styles.decorContainer} pointerEvents="none">
        <Text style={[styles.decorEmoji, { top: 100, left: 30 }]}>✈️</Text>
        <Text style={[styles.decorEmoji, { top: 150, right: 50 }]}>🌍</Text>
        <Text style={[styles.decorEmoji, { bottom: 200, left: 50 }]}>📍</Text>
        <Text style={[styles.decorEmoji, { bottom: 250, right: 30 }]}>🗺️</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>{t('auth.back')}</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>🚀</Text>
            <Text style={styles.title}>{t('auth.register')}</Text>
            <Text style={styles.subtitle}>{t('auth.createAccount')}</Text>
          </View>

          {/* Form Card */}
          <BlurView intensity={isDarkMode ? 60 : 100} tint={isDarkMode ? 'dark' : 'light'} style={styles.formCard}>
            <View style={styles.form}>
              <Input
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label={t('auth.username')}
                placeholder={t('auth.usernamePlaceholder')}
                value={username}
                onChangeText={setUsername}
                error={errors.username}
                autoCapitalize="none"
              />

              <Input
                label={t('auth.password')}
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
              />

              <Input
                label={t('auth.confirmPassword')}
                placeholder={t('auth.passwordPlaceholder')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={errors.confirmPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#43e97b', '#38f9d7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.registerButtonGradient}
                >
                  <Text style={styles.registerButtonText}>
                    {isLoading ? t('auth.processing') : '✨ ' + t('auth.register')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              {t('auth.hasAccount')} <Text style={styles.loginTextBold}>{t('auth.login')}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  decorContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  decorEmoji: {
    position: 'absolute',
    fontSize: 50,
    opacity: 0.1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl + 40,
    paddingBottom: spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.lg,
  },
  backButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.neutral.white,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    marginBottom: spacing.sm,
    textAlign: 'center',
    textShadowColor: colors.neutral.black + '33', // 20% opacity
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.neutral.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  formCard: {
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    padding: spacing.xl,
    backgroundColor: colors.neutral.white + '26', // 15% opacity
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.sm,
  },
  registerButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginTop: spacing.md,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  registerButtonGradient: {
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    letterSpacing: 0.5,
  },
  loginLink: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  loginText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.white,
    opacity: 0.9,
  },
  loginTextBold: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    textDecorationLine: 'underline',
  },
});
