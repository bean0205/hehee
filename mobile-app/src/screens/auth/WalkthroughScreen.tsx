import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { typography } from "../../theme/typography";
import { spacing, borderRadius } from "../../theme/spacing";
const { width, height } = Dimensions.get("window");

interface WalkthroughScreenProps {
  onComplete: () => void;
}

export const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const slides = [
    {
      icon: "earth",
      title: t("walkthrough.discoverWorld"),
      description: t("walkthrough.discoverDescription"),
      backgroundImage: require("../../../assets/images/walk/step1.jpg"),
    },
    {
      icon: "map-marker",
      title: t("walkthrough.markPlaces"),
      description: t("walkthrough.markPlacesDescription"),
      backgroundImage: require("../../../assets/images/walk/step2.jpg"),
    },
    {
      icon: "target",
      title: t("walkthrough.planTrip"),
      description: t("walkthrough.planTripDescription"),
      backgroundImage: require("../../../assets/images/walk/step3.jpg"),
    },
    {
      icon: "account-group",
      title: t("walkthrough.connectFriends"),
      description: t("walkthrough.connectFriendsDescription"),
      backgroundImage: require("../../../assets/images/walk/step4.jpg"),
    },
  ];

  // 2 refs riêng biệt cho 2 ScrollViews
  const mainScrollRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;

 
    // Cập nhật currentIndex ngay lập tức
    const index = Math.round(offsetX / width);
    if (index !== currentIndex && index >= 0 && index < slides.length) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      const targetOffset = width * nextIndex;

      // Scroll cả 2 cùng lúc
      mainScrollRef.current?.scrollTo({
        x: targetOffset,
        animated: true,
      });

      // Cập nhật currentIndex ngay lập tức
      // const index = Math.round(targetOffset / width);
      // if (index !== currentIndex && index >= 0 && index < slides.length) {
      //   setCurrentIndex(index);
      // }
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Background ScrollView - chứa các ImageBackground slides */}
      <ScrollView
        ref={mainScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        // onMomentumScrollEnd={handleMomentumScrollEnd} // Thêm dòng này
        scrollEventThrottle={8}
        snapToInterval={width}
        decelerationRate="fast"
        bounces={false}
        style={StyleSheet.absoluteFillObject}
      >
        {slides.map((slide, index) => (
          <ImageBackground
            key={`bg-${index}`}
            source={slide.backgroundImage}
            style={[styles.backgroundSlide, { width }]}
            resizeMode="cover"
          >
            {/* Overlay để text dễ đọc */}
            <View style={styles.overlay} />

            {/* Icon ở center của mỗi slide */}
            {/* <View style={styles.slideContent}>
              <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                  <MaterialCommunityIcons
                    name={slide.icon as any}
                    size={70}
                    color={colors.neutral.white}
                  />
                </View>
              </View>
            </View> */}
          </ImageBackground>
        ))}
      </ScrollView>

      {/* Skip button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <BlurView
            intensity={50}
            tint={isDarkMode ? "dark" : "light"}
            style={styles.skipBlur}
          >
            <Text style={styles.skipText}>{t("common.skip")}</Text>
          </BlurView>
        </TouchableOpacity>
      )}

      {/* Footer với Text ScrollView */}
      <BlurView
        intensity={100}
        tint={isDarkMode ? "dark" : "light"}
        style={styles.footer}
      >
        {/* Text ScrollView - sync với main ScrollView */}
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>{slides[currentIndex].title}</Text>
          <Text style={styles.description}>
            {slides[currentIndex].description}
          </Text>
        </Animated.View>

        {/* Pagination dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[styles.dot, index === currentIndex && styles.activeDot]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <MaterialCommunityIcons
              name={
                currentIndex === slides.length - 1
                  ? "rocket-launch"
                  : "arrow-right"
              }
              size={20}
              color={colors.neutral.white}
              style={{ marginRight: spacing.xs }}
            />
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1
                ? "Khám phá ngay"
                : "Tiếp tục"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.main,
    },
    backgroundSlide: {
      height: height,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.neutral.black + "40",
    },
    slideContent: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
    },
    skipButton: {
      position: "absolute",
      top: spacing.xl + 40,
      right: spacing.lg,
      zIndex: 10,
      borderRadius: borderRadius.full,
      overflow: "hidden",
    },
    skipBlur: {
      paddingHorizontal: spacing.md + 4,
      paddingVertical: spacing.sm,
    },
    skipText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.neutral.white,
    },
    iconContainer: {
      marginBottom: spacing.xl,
    },
    iconBackground: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.neutral.white + "40",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl + 20,
      paddingTop: spacing.xl,
      zIndex: 3,
      borderTopLeftRadius: borderRadius["2xl"],
      borderTopRightRadius: borderRadius["2xl"],
      overflow: "hidden",
    },
    textContainer: {
      marginBottom: spacing.lg,
      overflow: "hidden",
    },
    textScrollContent: {
      alignItems: "center",
    },
    textSlide: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.md,
    },
    title: {
      fontSize: typography.fontSize["3xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.black,
      textAlign: "center",
      marginBottom: spacing.md,
    },
    description: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      textAlign: "center",
      lineHeight: 24,
      paddingHorizontal: spacing.sm,
    },
    pagination: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: spacing.lg,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.neutral.white + "4D",
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: colors.primary.main || "#667eea",
      width: 30,
    },
    button: {
      borderRadius: borderRadius.xl,
      overflow: "hidden",
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    buttonGradient: {
      paddingVertical: spacing.md + 4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: colors.neutral.white,
      letterSpacing: 0.5,
    },
  });
