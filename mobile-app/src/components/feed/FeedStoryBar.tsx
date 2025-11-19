/**
 * FeedStoryBar Component
 * Instagram-style story carousel with progress indicators
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Avatar } from '../common/Avatar';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const STORY_ITEM_WIDTH = 76;
const STORY_GAP = spacing.md;

interface Story {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  hasViewed: boolean;
  isOwn?: boolean;
}

interface FeedStoryBarProps {
  stories: Story[];
  colors: any;
  onStoryPress: (storyId: string, userId: string) => void;
  onAddStory?: () => void;
  t: (key: string) => string;
}

/**
 * AnimatedStoryItem - Individual story item with press animation
 */
const AnimatedStoryItem: React.FC<{
  story: Story;
  isOwn: boolean;
  colors: any;
  onPress: () => void;
  onAddStory?: () => void;
  t: (key: string) => string;
}> = ({ story, isOwn, colors, onPress, onAddStory, t }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const handlePressIn = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.storyItem}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.storyAvatarContainer}>
          {/* Gradient border for unviewed stories */}
          {!story.hasViewed ? (
            <LinearGradient
              colors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}
            >
              <View style={styles.storyAvatarInner}>
                <Avatar size={60} uri={story.user.avatar} />
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.viewedBorder}>
              <Avatar size={60} uri={story.user.avatar} />
            </View>
          )}

          {/* Add Story Plus Button */}
          {isOwn && onAddStory && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddStory}
              hitSlop={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <LinearGradient
                colors={[colors.primary.main, colors.primary.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>+</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <Text
          style={[styles.storyName, isOwn && styles.ownStoryName]}
          numberOfLines={1}
        >
          {isOwn ? t('feed.yourStory') : story.user.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const FeedStoryBar: React.FC<FeedStoryBarProps> = ({
  stories,
  colors,
  onStoryPress,
  onAddStory,
  t,
}) => {
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const renderStoryItem = (story: Story, index: number) => {
    const isOwn = story.isOwn || index === 0;

    return (
      <AnimatedStoryItem
        key={story.id}
        story={story}
        isOwn={isOwn}
        colors={colors}
        onPress={() => onStoryPress(story.id, story.user.id)}
        onAddStory={isOwn ? onAddStory : undefined}
        t={t}
      />
    );
  };

  if (stories.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={STORY_ITEM_WIDTH + STORY_GAP}
        snapToAlignment="center"
        bounces={true}
        pagingEnabled={false}
      >
        {stories.map((story, index) => renderStoryItem(story, index))}
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background.card,
      paddingVertical: spacing.md + 2,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    scrollContent: {
      paddingHorizontal: spacing.md - 4,
      gap: STORY_GAP,
      alignItems: 'center',
    },
    storyItem: {
      alignItems: 'center',
      width: STORY_ITEM_WIDTH,
    },
    storyAvatarContainer: {
      position: 'relative',
      marginBottom: spacing.xs + 2,
    },
    gradientBorder: {
      width: 72,
      height: 72,
      borderRadius: 36,
      padding: 3.5,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#e91e63',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    storyAvatarInner: {
      backgroundColor: colors.background.card,
      borderRadius: 33,
      padding: 3,
    },
    viewedBorder: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 2.5,
      borderColor: colors.border.light,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
    },
    addButton: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.background.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2.5,
      borderColor: colors.background.card,
      shadowColor: colors.primary.main,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 3,
    },
    addButtonGradient: {
      width: 21,
      height: 21,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: {
      color: colors.text.inverse,
      fontSize: 15,
      fontWeight: typography.fontWeight.bold,
      marginTop: -1,
      includeFontPadding: false,
    },
    storyName: {
      fontSize: typography.fontSize.xs,
      color: colors.text.primary,
      textAlign: 'center',
      fontWeight: typography.fontWeight.medium,
      maxWidth: STORY_ITEM_WIDTH - 4,
    },
    ownStoryName: {
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
  });
