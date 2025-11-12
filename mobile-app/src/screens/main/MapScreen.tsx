import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { usePin } from '../../contexts/PinContext';
import { useNavigation } from '@react-navigation/native';

export const MapScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { pins } = usePin();
  const { colors, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const mapRef = useRef<MapView>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Create styles with current theme colors
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  const initialRegion = {
    latitude: 21.0285,
    longitude: 105.8542,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Mock search results
    if (text.length > 2) {
      setSearchResults([
        { id: '1', name: 'Hồ Hoàn Kiếm, Hà Nội', lat: 21.0285, lng: 105.8542 },
        { id: '2', name: 'Vịnh Hạ Long, Quảng Ninh', lat: 20.9101, lng: 107.1839 },
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const handleMarkerPress = (pinId: string) => {
    navigation.navigate('PinDetails', { pinId });
  };

  const handleAddPin = () => {
    navigation.navigate('AddPin', {});
  };

  // Dark mode map style
  const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
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
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.latitude,
              longitude: pin.longitude,
            }}
            pinColor={pin.status === 'visited' ? colors.status.visited : colors.status.wantToGo}
            onPress={() => handleMarkerPress(pin.id)}
          >
            <View
              style={[
                styles.markerContainer,
                {
                  backgroundColor:
                    pin.status === 'visited' ? colors.status.visited : colors.status.wantToGo,
                },
              ]}
            >
              <Text style={styles.markerText}>📍</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => setSearchModalVisible(true)}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>{t('map.searchPlaceholder')}</Text>
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
              <Text style={styles.modalCloseButton}>✕</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.modalSearchInput}
              placeholder={t('map.searchPlaceholder')}
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
                <Text style={styles.searchResultIcon}>📍</Text>
                <Text style={styles.searchResultName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery.length > 2
                    ? t('map.noResults')
                    : t('map.searchHint')}
                </Text>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
  },
  searchBar: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
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
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
});
