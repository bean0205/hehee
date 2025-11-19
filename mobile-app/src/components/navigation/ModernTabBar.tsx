import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../contexts/ThemeContext';

// Minimal animation configs for smooth, subtle effects
const SPRING_CONFIG = {
  tension: 300,
  friction: 20,
  useNativeDriver: true,
};

// Icon-only Tab Button (Instagram/Facebook style)
interface TabButtonProps {
  route: any;
  index: number;
  isFocused: boolean;
  onPress: () => void;
  options: any;
  colors: any;
}

const TabButton: React.FC<TabButtonProps> = ({
  route,
  index,
  isFocused,
  onPress,
  options,
  colors,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(isFocused ? 1 : 0.5)).current;

  useEffect(() => {
    Animated.parallel([
      // Scale animation with bounce effect
      Animated.spring(scaleValue, {
        toValue: isFocused ? 1.1 : 1,
        ...SPRING_CONFIG,
      }),
      // Opacity animation for smooth fade
      Animated.timing(opacityValue, {
        toValue: isFocused ? 1 : 0.5,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Tap animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: isFocused ? 1.1 : 1,
        ...SPRING_CONFIG,
      }),
    ]).start();

    onPress();
  };

  const iconColor = isFocused ? colors.primary.main : '#8E8E93';

  return (
    <Pressable
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={handlePress}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
      }}
      android_ripple={{
        color: colors.primary.main + '15',
        borderless: true,
        radius: 30,
      }}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      >
        {/* Icon only - no labels, no dots */}
        {options.tabBarIcon?.({
          focused: isFocused,
          color: iconColor,
          size: 26,
        })}
      </Animated.View>
    </Pressable>
  );
};

// Simple Center Action Button (Instagram style)
interface FABButtonProps {
  onPress: () => void;
  colors: any;
  isFocused: boolean;
}

const FABButton: React.FC<FABButtonProps> = ({ onPress, colors, isFocused }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: isFocused ? 1.08 : 1,
        ...SPRING_CONFIG,
      }),
      Animated.timing(opacityValue, {
        toValue: isFocused ? 1 : 0.95,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Press animation with bounce
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.88,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        ...SPRING_CONFIG,
      }),
    ]).start();

    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
      }}
    >
      <Animated.View
        style={[
          {
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: colors.primary.main,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              },
              android: {
                elevation: 8,
              },
            }),
          },
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
      </Animated.View>
    </Pressable>
  );
};

// Main Modern Tab Bar Component (Instagram/Facebook Style)
interface ModernTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const ModernTabBar: React.FC<ModernTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = createStyles(colors, insets, isDarkMode);

  return (
    <View style={styles.container}>
      {/* Simple background - no blur, no gradient border */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
          },
        ]}
      />

      {/* Minimal top border */}
      <View style={styles.topBorder} />

      {/* Tab buttons */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Center action button
          if (route.name === 'AddPinTab') {
            return (
              <FABButton
                key={route.key}
                onPress={onPress}
                colors={colors}
                isFocused={isFocused}
              />
            );
          }

          // Regular icon-only tab buttons
          return (
            <TabButton
              key={route.key}
              route={route}
              index={index}
              isFocused={isFocused}
              onPress={onPress}
              options={options}
              colors={colors}
            />
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (colors: any, insets: any, isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isDarkMode ? '#2C2C2E' : '#E5E5EA',
    },
    topBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: isDarkMode ? '#2C2C2E' : '#E5E5EA',
    },
    tabsContainer: {
      flexDirection: 'row',
      paddingTop: 6,
      paddingBottom: Math.max(insets.bottom + 4, 8),
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: 'transparent',
      minHeight: 60,
    },
  });
