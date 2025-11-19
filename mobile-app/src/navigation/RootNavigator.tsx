import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
  Pressable,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../i18n/LanguageContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Auth Screens
import { SplashScreen } from "../screens/auth/SplashScreen";
import { WalkthroughScreen } from "../screens/auth/WalkthroughScreen";
import { PermissionRequestScreen } from "../screens/auth/PermissionRequestScreen";
import { AuthHomeScreen } from "../screens/auth/AuthHomeScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";

// Main Screens
import { MapScreen } from "../screens/main/MapScreen";
import { ProfileScreen } from "../screens/main/ProfileScreen";
import { SettingsScreen } from "../screens/main/SettingsScreen";
import { AddPinScreen } from "../screens/main/AddPinScreen";
import { PinDetailsScreen } from "../screens/main/PinDetailsScreen";
import { CountryExplorationScreen } from "../screens/main/CountryExplorationScreen";
import { FeedScreen } from "../screens/main/FeedScreen";
import { DiscoverScreen } from "../screens/main/DiscoverScreen";
import { UserProfileScreen } from "../screens/main/UserProfileScreen";
import { PrivacySettingsScreen } from "../screens/main/PrivacySettingsScreen";
import { BadgeDetailsScreen } from "../screens/main/BadgeDetailsScreen";
import { PostDetailsScreen } from "../screens/main/PostDetailsScreen";
import { FeedScreenV2 } from '../screens/main/FeedScreen.v2';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Button Component with Animation
const TabButton = ({
  route,
  index,
  isFocused,
  onPress,
  options,
  colors,
}: any) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: isFocused ? 1.1 : 1,
        useNativeDriver: true,
        friction: 7,
        tension: 100,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={handlePress}
      style={styles.tabButton}
      android_ripple={{
        color: colors.primary.main + '20',
        borderless: true,
        radius: 32
      }}
    >
      <Animated.View
        style={[
          styles.tabBackground,
          {
            opacity: backgroundOpacity,
            backgroundColor: colors.primary.main + '15',
          },
        ]}
      />
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        {options.tabBarIcon?.({
          focused: isFocused,
          color: isFocused ? colors.primary.main : colors.text.secondary,
          size: 26,
        })}
      </Animated.View>
    </Pressable>
  );
};

// Modern Bottom Tab Bar with Material Icons
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const tabBarWidth = screenWidth - 40; // Trừ đi paddingHorizontal (20 * 2)
  const tabWidth = tabBarWidth / state.routes.length;
  const translateX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: state.index * tabWidth + (tabWidth - 60) / 2,
        useNativeDriver: true,
        friction: 8,
        tension: 120,
      }),
      Animated.spring(indicatorWidth, {
        toValue: 60,
        useNativeDriver: false,
        friction: 8,
        tension: 120,
      }),
    ]).start();
  }, [state.index, tabWidth]);

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: colors.background.card,
          paddingBottom: Math.max(insets.bottom, 8),
          borderTopColor: colors.border.light,
        },
      ]}
    >
      {/* Animated indicator bar */}
      <Animated.View
        style={[
          styles.activeTabIndicator,
          {
            width: indicatorWidth,
            backgroundColor: colors.primary.main,
            transform: [{ translateX }],
          },
        ]}
      />

      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabButton
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={onPress}
            options={options}
            colors={colors}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 4,
    borderTopWidth: 1,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      },
      android: {
        elevation: 8,
      },
    }),
  },
  activeTabIndicator: {
    position: "absolute",
    top: 0,
    left: 20,
    height: 3.5,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    shadowColor: "currentColor",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    maxWidth: 80,
    position: 'relative',
  },
  tabBackground: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
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
          title: "Map",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "map-marker" : "map-marker-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 2: Feed */}
      <Tab.Screen
        name="Feed"
        component={FeedScreenV2}
        options={{
          title: "Feed",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "view-grid" : "view-grid-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 3: Add Pin */}
      <Tab.Screen
        name="AddPinTab"
        component={View}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("AddPin", {});
          },
        }}
        options={{
          title: "Add",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              size={size + 4}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 4: Discover */}
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "compass" : "compass-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 5: Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account-circle" : "account-circle-outline"}
              size={size}
              color={color}
            />
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
          presentation: "transparentModal", // hoặc 'fullScreenModal'
          headerShown: false,
          animation: "fade", // hoặc 'slide_from_bottom'
        }}
      />
      <Stack.Screen
        name="PinDetails"
        component={PinDetailsScreen}
        options={{
          // title: t('pin.pinDetails'),
          // headerStyle: {
          //   backgroundColor: colors.background.card,
          // },
          // headerTintColor: colors.text.primary,
          headerShown: false,
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
          // title: 'Hồ sơ người dùng',
          // headerStyle: {
          //   backgroundColor: colors.background.card,
          // },
          // headerTintColor: colors.text.primary,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          // title: t('settings.settings'),
          // headerStyle: {
          //   backgroundColor: colors.background.card,
          // },
          // headerTintColor: colors.text.primary,
          headerShown: false,
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
