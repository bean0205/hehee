import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Enhanced animation configs
const SPRING_CONFIG = {
  tension: 180,
  friction: 12,
  useNativeDriver: true,
};

const TIMING_CONFIG = {
  duration: 200,
  useNativeDriver: true,
};

// Enhanced Tab Button with labels and pill-shaped indicator
interface TabButtonProps {
  route: any;
  index: number;
  isFocused: boolean;
  onPress: () => void;
  options: any;
  colors: any;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  route,
  index,
  isFocused,
  onPress,
  options,
  colors,
  label,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      // Scale animation
      Animated.spring(scaleValue, {
        toValue: isFocused ? 1 : 0.9,
        ...SPRING_CONFIG,
      }),
      // Background pill animation
      Animated.spring(backgroundOpacity, {
        toValue: isFocused ? 1 : 0,
        ...SPRING_CONFIG,
      }),
      // Label fade animation
      Animated.timing(labelOpacity, {
        toValue: isFocused ? 1 : 0.7,
        ...TIMING_CONFIG,
      }),
      // Bounce animation
      Animated.spring(translateY, {
        toValue: isFocused ? -2 : 0,
        ...SPRING_CONFIG,
      }),
    ]).start();
  }, [isFocused]);

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const iconColor = isFocused ? colors.primary.main : colors.text.secondary;

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
        paddingVertical: 8,
        paddingHorizontal: 4,
      }}
      android_ripple={{
        color: colors.primary.main + '20',
        borderless: true,
        radius: 40,
      }}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            paddingHorizontal: 12,
            paddingVertical: 8,
            minWidth: 64,
          },
          {
            transform: [{ scale: scaleValue }, { translateY }],
          },
        ]}
      >
        {/* Pill-shaped background for active tab */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20,
            },
            {
              opacity: backgroundOpacity,
              backgroundColor: colors.primary.main + '15',
            },
          ]}
        />

        {/* Icon */}
        <View style={{ marginBottom: 2 }}>
          {options.tabBarIcon?.({
            focused: isFocused,
            color: iconColor,
            size: 24,
          })}
        </View>

        {/* Label */}
        <Animated.Text
          style={[
            {
              fontSize: 11,
              letterSpacing: -0.1,
              marginTop: 2,
            },
            {
              color: iconColor,
              opacity: labelOpacity,
              fontWeight: isFocused ? '600' : '500',
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

// FAB (Floating Action Button) for center tab
interface FABButtonProps {
  onPress: () => void;
  colors: any;
  isFocused: boolean;
}

const FABButton: React.FC<FABButtonProps> = ({ onPress, colors, isFocused }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: isFocused ? 1.1 : 1,
        ...SPRING_CONFIG,
      }),
      Animated.spring(rotateValue, {
        toValue: isFocused ? 1 : 0,
        ...SPRING_CONFIG,
      }),
    ]).start();
  }, [isFocused]);

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Pulse animation on press
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
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

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <Pressable
      onPress={handlePress}
      style={{
        marginHorizontal: 8,
        marginTop: -24,
      }}
    >
      <Animated.View
        style={[
          {
            borderRadius: 32,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
              },
              android: {
                elevation: 12,
              },
            }),
          },
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primary.main, colors.primary.dark || colors.primary.main]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 4,
            borderColor: colors.background.card || '#FFFFFF',
          }}
        >
          <Animated.View
            style={{
              transform: [{ rotate: rotation }],
            }}
          >
            <MaterialCommunityIcons name="plus" size={32} color="#FFFFFF" />
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

// Main Modern Tab Bar Component
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

  // Tab labels mapping
  const tabLabels: Record<string, string> = {
    Map: 'Map',
    Feed: 'Feed',
    AddPinTab: 'Add',
    Discover: 'Explore',
    Profile: 'Profile',
  };

  const styles = createStyles(colors, insets);

  return (
    <View style={styles.container}>
      {/* Blur background for iOS, solid for Android */}
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={isDarkMode ? 80 : 100}
          tint={isDarkMode ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.background.card },
          ]}
        />
      )}

      {/* Top border with gradient */}
      <LinearGradient
        colors={[
          colors.border.light + '00',
          colors.border.light,
          colors.border.light + '00',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topBorder}
      />

      {/* Tab buttons */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = tabLabels[route.name] || route.name;

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

          // Center FAB button
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

          // Regular tab buttons
          return (
            <TabButton
              key={route.key}
              route={route}
              index={index}
              isFocused={isFocused}
              onPress={onPress}
              options={options}
              colors={colors}
              label={label}
            />
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (colors: any, insets: any) =>
  StyleSheet.create({
    container: {
      position: 'relative',
      overflow: 'hidden',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
        },
        android: {
          elevation: 16,
        },
      }),
    },
    topBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 1,
    },
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingTop: 8,
      paddingBottom: Math.max(insets.bottom, 8) + 4,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
  });
