import React, { useState, useRef, useEffect, useCallback } from "react";
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
  TextInput,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Rating } from "react-native-ratings";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../contexts/ThemeContext";
import { typography } from "../../theme/typography";
import { spacing, borderRadius } from "../../theme/spacing";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { usePin } from "../../contexts/PinContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { Pin } from "../../components/common/PinCard";
import { LocationPin } from "../../components/common/PinCard";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const IMAGE_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * 2) / 3;

// Nominatim API types
export interface NominatimPlace {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string; // JSON trả về string
  lon: string; // JSON trả về string
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype?: string;
  name: string;
  display_name: string;
  address?: {
    amenity?: string;
    house_number?: string;
    road?: string;
    suburb?: string;
    city_district?: string;
    city?: string;
    state?: string;
    region?: string;
    "ISO3166-2-lvl4"?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
    county?: string;
  };
  boundingbox?: [string, string, string, string]; // [minLat, maxLat, minLon, maxLon]
}

export const AddPinScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { addPin, updatePin, getPinById } = usePin();
  const { t } = useLanguage();
  const { colors, isDarkMode } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const styles = React.useMemo(
    () => createStyles(colors, isDarkMode),
    [colors, isDarkMode]
  );

  // Edit mode
  const editPinId = route.params?.pinId;
  const existingPin = editPinId ? getPinById(editPinId) : null;
  const isEditMode = !!existingPin;

  // Form state
  const [name, setName] = useState(
    existingPin?.name || route.params?.placeName || ""
  );
  const [selectedLocation, setSelectedLocation] =
    useState<NominatimPlace | null>(
      existingPin?.location
        ? (existingPin.location as any as NominatimPlace)
        : null
    );
  const [status, setStatus] = useState<"visited" | "wantToGo">(
    existingPin?.status || "visited"
  );
  const [visitDate, setVisitDate] = useState(
    existingPin?.visitDate ? new Date(existingPin.visitDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rating, setRating] = useState(existingPin?.rating || 0);
  const [notes, setNotes] = useState(existingPin?.notes || "");
  const [images, setImages] = useState<string[]>(existingPin?.images || []);
  const [isLoading, setIsLoading] = useState(false);

  // Autocomplete state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchAbortControllerRef = useRef<AbortController | null>(null);

  // Enhanced animation values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const headerScale = useRef(new Animated.Value(0.9)).current;
  const statusSlideX = useRef(
    new Animated.Value(status === "visited" ? 0 : 1)
  ).current;
  const suggestionsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log("AddPinScreen mounted");
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

    return () => {
      console.log("AddPinScreen unmounted");
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }
    };
  }, []);

  // Debounced search function
  const searchPlaces = useCallback(
    async (query: string) => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // Cancel previous request if exists
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      const controller = new AbortController();
      searchAbortControllerRef.current = controller;

      setIsSearching(true);

      // Setup timeout for fetch
      const timeoutMs = 8000;
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        console.log("Searching for:", query);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(query)}&` +
            `format=json&` +
            `addressdetails=1&` +
            `limit=8&` +
            `accept-language=vi`,
          {
            method: "GET",
            headers: {
              // Nominatim requires a valid User-Agent or Referer identifying the application
              "User-Agent": "PinYourWord/1.0 (contact@pinyourword.app)",
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        // Clear timeout when response arrives
        clearTimeout(timeout);

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          let userMessage = "Failed to search locations";
          if (response.status === 429) {
            userMessage =
              "Too many requests — please wait a moment and try again.";
          } else if (response.status === 403) {
            userMessage =
              "Request blocked by API. Please check network or try again later.";
          }
          console.error("Search failed:", response.status, text);
          Alert.alert(t("errors.error"), userMessage);
          throw new Error(`Search failed: ${response.status} ${text}`);
        }

        const data: NominatimPlace[] = await response.json();
        console.log("Search results:", data.length, "places found");

        setSuggestions(data);
        setShowSuggestions(data.length > 0);

        // Animate suggestions appearance
        if (data.length > 0) {
          Animated.timing(suggestionsOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.warn("Search request aborted due to timeout");
          Alert.alert(
            t("errors.error"),
            "Request timed out. Please try again."
          );
        } else {
          console.error("Search error:", error);
          Alert.alert(t("errors.error"), "Failed to search locations");
        }
      } finally {
        clearTimeout(timeout);
        setIsSearching(false);
      }
    },
    [t]
  );

  // Handle search input change with debounce
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debouncing
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 500);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (place: NominatimPlace) => {
    console.log("Selected place:", place);

    setName(place.display_name);
    setSearchQuery("");
    setSelectedLocation(place);

    // Hide suggestions with animation
    Animated.timing(suggestionsOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setShowSuggestions(false);
      setSuggestions([]);
    });

    Keyboard.dismiss();

    if (Platform.OS === "ios") {
      Vibration.vibrate(10);
    }
  };

  const handleStatusToggle = (newStatus: "visited" | "wantToGo") => {
    console.log(`Status toggled to: ${newStatus}`);
    if (Platform.OS === "ios") {
      Vibration.vibrate(10);
    }

    setStatus(newStatus);

    Animated.spring(statusSlideX, {
      toValue: newStatus === "visited" ? 0 : 1,
      useNativeDriver: true,
      tension: 70,
      friction: 10,
    }).start();

    if (newStatus === "wantToGo") {
      setRating(0);
      setVisitDate(new Date());
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    console.log("Date picker triggered", { selectedDate });
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setVisitDate(selectedDate);
    }
  };

  const pickImage = async () => {
    console.log("Image picker opened");
    if (images.length >= 5) {
      Alert.alert(t("pin.imageLimit"), t("pin.maxImages"));
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("permissions.title"), t("permissions.photos"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      console.log("Image selected:", result.assets[0].uri);
      setImages([...images, result.assets[0].uri]);
      if (Platform.OS === "ios") {
        Vibration.vibrate(10);
      }
    }
  };

  const removeImage = (index: number) => {
    console.log(`Remove image at index: ${index}`);
    Alert.alert(t("common.confirm"), t("pin.removeImageConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.remove"),
        style: "destructive",
        onPress: () => {
          setImages(images.filter((_, i) => i !== index));
          if (Platform.OS === "ios") {
            Vibration.vibrate(10);
          }
        },
      },
    ]);
  };
  function mapNominatimToLocationPin(place: NominatimPlace): LocationPin {
    return {
      placeId: place.place_id,
      licence: place.licence,
      osmType: place.osm_type,
      osmId: place.osm_id,
      lat: place.lat,
      lon: place.lon,
      clazz: place.class,
      type: place.type,
      placeRank: place.place_rank,
      importance: place.importance,
      addresstype: place.addresstype,
      name: place.name,
      displayName: place.display_name,
      address: place.address
        ? {
            amenity: place.address.amenity,
            houseNumber: place.address.house_number,
            road: place.address.road,
            suburb: place.address.suburb,
            cityDistrict: place.address.city_district,
            city: place.address.city,
            state: place.address.state,
            region: place.address.region,
            "ISO3166-2-lvl4": place.address["ISO3166-2-lvl4"],
            postcode: place.address.postcode,
            country: place.address.country,
            countryCode: place.address.country_code,
            county: place.address.county,
          }
        : undefined,
      boundingbox: place.boundingbox ? [...place.boundingbox] : undefined,
    };
  }

  const handleSave = async () => {
    console.log("Save button clicked");
    if (!name.trim()) {
      console.log("Validation failed: Name is required");
      Alert.alert(t("errors.error"), t("validation.nameRequired"));
      return;
    }

    if (!selectedLocation) {
      Alert.alert(t("errors.error"), t("pin.selectLocationFromSearch"));
      return;
    }

    setIsLoading(true);
    try {
      console.log("Saving pin data...", {
        name,
        status,
        visitDate,
        rating,
        notes,
        images,
        location: selectedLocation,
      });
      const pinData: Pin = {
        placeName: name.trim(),
        location: mapNominatimToLocationPin(selectedLocation),
        status,
        rating: status === "visited" ? rating : undefined,
        visitedDate: status === "visited" ? visitDate.toISOString() : undefined,
        notes: notes?.trim() || undefined,
        images: images?.length ? images : undefined,
        id: "",
        uuid: "",
        userId: 0,
        isFavorite: false,
        createdAt: "",
        updatedAt: "",
      };

      console.log("Constructed pin data:", pinData);
      if (isEditMode && editPinId) {
        console.log(`Updating pin with ID: ${editPinId}`);
        updatePin(editPinId, pinData);
        Alert.alert(t("common.success"), t("pin.pinUpdated"), [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        console.log("Adding new pin");
        addPin(pinData);
        Alert.alert(t("common.success"), t("pin.pinAdded"), [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Error saving pin:", error);
      Alert.alert(t("errors.error"), t("errors.saveFailed"));
    } finally {
      setIsLoading(false);
      console.log("Save process completed");
    }
  };

  const getStatusColor = (statusType: "visited" | "wantToGo") => {
    return statusType === "visited"
      ? colors.status.success
      : colors.accent.main;
  };

  // Get location icon based on type
  const getLocationIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      city: "city",
      town: "town-hall",
      village: "home-group",
      restaurant: "silverware-fork-knife",
      cafe: "coffee",
      hotel: "bed",
      museum: "bank",
      park: "tree",
      beach: "beach",
      airport: "airplane",
      station: "train",
    };
    return iconMap[type] || "map-marker";
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => {
            console.log("Backdrop pressed, navigating back");
            navigation.goBack();
          }}
        />
      </Animated.View>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={["92%"]}
        enablePanDownToClose={true}
        animateOnMount={true}
        onClose={() => {
          console.log("BottomSheet closed");
          navigation.goBack();
        }}
        backgroundStyle={styles.bottomSheet}
        handleIndicatorStyle={styles.handleIndicator}
        topInset={0}
        enableDynamicSizing={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Modern Header */}
          <Animated.View
            style={[styles.header, { transform: [{ scale: headerScale }] }]}
          >
            <LinearGradient
              colors={
                isEditMode
                  ? [colors.accent.main + "15", colors.accent.main + "05"]
                  : [colors.primary.main + "15", colors.primary.main + "05"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.headerContent}>
                <View
                  style={[
                    styles.headerIconContainer,
                    {
                      backgroundColor: isEditMode
                        ? colors.accent.main
                        : colors.primary.main,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={isEditMode ? "pencil" : "map-marker-plus"}
                    size={28}
                    color={colors.neutral.white}
                  />
                </View>
                <View style={styles.headerTextWrapper}>
                  <Text style={styles.headerTitle}>
                    {isEditMode ? t("pin.editPin") : t("pin.addPin")}
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    {isEditMode
                      ? t("pin.updatePinInfo")
                      : t("pin.createNewMemory")}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Section: Location Search with Autocomplete */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View
                style={[
                  styles.sectionIconBadge,
                  { backgroundColor: colors.primary.main + "15" },
                ]}
              >
                <MaterialCommunityIcons
                  name="map-search"
                  size={18}
                  color={colors.primary.main}
                />
              </View>
              <Text style={styles.sectionTitle}>{t("pin.searchLocation")}</Text>
              <View style={styles.requiredPill}>
                <MaterialCommunityIcons
                  name="asterisk"
                  size={10}
                  color={colors.error}
                />
              </View>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={22}
                  color={colors.text.disabled}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for places..."
                  placeholderTextColor={colors.text.disabled}
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                />
                {isSearching && (
                  <ActivityIndicator
                    size="small"
                    color={colors.primary.main}
                    style={styles.searchLoader}
                  />
                )}
              </View>

              {/* Autocomplete Suggestions */}
              {suggestions.length > 0 &&
                (showSuggestions || searchQuery.trim().length > 0) && (
                  <Animated.View
                    style={[
                      styles.suggestionsContainer,
                      { opacity: suggestionsOpacity },
                    ]}
                  >
                    <ScrollView
                      style={styles.suggestionsList}
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                    >
                      {suggestions.map((place, index) => (
                        <TouchableOpacity
                          key={place.place_id}
                          style={[
                            styles.suggestionItem,
                            index === suggestions.length - 1 &&
                              styles.suggestionItemLast,
                          ]}
                          onPress={() => handleSuggestionSelect(place)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.suggestionIconWrapper}>
                            <MaterialCommunityIcons
                              name={getLocationIcon(place.type)}
                              size={20}
                              color={colors.primary.main}
                            />
                          </View>
                          <View style={styles.suggestionContent}>
                            <Text
                              style={styles.suggestionTitle}
                              numberOfLines={1}
                            >
                              {place.display_name.split(",")[0]}
                            </Text>
                            <Text
                              style={styles.suggestionAddress}
                              numberOfLines={2}
                            >
                              {place.display_name}
                            </Text>
                          </View>
                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color={colors.text.disabled}
                          />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </Animated.View>
                )}

              {/* Selected Location Display */}
              {selectedLocation && !showSuggestions && (
                <View style={styles.selectedLocationCard}>
                  <View style={styles.selectedLocationIcon}>
                    <MaterialCommunityIcons
                      name="map-marker-check"
                      size={24}
                      color={colors.status.success}
                    />
                  </View>
                  <View style={styles.selectedLocationContent}>
                    <Text style={styles.selectedLocationTitle}>
                      Selected Location
                    </Text>
                    <Text style={styles.selectedLocationCoords}>
                      {selectedLocation.display_name || "Coordinates"}
                    </Text>
                    {typeof selectedLocation.lat === "number" &&
                      typeof selectedLocation.lon === "number" && (
                        <Text style={styles.selectedLocationCoords}>
                          {selectedLocation.lat.toFixed(6)},{" "}
                          {selectedLocation.lon.toFixed(6)}
                        </Text>
                      )}
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedLocation(null)}
                    style={styles.selectedLocationRemove}
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color={colors.text.disabled}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Section: Place Name */}
          {/* <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={[styles.sectionIconBadge, { backgroundColor: colors.primary.main + '15' }]}>
                <MaterialCommunityIcons
                  name="rename-box"
                  size={18}
                  color={colors.primary.main}
                />
              </View>
              <Text style={styles.sectionTitle}>{t('pin.customName')}</Text>
              <View style={styles.optionalBadge}>
                <Text style={styles.optionalBadgeText}>Optional</Text>
              </View>
            </View>
            
            <View style={styles.inputWrapper}>
              <Input
                placeholder="Enter custom name (optional)"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View> */}

          {/* Section: Status Toggle */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View
                style={[
                  styles.sectionIconBadge,
                  { backgroundColor: colors.accent.main + "15" },
                ]}
              >
                <MaterialCommunityIcons
                  name="flag-variant"
                  size={18}
                  color={colors.accent.main}
                />
              </View>
              <Text style={styles.sectionTitle}>{t("pin.status")}</Text>
              <View style={styles.requiredPill}>
                <MaterialCommunityIcons
                  name="asterisk"
                  size={10}
                  color={colors.error}
                />
              </View>
            </View>

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
                            outputRange: [
                              0,
                              (SCREEN_WIDTH - spacing.lg * 2) / 2,
                            ],
                          }),
                        },
                      ],
                    },
                  ]}
                />

                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusToggle("visited")}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color={
                      status === "visited"
                        ? colors.neutral.white
                        : colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === "visited" && styles.statusOptionTextActive,
                    ]}
                  >
                    {t("pin.visited")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.statusOption}
                  onPress={() => handleStatusToggle("wantToGo")}
                  activeOpacity={0.8}
                >
                  <FontAwesome
                    name="heart"
                    size={22}
                    color={
                      status === "wantToGo"
                        ? colors.neutral.white
                        : colors.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      status === "wantToGo" && styles.statusOptionTextActive,
                    ]}
                  >
                    {t("pin.wantToGo")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Visited Details */}
          {status === "visited" && (
            <Animated.View
              style={[
                styles.section,
                {
                  opacity: statusSlideX.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 0.5, 0],
                  }),
                },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <View
                  style={[
                    styles.sectionIconBadge,
                    { backgroundColor: colors.status.success + "15" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="calendar-check"
                    size={18}
                    color={colors.status.success}
                  />
                </View>
                <Text style={styles.sectionTitle}>
                  {t("pin.dateAndRating")}
                </Text>
              </View>

              <View style={styles.cardContainer}>
                <Text style={styles.cardLabel}>{t("pin.visitDate")}</Text>
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
                      {visitDate.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                    <Text style={styles.dateDayName}>
                      {visitDate.toLocaleDateString("vi-VN", {
                        weekday: "long",
                      })}
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
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              <View style={styles.cardContainer}>
                <Text style={styles.cardLabel}>{t("pin.rating")}</Text>
                <View style={styles.ratingCard}>
                  <Rating
                    type="custom"
                    ratingCount={5}
                    imageSize={44}
                    startingValue={rating}
                    onFinishRating={(value) => {
                      setRating(value);
                      if (Platform.OS === "ios") {
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
                      <Text style={styles.ratingNumber}>
                        {rating.toFixed(1)}
                      </Text>
                      <View style={styles.ratingMaxContainer}>
                        <Text style={styles.ratingMaxText}>/ 5.0</Text>
                        <View style={styles.ratingQualityBadge}>
                          <Text style={styles.ratingQualityText}>
                            {rating >= 4.5
                              ? "Excellent"
                              : rating >= 3.5
                              ? "Great"
                              : rating >= 2.5
                              ? "Good"
                              : "Fair"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          )}

          {/* Notes Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View
                style={[
                  styles.sectionIconBadge,
                  { backgroundColor: colors.text.secondary + "15" },
                ]}
              >
                <MaterialCommunityIcons
                  name="text"
                  size={18}
                  color={colors.text.secondary}
                />
              </View>
              <Text style={styles.sectionTitle}>{t("pin.notes")}</Text>
              <View style={styles.optionalBadge}>
                <Text style={styles.optionalBadgeText}>Optional</Text>
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Input
                placeholder={t("pin.notesPlaceholder")}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Photos Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View
                style={[
                  styles.sectionIconBadge,
                  { backgroundColor: colors.primary.main + "15" },
                ]}
              >
                <MaterialCommunityIcons
                  name="image-multiple"
                  size={18}
                  color={colors.primary.main}
                />
              </View>
              <Text style={styles.sectionTitle}>{t("pin.images")}</Text>
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

                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.3)"]}
                    style={styles.imageOverlay}
                  >
                    <View style={styles.imageIndexBadge}>
                      <Text style={styles.imageIndexText}>{index + 1}</Text>
                    </View>
                  </LinearGradient>

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
                  {t("pin.addImagesToShare")}
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 140 }} />
        </BottomSheetScrollView>

        {/* Fixed Action Bar */}
        <View style={styles.actionBar}>
          <LinearGradient
            colors={[
              colors.background.main + "00",
              colors.background.main,
              colors.background.main,
            ]}
            style={styles.actionBarGradient}
          >
            <View style={styles.actionButtonsContainer}>
              <Button
                title={isEditMode ? t("pin.update") : t("pin.savePin")}
                onPress={handleSave}
                loading={isLoading}
                fullWidth
              />
              <TouchableOpacity
                style={styles.cancelLink}
                onPress={() => {
                  console.log("Cancel button clicked, navigating back");
                  navigation.goBack();
                }}
                activeOpacity={0.6}
              >
                <Text style={styles.cancelLinkText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </BottomSheet>
    </View>
  );
};

const createStyles = (colors: any, isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.neutral.black + (isDarkMode ? "DD" : "BB"),
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

    // Header
    header: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      borderRadius: borderRadius.xl,
      overflow: "hidden",
    },
    headerGradient: {
      padding: spacing.lg,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
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
      fontSize: typography.fontSize["2xl"],
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

    // Section
    section: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    sectionHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    sectionIconBadge: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
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
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.error + "15",
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
      gap: 4,
    },
    optionalBadge: {
      backgroundColor: colors.text.disabled + "20",
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
    },
    optionalBadgeText: {
      fontSize: typography.fontSize.xs,
      color: colors.text.disabled,
      fontWeight: typography.fontWeight.medium,
      textTransform: "uppercase",
    },

    // Search Autocomplete
    searchContainer: {
      marginTop: spacing.xs,
      position: "relative", // allow absolute positioning of suggestions
      zIndex: 9999,
    },
    searchInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 56, // ensures a consistent top offset for suggestions
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.xl,
      borderWidth: 1.5,
      borderColor: colors.border.main,
      paddingHorizontal: spacing.md,
      paddingVertical: Platform.OS === "ios" ? spacing.md : spacing.xs,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.15 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    searchIcon: {
      marginRight: spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      fontWeight: typography.fontWeight.medium,
      paddingVertical: Platform.OS === "android" ? spacing.xs : 0,
    },
    searchLoader: {
      marginLeft: spacing.sm,
    },

    // Suggestions Dropdown
    suggestionsContainer: {
      position: "absolute",
      top: 56, // aligned below searchInputWrapper
      left: 0,
      right: 0,
      width: "100%",
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border.main,
      overflow: "hidden",
      maxHeight: 280,
      shadowColor: colors.neutral.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 24,
      zIndex: 9999,
    },
    suggestionsList: {
      flex: 1,
    },
    suggestionItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
      gap: spacing.sm,
    },
    suggestionItemLast: {
      borderBottomWidth: 0,
    },
    suggestionIconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: colors.primary.main + "15",
      alignItems: "center",
      justifyContent: "center",
    },
    suggestionContent: {
      flex: 1,
      gap: 4,
    },
    suggestionTitle: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
    },
    suggestionAddress: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      lineHeight: 18,
    },

    // Selected Location Card
    selectedLocationCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.status.success + "10",
      borderRadius: borderRadius.lg,
      borderWidth: 1.5,
      borderColor: colors.status.success + "30",
      padding: spacing.md,
      marginTop: spacing.sm,
      gap: spacing.sm,
    },
    selectedLocationIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.status.success + "20",
      alignItems: "center",
      justifyContent: "center",
    },
    selectedLocationContent: {
      flex: 1,
    },
    selectedLocationTitle: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: colors.status.success,
      marginBottom: 2,
    },
    selectedLocationCoords: {
      fontSize: typography.fontSize.sm,
      color: colors.text.secondary,
      fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    },
    selectedLocationRemove: {
      padding: spacing.xs,
    },

    inputWrapper: {
      marginTop: spacing.xs,
    },

    // Status Toggle
    statusToggleContainer: {
      marginTop: spacing.sm,
    },
    statusTrack: {
      flexDirection: "row",
      backgroundColor: colors.background.elevated,
      borderRadius: borderRadius.xl,
      padding: 4,
      position: "relative",
      borderWidth: 1.5,
      borderColor: colors.border.main,
    },
    statusIndicator: {
      position: "absolute",
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
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

    // Cards
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
    dateCard: {
      flexDirection: "row",
      alignItems: "center",
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
      backgroundColor: colors.primary.main + "15",
      alignItems: "center",
      justifyContent: "center",
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
      textTransform: "capitalize",
    },
    ratingCard: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.xl,
      borderWidth: 1.5,
      borderColor: colors.border.main,
      padding: spacing.lg,
      alignItems: "center",
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
      alignItems: "center",
    },
    ratingNumber: {
      fontSize: 48,
      fontWeight: typography.fontWeight.bold,
      color: colors.accent.main,
      letterSpacing: -2,
      lineHeight: 52,
    },
    ratingMaxContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    ratingMaxText: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.medium,
    },
    ratingQualityBadge: {
      backgroundColor: colors.accent.main + "20",
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: borderRadius.full,
    },
    ratingQualityText: {
      fontSize: typography.fontSize.xs,
      color: colors.accent.main,
      fontWeight: typography.fontWeight.bold,
      textTransform: "uppercase",
    },

    // Image Gallery
    imageCountBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary.main + "15",
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
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    imageItem: {
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      position: "relative",
      borderRadius: borderRadius.lg,
      overflow: "hidden",
    },
    imageThumb: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.background.elevated,
    },
    imageOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "40%",
      justifyContent: "flex-end",
      padding: spacing.sm,
    },
    imageIndexBadge: {
      alignSelf: "flex-start",
      backgroundColor: colors.neutral.black + "CC",
      minWidth: 28,
      height: 28,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xs,
      borderWidth: 2,
      borderColor: colors.neutral.white + "40",
    },
    imageIndexText: {
      color: colors.neutral.white,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
    },
    imageDeleteButton: {
      position: "absolute",
      top: spacing.xs,
      right: spacing.xs,
    },
    imageDeleteCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.error,
      alignItems: "center",
      justifyContent: "center",
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
      borderStyle: "dashed",
      backgroundColor: colors.background.card,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
    },
    imageAddIconWrapper: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary.main + "15",
      alignItems: "center",
      justifyContent: "center",
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
    emptyImageState: {
      alignItems: "center",
      paddingVertical: spacing.xl * 1.5,
      paddingHorizontal: spacing.lg,
    },
    emptyImageIconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.background.elevated,
      alignItems: "center",
      justifyContent: "center",
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
      textAlign: "center",
      lineHeight: 20,
    },

    // Action Bar
    actionBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    actionBarGradient: {
      paddingTop: spacing.lg,
      paddingBottom: Platform.OS === "ios" ? spacing.xl : spacing.lg,
      paddingHorizontal: spacing.lg,
    },
    actionButtonsContainer: {
      gap: spacing.sm,
    },
    cancelLink: {
      paddingVertical: spacing.md,
      alignItems: "center",
    },
    cancelLinkText: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
      fontWeight: typography.fontWeight.semiBold,
    },
  });
