import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const { width, height } = Dimensions.get('window');

export const AuthHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, isDarkMode } = useTheme();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {/* Animated Gradient Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Floating Decorative Elements */}
      <View style={styles.decorContainer} pointerEvents="none">
        <Animated.Text style={[styles.decorEmoji, styles.decor1, { opacity: fadeAnim }]}>
          🌍
        </Animated.Text>
        <Animated.Text style={[styles.decorEmoji, styles.decor2, { opacity: fadeAnim }]}>
          ✈️
        </Animated.Text>
        <Animated.Text style={[styles.decorEmoji, styles.decor3, { opacity: fadeAnim }]}>
          📍
        </Animated.Text>
        <Animated.Text style={[styles.decorEmoji, styles.decor4, { opacity: fadeAnim }]}>
          🗺️
        </Animated.Text>
        <Animated.Text style={[styles.decorEmoji, styles.decor5, { opacity: fadeAnim }]}>
          📸
        </Animated.Text>
        <Animated.Text style={[styles.decorEmoji, styles.decor6, { opacity: fadeAnim }]}>
          🎒
        </Animated.Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Logo and Title Section */}
        <Animated.View 
          style={[
            styles.content, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.logoCircle}
            >
              <Text style={styles.logo}>📍</Text>
            </LinearGradient>
          </View>
          <Text style={styles.title}>PinYourWord</Text>
          <Text style={styles.subtitle}>Khám phá thế giới, lưu giữ kỷ niệm</Text>
          <Text style={styles.tagline}>Ghi lại từng khoảnh khắc đáng nhớ ✨</Text>
        </Animated.View>

        {/* Buttons Section */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Social Login Buttons */}
          <TouchableOpacity 
            style={styles.socialButton}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <BlurView intensity={isDarkMode ? 60 : 100} tint={isDarkMode ? 'dark' : 'light'} style={styles.buttonBlur}>
              <View style={styles.socialButtonContent}>
                <Text style={styles.socialIcon}>🔍</Text>
                <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
              </View>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialButton}
            activeOpacity={0.8}
            onPress={() => {}}
          >
            <BlurView intensity={isDarkMode ? 60 : 100} tint={isDarkMode ? 'dark' : 'light'} style={styles.buttonBlur}>
              <View style={styles.socialButtonContent}>
                <Text style={styles.socialIcon}>🍎</Text>
                <Text style={styles.socialButtonText}>Tiếp tục với Apple</Text>
              </View>
            </BlurView>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Login Button */}
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F59E0B', '#EF4444', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.emailButtonGradient}
            >
              <Text style={styles.emailButtonIcon}>📧</Text>
              <Text style={styles.emailButtonText}>Đăng nhập với Email</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              Chưa có tài khoản? <Text style={styles.registerTextBold}>Đăng ký ngay 🚀</Text>
            </Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.terms}>
            Bằng việc tiếp tục, bạn đồng ý với{'\n'}
            <Text style={styles.termsLink}>Điều khoản</Text> và <Text style={styles.termsLink}>Chính sách</Text> của chúng tôi
          </Text>
        </Animated.View>
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
    fontSize: 60,
    opacity: 0.12,
  },
  decor1: {
    top: height * 0.08,
    left: width * 0.1,
  },
  decor2: {
    top: height * 0.15,
    right: width * 0.15,
  },
  decor3: {
    top: height * 0.35,
    left: width * 0.08,
  },
  decor4: {
    bottom: height * 0.35,
    right: width * 0.1,
  },
  decor5: {
    bottom: height * 0.25,
    left: width * 0.15,
  },
  decor6: {
    top: height * 0.25,
    right: width * 0.08,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logo: {
    fontSize: 70,
  },
  title: {
    fontSize: 42,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: typography.fontSize.xl,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.xs,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: typography.fontSize.base,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.85,
    fontStyle: 'italic',
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl + 20,
    zIndex: 2,
  },
  socialButton: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonBlur: {
    overflow: 'hidden',
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    gap: spacing.sm,
  },
  socialIcon: {
    fontSize: 24,
  },
  socialButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: typography.fontSize.sm,
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.medium,
    opacity: 0.8,
  },
  emailButton: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  emailButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 4,
    gap: spacing.sm,
  },
  emailButtonIcon: {
    fontSize: 24,
  },
  emailButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  registerLink: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  registerText: {
    fontSize: typography.fontSize.base,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  registerTextBold: {
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  terms: {
    fontSize: typography.fontSize.xs,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 18,
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: typography.fontWeight.semiBold,
  },
});
