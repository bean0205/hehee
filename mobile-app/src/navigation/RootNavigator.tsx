import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';

// Auth Screens
import { SplashScreen } from '../screens/auth/SplashScreen';
import { WalkthroughScreen } from '../screens/auth/WalkthroughScreen';
import { PermissionRequestScreen } from '../screens/auth/PermissionRequestScreen';
import { AuthHomeScreen } from '../screens/auth/AuthHomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

// Main Screens
import { MapScreen } from '../screens/main/MapScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { AddPinScreen } from '../screens/main/AddPinScreen';
import { PinDetailsScreen } from '../screens/main/PinDetailsScreen';
import { CountryExplorationScreen } from '../screens/main/CountryExplorationScreen';
import { FeedScreen } from '../screens/main/FeedScreen';
import { DiscoverScreen } from '../screens/main/DiscoverScreen';
import { UserProfileScreen } from '../screens/main/UserProfileScreen';
import { PrivacySettingsScreen } from '../screens/main/PrivacySettingsScreen';
import { BadgeDetailsScreen } from '../screens/main/BadgeDetailsScreen';
import { PostDetailsScreen } from '../screens/main/PostDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Tab Bar Component with Circle Indicator and Slide Animation
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(state.routes.map(() => new Animated.Value(0))).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fade out navbar
  const fadeOut = () => {
    Animated.timing(opacityAnim, {
      toValue: 0.3,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Function to fade in navbar
  const fadeIn = () => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Reset the timeout whenever there's interaction
  const resetTimeout = () => {
    fadeIn();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      fadeOut();
    }, 3000); // Fade out after 3 seconds of inactivity
  };

  useEffect(() => {
    // Initial timeout
    resetTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Animate slide indicator
    Animated.spring(slideAnim, {
      toValue: state.index,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();

    // Animate scale for icons
    scaleAnims.forEach((anim: Animated.Value, index: number) => {
      Animated.spring(anim, {
        toValue: state.index === index ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    });

    // Reset timeout on navigation
    resetTimeout();
  }, [state.index]);

  const tabWidth = (Dimensions.get('window').width - 40) / state.routes.length;

  return (
    <Animated.View 
      style={[
        styles.tabBarContainer, 
        { 
          backgroundColor: colors.background.card,
          opacity: opacityAnim,
        }
      ]}
      onTouchStart={resetTimeout}
    >
      {/* Sliding Circle Indicator */}
      <Animated.View
        style={[
          styles.slideIndicator,
          {
            backgroundColor: colors.primary.main + '20',
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, state.routes.length - 1],
                  outputRange: [tabWidth / 2 - 30, ((state.routes.length - 1) * tabWidth) + (tabWidth / 2) - 30],
                }),
              },
            ],
          },
        ]}
      />

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

        const scale = scaleAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        });

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [{ scale }],
                },
              ]}
            >
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? colors.primary.main : colors.text.disabled,
                size: 24,
              })}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    flexDirection: 'row',
    height: 70,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  slideIndicator: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    left: 0,
    top: 5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    zIndex: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
});

// Auth Stack Navigator
const AuthNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: colors.background.main },
      }}
    >
      <Stack.Screen name="AuthHome" component={AuthHomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator - Version 1.5 (5 tabs)
const MainTabNavigator = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation<any>();
  
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Tab 1: Map */}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: 26 }}>🗺️</Text>
          ),
        }}
      />
      
      {/* Tab 2: Feed */}
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: 26 }}>📰</Text>
          ),
        }}
      />
      
      {/* Tab 3: Add Pin (Center FAB-style) */}
      <Tab.Screen
        name="AddPinTab"
        component={View}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('AddPin', {});
          },
        }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.primary.main,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Text style={{ fontSize: 32, color: colors.text.inverse }}>+</Text>
            </View>
          ),
        }}
      />
      
      {/* Tab 4: Discover */}
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: 26 }}>�</Text>
          ),
        }}
      />
      
      {/* Tab 5: Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Text style={{ fontSize: 26 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Stack Navigator (with modals)
const MainNavigator = () => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.card,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          color: colors.text.primary,
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPin"
        component={AddPinScreen}
        options={{
          title: t('pin.addPin'),
          presentation: 'modal',
          headerStyle: {
            backgroundColor: colors.background.card,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <Stack.Screen
        name="PinDetails"
        component={PinDetailsScreen}
        options={{
          title: t('pin.pinDetails'),
          headerStyle: {
            backgroundColor: colors.background.card,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <Stack.Screen
        name="CountryExploration"
        component={CountryExplorationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          title: 'Hồ sơ người dùng',
          headerStyle: {
            backgroundColor: colors.background.card,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('settings.settings'),
          headerStyle: {
            backgroundColor: colors.background.card,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      <Stack.Screen
        name="PrivacySettings"
        component={PrivacySettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BadgeDetails"
        component={BadgeDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostDetails"
        component={PostDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const { isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isAuthenticated && showOnboarding) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Walkthrough">
          {(props) => (
            <WalkthroughScreen
              {...props}
              onComplete={() => {
                // In production, check if user has seen walkthrough before
                setShowOnboarding(false);
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="PermissionRequest">
          {(props) => (
            <PermissionRequestScreen
              {...props}
              onComplete={() => {
                // Navigate to auth
                setShowOnboarding(false);
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

export default RootNavigator;
