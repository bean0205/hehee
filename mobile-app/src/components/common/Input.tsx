import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onRightIconPress?: () => void;
  showPasswordToggle?: boolean;
  success?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  onRightIconPress,
  showPasswordToggle = false,
  secureTextEntry = false,
  success = false,
  ...props
}) => {
  const { colors, isDarkMode } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<RNTextInput>(null);

  // Shake animation khi có error
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [error]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getInputStyle = () => {
    if (error) return [styles.input, styles.inputError];
    if (success) return [styles.input, styles.inputSuccess];
    if (isFocused) return [styles.input, styles.inputFocused];
    return styles.input;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        { transform: [{ translateX: shakeAnimation }] }
      ]}
    >
      {label && (
        <Text style={styles.label}>
          {label}
          {props.required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={getInputStyle()}>
        {leftIcon && (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={error ? colors.error : isFocused ? colors.primary : colors.text.disabled}
            style={styles.leftIcon}
          />
        )}

        <RNTextInput
          ref={inputRef}
          style={[
            styles.inputText,
            multiline && { height: numberOfLines * 40, textAlignVertical: 'top' },
            leftIcon && { paddingLeft: 0 },
            (showPasswordToggle || rightIcon) && { paddingRight: 0 },
          ]}
          placeholderTextColor={colors.text.disabled}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={colors.text.disabled}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name={rightIcon}
              size={20}
              color={colors.text.disabled}
            />
          </TouchableOpacity>
        )}

        {success && !error && (
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color={colors.success}
            style={styles.rightIcon}
          />
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={14} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  required: {
    color: colors.error,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderWidth: 1.5,
    borderColor: colors.border.main,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.background.elevated,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.error + '15', // 8% opacity
  },
  inputSuccess: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10', // 6% opacity
  },
  inputText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
    paddingHorizontal: spacing.xs,
  },
  leftIcon: {
    marginRight: spacing.xs,
  },
  rightIcon: {
    marginLeft: spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  errorText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    color: colors.error,
    fontWeight: typography.fontWeight.semiBold,
  },
});
