import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import { typography } from "../../theme/typography";
import { spacing, borderRadius } from "../../theme/spacing";
import { Input } from "../../components/common/Input";
import { Alert } from "../../components/common/Alert";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { useAlert } from "../../hooks/useAlert";
import { useFormValidation, ValidationPresets } from "../../hooks/useFormValidation";
import { PasswordStrengthIndicator } from "../../components/auth/PasswordStrengthIndicator";

interface RegisterFormValues {
  email: string;
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { register, isLoading } = useAuth();
  const { t } = useLanguage();
  const { colors, isDarkMode } = useTheme();
  const { alertVisible, alertConfig, hideAlert, showSuccess, showError } =
    useAlert();

  const emailInputRef = useRef<any>(null);
  const usernameInputRef = useRef<any>(null);
  const displayNameInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);
  const confirmPasswordInputRef = useRef<any>(null);

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  // Form validation với hook
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    setError,
  } = useFormValidation<RegisterFormValues>(
    {
      email: "",
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
    {
      email: ValidationPresets.email,
      username: ValidationPresets.username,
      displayName: ValidationPresets.required("Tên hiển thị"),
      password: ValidationPresets.strongPassword,
      confirmPassword: (value: string) =>
        ValidationPresets.match("Mật khẩu", values.password)(value),
    }
  );

  // Auto-focus email input khi mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      emailInputRef.current?.focus();
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  const handleRegister = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await register(
        values.email,
        values.password,
        values.username,
        values.displayName
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      showSuccess(
        t("auth.registerSuccess") || "Đăng ký thành công!",
        t("auth.registerSuccessMessage") ||
          "Chào mừng bạn đến với PinYourWord! Hãy bắt đầu hành trình khám phá thế giới của bạn.",
        () => {
          // Navigate or do something after success
        }
      );
    } catch (error: any) {
      console.log("Register error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Hiển thị error từ backend
      if (error?.errors) {
        if (error.errors.email) setError("email", error.errors.email);
        if (error.errors.username) setError("username", error.errors.username);
        if (error.errors.password) setError("password", error.errors.password);
        if (error.errors.displayName)
          setError("displayName", error.errors.displayName);
      } else if (error?.message) {
        showError("Đăng ký thất bại", error.message);
      } else {
        showError("Lỗi", "Đăng ký thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <Text style={styles.backButtonText}>{t("auth.back")}</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t("auth.register")}</Text>
            <Text style={styles.subtitle}>{t("auth.createAccount")}</Text>
          </View>

          {/* Form Card */}
          <BlurView
            intensity={isDarkMode ? 60 : 100}
            tint={isDarkMode ? "dark" : "light"}
            style={styles.formCard}
          >
            <View style={styles.form}>
              <Input
                ref={emailInputRef}
                label={t("auth.email")}
                placeholder={t("auth.emailPlaceholder")}
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={touched.email ? errors.email : ""}
                leftIcon="email-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => usernameInputRef.current?.focus()}
                blurOnSubmit={false}
              />

              <Input
                ref={usernameInputRef}
                label={t("auth.username")}
                placeholder={t("auth.usernamePlaceholder")}
                value={values.username}
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                error={touched.username ? errors.username : ""}
                leftIcon="at"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => displayNameInputRef.current?.focus()}
                blurOnSubmit={false}
              />

              <Input
                ref={displayNameInputRef}
                label={t("auth.displayName")}
                placeholder={t("auth.displayNamePlaceholder")}
                value={values.displayName}
                onChangeText={handleChange("displayName")}
                onBlur={handleBlur("displayName")}
                error={touched.displayName ? errors.displayName : ""}
                leftIcon="account-outline"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                blurOnSubmit={false}
              />

              <Input
                ref={passwordInputRef}
                label={t("auth.password")}
                placeholder={t("auth.passwordPlaceholder")}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={touched.password ? errors.password : ""}
                leftIcon="lock-outline"
                showPasswordToggle
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                blurOnSubmit={false}
              />

              {/* Password Strength Indicator */}
              {values.password.length > 0 && (
                <PasswordStrengthIndicator password={values.password} />
              )}

              <Input
                ref={confirmPasswordInputRef}
                label={t("auth.confirmPassword")}
                placeholder={t("auth.passwordPlaceholder")}
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={touched.confirmPassword ? errors.confirmPassword : ""}
                leftIcon="lock-check-outline"
                showPasswordToggle
                returnKeyType="go"
                onSubmitEditing={handleRegister}
              />

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  isLoading && styles.registerButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isLoading
                      ? ["#9CA3AF", "#6B7280"]
                      : ["#737ab8ff", "#384bf9ff"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.registerButtonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.neutral.white}
                      style={{ marginRight: spacing.xs }}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="account-plus"
                      size={20}
                      color={colors.neutral.white}
                      style={{ marginRight: spacing.xs }}
                    />
                  )}
                  <Text style={styles.registerButtonText}>
                    {isLoading ? t("auth.processing") : t("auth.register")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginText}>
              {t("auth.hasAccount")}{" "}
              <Text style={styles.loginTextBold}>{t("auth.login")}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Alert Component */}
      <Alert
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        primaryButton={alertConfig.primaryButton}
        secondaryButton={alertConfig.secondaryButton}
        onClose={hideAlert}
        showCloseButton={alertConfig.showCloseButton}
      />
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.main,
    },
    decorContainer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 1,
    },
    decorEmoji: {
      position: "absolute",
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
      alignSelf: "flex-start",
      marginBottom: spacing.lg,
    },
    backButtonText: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.neutral.white,
    },
    header: {
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    headerIcon: {
      fontSize: 64,
      marginBottom: spacing.md,
    },
    title: {
      fontSize: typography.fontSize["3xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
      marginBottom: spacing.sm,
      textAlign: "center",
      textShadowColor: colors.neutral.black + "33", // 20% opacity
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    subtitle: {
      fontSize: typography.fontSize.lg,
      color: colors.neutral.white,
      opacity: 0.9,
      textAlign: "center",
    },
    formCard: {
      borderRadius: borderRadius["2xl"],
      overflow: "hidden",
      padding: spacing.xl,
      backgroundColor: colors.neutral.white + "26", // 15% opacity
      marginBottom: spacing.lg,
    },
    form: {
      gap: spacing.sm,
    },
    registerButton: {
      borderRadius: borderRadius.xl,
      overflow: "hidden",
      marginTop: spacing.md,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    registerButtonGradient: {
      paddingVertical: spacing.md + 4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    registerButtonDisabled: {
      opacity: 0.7,
    },
    registerButtonText: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
      letterSpacing: 0.5,
    },
    loginLink: {
      paddingVertical: spacing.md,
      alignItems: "center",
    },
    loginText: {
      fontSize: typography.fontSize.base,
      color: colors.neutral.white,
      opacity: 0.9,
    },
    loginTextBold: {
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
      textDecorationLine: "underline",
    },
  });
