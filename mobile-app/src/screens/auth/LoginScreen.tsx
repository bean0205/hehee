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
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    // Validate
    const newErrors = { email: '', password: '' };
    if (!email) newErrors.email = t('validation.emailRequired');
    if (!password) newErrors.password = t('validation.passwordRequired');
    
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert(t('errors.error'), t('errors.loginFailed'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.login')}</Text>
          <Text style={styles.subtitle}>{t('auth.welcomeBack')}</Text>
        </View>

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

          <Button
            title={t('auth.login')}
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
          />
        </View>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
  },
  header: {
    marginBottom: spacing.xl,
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
  form: {
    marginBottom: spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: typography.fontSize.sm,
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
