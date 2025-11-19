import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  feedback: string[];
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      label: '',
      color: '#999',
      feedback: [],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Ít nhất 8 ký tự');
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Cần chữ hoa (A-Z)');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Cần chữ thường (a-z)');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Cần số (0-9)');
  }

  // Special character check
  if (/[@$!%*?&#]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Cần ký tự đặc biệt (@$!%*?&#)');
  }

  // Bonus for length
  if (password.length >= 12) {
    score += 1;
  }

  // Normalize score to 0-4
  const normalizedScore = Math.min(Math.floor(score / 1.5), 4);

  const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const colors = ['#EF4444', '#F59E0B', '#EAB308', '#10B981', '#059669'];

  return {
    score: normalizedScore,
    label: labels[normalizedScore],
    color: colors[normalizedScore],
    feedback,
  };
};

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  const { colors } = useTheme();
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) return null;

  return (
    <View style={styles.container}>
      {/* Strength Bars */}
      <View style={styles.barsContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                backgroundColor:
                  index <= strength.score ? strength.color : colors.border.main,
              },
            ]}
          />
        ))}
      </View>

      {/* Strength Label */}
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: strength.color }]}>
          {strength.label}
        </Text>
      </View>

      {/* Feedback */}
      {strength.feedback.length > 0 && strength.score < 3 && (
        <View style={styles.feedbackContainer}>
          {strength.feedback.slice(0, 2).map((item, index) => (
            <View key={index} style={styles.feedbackItem}>
              <MaterialCommunityIcons
                name="circle-small"
                size={16}
                color={colors.text.secondary}
              />
              <Text style={[styles.feedbackText, { color: colors.text.secondary }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Success Message */}
      {strength.score >= 3 && (
        <View style={styles.successContainer}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={strength.color}
          />
          <Text style={[styles.successText, { color: strength.color }]}>
            Mật khẩu đủ mạnh!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  barsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: borderRadius.sm,
  },
  labelContainer: {
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  feedbackContainer: {
    gap: 2,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -4,
  },
  feedbackText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  successText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
});
