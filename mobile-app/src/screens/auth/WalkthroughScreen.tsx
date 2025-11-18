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

  const slides = [
    {
      icon: "earth",
      title: t("walkthrough.discoverWorld"),
      description: t("walkthrough.discoverDescription"),
      backgroundImage: require("../../../assets/images/walk/step1.jpg"),
      decorIcons: [
        { name: "airplane", library: "MaterialCommunityIcons" },
        { name: "map", library: "MaterialCommunityIcons" },
        { name: "camera", library: "MaterialCommunityIcons" },
      ],
    },
    {
      icon: "map-marker",
      title: t("walkthrough.markPlaces"),
      description: t("walkthrough.markPlacesDescription"),
      backgroundImage: require("../../../assets/images/walk/step2.jpg"),
      decorIcons: [
        { name: "terrain", library: "MaterialCommunityIcons" },
        { name: "beach", library: "MaterialCommunityIcons" },
        { name: "city-variant", library: "MaterialCommunityIcons" },
      ],
    },
    {
      icon: "target",
      title: t("walkthrough.planTrip"),
      description: t("walkthrough.planTripDescription"),
      backgroundImage: require("../../../assets/images/walk/step3.jpg"),
      decorIcons: [
        { name: "bag-personal", library: "MaterialCommunityIcons" },
        { name: "compass", library: "MaterialCommunityIcons" },
        { name: "tent", library: "MaterialCommunityIcons" },
      ],
    },
    {
      icon: "account-group",
      title: t("walkthrough.connectFriends"),
      description: t("walkthrough.connectFriendsDescription"),
      backgroundImage: require("../../../assets/images/walk/step4.jpg"),
      decorIcons: [
        { name: "handshake", library: "MaterialCommunityIcons" },
        { name: "comment", library: "MaterialCommunityIcons" },
        { name: "heart", library: "MaterialCommunityIcons" },
      ],
    },
  ];

  // CHỈ 1 ScrollView ref duy nhất
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    
    if (index !== currentIndex) {
      setCurrentIndex(index);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
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
      <ImageBackground
        source={slides[currentIndex].backgroundImage}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      >
        {/* Overlay để tăng contrast cho text */}
        <View style={styles.overlay} />

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

        {/* SINGLE ScrollView - Chỉ 1 source of truth */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={width}
            decelerationRate="fast"
          >
            {slides.map((slide, index) => (
              <View key={index} style={[styles.slide, { width }]}>
                {/* Icon container - positioned in center */}
                <View style={styles.iconContainer}>
                  <View style={styles.iconBackground}>
                    <MaterialCommunityIcons
                      name={slide.icon as any}
                      size={70}
                      color={colors.neutral.white}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Footer with Text - Không scroll, chỉ fade transition */}
        <BlurView
          intensity={100}
          tint={isDarkMode ? "dark" : "light"}
          style={styles.footer}
        >
          {/* Text content với fade animation */}
          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <Text style={styles.title}>{slides[currentIndex].title}</Text>
            <Text style={styles.description}>
              {slides[currentIndex].description}
            </Text>
          </Animated.View>

          {/* Pagination dots */}
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.activeDot,
                ]}
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
      </ImageBackground>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.main,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.neutral.black + "40", // 25% overlay để text dễ đọc
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
    content: {
      flex: 1,
      zIndex: 2,
    },
    slide: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
    },
    iconContainer: {
      marginBottom: spacing.xl,
    },
    iconBackground: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.neutral.white + "40", // 25% opacity
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    footer: {
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
      alignItems: "center",
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
      paddingHorizontal: spacing.md,
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
      backgroundColor: colors.neutral.white + "4D", // 30% opacity
      marginHorizontal: 5,
      transition: "all 0.3s",
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