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
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { Rating } from 'react-native-ratings';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { usePin } from '../../contexts/PinContext';
import { Header } from '../../components/common/Header';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PinDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { deletePin, getPinById } = usePin();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const pinId = route.params?.pinId;
  const pin = getPinById(pinId);

  const [isDeleting, setIsDeleting] = useState(false);
  
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  if (!pin) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('pin.pinNotFound')}</Text>
        <Button title={t('pin.back')} onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate('AddPin', { pinId: pin.id });
  };

  const handleDelete = () => {
    Alert.alert(
      t('pin.deletePinTitle'),
      t('pin.deletePinMessage'),
      [
        { text: t('pin.cancel'), style: 'cancel' },
        {
          text: t('pin.delete'),
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              deletePin(pin.id);
              Alert.alert(t('pin.success'), t('pin.pinDeleted'), [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert(t('pin.error'), t('pin.deletePinError'));
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const statusConfig = {
    visited: {
      label: t('pin.visitedStatus'),
      icon: 'check',
      iconLibrary: 'MaterialCommunityIcons' as const,
      color: colors.status.visited,
    },
    wantToGo: {
      label: t('pin.wantToGoStatus'),
      icon: 'star',
      iconLibrary: 'FontAwesome' as const,
      color: colors.status.wantToGo,
    },
  };

  const currentStatus = statusConfig[pin.status];

  return (
    <View style={styles.container}>
      <Header
              title={t('pin.pinDetails')}
              showBackButton={true}
              onBackPress={() => navigation.goBack()}
              gradient={false}
              blur={false}
            />
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
            <MaterialCommunityIcons
              name="camera-outline"
              size={60}
              color={colors.text.secondary}
              style={{ marginBottom: spacing.sm }}
            />
            <Text style={styles.noImageLabel}>{t('pin.noImagesYet')}</Text>
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
                <View style={styles.statusRow}>
                  {currentStatus.iconLibrary === 'MaterialCommunityIcons' ? (
                    <MaterialCommunityIcons
                      name={currentStatus.icon as any}
                      size={16}
                      color={colors.neutral.white}
                    />
                  ) : (
                    <FontAwesome
                      name={currentStatus.icon as any}
                      size={16}
                      color={colors.neutral.white}
                    />
                  )}
                  <Text style={styles.statusText}>
                    {' '}{currentStatus.label}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEdit}
              >
                <MaterialCommunityIcons
                  name="pencil"
                  size={20}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
                disabled={isDeleting}
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={20}
                  color={colors.error}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Visit Info (for visited pins) */}
          {pin.status === 'visited' && (
            <View style={styles.infoSection}>
              {/* Date */}
              {pin.visitDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('pin.visitDateLabel')}</Text>
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
                  <Text style={styles.infoLabel}>{t('pin.ratingLabel')}</Text>
                  <View style={styles.ratingContainer}>
                    <Rating
                      type="star"
                      ratingCount={5}
                      imageSize={18}
                      startingValue={pin.rating}
                      readonly
                      style={styles.rating}
                      ratingBackgroundColor={colors.background.card}
                    />
                    <Text style={styles.ratingText}>
                      {pin.rating}/5
                    </Text>
                  </View>
                </View>
              )}

              {/* Location coordinates */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('pin.coordinatesLabel')}</Text>
                <Text style={styles.infoValue}>
                  {pin.latitude.toFixed(6)}, {pin.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          )}

          {/* Notes/Journal */}
          {pin.notes && pin.notes.trim() !== '' && (
            <View style={styles.journalSection}>
              <Text style={styles.journalLabel}>{t('pin.notesLabel')}</Text>
              <Text style={styles.journalText}>{pin.notes}</Text>
            </View>
          )}

          {/* Empty state for want to go */}
          {pin.status === 'wantToGo' && (
            <View style={styles.emptyState}>
              <FontAwesome
                name="star"
                size={60}
                color={colors.accent.main}
                style={{ marginBottom: spacing.md }}
              />
              <Text style={styles.emptyStateText}>
                {t('pin.dreamLocation')}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {t('pin.wantToGoMessage')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Button
          title={t('pin.edit')}
          onPress={handleEdit}
          variant="primary"
          style={styles.bottomButton}
        />
        <Button
          title={t('pin.delete')}
          onPress={handleDelete}
          variant="outline"
          loading={isDeleting}
          style={styles.bottomButton}
        />
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
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
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  deleteButton: {
    backgroundColor: colors.error + '15',
    borderColor: colors.error + '40',
  },
  infoSection: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.xs,
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
  rating: {
    backgroundColor: 'transparent',
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  journalSection: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
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
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
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
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.main,
    gap: spacing.md,
  },
  bottomButton: {
    flex: 1,
  },
});
