import React from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { colors } from '../../theme/colors';
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
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          multiline && { height: numberOfLines * 40, textAlignVertical: 'top' },
          error && styles.inputError,
        ]}
        placeholderTextColor={colors.neutral.gray400}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
