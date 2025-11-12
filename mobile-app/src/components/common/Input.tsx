import React from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  numberOfLines?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  multiline = false,
  numberOfLines = 1,
  ...props
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          multiline && { height: numberOfLines * 40, textAlignVertical: 'top' },
          error && styles.inputError,
        ]}
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
    opacity: 0.9,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: '#FFFFFF',
    fontWeight: typography.fontWeight.medium,
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: '#FEE2E2',
    marginTop: spacing.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
});
