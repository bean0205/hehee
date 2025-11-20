import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  Modal,
  Share,
  Platform,
  Vibration,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { Rating } from "react-native-ratings";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { typography } from "../../theme/typography";
import { spacing, borderRadius } from "../../theme/spacing";
import { Button } from "../../components/common/Button";
import { usePin } from "../../contexts/PinContext";
import { Header } from "../../components/common/Header";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const PinDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { deletePin, getPinById } = usePin();
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();

  const pinId = route.params?.pinId;
  const pin = getPinById(pinId);

  const [isDeleting, setIsDeleting] = useState(false);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Animations
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  const styles = React.useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);

  React.useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!pin) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("pin.pinNotFound")}</Text>
        <Button title={t("pin.back")} onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleShare = async () => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
    try {
      await Share.share({
        message: `Check out my pin: ${pin.placeName}!\n${pin.notes || ''}`,
        title: pin.placeName,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleImagePress = (index: number) => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
    setSelectedImageIndex(index);
    setLightboxVisible(true);
  };

  const handleEdit = () => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
    navigation.navigate("AddPin", { pinId: pin.id });
  };

  const handleDelete = () => {
    Alert.alert(t("pin.deletePinTitle"), t("pin.deletePinMessage"), [
      { text: t("pin.cancel"), style: "cancel" },
      {
        text: t("pin.delete"),
        style: "destructive",
        onPress: async () => {
          setIsDeleting(true);
          try {
            deletePin(pin.id);
            Alert.alert(t("pin.success"), t("pin.pinDeleted"), [
              {
                text: "OK",
                onPress: () => navigation.goBack(),
              },
            ]);
          } catch (error) {
            Alert.alert(t("pin.error"), t("pin.deletePinError"));
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  const statusConfig = {
    visited: {
      label: t("pin.visitedStatus"),
      icon: "check",
      iconLibrary: "MaterialCommunityIcons" as const,
      color: colors.status.visited,
    },
    wantToGo: {
      label: t("pin.wantToGoStatus"),
      icon: "star",
      iconLibrary: "FontAwesome" as const,
      color: colors.status.wantToGo,
    },
    active: {
      label: t("pin.activeStatus"),
      icon: "map-marker",
      iconLibrary: "MaterialCommunityIcons" as const,
      color: colors.status.active,
    },
  };

  const currentStatus = statusConfig[pin.status];

  return (
    <View style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <Header
          title={pin.placeName}
          subtitle={currentStatus.label}
          showBackButton
          onBackPress={() => navigation.goBack()}
          centerTitle
          actions={[
            {
              icon: 'share-variant',
              onPress: handleShare,
            },
            {
              icon: 'heart-outline',
              onPress: () => console.log('Add to favorites'),
            },
          ]}
          elevation={2}
        />
        <Animated.ScrollView
          style={styles.scrollView}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Enhanced Image Gallery */}
          {pin.images && pin.images.length > 0 ? (
            <Animated.View
              style={[
                styles.galleryContainer,
                {
                  transform: [
                    {
                      scale: scaleAnim,
                    },
                  ],
                },
              ]}
            >
              <Swiper
                style={styles.swiper}
                showsButtons={false}
                loop={false}
                dotColor={colors.neutral.gray400}
                activeDotColor={colors.primary.main}
                paginationStyle={styles.pagination}
              >
                {pin.images.map((uri: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.slide}
                    onPress={() => handleImagePress(index)}
                    activeOpacity={0.9}
                  >
                    <Image source={{ uri }} style={styles.galleryImage} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.6)']}
                      style={styles.imageGradient}
                    >
                      <View style={styles.imageCounter}>
                        <MaterialCommunityIcons
                          name="image-multiple"
                          size={16}
                          color={colors.neutral.white}
                        />
                        <Text style={styles.imageCounterText}>
                          {index + 1} / {pin.images.length}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </Swiper>
            </Animated.View>
          ) : (
            <LinearGradient
              colors={[colors.background.elevated, colors.background.card]}
              style={styles.noImageContainer}
            >
              <View style={styles.noImageIconCircle}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={60}
                  color={colors.text.disabled}
                />
              </View>
              <Text style={styles.noImageLabel}>{t("pin.noImagesYet")}</Text>
            </LinearGradient>
          )}

        {/* Content */}
        <View style={styles.content}>
          {/* Header with Edit/Delete */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{pin.placeName}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: currentStatus.color },
                ]}
              >
                <View style={styles.statusRow}>
                  {currentStatus.iconLibrary === "MaterialCommunityIcons" ? (
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
                  <Text style={styles.statusText}> {currentStatus.label}</Text>
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
          {pin.status === "visited" && (
            <View style={styles.infoSection}>
              {/* Date */}
              {pin.visitedDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    {t("pin.visitDateLabel")}
                  </Text>
                  <Text style={styles.infoValue}>
                    {new Date(pin.visitedDate).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              )}

              {/* Rating */}
              {typeof pin.rating === "number" && pin.rating > 0 && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t("pin.ratingLabel")}</Text>
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
                    <Text style={styles.ratingText}>{pin.rating}/5</Text>
                  </View>
                </View>
              )}

              {/* Location coordinates */}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  {t("pin.coordinatesLabel")}
                </Text>
                <Text style={styles.infoValue}>
                  {pin.location.lat.toFixed(6)}, {pin.location.lon.toFixed(6)}
                </Text>
              </View>
            </View>
          )}
          {/* Notes/Journal */}
          {pin.notes && pin.notes.trim() !== "" && (
            <View style={styles.journalSection}>
              <Text style={styles.journalLabel}>{t("pin.notesLabel")}</Text>
              <Text style={styles.journalText}>{pin.notes}</Text>
            </View>
          )}

          {/* Empty state for want to go */}
          {pin.status === "wantToGo" && (
            <View style={styles.emptyState}>
              <FontAwesome
                name="star"
                size={60}
                color={colors.accent.main}
                style={{ marginBottom: spacing.md }}
              />
              <Text style={styles.emptyStateText}>
                {t("pin.dreamLocation")}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {t("pin.wantToGoMessage")}
              </Text>
            </View>
          )}
        </View>
        </Animated.ScrollView>

        {/* Bottom Action Bar */}
        <LinearGradient
          colors={[colors.background.main + '00', colors.background.main]}
          style={styles.bottomBar}
        >
          <View style={styles.bottomButtonsRow}>
            <Button
              title={t("pin.edit")}
              onPress={handleEdit}
              variant="primary"
              style={styles.bottomButton}
            />
            <Button
              title={t("pin.delete")}
              onPress={handleDelete}
              variant="outline"
              loading={isDeleting}
              style={styles.bottomButton}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Image Lightbox Modal */}
      <Modal
        visible={lightboxVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLightboxVisible(false)}
      >
        <View style={styles.lightboxContainer}>
          <TouchableOpacity
            style={styles.lightboxClose}
            onPress={() => setLightboxVisible(false)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']}
              style={styles.closeButtonGradient}
            >
              <MaterialCommunityIcons
                name="close"
                size={28}
                color={colors.neutral.white}
              />
            </LinearGradient>
          </TouchableOpacity>

          {pin.images && pin.images.length > 0 && (
            <Swiper
              index={selectedImageIndex}
              style={styles.lightboxSwiper}
              showsButtons={false}
              loop={false}
              dotColor={colors.neutral.white + '40'}
              activeDotColor={colors.neutral.white}
            >
              {pin.images.map((uri: string, index: number) => (
                <View key={index} style={styles.lightboxSlide}>
                  <Image
                    source={{ uri }}
                    style={styles.lightboxImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </Swiper>
          )}
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: any, isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.main,
    },
    scrollView: {
      flex: 1,
    },
    errorContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
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
      height: 350,
      backgroundColor: colors.neutral.black,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },
    swiper: {
      height: 350,
    },
    slide: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    galleryImage: {
      width: SCREEN_WIDTH,
      height: 350,
      resizeMode: "cover",
    },
    imageGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 80,
      justifyContent: 'flex-end',
      padding: spacing.md,
    },
    imageCounter: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      backdropFilter: 'blur(10px)',
    },
    imageCounterText: {
      color: colors.neutral.white,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
    },
    pagination: {
      bottom: 16,
    },
    noImageContainer: {
      width: SCREEN_WIDTH,
      height: 250,
      alignItems: "center",
      justifyContent: "center",
    },
    noImageIconCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.background.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
      borderWidth: 2,
      borderColor: colors.border.light,
    },
    noImageLabel: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
    },
    content: {
      padding: spacing.xl,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: spacing.lg,
    },
    titleContainer: {
      flex: 1,
      marginRight: spacing.md,
    },
    title: {
      fontSize: typography.fontSize["2xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    statusBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    statusText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.neutral.white,
    },
    actions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    actionButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      backgroundColor: colors.background.elevated,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border.main,
    },
    deleteButton: {
      backgroundColor: colors.error + "15",
      borderColor: colors.error + "40",
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    rating: {
      backgroundColor: "transparent",
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
      alignItems: "center",
      paddingVertical: spacing["2xl"],
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
      textAlign: "center",
      marginBottom: spacing.sm,
    },
    emptyStateSubtext: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      textAlign: "center",
      paddingHorizontal: spacing.xl,
    },
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingTop: spacing.xl,
      paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
      paddingHorizontal: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
    },
    bottomButtonsRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    bottomButton: {
      flex: 1,
    },
    // Lightbox styles
    lightboxContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.95)',
    },
    lightboxClose: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 30,
      right: spacing.lg,
      zIndex: 10,
    },
    closeButtonGradient: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    lightboxSwiper: {
      flex: 1,
    },
    lightboxSlide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    lightboxImage: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    },
  });
