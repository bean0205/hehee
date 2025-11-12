import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Rating } from 'react-native-ratings';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { usePin } from '../../contexts/PinContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const AddPinScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addPin, updatePin, getPinById } = usePin();
  const { t } = useLanguage();
  const { colors, isDarkMode } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  // Edit mode
  const editPinId = route.params?.pinId;
  const existingPin = editPinId ? getPinById(editPinId) : null;
  const isEditMode = !!existingPin;

  // Form state
  const [name, setName] = useState(existingPin?.name || route.params?.placeName || '');
  const [status, setStatus] = useState<'visited' | 'wantToGo'>(
    existingPin?.status || 'visited'
  );
  const [visitDate, setVisitDate] = useState(
    existingPin?.visitDate ? new Date(existingPin.visitDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rating, setRating] = useState(existingPin?.rating || 0);
  const [notes, setNotes] = useState(existingPin?.notes || '');
  const [images, setImages] = useState<string[]>(existingPin?.images || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleStatusToggle = (newStatus: 'visited' | 'wantToGo') => {
    setStatus(newStatus);
    if (newStatus === 'wantToGo') {
      setRating(0);
      setVisitDate(new Date());
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setVisitDate(selectedDate);
    }
  };

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert(t('pin.imageLimit'), t('pin.maxImages'));
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('permissions.title'), t('permissions.photos'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('errors.error'), t('validation.nameRequired'));
      return;
    }

    setIsLoading(true);
    try {
      const pinData = {
        name: name.trim(),
        latitude: route.params?.latitude || existingPin?.latitude || 21.0285,
        longitude: route.params?.longitude || existingPin?.longitude || 105.8542,
        status,
        rating: status === 'visited' ? rating : undefined,
        visitDate: status === 'visited' ? visitDate.toISOString() : undefined,
        notes: notes.trim(),
        images,
      };

      if (isEditMode && editPinId) {
        updatePin(editPinId, pinData);
        Alert.alert(t('common.success'), t('pin.pinUpdated'), [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        addPin(pinData);
      Alert.alert(t('common.success'), t('pin.pinAdded'), [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      }
    } catch (error) {
      Alert.alert(t('errors.error'), t('errors.saveFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => navigation.goBack()}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['88%']}
        enablePanDownToClose={true}
        // enableContentPanningGesture={false}
        animateOnMount={true}
        onClose={() => navigation.goBack()}
        backgroundStyle={styles.bottomSheet}
        handleIndicatorStyle={styles.handleIndicator}
        topInset={0}
        enableDynamicSizing={false}
       
      >
        <BottomSheetScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Modern Header with Gradient */}
          <LinearGradient
            colors={isEditMode 
              ? [colors.accent.main + '20', colors.accent.main + '05'] 
              : [colors.primary.main + '20', colors.primary.main + '05']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View style={[
                styles.headerIconContainer,
                { backgroundColor: isEditMode ? colors.accent.main + '20' : colors.primary.main + '20' }
              ]}>
                <MaterialCommunityIcons
                  name={isEditMode ? 'pencil' : 'map-marker'}
                  size={32}
                  color={isEditMode ? colors.accent.main : colors.primary.main}
                />
              </View>
              <Text style={styles.title}>
                {isEditMode ? t('pin.editPin') : t('pin.addPin')}
              </Text>
              <Text style={styles.subtitle}>
                {isEditMode ? t('pin.updatePinInfo') : t('pin.createNewMemory')}
              </Text>
            </View>
          </LinearGradient>

          {/* Place Name Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrapper, { backgroundColor: colors.primary.main + '15' }]}>
                <MaterialCommunityIcons
                  name="tag"
                  size={24}
                  color={colors.primary.main}
                />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{t('pin.placeInfo')}</Text>
                <Text style={styles.cardDescription}>{t('pin.nameAndLocation')}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <Input
                label={t('pin.placeName')}
                placeholder={t('pin.placeNamePlaceholder')}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Status Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrapper, { backgroundColor: colors.accent.main + '15' }]}>
                <MaterialCommunityIcons
                  name="star-outline"
                  size={24}
                  color={colors.accent.main}
                />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{t('pin.status')}</Text>
                <Text style={styles.cardDescription}>{t('pin.chooseYourStatus')}</Text>
              </View>
              <View style={styles.requiredBadge}>
                <Text style={styles.requiredText}>{t('pin.required')}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.statusToggle}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'visited' && styles.statusButtonVisited,
                ]}
                onPress={() => handleStatusToggle('visited')}
                activeOpacity={0.7}
              >
                <View style={styles.statusButtonContent}>
                  <View style={[
                    styles.statusIcon,
                    status === 'visited' && styles.statusIconActive
                  ]}>
                    <MaterialCommunityIcons
                      name="check"
                      size={24}
                      color={status === 'visited' ? colors.neutral.white : colors.text.secondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.statusButtonText,
                      status === 'visited' && styles.statusButtonTextActive,
                    ]}
                  >
                    {t('pin.visited')}
                  </Text>
                  <Text
                    style={[
                      styles.statusButtonSubtext,
                      status === 'visited' && styles.statusButtonSubtextActive,
                    ]}
                  >
                    Đã đến
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'wantToGo' && styles.statusButtonWantToGo,
                ]}
                onPress={() => handleStatusToggle('wantToGo')}
                activeOpacity={0.7}
              >
                <View style={styles.statusButtonContent}>
                  <View style={[
                    styles.statusIcon,
                    status === 'wantToGo' && styles.statusIconActive
                  ]}>
                    <FontAwesome
                      name="star"
                      size={24}
                      color={status === 'wantToGo' ? colors.neutral.white : colors.text.secondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.statusButtonText,
                      status === 'wantToGo' && styles.statusButtonTextActive,
                    ]}
                  >
                    {t('pin.wantToGo')}
                  </Text>
                  <Text
                    style={[
                      styles.statusButtonSubtext,
                      status === 'wantToGo' && styles.statusButtonSubtextActive,
                    ]}
                  >
                    Muốn đến
                  </Text>
                </View>
              </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Visited Fields */}
          {status === 'visited' && (
            <>
              {/* Date & Rating Card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconWrapper, { backgroundColor: colors.status.success + '15' }]}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={24}
                      color={colors.status.success}
                    />
                  </View>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>{t('pin.dateAndRating')}</Text>
                    <Text style={styles.cardDescription}>{t('pin.timeAndExperience')}</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                
                {/* Date Picker */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('pin.visitDate')}</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dateButtonContent}>
                      <Text style={styles.dateButtonIcon}>📅</Text>
                      <Text style={styles.dateButtonText}>
                        {visitDate.toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                      <Text style={styles.dateButtonChevron}>›</Text>
                    </View>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={visitDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </View>

                {/* Star Rating */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('pin.rating')}</Text>
                  <View style={styles.ratingContainer}>
                    <Rating
                      type="star"
                      ratingCount={5}
                      imageSize={44}
                      startingValue={rating}
                      onFinishRating={setRating}
                      style={styles.rating}
                      readonly={false}
                      ratingBackgroundColor={colors.background.card}
                    />
                  </View>
                  <Text style={styles.ratingText}>
                    {rating > 0 ? (
                      <>
                        <Text style={styles.ratingValue}>{rating}</Text>
                        <Text style={styles.ratingMax}>/5 {t('pin.stars')}</Text>
                      </>
                    ) : (
                      <Text style={styles.ratingEmpty}>{t('pin.tapToRate')}</Text>
                    )}
                  </Text>
                </View>
                </View>
              </View>
            </>
          )}

          {/* Notes Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrapper, { backgroundColor: colors.text.secondary + '15' }]}>
                <MaterialCommunityIcons
                  name="note-text-outline"
                  size={24}
                  color={colors.text.secondary}
                />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{t('pin.notes')}</Text>
                <Text style={styles.cardDescription}>{t('pin.notesAndFeelings')}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <Input
                placeholder={t('pin.notesPlaceholder')}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={5}
              />
            </View>
          </View>

          {/* Image Uploader Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrapper, { backgroundColor: colors.primary.main + '15' }]}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={24}
                  color={colors.primary.main}
                />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{t('pin.images')}</Text>
                <Text style={styles.cardDescription}>{t('pin.maxImages')}</Text>
              </View>
              <View style={styles.imageBadge}>
                <Text style={styles.imageBadgeText}>{images.length}/5</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <ScrollView 
              horizontal 
              style={styles.imageScroll}
              showsHorizontalScrollIndicator={false}
            >
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.imageThumb} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={16}
                      color={colors.neutral.white}
                    />
                  </TouchableOpacity>
                  <View style={styles.imageNumber}>
                    <Text style={styles.imageNumberText}>{index + 1}</Text>
                  </View>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={pickImage}
                  activeOpacity={0.7}
                >
                  <View style={styles.addImageContent}>
                    <MaterialCommunityIcons
                      name="camera-plus"
                      size={24}
                      color={colors.primary.main}
                    />
                    <Text style={styles.addImageText}>{t('pin.addPhotos')}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </ScrollView>
              {images.length === 0 && (
                <View style={styles.emptyImageState}>
                  <Text style={styles.emptyImageText}>
                    {t('pin.addImagesToShare')}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <Button
              title={isEditMode ? t('pin.update') : t('pin.savePin')}
              onPress={handleSave}
              loading={isLoading}
              fullWidth
            />
            <Button
              title={t('common.cancel')}
              onPress={() => navigation.goBack()}
              variant="outline"
              fullWidth
              style={{ marginTop: spacing.md }}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.neutral.black + '90',
  },
  bottomSheet: {
    backgroundColor: colors.background.main,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: colors.text.disabled,
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  content: {
    paddingBottom: spacing.lg,
  },
  
  // Modern Header with Gradient
  headerGradient: {
    marginHorizontal: -spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 20,
  },
  
  // Modern Card Styles
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius['2xl'],
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light + '50',
  },
  cardIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    marginTop: 1,
  },
  cardContent: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  requiredBadge: {
    backgroundColor: colors.error + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  requiredText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  
  // Modern Status Toggle
  statusToggle: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statusButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.elevated,
    borderWidth: 2.5,
    borderColor: colors.border.main,
    alignItems: 'center',
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusButtonVisited: {
    backgroundColor: colors.status.success + '12',
    borderColor: colors.status.success,
    shadowColor: colors.status.success,
    shadowOpacity: 0.2,
  },
  statusButtonWantToGo: {
    backgroundColor: colors.accent.main + '12',
    borderColor: colors.accent.main,
    shadowColor: colors.accent.main,
    shadowOpacity: 0.2,
  },
  statusButtonContent: {
    alignItems: 'center',
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  statusIconActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  statusIconText: {
    fontSize: 24,
  },
  statusButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  statusButtonTextActive: {
    color: colors.primary.main,
  },
  statusButtonSubtext: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  statusButtonSubtextActive: {
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semiBold,
  },
  
  // Input Group
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  
  // Modern Date Button
  dateButton: {
    backgroundColor: colors.background.elevated,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.border.main,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  dateButtonIcon: {
    fontSize: 24,
  },
  dateButtonText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semiBold,
    letterSpacing: -0.2,
  },
  dateButtonChevron: {
    fontSize: 28,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.regular,
  },
  
  // Modern Rating
  ratingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.elevated + '80',
    borderRadius: borderRadius.xl,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  rating: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
  },
  ratingText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  ratingValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.accent.main,
    letterSpacing: -0.5,
  },
  ratingMax: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  ratingEmpty: {
    fontSize: typography.fontSize.base,
    color: colors.text.disabled,
    fontStyle: 'italic',
  },
  
  // Modern Images
  imageBadge: {
    backgroundColor: colors.primary.main + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary.main + '40',
  },
  imageBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  imageScroll: {
    marginTop: spacing.md,
  },
  imageContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  imageThumb: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.elevated,
    borderWidth: 1.5,
    borderColor: colors.border.light,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.background.card,
  },
  removeImageText: {
    color: colors.neutral.white,
    fontSize: 18,
    fontWeight: typography.fontWeight.bold,
  },
  imageNumber: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: colors.neutral.black + 'DD',
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: 2,
    borderColor: colors.neutral.white + '40',
  },
  imageNumberText: {
    color: colors.neutral.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border.main,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.elevated,
  },
  addImageContent: {
    alignItems: 'center',
  },
  addImageIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  addImageText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.semiBold,
  },
  emptyImageState: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  emptyImageText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.disabled,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  buttonContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
});
