import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { Rating } from 'react-native-ratings';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { usePin } from '../../contexts/PinContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PinDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { deletePin, getPinById } = usePin();

  const pinId = route.params?.pinId;
  const pin = getPinById(pinId);

  const [isDeleting, setIsDeleting] = useState(false);

  if (!pin) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy ghim</Text>
        <Button title="Quay lại" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate('AddPin', { pinId: pin.id });
  };

  const handleDelete = () => {
    Alert.alert(
      'Xóa ghim',
      'Bạn có chắc chắn muốn xóa ghim này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              deletePin(pin.id);
              Alert.alert('Thành công', 'Đã xóa ghim', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa ghim');
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const statusConfig = {
    visited: {
      label: 'Đã đến',
      icon: '✓',
      color: colors.status.visited,
    },
    wantToGo: {
      label: 'Muốn đến',
      icon: '⭐',
      color: colors.status.wantToGo,
    },
  };

  const currentStatus = statusConfig[pin.status];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Image Gallery */}
        {pin.images && pin.images.length > 0 ? (
          <View style={styles.galleryContainer}>
            <Swiper
              style={styles.swiper}
              showsButtons={false}
              loop={false}
              dotColor={colors.neutral.gray400}
              activeDotColor={colors.primary.main}
              paginationStyle={styles.pagination}
            >
              {pin.images.map((uri: string, index: number) => (
                <View key={index} style={styles.slide}>
                  <Image source={{ uri }} style={styles.galleryImage} />
                </View>
              ))}
            </Swiper>
          </View>
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>📷</Text>
            <Text style={styles.noImageLabel}>Chưa có hình ảnh</Text>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Header with Edit/Delete */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{pin.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: currentStatus.color },
                ]}
              >
                <Text style={styles.statusText}>
                  {currentStatus.icon} {currentStatus.label}
                </Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEdit}
              >
                <Text style={styles.actionIcon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
                disabled={isDeleting}
              >
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Visit Info (for visited pins) */}
          {pin.status === 'visited' && (
            <View style={styles.infoSection}>
              {/* Date */}
              {pin.visitDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>📅 Ngày đi</Text>
                  <Text style={styles.infoValue}>
                    {new Date(pin.visitDate).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              )}

              {/* Rating */}
              {pin.rating !== undefined && pin.rating > 0 && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>⭐ Đánh giá</Text>
                  <View style={styles.ratingContainer}>
                    <Rating
                      type="star"
                      ratingCount={5}
                      imageSize={20}
                      startingValue={pin.rating}
                      readonly
                      tintColor={colors.neutral.gray50}
                    />
                    <Text style={styles.ratingText}>
                      {pin.rating}/5
                    </Text>
                  </View>
                </View>
              )}

              {/* Location coordinates */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>📍 Tọa độ</Text>
                <Text style={styles.infoValue}>
                  {pin.latitude.toFixed(6)}, {pin.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          )}

          {/* Notes/Journal */}
          {pin.notes && pin.notes.trim() !== '' && (
            <View style={styles.journalSection}>
              <Text style={styles.journalLabel}>📝 Ghi chú</Text>
              <Text style={styles.journalText}>{pin.notes}</Text>
            </View>
          )}

          {/* Empty state for want to go */}
          {pin.status === 'wantToGo' && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🌟</Text>
              <Text style={styles.emptyStateText}>
                Địa điểm trong danh sách mơ ước của bạn
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Khi bạn đến đây, hãy đánh dấu "Đã đến" và thêm ảnh cùng đánh giá!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Button
          title="Chỉnh sửa"
          onPress={handleEdit}
          variant="primary"
          style={styles.bottomButton}
        />
        <Button
          title="Xóa"
          onPress={handleDelete}
          variant="outline"
          loading={isDeleting}
          style={styles.bottomButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  galleryContainer: {
    width: SCREEN_WIDTH,
    height: 300,
    backgroundColor: colors.neutral.black,
  },
  swiper: {
    height: 300,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryImage: {
    width: SCREEN_WIDTH,
    height: 300,
    resizeMode: 'cover',
  },
  pagination: {
    bottom: 10,
  },
  noImageContainer: {
    width: SCREEN_WIDTH,
    height: 200,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 60,
    marginBottom: spacing.sm,
  },
  noImageLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  content: {
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.neutral.white,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: colors.error + '20',
  },
  actionIcon: {
    fontSize: 20,
  },
  infoSection: {
    backgroundColor: colors.neutral.gray50,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray200,
  },
  infoLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  infoValue: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  journalSection: {
    marginBottom: spacing.lg,
  },
  journalLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  journalText: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.fontSize.base * 1.6,
    color: colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: spacing.md,
  },
  emptyStateText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.gray200,
    gap: spacing.md,
  },
  bottomButton: {
    flex: 1,
  },
});
