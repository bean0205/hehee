import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { usePin } from "../../contexts/PinContext";
import { Avatar } from "../../components/common/Avatar";
import { Button } from "../../components/common/Button";
import { PinCard } from "../../components/common/PinCard";
import { BadgeIcon } from "../../components/common/BadgeIcon";
import { typography } from "../../theme/typography";
import { spacing, borderRadius } from "../../theme/spacing";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Header } from "@/components/common/Header";

// Mock user data
const getMockUser = (t: any) => ({
  id: "u1",
  name: t("mockData.userProfile.name"),
  username: t("mockData.userProfile.username"),
  avatar: null,
  coverImage: null,
  bio: t("mockData.userProfile.bio"),
  stats: {
    visited_countries_count: 12,
    visited_cities_count: 45,
    total_pins_count: 127,
    followers_count: 234,
    following_count: 189,
  },
  isFollowing: false,
  isPrivate: false,
});

export const UserProfileScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const { pins } = usePin();
  const [activeTab, setActiveTab] = useState<"map" | "list">("map");
  const [filter, setFilter] = useState<"all" | "visited" | "wantToGo">("all");
  const mockUser = getMockUser(t);
  const [isFollowing, setIsFollowing] = useState(mockUser.isFollowing);

  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const userId = route.params?.userId;
  const user = mockUser; // In production, fetch user by userId

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleFollowersList = () => {
    // Navigate to followers list
  };

  const handleFollowingList = () => {
    // Navigate to following list
  };

  const filteredPins = pins.filter((pin) => {
    if (filter === "all") return true;
    return pin.status === filter;
  });

  const renderPinCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.pinCardContainer}
      onPress={() => navigation.navigate("PinDetails", { pinId: item.id })}
    >
      <PinCard
        pin={item}
        onPress={() => navigation.navigate("PinDetails", { pinId: item.id })}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Header
        title={t("userProfile.title")}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        gradient={false}
        blur={false}
      />
      {/* Cover Image & Avatar */}
      <View style={styles.headerContainer}>
        <ImageBackground
          source={
            user.coverImage
              ? { uri: user.coverImage }
              : require("../../../assets/icon.png")
          }
          style={styles.coverImage}
        >
          <View style={styles.coverOverlay} />
        </ImageBackground>

        <View style={styles.avatarContainer}>
          <Avatar
            size={100}
            uri={user.avatar || undefined}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userInfoContainer}>
        <View style={styles.userNameRow}>
          <Text style={styles.userName}>{user.name}</Text>
          <BadgeIcon size="medium" showName={true} />
        </View>
        <Text style={styles.userUsername}>@{user.username}</Text>
        {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}

        {/* Follow Button */}
        <View style={styles.actionButtonContainer}>
          <Button
            title={
              isFollowing ? t("userProfile.following") : t("userProfile.follow")
            }
            onPress={handleFollowToggle}
            variant={isFollowing ? "outline" : "primary"}
            fullWidth
          />
        </View>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {user.stats.visited_countries_count}
          </Text>
          <Text style={styles.statLabel}>{t("userProfile.countries")}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {user.stats.visited_cities_count}
          </Text>
          <Text style={styles.statLabel}>{t("userProfile.cities")}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user.stats.total_pins_count}</Text>
          <Text style={styles.statLabel}>{t("userProfile.pins")}</Text>
        </View>
      </View>

      {/* Followers/Following Stats */}
      <View style={styles.followStatsContainer}>
        <TouchableOpacity
          style={styles.followStat}
          onPress={handleFollowersList}
        >
          <Text style={styles.followStatValue}>
            {user.stats.followers_count}
          </Text>
          <Text style={styles.followStatLabel}>
            {" "}
            {t("userProfile.followers")}
          </Text>
        </TouchableOpacity>
        <Text style={styles.followStatSeparator}>•</Text>
        <TouchableOpacity
          style={styles.followStat}
          onPress={handleFollowingList}
        >
          <Text style={styles.followStatValue}>
            {user.stats.following_count}
          </Text>
          <Text style={styles.followStatLabel}>
            {" "}
            {t("userProfile.following")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigator */}
      <View style={styles.tabNavigator}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "map" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("map")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "map" && styles.tabButtonTextActive,
            ]}
          >
            🗺️ {t("userProfile.map")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "list" && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab("list")}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "list" && styles.tabButtonTextActive,
            ]}
          >
            📋 {t("userProfile.list")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "map" ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: 21.0285,
              longitude: 105.8542,
              latitudeDelta: 10,
              longitudeDelta: 10,
            }}
          >
            {filteredPins.map((pin) => (
              <Marker
                key={pin.id}
                coordinate={{
                  latitude: pin.latitude,
                  longitude: pin.longitude,
                }}
                pinColor={
                  pin.status === "visited"
                    ? colors.status.visited
                    : colors.status.wantToGo
                }
              />
            ))}
          </MapView>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === "all" && styles.filterButtonActive,
              ]}
              onPress={() => setFilter("all")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === "all" && styles.filterButtonTextActive,
                ]}
              >
                {t("userProfile.all")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === "visited" && styles.filterButtonActive,
              ]}
              onPress={() => setFilter("visited")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === "visited" && styles.filterButtonTextActive,
                ]}
              >
                {t("userProfile.visited")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === "wantToGo" && styles.filterButtonActive,
              ]}
              onPress={() => setFilter("wantToGo")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === "wantToGo" && styles.filterButtonTextActive,
                ]}
              >
                {t("userProfile.wantToGo")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pins List */}
          <FlatList
            data={filteredPins}
            renderItem={renderPinCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.pinsList}
          />
        </View>
      )}
    </ScrollView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.main,
    },
    contentContainer: {
      paddingBottom: 100,
    },
    headerContainer: {
      position: "relative",
    },
    coverImage: {
      width: "100%",
      height: 200,
    },
    coverOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.neutral.black + "4D", // 30% opacity
    },
    avatarContainer: {
      position: "absolute",
      bottom: -50,
      left: spacing.lg,
    },
    avatar: {
      borderWidth: 4,
      borderColor: colors.background.card,
    },
    userInfoContainer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl + 10,
      paddingBottom: spacing.lg,
    },
    userName: {
      fontSize: typography.fontSize["2xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    userNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    userUsername: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      marginBottom: spacing.md,
    },
    userBio: {
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    actionButtonContainer: {
      marginTop: spacing.sm,
    },
    statsBar: {
      flexDirection: "row",
      backgroundColor: colors.background.card,
      paddingVertical: spacing.lg,
      marginBottom: spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statValue: {
      fontSize: typography.fontSize["2xl"],
      fontWeight: typography.fontWeight.bold,
      color: colors.primary.main,
      marginBottom: spacing.xs,
    },
    statLabel: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
    },
    statDivider: {
      width: 1,
      backgroundColor: colors.border.light,
    },
    followStatsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    followStat: {
      flexDirection: "row",
      alignItems: "center",
    },
    followStatValue: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    followStatLabel: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
    },
    followStatSeparator: {
      fontSize: typography.fontSize.base,
      color: colors.text.disabled,
      marginHorizontal: spacing.md,
    },
    tabNavigator: {
      flexDirection: "row",
      backgroundColor: colors.background.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    tabButton: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    tabButtonActive: {
      borderBottomColor: colors.primary.main,
    },
    tabButtonText: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
    },
    tabButtonTextActive: {
      color: colors.primary.main,
      fontWeight: typography.fontWeight.semiBold,
    },
    mapContainer: {
      height: 400,
      marginVertical: spacing.md,
    },
    map: {
      flex: 1,
    },
    listContainer: {
      paddingBottom: spacing.xl,
    },
    filterContainer: {
      flexDirection: "row",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.sm,
    },
    filterButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.md,
      backgroundColor: colors.background.card,
      borderWidth: 1,
      borderColor: colors.border.main,
      alignItems: "center",
    },
    filterButtonActive: {
      backgroundColor: colors.primary.main,
      borderColor: colors.primary.main,
    },
    filterButtonText: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
    },
    filterButtonTextActive: {
      color: colors.text.inverse,
      fontWeight: typography.fontWeight.semiBold,
    },
    pinsList: {
      paddingHorizontal: spacing.lg,
    },
    pinCardContainer: {
      marginBottom: spacing.md,
    },
  });
