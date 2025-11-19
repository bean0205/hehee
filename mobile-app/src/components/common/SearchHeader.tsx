import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Keyboard,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface SearchHeaderProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  showFilter?: boolean;
  onFilterPress?: () => void;
  filterActive?: boolean;
  autoFocus?: boolean;
  leftAction?: {
    icon: string;
    onPress: () => void;
  };
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSubmit,
  onClear,
  showFilter = false,
  onFilterPress,
  filterActive = false,
  autoFocus = false,
  leftAction,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const styles = React.useMemo(
    () => createStyles(colors, insets),
    [colors, insets]
  );

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
      friction: 7,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
    }).start();
  };

  const handleClear = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChangeText('');
    onClear?.();
  };

  const handleFilterPress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Keyboard.dismiss();
    onFilterPress?.();
  };

  return (
    <View style={styles.container}>
      {/* Left Action Button */}
      {leftAction && (
        <TouchableOpacity
          onPress={leftAction.onPress}
          style={styles.leftButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={leftAction.icon as any}
            size={24}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      )}

      {/* Search Input */}
      <Animated.View
        style={[
          styles.searchContainer,
          isFocused && styles.searchContainerFocused,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={colors.text.secondary}
          style={styles.searchIcon}
        />

        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmit}
          autoFocus={autoFocus}
          returnKeyType="search"
          clearButtonMode="never" // We'll use custom clear button
        />

        {/* Clear Button */}
        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Filter Button */}
      {showFilter && (
        <TouchableOpacity
          onPress={handleFilterPress}
          style={[
            styles.filterButton,
            filterActive && styles.filterButtonActive,
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={20}
            color={filterActive ? colors.primary.main : colors.text.primary}
          />
          {filterActive && <View style={styles.filterActiveDot} />}
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (colors: any, insets: any) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: insets.top + spacing.sm,
      paddingBottom: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.background.card,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border.light,
      gap: spacing.sm,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    leftButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.elevated,
      borderRadius: 12,
      paddingHorizontal: spacing.sm,
      height: 40,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    searchContainerFocused: {
      borderColor: colors.primary.main + '40',
      backgroundColor: colors.background.card,
    },
    searchIcon: {
      marginRight: spacing.xs,
    },
    searchInput: {
      flex: 1,
      fontSize: typography.fontSize.md,
      color: colors.text.primary,
      fontWeight: typography.fontWeight.normal,
      paddingVertical: 0, // Remove default padding
      height: '100%',
    },
    clearButton: {
      padding: spacing.xs,
      marginLeft: spacing.xs,
    },
    filterButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.background.elevated,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    filterButtonActive: {
      backgroundColor: colors.primary.main + '15',
    },
    filterActiveDot: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary.main,
    },
  });
