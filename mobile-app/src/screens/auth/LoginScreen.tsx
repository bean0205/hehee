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

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const { colors, isDarkMode } = useTheme();
  const [email, setEmail] = useState('demo@pinyourword.com');
  const [password, setPassword] = useState('demo123');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handleLogin = async () => {
    console.log('Login button pressed');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Validate
    const newErrors = { email: '', password: '' };
    if (!email) newErrors.email = t('validation.emailRequired');
    if (!password) newErrors.password = t('validation.passwordRequired');
    
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) {
      console.log('Validation errors:', newErrors);
      return;
    }

    try {
      console.log('Attempting login...');
      await login(email, password);
      console.log('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(t('errors.error'), t('errors.loginFailed'));
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative Elements */}
      <View style={styles.decorContainer} pointerEvents="none">
        <Text style={[styles.decorEmoji, { top: 120, left: 40 }]}>🗺️</Text>
        <Text style={[styles.decorEmoji, { top: 180, right: 40 }]}>📸</Text>
        <Text style={[styles.decorEmoji, { bottom: 220, left: 60 }]}>🧭</Text>
        <Text style={[styles.decorEmoji, { bottom: 280, right: 50 }]}>✈️</Text>
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
            <Text style={styles.headerIcon}>👋</Text>
            <Text style={styles.title}>{t('auth.login')}</Text>
            <Text style={styles.subtitle}>{t('auth.welcomeBack')}</Text>
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
                label={t('auth.password')}
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                secureTextEntry
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#F59E0B', '#EF4444']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.loginButtonGradient}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? t('auth.loggingIn') : '🚀 ' + t('auth.login')}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Demo Account Info */}
              <View style={styles.demoInfo}>
                <Text style={styles.demoInfoText}>{t('auth.demoAccountFilled')}</Text>
              </View>
            </View>
          </BlurView>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('auth.or')}</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>{t('auth.google')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>{t('auth.apple')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Link */}
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              {t('auth.noAccount')} <Text style={styles.registerTextBold}>{t('auth.registerNow')}</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xs,
  },
  forgotPasswordText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semiBold,
    opacity: 0.9,
  },
  loginButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginTop: spacing.sm,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonGradient: {
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    letterSpacing: 0.5,
  },
  demoInfo: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.neutral.white + '33', // 20% opacity
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  demoInfoText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.white,
    opacity: 0.85,
  },
  socialContainer: {
    marginBottom: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral.white + '4D', // 30% opacity
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.neutral.white,
    opacity: 0.8,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    backgroundColor: colors.neutral.white + '33', // 20% opacity
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral.white + '4D', // 30% opacity
  },
  socialButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.neutral.white,
  },
  registerLink: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  registerText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.white,
    opacity: 0.9,
  },
  registerTextBold: {
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
    textDecorationLine: 'underline',
  },
});
