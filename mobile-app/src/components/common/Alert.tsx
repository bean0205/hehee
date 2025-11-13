import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const { width } = Dimensions.get('window');

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  visible: boolean;
  type?: AlertType;
  title: string;
  message: string;
  primaryButton?: {
    text: string;
    onPress: () => void;
  };
  secondaryButton?: {
    text: string;
    onPress: () => void;
  };
  onClose?: () => void;
  showCloseButton?: boolean;
}

const alertConfig = {
  success: {
    iconName: 'checkmark-circle' as const,
    colors: ['#43e97b', '#38f9d7'] as const,
    decorIcons: [
      { name: 'star' as const, angle: 15 },
      { name: 'sparkles' as const, angle: -20 },
      { name: 'trophy' as const, angle: 10 },
      { name: 'rocket' as const, angle: -15 },
    ],
  },
  error: {
    iconName: 'close-circle' as const,
    colors: ['#ff6b6b', '#ee5a6f'] as const,
    decorIcons: [
      { name: 'alert-circle' as const, angle: 15 },
      { name: 'warning' as const, angle: -20 },
      { name: 'alert' as const, angle: 10 },
      { name: 'close-circle-outline' as const, angle: -15 },
    ],
  },
  warning: {
    iconName: 'warning' as const,
    colors: ['#f093fb', '#f5576c'] as const,
    decorIcons: [
      { name: 'flash' as const, angle: 15 },
      { name: 'notifications' as const, angle: -20 },
      { name: 'megaphone' as const, angle: 10 },
      { name: 'alert-circle-outline' as const, angle: -15 },
    ],
  },
  info: {
    iconName: 'information-circle' as const,
    colors: ['#667eea', '#764ba2'] as const,
    decorIcons: [
      { name: 'airplane' as const, angle: 15 },
      { name: 'map' as const, angle: -20 },
      { name: 'location' as const, angle: 10 },
      { name: 'earth' as const, angle: -15 },
    ],
  },
};

export const Alert: React.FC<AlertProps> = ({
  visible,
  type = 'info',
  title,
  message,
  primaryButton,
  secondaryButton,
  onClose,
  showCloseButton = true,
}) => {
  const { colors, isDarkMode } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  const config = alertConfig[type];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Floating animation for decorative elements
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const styles = React.useMemo(() => createStyles(colors, config.colors), [colors, config.colors]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={showCloseButton ? handleClose : undefined}
        />

        <Animated.View
          style={[
            styles.alertContainer,
            {
              opacity: opacityAnim,
              transform: [
                {
                  scale: scaleAnim,
                },
              ],
            },
          ]}
        >
          {/* Decorative floating icons */}
          <View style={styles.decorContainer} pointerEvents="none">
            {config.decorIcons.map((icon, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.decorIcon,
                  {
                    top: [20, 40, 30, 50][index],
                    [index % 2 === 0 ? 'left' : 'right']: [10, 20, 15, 25][index],
                    transform: [
                      {
                        translateY: floatAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, index % 2 === 0 ? -10 : 10],
                        }),
                      },
                      { rotate: `${icon.angle}deg` },
                    ],
                  },
                ]}
              >
                <Ionicons name={icon.name} size={28} color="rgba(255, 255, 255, 0.15)" />
              </Animated.View>
            ))}
          </View>

          <BlurView intensity={isDarkMode ? 80 : 100} tint={isDarkMode ? 'dark' : 'light'} style={styles.blurContainer}>
            {/* Close button */}
            {showCloseButton && (
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                  style={styles.closeButtonGradient}
                >
                  <Ionicons name="close" size={20} color={colors.neutral.white} />
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Icon with gradient */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={config.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Ionicons name={config.iconName} size={48} color={colors.neutral.white} />
              </LinearGradient>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              {secondaryButton && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => {
                    secondaryButton.onPress();
                    handleClose();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryButtonText}>{secondaryButton.text}</Text>
                </TouchableOpacity>
              )}

              {primaryButton && (
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={() => {
                    primaryButton.onPress();
                    handleClose();
                  }}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={config.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.primaryButtonGradient}
                  >
                    <Text style={styles.primaryButtonText}>{primaryButton.text}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

            {/* Bottom decoration wave */}
            <View style={styles.bottomDecor}>
              <LinearGradient
                colors={[config.colors[0], config.colors[1], 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bottomDecorGradient}
              />
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any, gradientColors: readonly string[]) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  alertContainer: {
    width: width - spacing.xl * 2,
    maxWidth: 400,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  decorContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  decorIcon: {
    position: 'absolute',
  },
  blurContainer: {
    padding: spacing.xl,
    backgroundColor: colors.neutral.white + '26', // 15% opacity
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  closeButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainer: {
    alignSelf: 'center',
    marginBottom: spacing.lg,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.fontSize.base * 1.5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  secondaryButton: {
    backgroundColor: colors.background.elevated + '80',
    borderWidth: 2,
    borderColor: colors.border.main,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  primaryButton: {
    ...Platform.select({
      ios: {
        shadowColor: colors.neutral.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButtonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral.white,
  },
  bottomDecor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    overflow: 'hidden',
  },
  bottomDecorGradient: {
    flex: 1,
    opacity: 0.3,
  },
});
