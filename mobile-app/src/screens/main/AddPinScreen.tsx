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
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Rating } from 'react-native-ratings';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';
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
  const bottomSheetRef = useRef<BottomSheet>(null);

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
      Alert.alert(t('errors.imageLimit'), t('errors.maxImages'));
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
        Alert.alert(t('pin.success'), t('pin.pinUpdated'), [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        addPin(pinData);
        Alert.alert(t('pin.success'), t('pin.pinAdded'), [
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
        snapPoints={['80%']}
        enablePanDownToClose
        onClose={() => navigation.goBack()}
        backgroundStyle={styles.bottomSheet}
      >
        <BottomSheetScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditMode ? t('pin.editPin') : t('pin.addPin')}
            </Text>
          </View>

          {/* Place Name */}
          <Input
            label={t('pin.placeName')}
            placeholder={t('pin.placeNamePlaceholder')}
            value={name}
            onChangeText={setName}
          />

          {/* Status Toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('pin.status')} *</Text>
            <View style={styles.statusToggle}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'visited' && styles.statusButtonActive,
                ]}
                onPress={() => handleStatusToggle('visited')}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    status === 'visited' && styles.statusButtonTextActive,
                  ]}
                >
                  ✓ {t('pin.visited')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'wantToGo' && styles.statusButtonActive,
                ]}
                onPress={() => handleStatusToggle('wantToGo')}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    status === 'wantToGo' && styles.statusButtonTextActive,
                  ]}
                >
                  ⭐ {t('pin.wantToGo')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Visited Fields */}
          {status === 'visited' && (
            <>
              {/* Date Picker */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>{t('pin.visitDate')}</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateButtonText}>
                    📅 {visitDate.toLocaleDateString('vi-VN')}
                  </Text>
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
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>{t('pin.rating')}</Text>
                <Rating
                  type="star"
                  ratingCount={5}
                  imageSize={40}
                  startingValue={rating}
                  onFinishRating={setRating}
                  style={styles.rating}
                  tintColor={colors.neutral.white}
                />
                <Text style={styles.ratingText}>
                  {rating > 0 ? `${rating}/5 ${t('pin.stars')}` : t('pin.noRating')}
                </Text>
              </View>
            </>
          )}

          {/* Notes */}
          <Input
            label={t('pin.notes')}
            placeholder={t('pin.notesPlaceholder')}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={5}
          />

          {/* Image Uploader */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {t('pin.images')} ({images.length}/5)
            </Text>
            <ScrollView horizontal style={styles.imageScroll}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.imageThumb} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={pickImage}
                >
                  <Text style={styles.addImageText}>+</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  content: {
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  statusToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.dark,
  },
  statusButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  statusButtonTextActive: {
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semiBold,
  },
  dateButton: {
    backgroundColor: colors.neutral.gray50,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
  },
  dateButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  rating: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  imageScroll: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  imageThumb: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: typography.fontWeight.bold,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.gray50,
  },
  addImageText: {
    fontSize: 40,
    color: colors.neutral.gray400,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
