import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Avatar } from '../../components/common/Avatar';
import { BadgeIcon } from '../../components/common/BadgeIcon';
import { CustomBadgeIcon } from '../../components/common/CustomBadgeIcon';
import { ImageViewerModal } from '../../components/common/ImageViewerModal';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock comments data with replies and badges
const mockComments = [
  {
    id: '1',
    user: {
      id: 'u1',
      name: 'Trần Văn B',
      avatar: null,
      username: 'tranvanb',
      badge: { icon: '🌍', color: '#10B981' }, // Explorer
    },
    text: 'Nơi này đẹp quá! Mình cũng muốn đến lắm 😍',
    timestamp: '1 giờ trước',
    likes: 5,
    isLiked: false,
    replies: [
      {
        id: 'r1',
        user: {
          id: 'author',
          name: 'Nguyễn Văn A',
          avatar: null,
          username: 'nguyenvana',
          badge: { icon: '👑', color: '#F59E0B' }, // Gold/VIP
        },
        text: 'Cảm ơn bạn! Đến đây nhớ vào buổi sáng sớm nhé, không khí rất trong lành 🌅',
        timestamp: '50 phút trước',
        likes: 2,
        isLiked: false,
      },
      {
        id: 'r2',
        user: {
          id: 'u4',
          name: 'Phạm Thị E',
          avatar: null,
          username: 'phamthie',
          badge: { icon: '🗺️', color: '#8B5CF6' }, // Traveler
        },
        text: 'Mình cũng đã đến đây rồi, thật sự rất đáng để ghé thăm!',
        timestamp: '40 phút trước',
        likes: 1,
        isLiked: false,
      },
    ],
  },
  {
    id: '2',
    user: {
      id: 'u2',
      name: 'Nguyễn Thị C',
      avatar: null,
      username: 'nguyenthic',
      badge: { icon: '⭐', color: '#3B82F6' }, // Rising Star
    },
    text: 'Cảm ơn bạn đã chia sẻ! Mình sẽ ghé đây vào tháng sau',
    timestamp: '30 phút trước',
    likes: 3,
    isLiked: true,
    replies: [],
  },
  {
    id: '3',
    user: {
      id: 'u3',
      name: 'Lê Minh D',
      avatar: null,
      username: 'leminhd',
      badge: { icon: '🏆', color: '#EF4444' }, // Champion
    },
    text: 'View đẹp thật đấy! Giá vé bao nhiêu nhỉ?',
    timestamp: '15 phút trước',
    likes: 1,
    isLiked: false,
    replies: [
      {
        id: 'r3',
        user: {
          id: 'author',
          name: 'Nguyễn Văn A',
          avatar: null,
          username: 'nguyenvana',
          badge: { icon: '👑', color: '#F59E0B' }, // Gold/VIP
        },
        text: 'Mình đến miễn phí luôn bạn ơi! Đây là công viên công cộng',
        timestamp: '10 phút trước',
        likes: 3,
        isLiked: true,
      },
    ],
  },
];

export const PostDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const post = route.params?.post;

  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState(mockComments);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{commentId: string, userName: string} | null>(null);

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy bài viết</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        >
          <Text style={styles.errorButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleComment = () => {
    Alert.alert('Bình luận', 'Tính năng bình luận đang được phát triển');
  };

  const handleShare = () => {
    Alert.alert('Chia sẻ', 'Tính năng chia sẻ đang được phát triển');
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const handleSendComment = () => {
    if (commentText.trim() === '') return;

    if (replyingTo) {
      // Add reply to comment
      const newReply = {
        id: 'r' + Date.now().toString(),
        user: {
          id: 'current_user',
          name: 'Bạn',
          avatar: null,
          username: 'you',
          badge: { icon: '🎯', color: '#06B6D4' }, // Current user badge
        },
        text: commentText.trim(),
        timestamp: 'Vừa xong',
        likes: 0,
        isLiked: false,
      };

      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === replyingTo.commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
      setReplyingTo(null);
    } else {
      // Add new comment
      const newComment = {
        id: Date.now().toString(),
        user: {
          id: 'current_user',
          name: 'Bạn',
          avatar: null,
          username: 'you',
          badge: { icon: '🎯', color: '#06B6D4' }, // Current user badge
        },
        text: commentText.trim(),
        timestamp: 'Vừa xong',
        likes: 0,
        isLiked: false,
        replies: [],
      };

      setComments([...comments, newComment]);
    }
    setCommentText('');
  };

  const handleReply = (commentId: string, userName: string) => {
    setReplyingTo({ commentId, userName });
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setCommentText('');
  };

  const handleReplyLike = (commentId: string, replyId: string) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === replyId
                  ? {
                      ...reply,
                      isLiked: !reply.isLiked,
                      likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    }
                  : reply
              ),
            }
          : comment
      )
    );
  };

  const handleUserPress = () => {
    navigation.navigate('UserProfile', { userId: post.user.id });
  };

  const handleLocationPress = () => {
    if (post.pinId) {
      navigation.navigate('PinDetails', { pinId: post.pinId });
    }
  };

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <Text key={star} style={styles.star}>
            {star <= rating ? '⭐' : '☆'}
          </Text>
        ))}
      </View>
    );
  };

  const renderComment = (comment: any) => {
    return (
      <View key={comment.id} style={styles.commentItem}>
        <Avatar size={36} uri={comment.user.avatar} />
        <View style={styles.commentContent}>
          <View style={styles.commentBubble}>
            <View style={styles.commentUserHeader}>
              <Text style={styles.commentUserName}>{comment.user.name}</Text>
              {comment.user.badge && (
                <CustomBadgeIcon 
                  icon={comment.user.badge.icon} 
                  color={comment.user.badge.color}
                  size="small"
                />
              )}
            </View>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
          <View style={styles.commentActions}>
            <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
            <TouchableOpacity
              onPress={() => handleCommentLike(comment.id)}
              style={styles.commentLikeButton}
            >
              <Text style={styles.commentLikeIcon}>
                {comment.isLiked ? '❤️' : '🤍'}
              </Text>
              {comment.likes > 0 && (
                <Text
                  style={[
                    styles.commentLikeCount,
                    comment.isLiked && styles.commentLikeCountActive,
                  ]}
                >
                  {comment.likes}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleReply(comment.id, comment.user.name)}
              style={styles.replyButton}
            >
              <Text style={styles.replyButtonText}>Trả lời</Text>
            </TouchableOpacity>
          </View>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <View style={styles.repliesContainer}>
              {comment.replies.map((reply: any) => (
                <View key={reply.id} style={styles.replyItem}>
                  <Avatar size={28} uri={reply.user.avatar} />
                  <View style={styles.replyContent}>
                    <View style={styles.replyBubble}>
                      <View style={styles.replyUserHeader}>
                        <Text style={styles.replyUserName}>{reply.user.name}</Text>
                        {reply.user.badge && (
                          <CustomBadgeIcon 
                            icon={reply.user.badge.icon} 
                            color={reply.user.badge.color}
                            size="small"
                          />
                        )}
                      </View>
                      <Text style={styles.replyText}>{reply.text}</Text>
                    </View>
                    <View style={styles.replyActions}>
                      <Text style={styles.replyTimestamp}>{reply.timestamp}</Text>
                      <TouchableOpacity
                        onPress={() => handleReplyLike(comment.id, reply.id)}
                        style={styles.commentLikeButton}
                      >
                        <Text style={styles.replyLikeIcon}>
                          {reply.isLiked ? '❤️' : '🤍'}
                        </Text>
                        {reply.likes > 0 && (
                          <Text
                            style={[
                              styles.replyLikeCount,
                              reply.isLiked && styles.commentLikeCountActive,
                            ]}
                          >
                            {reply.likes}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderImageGallery = () => {
    if (!post.photos || post.photos.length === 0) return null;

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / SCREEN_WIDTH);
      setCurrentImageIndex(index);
    };

    return (
      <View style={styles.imageGalleryContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageScrollView}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {post.photos.map((photo: string, index: number) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => handleImagePress(index)}
            >
              <Image
                source={{ uri: photo }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Image Counter Indicator */}
        {post.photos.length > 1 && (
          <View style={styles.imageCounterContainer}>
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentImageIndex + 1} / {post.photos.length}
              </Text>
            </View>
          </View>
        )}

        {/* Dot Pagination */}
        {post.photos.length > 1 && (
          <View style={styles.paginationDots}>
            {post.photos.map((_: string, index: number) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentImageIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  // Achievement post layout
  if (post.type === 'achievement') {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết hoạt động</Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView style={styles.scrollView}>
          {/* User Info */}
          <View style={styles.userSection}>
            <TouchableOpacity
              style={styles.userInfo}
              onPress={handleUserPress}
            >
              <Avatar size={50} uri={post.user.avatar} />
              <View style={styles.userDetails}>
                <View style={styles.userNameRow}>
                  <Text style={styles.userName}>{post.user.name}</Text>
                  <BadgeIcon size="small" />
                </View>
                <Text style={styles.timestamp}>{post.timestamp}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Achievement Content */}
          <View style={styles.achievementContent}>
            <Text style={styles.achievementBadge}>{post.achievement.badge}</Text>
            <Text style={styles.achievementTitle}>{post.achievement.title}</Text>
            <Text style={styles.achievementCount}>{post.achievement.count}</Text>
          </View>

          {/* Caption */}
          {post.caption && (
            <View style={styles.captionSection}>
              <Text style={styles.caption}>{post.caption}</Text>
            </View>
          )}

          {/* Stats & Actions */}
          <View style={styles.statsSection}>
            <Text style={styles.statsText}>
              {likes} lượt thích • {post.comments} bình luận
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButtonLarge}
              onPress={handleLike}
            >
              <Text style={styles.actionIconLarge}>{isLiked ? '❤️' : '🤍'}</Text>
              <Text style={[styles.actionTextLarge, isLiked && styles.actionTextActive]}>
                Thích
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonLarge}
              onPress={handleComment}
            >
              <Text style={styles.actionIconLarge}>💬</Text>
              <Text style={styles.actionTextLarge}>Bình luận</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonLarge}
              onPress={handleShare}
            >
              <Text style={styles.actionIconLarge}>📤</Text>
              <Text style={styles.actionTextLarge}>Chia sẻ</Text>
            </TouchableOpacity>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionLabel}>Bình luận ({comments.length})</Text>
            {comments.length > 0 ? (
              <View style={styles.commentsList}>
                {comments.map(comment => renderComment(comment))}
              </View>
            ) : (
              <View style={styles.emptyComments}>
                <Text style={styles.emptyCommentsIcon}>💬</Text>
                <Text style={styles.emptyCommentsText}>
                  Chưa có bình luận nào
                </Text>
                <Text style={styles.emptyCommentsSubtext}>
                  Hãy là người đầu tiên bình luận!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Reply indicator */}
          {replyingTo && (
            <View style={styles.replyingIndicator}>
              <View style={styles.replyingContent}>
                <Text style={styles.replyingText}>
                  Đang trả lời <Text style={styles.replyingUserName}>{replyingTo.userName}</Text>
                </Text>
                <TouchableOpacity onPress={handleCancelReply}>
                  <Text style={styles.cancelReplyButton}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.commentInputContainer}>
            <Avatar size={36} uri={undefined} />
            <TextInput
              style={styles.commentInput}
              placeholder={replyingTo ? `Trả lời ${replyingTo.userName}...` : "Viết bình luận..."}
              placeholderTextColor={colors.text.disabled}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                commentText.trim() === '' && styles.sendButtonDisabled,
              ]}
              onPress={handleSendComment}
              disabled={commentText.trim() === ''}
            >
              <Text style={styles.sendButtonText}>
                {commentText.trim() === '' ? '📤' : '✈️'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // Regular pin post layout
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết bài viết</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* User Info */}
        <View style={styles.userSection}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={handleUserPress}
          >
            <Avatar size={50} uri={post.user.avatar} />
            <View style={styles.userDetails}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{post.user.name}</Text>
                <BadgeIcon size="small" />
              </View>
              <TouchableOpacity onPress={handleLocationPress}>
                <Text style={styles.locationText}>
                  📍 {post.location.name}, {post.location.city}
                </Text>
              </TouchableOpacity>
              <Text style={styles.timestamp}>{post.timestamp}</Text>
            </View>
          </TouchableOpacity>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              post.status === 'visited'
                ? styles.visitedBadge
                : styles.wantToGoBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {post.status === 'visited' ? '✓ Đã đến' : '⭐ Muốn đến'}
            </Text>
          </View>
        </View>

        {/* Image Gallery */}
        {renderImageGallery()}

        {/* Post Details */}
        <View style={styles.detailsSection}>
          {/* Rating */}
          {post.status === 'visited' && post.rating && (
            <View style={styles.ratingSection}>
              <Text style={styles.sectionLabel}>Đánh giá</Text>
              <View style={styles.ratingRow}>
                {renderStars(post.rating)}
                <Text style={styles.ratingValue}>{post.rating}/5</Text>
              </View>
              {post.visitDate && (
                <Text style={styles.visitDate}>Đã đến: {post.visitDate}</Text>
              )}
            </View>
          )}

          {/* Caption */}
          {post.caption && (
            <View style={styles.captionSection}>
              <Text style={styles.caption}>
                <Text style={styles.captionUsername}>{post.user.name}</Text>{' '}
                {post.caption}
              </Text>
            </View>
          )}

          {/* Location Details */}
          {post.location && (
            <TouchableOpacity
              style={styles.locationSection}
              onPress={handleLocationPress}
            >
              <View style={styles.locationHeader}>
                <Text style={styles.locationIcon}>📍</Text>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{post.location.name}</Text>
                  <Text style={styles.locationCity}>
                    {post.location.city}, {post.location.country}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats & Actions */}
        <View style={styles.statsSection}>
          <Text style={styles.statsText}>
            {likes} lượt thích • {post.comments} bình luận
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={handleLike}
          >
            <Text style={styles.actionIconLarge}>{isLiked ? '❤️' : '🤍'}</Text>
            <Text style={[styles.actionTextLarge, isLiked && styles.actionTextActive]}>
              Thích
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={handleComment}
          >
            <Text style={styles.actionIconLarge}>💬</Text>
            <Text style={styles.actionTextLarge}>Bình luận</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButtonLarge}
            onPress={handleShare}
          >
            <Text style={styles.actionIconLarge}>📤</Text>
            <Text style={styles.actionTextLarge}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionLabel}>Bình luận ({comments.length})</Text>
          {comments.length > 0 ? (
            <View style={styles.commentsList}>
              {comments.map(comment => renderComment(comment))}
            </View>
          ) : (
            <View style={styles.emptyComments}>
              <Text style={styles.emptyCommentsIcon}>💬</Text>
              <Text style={styles.emptyCommentsText}>
                Chưa có bình luận nào
              </Text>
              <Text style={styles.emptyCommentsSubtext}>
                Hãy là người đầu tiên bình luận!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.commentInputContainer}>
          <Avatar size={36} uri={undefined} />
          <TextInput
            style={styles.commentInput}
            placeholder="Viết bình luận..."
            placeholderTextColor={colors.text.disabled}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              commentText.trim() === '' && styles.sendButtonDisabled,
            ]}
            onPress={handleSendComment}
            disabled={commentText.trim() === ''}
          >
            <Text style={styles.sendButtonText}>
              {commentText.trim() === '' ? '📤' : '✈️'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Image Viewer Modal */}
      {post.photos && post.photos.length > 0 && (
        <ImageViewerModal
          visible={imageViewerVisible}
          images={post.photos}
          initialIndex={selectedImageIndex}
          onClose={() => setImageViewerVisible(false)}
        />
      )}
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.main,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl + 20,
      paddingBottom: spacing.md,
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    backIcon: {
      fontSize: 28,
      color: colors.text.primary,
    },
    headerTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    scrollView: {
      flex: 1,
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      backgroundColor: colors.background.main,
    },
    errorText: {
      fontSize: typography.fontSize.lg,
      color: colors.text.secondary,
      marginBottom: spacing.lg,
    },
    errorButton: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      backgroundColor: colors.primary.main,
      borderRadius: borderRadius.md,
    },
    errorButtonText: {
      color: '#fff',
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
    },
    // User Section
    userSection: {
      backgroundColor: colors.background.card,
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    userDetails: {
      marginLeft: spacing.md,
      flex: 1,
    },
    userName: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    userNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    locationText: {
      fontSize: typography.fontSize.sm,
      color: colors.primary.main,
      marginTop: 4,
      fontWeight: typography.fontWeight.medium,
    },
    timestamp: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginTop: 4,
    },
    statusBadge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    visitedBadge: {
      backgroundColor: colors.status.success + '20',
    },
    wantToGoBadge: {
      backgroundColor: colors.accent.main + '20',
    },
    statusText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
    },
    // Image Gallery
    imageGalleryContainer: {
      position: 'relative',
    },
    imageScrollView: {
      backgroundColor: colors.background.elevated,
    },
    galleryImage: {
      width: SCREEN_WIDTH,
      height: 400,
    },
    imageCounterContainer: {
      position: 'absolute',
      top: spacing.md,
      right: spacing.md,
      zIndex: 10,
    },
    imageCounter: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    imageCounterText: {
      color: '#fff',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
    },
    paginationDots: {
      position: 'absolute',
      bottom: spacing.md,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.xs,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    activeDot: {
      backgroundColor: '#fff',
      width: 24,
    },
    // Details Section
    detailsSection: {
      backgroundColor: colors.background.card,
      padding: spacing.lg,
    },
    sectionLabel: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    ratingSection: {
      marginBottom: spacing.lg,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    starsContainer: {
      flexDirection: 'row',
      gap: 4,
    },
    star: {
      fontSize: 20,
    },
    ratingValue: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    visitDate: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginTop: spacing.sm,
    },
    captionSection: {
      marginBottom: spacing.lg,
    },
    caption: {
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      lineHeight: 24,
    },
    captionUsername: {
      fontWeight: typography.fontWeight.bold,
    },
    locationSection: {
      backgroundColor: colors.background.elevated,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginTop: spacing.md,
    },
    locationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationIcon: {
      fontSize: 24,
      marginRight: spacing.md,
    },
    locationInfo: {
      flex: 1,
    },
    locationName: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.text.primary,
    },
    locationCity: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      marginTop: 2,
    },
    chevron: {
      fontSize: 24,
      color: colors.text.secondary,
    },
    // Achievement
    achievementContent: {
      alignItems: 'center',
      paddingVertical: spacing.xl * 2,
      backgroundColor: colors.primary.main + '10',
      marginHorizontal: spacing.lg,
      marginVertical: spacing.lg,
      borderRadius: borderRadius.lg,
    },
    achievementBadge: {
      fontSize: 80,
      marginBottom: spacing.md,
    },
    achievementTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    achievementCount: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.primary.main,
    },
    // Stats & Actions
    statsSection: {
      backgroundColor: colors.background.card,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border.light,
    },
    statsText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
    },
    actionButtons: {
      backgroundColor: colors.background.card,
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    actionButtonLarge: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
    },
    actionIconLarge: {
      fontSize: 24,
    },
    actionTextLarge: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.semiBold,
    },
    actionTextActive: {
      color: colors.status.error,
    },
    // Comments Section
    commentsSection: {
      backgroundColor: colors.background.card,
      padding: spacing.lg,
      marginTop: spacing.sm,
      paddingBottom: spacing.xl * 2,
    },
    commentsList: {
      gap: spacing.md,
    },
    commentItem: {
      flexDirection: 'row',
      gap: spacing.sm,
      alignItems: 'flex-start',
    },
    commentContent: {
      flex: 1,
    },
    commentBubble: {
      backgroundColor: colors.background.elevated,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      borderTopLeftRadius: 4,
    },
    commentUserHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: 4,
    },
    commentUserName: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    commentText: {
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      lineHeight: 20,
    },
    commentActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginTop: spacing.xs,
      paddingLeft: spacing.sm,
    },
    commentTimestamp: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
    },
    commentLikeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    commentLikeIcon: {
      fontSize: 14,
    },
    commentLikeCount: {
      fontSize: typography.fontSize.xs,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
    },
    commentLikeCountActive: {
      color: colors.status.error,
    },
    replyButton: {
      paddingHorizontal: spacing.sm,
    },
    replyButtonText: {
      fontSize: typography.fontSize.xs,
      color: colors.primary.main,
      fontWeight: typography.fontWeight.semiBold,
    },
    // Replies
    repliesContainer: {
      marginTop: spacing.md,
      marginLeft: spacing.md,
      gap: spacing.md,
      borderLeftWidth: 2,
      borderLeftColor: colors.border.light,
      paddingLeft: spacing.md,
    },
    replyItem: {
      flexDirection: 'row',
      gap: spacing.xs,
      alignItems: 'flex-start',
    },
    replyContent: {
      flex: 1,
    },
    replyBubble: {
      backgroundColor: colors.background.main,
      padding: spacing.sm,
      borderRadius: borderRadius.md,
      borderTopLeftRadius: 4,
    },
    replyUserHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: 2,
    },
    replyUserName: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    replyText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.primary,
      lineHeight: 18,
    },
    replyActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: 4,
      paddingLeft: spacing.xs,
    },
    replyTimestamp: {
      fontSize: 11,
      color: colors.text.secondary,
    },
    replyLikeIcon: {
      fontSize: 12,
    },
    replyLikeCount: {
      fontSize: 11,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
    },
    emptyComments: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
    },
    emptyCommentsIcon: {
      fontSize: 48,
      marginBottom: spacing.md,
    },
    emptyCommentsText: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.semiBold,
    },
    emptyCommentsSubtext: {
      fontSize: typography.fontSize.sm,
      color: colors.text.disabled,
      marginTop: spacing.xs,
    },
    // Comment Input
    commentInputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      padding: spacing.md,
      backgroundColor: colors.background.card,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
      gap: spacing.sm,
    },
    replyingIndicator: {
      backgroundColor: colors.primary.main + '15',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
    },
    replyingContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    replyingText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    replyingUserName: {
      fontWeight: typography.fontWeight.bold,
      color: colors.primary.main,
    },
    cancelReplyButton: {
      fontSize: 20,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.bold,
      paddingHorizontal: spacing.sm,
    },
    commentInput: {
      flex: 1,
      backgroundColor: colors.background.elevated,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      maxHeight: 100,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary.main,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: colors.background.elevated,
      opacity: 0.5,
    },
    sendButtonText: {
      fontSize: 20,
    },
  });
