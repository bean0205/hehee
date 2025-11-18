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
  Dimensions,
  Vibration,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * 2) / 3;

export const AddPinScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addPin, updatePin, getPinById } = usePin();
  const { t } = useLanguage();
  const { colors, isDarkMode } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  const styles = React.useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);

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

  // Enhanced animation values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const headerScale = useRef(new Animated.Value(0.9)).current;
  const statusSlideX = useRef(new Animated.Value(status === 'visited' ? 0 : 1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
    
    bottomSheetRef.current?.expand();
  }, []);

  const handleStatusToggle = (newStatus: 'visited' | 'wantToGo') => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
    
    setStatus(newStatus);
    
    // Smooth slide animation for status toggle
    Animated.spring(statusSlideX, {
      toValue: newStatus === 'visited' ? 0 : 1,
      useNativeDriver: true,
      tension: 70,
      friction: 10,
    }).start();
    
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
      if (Platform.OS === 'ios') {
        Vibration.vibrate(10);
      }
    }
  };

  const removeImage = (index: number) => {
    Alert.alert(
      t('common.confirm'),
      t('pin.removeImageConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.remove'),
          style: 'destructive',
          onPress: () => {
            setImages(images.filter((_, i) => i !== index));
            if (Platform.OS === 'ios') {
              Vibration.vibrate(10);
            }
          },
        },
      ]
    );
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

  const getStatusColor = (statusType: 'visited' | 'wantToGo') => {
    return statusType === 'visited' ? colors.status.success : colors.accent.main;
  };

  return (
    <View style={styles.container}>
      {/* Animated backdrop with blur effect */}
      <Animated.View 
        style={[
          styles.backdrop,
          { opacity: backdropOpacity }
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => navigation.goBack()}
        />
      </Animated.View>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['92%']}
        enablePanDownToClose={true}
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
          contentContainerStyle={styles.scrollContent}
        >
          {/* Modern Header with Gradient Accent */}
          <Animated.View 
            style={[
              styles.header,
              { transform: [{ scale: headerScale }] }
            ]}
          >
            <LinearGradient
              colors={
                isEditMode 
                  ? [colors.accent.main + '15', colors.accent.main + '05']
                  : [colors.primary.main + '15', colors.primary.main + '05']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.headerContent}>
                <View style={[
                  styles.headerIconContainer,
                  { backgroundColor: isEditMode ? colors.accent.main : colors.primary.main }
                ]}>
                  <MaterialCommunityIcons
                    name={isEditMode ? 'pencil' : 'map-marker-plus'}
                    size={28}
                    color={colors.neutral.white}
                  />
                </View>
                <View style={styles.headerTextWrapper}>
                  <Text style={styles.headerTitle}>
                    {isEditMode ? t('pin.editPin') : t('pin.addPin')}
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    {isEditMode ? t('pin.updatePinInfo') : t('pin.createNewMemory')}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Section: Place Name with Icon */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBadge, { backgroundColor: colors.primary.main + '15' }]}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={18}
                  color={colors.primary.main}
                />
              </View>
              <Text style={styles.sectionTitle}>{t('pin.placeInfo')}</Text>
              <View style={styles.requiredPill}>
                <MaterialCommunityIcons name="asterisk" size={10} color={colors.error} />
                {/* <Text style={styles.requiredPillText}>{t('pin.required')}</Text> */}
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <Input
                placeholder={t('pin.placeNamePlaceholder')}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Section: Status with Sliding Toggle */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBadge, { backgroundColor: colors.accent.main + '15' }]}>
                <MaterialCommunityIcons
                  name="flag-variant"
                  size={18}
                  color={colors.accent.main}
                />
              </View>
              <Text style={styles.sectionTitle}>{t('pin.status')}</Text>
              <View style={styles.requiredPill}>
                <MaterialCommunityIcons name="asterisk" size={10} color={colors.error} />
                {/* <Text style={styles.requiredPillText}>{t('pin.required')}</Text> */}
              </View>
            </View>

            {/* Modern Toggle Switch Design */}
            <View style={styles.statusToggleContainer}>
              <View style={styles.statusTrack}>
                <Animated.View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor: getStatusColor(status),
                      transform: [
                        {
                          translateX: statusSlideX.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, (SCREEN_WIDTH - spacing.lg * 2) / 2],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                
                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusToggle('visited')}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color={status === 'visited' ? colors.neutral.white : colors.text.secondary}
                  />
                  <Text style={[
                    styles.statusOptionText,
                    status === 'visited' && styles.statusOptionTextActive
                  ]}>
                    {t('pin.visited')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusToggle('wantToGo')}
                  activeOpacity={0.8}
                >
                  <FontAwesome
                    name="heart"
                    size={22}
                    color={status === 'wantToGo' ? colors.neutral.white : colors.text.secondary}
                  />
                  <Text style={[
                    styles.statusOptionText,
                    status === 'wantToGo' && styles.statusOptionTextActive
                  ]}>
                    {t('pin.wantToGo')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Section: Visit Details with Animation */}
          {status === 'visited' && (
            <Animated.View 
              style={[
                styles.section,
                {
                  opacity: statusSlideX.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0.5, 0],
                  }),
                }
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionIconBadge, { backgroundColor: colors.status.success + '15' }]}>
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={18}
                    color={colors.status.success}
                  />
                </View>
                <Text style={styles.sectionTitle}>{t('pin.dateAndRating')}</Text>
              </View>

              {/* Date Picker Card */}
              <View style={styles.cardContainer}>
                <Text style={styles.cardLabel}>{t('pin.visitDate')}</Text>
                <TouchableOpacity
                  style={styles.dateCard}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dateIconWrapper}>
                    <MaterialCommunityIcons
                      name="calendar-month"
                      size={24}
                      color={colors.primary.main}
                    />
                  </View>
                  <View style={styles.dateTextContainer}>
                    <Text style={styles.dateValue}>
                      {visitDate.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Text>
                    <Text style={styles.dateDayName}>
                      {visitDate.toLocaleDateString('vi-VN', { weekday: 'long' })}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={24}
                    color={colors.text.disabled}
                  />
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

              {/* Rating Card */}
              <View style={styles.cardContainer}>
                <Text style={styles.cardLabel}>{t('pin.rating')}</Text>
                <View style={styles.ratingCard}>
                  <Rating
                    type="custom"
                    ratingCount={5}
                    imageSize={44}
                    startingValue={rating}
                    onFinishRating={(value) => {
                      setRating(value);
                      if (Platform.OS === 'ios') {
                        Vibration.vibrate(10);
                      }
                    }}
                    style={styles.ratingStars}
                    readonly={false}
                    tintColor={colors.background.card}
                    ratingColor={colors.accent.main}
                    ratingBackgroundColor={colors.border.light}
                  />
                  {rating > 0 && (
                    <View style={styles.ratingValueContainer}>
                      <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
                      <View style={styles.ratingMaxContainer}>
                        <Text style={styles.ratingMaxText}>/ 5.0</Text>
                        <View style={styles.ratingQualityBadge}>
                          <Text style={styles.ratingQualityText}>
                            {rating >= 4.5 ? 'Excellent' : rating >= 3.5 ? 'Great' : rating >= 2.5 ? 'Good' : 'Fair'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          )}

          {/* Section: Notes */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBadge, { backgroundColor: colors.text.secondary + '15' }]}>
                <MaterialCommunityIcons
                  name="text"
                  size={18}
                  color={colors.text.secondary}
                />
              </View>
              <Text style={styles.sectionTitle}>{t('pin.notes')}</Text>
              <View style={styles.optionalBadge}>
                <Text style={styles.optionalBadgeText}>Optional</Text>
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <Input
                placeholder={t('pin.notesPlaceholder')}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Section: Photos Gallery */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBadge, { backgroundColor: colors.primary.main + '15' }]}>
                <MaterialCommunityIcons
                  name="image-multiple"
                  size={18}
                  color={colors.primary.main}
                />
              </View>
              <Text style={styles.sectionTitle}>{t('pin.images')}</Text>
              <View style={styles.imageCountBadge}>
                <MaterialCommunityIcons 
                  name="camera" 
                  size={12} 
                  color={colors.primary.main} 
                />
                <Text style={styles.imageCountText}>{images.length} / 5</Text>
              </View>
            </View>

            <View style={styles.imageGallery}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageItem}>
                  <Image source={{ uri }} style={styles.imageThumb} />
                  
                  {/* Image overlay with gradient */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.imageOverlay}
                  >
                    <View style={styles.imageIndexBadge}>
                      <Text style={styles.imageIndexText}>{index + 1}</Text>
                    </View>
                  </LinearGradient>
                  
                  {/* Remove button */}
                  <TouchableOpacity
                    style={styles.imageDeleteButton}
                    onPress={() => removeImage(index)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.imageDeleteCircle}>
                      <MaterialCommunityIcons
                        name="close"
                        size={16}
                        color={colors.neutral.white}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Add Photo Button */}
              {images.length < 5 && (
                <TouchableOpacity
                  style={styles.imageAddCard}
                  onPress={pickImage}
                  activeOpacity={0.7}
                >
                  <View style={styles.imageAddIconWrapper}>
                    <MaterialCommunityIcons
                      name="camera-plus"
                      size={32}
                      color={colors.primary.main}
                    />
                  </View>
                  <Text style={styles.imageAddLabel}>Add Photo</Text>
                  <Text style={styles.imageAddHint}>Tap to upload</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Empty State */}
            {images.length === 0 && (
              <View style={styles.emptyImageState}>
                <View style={styles.emptyImageIconCircle}>
                  <MaterialCommunityIcons
                    name="image-outline"
                    size={40}
                    color={colors.text.disabled}
                  />
                </View>
                <Text style={styles.emptyImageTitle}>No photos yet</Text>
                <Text style={styles.emptyImageSubtitle}>
                  {t('pin.addImagesToShare')}
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Spacer for Fixed Buttons */}
          <View style={{ height: 140 }} />
        </BottomSheetScrollView>

        {/* Fixed Action Bar */}
        <View style={styles.actionBar}>
          <LinearGradient
            colors={[
              colors.background.main + '00',
              colors.background.main,
              colors.background.main,
            ]}
            style={styles.actionBarGradient}
          >
            <View style={styles.actionButtonsContainer}>
              <Button
                title={isEditMode ? t('pin.update') : t('pin.savePin')}
                onPress={handleSave}
                loading={isLoading}
                fullWidth
              />
              <TouchableOpacity
                style={styles.cancelLink}
                onPress={() => navigation.goBack()}
                activeOpacity={0.6}
              >
                <Text style={styles.cancelLinkText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </BottomSheet>
    </View>
  );
};

const createStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.neutral.black + (isDarkMode ? 'DD' : 'BB'),
  },
  bottomSheet: {
    backgroundColor: colors.background.main,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: colors.text.disabled,
    width: 40,
    height: 5,
    borderRadius: 3,
    marginTop: 10,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },

  // Modern Header with Gradient
  header: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTextWrapper: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    letterSpacing: -0.2,
    lineHeight: 18,
  },

  // Section Styles
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  sectionTitle: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  requiredPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  requiredPillText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  optionalBadge: {
    backgroundColor: colors.text.disabled + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  optionalBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.disabled,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
  },

  // Input Wrapper
  inputWrapper: {
    marginTop: spacing.xs,
  },

  // Modern Toggle Switch
  statusToggleContainer: {
    marginTop: spacing.sm,
  },
  statusTrack: {
    flexDirection: 'row',
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.xl,
    padding: 4,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: colors.border.main,
  },
  statusIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: (SCREEN_WIDTH - spacing.lg * 2 - 8) / 2,
    height: 56,
    borderRadius: borderRadius.lg,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
    zIndex: 1,
  },
  statusOptionText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.secondary,
    letterSpacing: -0.3,
  },
  statusOptionTextActive: {
    color: colors.neutral.white,
  },

  // Card Container
  cardContainer: {
    marginTop: spacing.md,
  },
  cardLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },

  // Date Card
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.border.main,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.15 : 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  dateIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary.main + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateTextContainer: {
    flex: 1,
  },
  dateValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  dateDayName: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },

  // Rating Card
  ratingCard: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.border.main,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.15 : 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  ratingStars: {
    paddingVertical: spacing.sm,
  },
  ratingValueContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: typography.fontWeight.bold,
    color: colors.accent.main,
    letterSpacing: -2,
    lineHeight: 52,
  },
  ratingMaxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  ratingMaxText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  ratingQualityBadge: {
    backgroundColor: colors.accent.main + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  ratingQualityText: {
    fontSize: typography.fontSize.xs,
    color: colors.accent.main,
    fontWeight: typography.fontWeight.bold,
    textTransform: 'uppercase',
  },

  // Image Gallery
  imageCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.main + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  imageCountText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.bold,
  },
  imageGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  imageItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    position: 'relative',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  imageThumb: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.elevated,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    justifyContent: 'flex-end',
    padding: spacing.sm,
  },
  imageIndexBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neutral.black + 'CC',
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderWidth: 2,
    borderColor: colors.neutral.white + '40',
  },
  imageIndexText: {
    color: colors.neutral.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  imageDeleteButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  imageDeleteCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  imageAddCard: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border.main,
    borderStyle: 'dashed',
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  imageAddIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.main + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageAddLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semiBold,
  },
  imageAddHint: {
    fontSize: typography.fontSize.xs,
    color: colors.text.disabled,
  },

  // Empty State
  emptyImageState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 1.5,
    paddingHorizontal: spacing.lg,
  },
  emptyImageIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  emptyImageTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  emptyImageSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.disabled,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Fixed Action Bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionBarGradient: {
    paddingTop: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  actionButtonsContainer: {
    gap: spacing.sm,
  },
  cancelLink: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelLinkText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.semiBold,
  },
});