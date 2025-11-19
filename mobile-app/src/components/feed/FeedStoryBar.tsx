/**
 * FeedStoryBar Component
 * Instagram-style story carousel with progress indicators
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../common/Avatar';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const STORY_ITEM_WIDTH = 72;

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
      <TouchableOpacity
        key={story.id}
        style={styles.storyItem}
        onPress={() => onStoryPress(story.id, story.user.id)}
        activeOpacity={0.7}
      >
        <View style={styles.storyAvatarContainer}>
          {/* Gradient border for unviewed stories */}
          {!story.hasViewed ? (
            <LinearGradient
              colors={['#F58529', '#DD2A7B', '#8134AF', '#515BD4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBorder}
            >
              <View style={styles.storyAvatarInner}>
                <Avatar size={56} uri={story.user.avatar} />
              </View>
            </LinearGradient>
          ) : (
            <View style={styles.viewedBorder}>
              <Avatar size={56} uri={story.user.avatar} />
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
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>+</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        <Text
          style={[
            styles.storyName,
            isOwn && styles.ownStoryName,
          ]}
          numberOfLines={1}
        >
          {isOwn ? t('feed.yourStory') : story.user.name}
        </Text>
      </TouchableOpacity>
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
        snapToInterval={STORY_ITEM_WIDTH + spacing.md}
        snapToAlignment="start"
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
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    scrollContent: {
      paddingHorizontal: spacing.sm,
      gap: spacing.md,
    },
    storyItem: {
      alignItems: 'center',
      width: STORY_ITEM_WIDTH,
    },
    storyAvatarContainer: {
      position: 'relative',
      marginBottom: spacing.xs,
    },
    gradientBorder: {
      width: 68,
      height: 68,
      borderRadius: 34,
      padding: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    storyAvatarInner: {
      backgroundColor: colors.background.card,
      borderRadius: 31,
      padding: 3,
    },
    viewedBorder: {
      width: 68,
      height: 68,
      borderRadius: 34,
      borderWidth: 2,
      borderColor: colors.border.light,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 3,
    },
    addButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.background.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.background.card,
    },
    addButtonGradient: {
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: {
      color: colors.text.inverse,
      fontSize: 14,
      fontWeight: typography.fontWeight.bold,
      marginTop: -1,
    },
    storyName: {
      fontSize: typography.fontSize.xs,
      color: colors.text.primary,
      textAlign: 'center',
      fontWeight: typography.fontWeight.medium,
    },
    ownStoryName: {
      fontWeight: typography.fontWeight.semiBold,
    },
  });
