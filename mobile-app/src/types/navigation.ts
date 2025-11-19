/**
 * Navigation Type Definitions
 * Type-safe navigation for all screens
 */

import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

// ============================================================================
// AUTH STACK
// ============================================================================

export type AuthStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  Register: undefined;
};

export type AuthStackNavigationProp<T extends keyof AuthStackParamList> =
  StackNavigationProp<AuthStackParamList, T>;

export type AuthStackRouteProp<T extends keyof AuthStackParamList> = RouteProp<
  AuthStackParamList,
  T
>;

// ============================================================================
// MAIN TAB NAVIGATOR
// ============================================================================

export type MainTabParamList = {
  Map: undefined;
  Feed: undefined;
  AddPinTab: undefined; // Placeholder tab (triggers modal)
  Discover: undefined;
  Profile: undefined;
};

export type MainTabNavigationProp<T extends keyof MainTabParamList> =
  BottomTabNavigationProp<MainTabParamList, T>;

// ============================================================================
// MAIN STACK (Includes tabs + modals)
// ============================================================================

export type MainStackParamList = {
  MainTabs: undefined;
  AddPin: {
    pinId?: string; // For editing existing pin
    placeName?: string; // Pre-fill place name
  };
  PinDetails: {
    pinId: string;
  };
  CountryExploration: {
    countryCode?: string;
    countryName?: string;
  };
  UserProfile: {
    userId: string;
  };
  Settings: undefined;
  PrivacySettings: undefined;
  BadgeDetails: undefined;
  PostDetails: {
    postId: string;
  };
  ThemeSettings: undefined;
};

export type MainStackNavigationProp<T extends keyof MainStackParamList> =
  StackNavigationProp<MainStackParamList, T>;

export type MainStackRouteProp<T extends keyof MainStackParamList> = RouteProp<
  MainStackParamList,
  T
>;

// ============================================================================
// ROOT STACK
// ============================================================================

export type RootStackParamList = {
  Splash: undefined;
  Walkthrough: undefined;
  PermissionRequest: undefined;
  Auth: undefined;
  Main: undefined;
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

// ============================================================================
// COMPOSITE NAVIGATION PROPS
// ============================================================================

/**
 * Use this in components that are inside MainTabs
 * to get navigation to both tab screens and stack screens
 */
export type MainTabCompositeNavigationProp<T extends keyof MainTabParamList> =
  CompositeNavigationProp<
    MainTabNavigationProp<T>,
    MainStackNavigationProp<keyof MainStackParamList>
  >;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract route params for any screen
 */
export type ScreenParams<T extends keyof MainStackParamList> =
  MainStackParamList[T];

/**
 * Type guard for navigation params
 */
export function hasNavigationParams<T extends keyof MainStackParamList>(
  route: { params?: any },
  key: keyof MainStackParamList[T]
): route is { params: MainStackParamList[T] } {
  return route.params !== undefined && key in route.params;
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
Example 1: In a screen component

import { MainStackNavigationProp, MainStackRouteProp } from '@/types/navigation';

type Props = {
  navigation: MainStackNavigationProp<'PinDetails'>;
  route: MainStackRouteProp<'PinDetails'>;
};

export const PinDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { pinId } = route.params; // ✅ Type-safe!

  navigation.navigate('AddPin', { pinId }); // ✅ Type-safe!
};
*/

/*
Example 2: With useNavigation hook

import { useNavigation } from '@react-navigation/native';
import { MainStackNavigationProp } from '@/types/navigation';

const Component = () => {
  const navigation = useNavigation<MainStackNavigationProp<'Map'>>();

  navigation.navigate('PinDetails', { pinId: '123' }); // ✅ Type-safe!
};
*/

/*
Example 3: In tab screens that need to navigate to modals

import { MainTabCompositeNavigationProp } from '@/types/navigation';

type Props = {
  navigation: MainTabCompositeNavigationProp<'Map'>;
};

export const MapScreen: React.FC<Props> = ({ navigation }) => {
  // Can navigate to tabs
  navigation.navigate('Profile'); // ✅

  // Can also navigate to stack screens
  navigation.navigate('AddPin', {}); // ✅
};
*/
