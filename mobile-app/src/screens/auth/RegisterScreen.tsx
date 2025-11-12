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

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { register, isLoading } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', username: '', password: '', confirmPassword: '' });

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.register')}</Text>
          <Text style={styles.subtitle}>{t('auth.createAccount')}</Text>
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

          <Button
            title={t('auth.register')}
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
          />
        </View>

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
  loginLink: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  loginText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  loginTextBold: {
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primary.main,
  },
});
