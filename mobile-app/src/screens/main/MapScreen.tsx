import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { typography } from "../../theme/typography";
import { spacing, borderRadius } from "../../theme/spacing";
import { usePin } from "../../contexts/PinContext";
import { useNavigation } from "@react-navigation/native";
import { MainTabCompositeNavigationProp } from "../../types/navigation";
import { errorHandler } from "../../services/errorHandler";

export const MapScreen: React.FC = () => {
  const navigation = useNavigation<MainTabCompositeNavigationProp<'Map'>>();
  const { pins, getPinByUser } = usePin();
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const mapRef = useRef<MapView>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pinsState, setPinsState] = useState(pins);
  const [isLoadingPins, setIsLoadingPins] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPins = async () => {
      setIsLoadingPins(true);
      setLoadError(null);
      try {
        await getPinByUser();
        setLoadError(null);
      } catch (error: any) {
        const appError = errorHandler.handle(error, 'MapScreen.fetchPins');
        setLoadError(appError.message);

        errorHandler.handleWithAlert(error, {
          title: t("errors.error") || "Error",
          context: 'MapScreen.fetchPins',
          onRetry: fetchPins,
        });
      } finally {
        setIsLoadingPins(false);
      }
    };

    fetchPins();
  }, []);

  useEffect(() => {
    setPinsState(pins);

    // Auto-fit map to pins when data loads
    if (pins.length > 0 && mapRef.current) {
      const coordinates = pins.map(pin => ({
        latitude: parseFloat(pin.location.lat),
        longitude: parseFloat(pin.location.lon),
      }));

      // Fit map to show all pins
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [pins]);

  // Create styles with current theme colors
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  // Calculate initial region from pins or use default
  const initialRegion = React.useMemo(() => {
    if (pinsState.length > 0) {
      const lats = pinsState.map(p => parseFloat(p.location.lat));
      const lons = pinsState.map(p => parseFloat(p.location.lon));

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);

      return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLon + maxLon) / 2,
        latitudeDelta: (maxLat - minLat) * 1.5 || 10,
        longitudeDelta: (maxLon - minLon) * 1.5 || 10,
      };
    }

    // Default: Vietnam center
    return {
      latitude: 16.0544,
      longitude: 108.2022,
      latitudeDelta: 15,
      longitudeDelta: 15,
    };
  }, [pinsState]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Mock search results
    if (text.length > 2) {
      setSearchResults([
        { id: "1", name: "Hồ Hoàn Kiếm, Hà Nội", lat: 21.0285, lng: 105.8542 },
        {
          id: "2",
          name: "Vịnh Hạ Long, Quảng Ninh",
          lat: 20.9101,
          lng: 107.1839,
        },
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const handleMarkerPress = (pinId: string) => {
    navigation.navigate("PinDetails", { pinId });
  };

  const handleAddPin = () => {
    navigation.navigate("AddPin", {});
  };

  // Dark mode map style
  const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        customMapStyle={isDarkMode ? darkMapStyle : []}
        showsUserLocation
        showsMyLocationButton
      >
        {pinsState.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.location.lat,
              longitude: pin.location.lon,
            }}
            pinColor={
              pin.status === "visited"
                ? colors.status.visited
                : colors.status.wantToGo
            }
            onPress={() => handleMarkerPress(pin.id)}
          >
            <View
              style={[
                styles.markerContainer,
                {
                  backgroundColor:
                    pin.status === "visited"
                      ? colors.status.visited
                      : colors.status.wantToGo,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={pin.status === "visited" ? "map-marker-check" : "map-marker-question"}
                size={24}
                color={colors.neutral.white}
              />
            </View>
          </Marker>
        ))} 
      </MapView>

      {/* Loading Overlay */}
      {isLoadingPins && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={styles.loadingText}>{t("common.loading") || "Loading pins..."}</Text>
          </View>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => setSearchModalVisible(true)}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.text.secondary}
          />
          <Text style={styles.searchPlaceholder}>
            {t("map.searchPlaceholder")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Modal */}
      <Modal
        visible={searchModalVisible}
        animationType="slide"
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSearchModalVisible(false)}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.modalSearchInput}
              placeholder={t("map.searchPlaceholder")}
              placeholderTextColor={colors.text.secondary}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.searchResultItem}
                onPress={() => {
                  setSearchModalVisible(false);
                  mapRef.current?.animateToRegion({
                    latitude: item.lat,
                    longitude: item.lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  });
                }}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color={colors.primary.main}
                />
                <Text style={styles.searchResultName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery.length > 2
                    ? t("map.noResults")
                    : t("map.searchHint")}
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    searchBarContainer: {
      position: "absolute",
      top: 60,
      left: spacing.md,
      right: spacing.md,
    },
    searchBar: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    searchIcon: {
      fontSize: 20,
      marginRight: spacing.sm,
    },
    searchPlaceholder: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
    },
    markerContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: colors.background.card,
    },
    markerText: {
      fontSize: 20,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background.main,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.main,
    },
    modalCloseButton: {
      fontSize: 24,
      color: colors.text.secondary,
      marginRight: spacing.md,
    },
    modalSearchInput: {
      flex: 1,
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
    },
    searchResultItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    searchResultIcon: {
      fontSize: 24,
      marginRight: spacing.md,
    },
    searchResultName: {
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xl,
    },
    emptyStateText: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    loadingCard: {
      backgroundColor: colors.background.card,
      padding: spacing.xl,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    loadingText: {
      marginTop: spacing.md,
      fontSize: typography.fontSize.base,
      color: colors.text.primary,
      fontWeight: typography.fontWeight.medium,
    },
  });
