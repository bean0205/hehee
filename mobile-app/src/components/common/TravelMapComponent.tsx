import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  Pressable,
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { COUNTRIES_PATHS } from './countriesPaths';
import { useTheme } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;

type CountryCode = keyof typeof COUNTRIES_PATHS;

const COUNTRY_NAMES: Partial<Record<CountryCode, string>> = {
  AF: 'Afghanistan', AL: 'Albania', DZ: 'Algeria', AE: 'United Arab Emirates', AM: 'Armenia',
  AT: 'Austria', BI: 'Burundi', BE: 'Belgium', BJ: 'Benin', BF: 'Burkina Faso',
  BD: 'Bangladesh', BG: 'Bulgaria', BA: 'Bosnia and Herzegovina', BY: 'Belarus', BZ: 'Belize',
  BO: 'Bolivia', BR: 'Brazil', BN: 'Brunei', BT: 'Bhutan', BW: 'Botswana',
  CF: 'Central African Republic', CH: 'Switzerland', CI: "Côte d'Ivoire", CM: 'Cameroon', CD: 'Democratic Republic of the Congo',
  CG: 'Republic of the Congo', CO: 'Colombia', CR: 'Costa Rica', CU: 'Cuba', CZ: 'Czech Republic',
  DE: 'Germany', DJ: 'Djibouti', DO: 'Dominican Republic', EG: 'Egypt', EC: 'Ecuador',
  ER: 'Eritrea', EE: 'Estonia', ET: 'Ethiopia', FI: 'Finland', GA: 'Gabon',
  GE: 'Georgia', GH: 'Ghana', GN: 'Guinea', GM: 'Gambia', GW: 'Guinea-Bissau',
  GQ: 'Equatorial Guinea', GL: 'Greenland', GT: 'Guatemala', GY: 'Guyana', HN: 'Honduras',
  HR: 'Croatia', HT: 'Haiti', HU: 'Hungary', IN: 'India', IE: 'Ireland',
  IR: 'Iran', IQ: 'Iraq', IS: 'Iceland', IL: 'Israel', JM: 'Jamaica',
  JO: 'Jordan', KZ: 'Kazakhstan', KE: 'Kenya', KG: 'Kyrgyzstan', KH: 'Cambodia',
  KR: 'South Korea', KW: 'Kuwait', LA: 'Laos', LB: 'Lebanon', LR: 'Liberia',
  LY: 'Libya', LK: 'Sri Lanka', LS: 'Lesotho', LT: 'Lithuania', LU: 'Luxembourg',
  LV: 'Latvia', MA: 'Morocco', MD: 'Moldova', MG: 'Madagascar', MX: 'Mexico',
  MK: 'North Macedonia', ML: 'Mali', MM: 'Myanmar', MN: 'Mongolia', MZ: 'Mozambique',
  MR: 'Mauritania', MW: 'Malawi', NA: 'Namibia', NE: 'Niger', NG: 'Nigeria',
  NI: 'Nicaragua', NP: 'Nepal', PK: 'Pakistan', PA: 'Panama', PE: 'Peru',
  PL: 'Poland', PS: 'Palestine', PT: 'Portugal', PY: 'Paraguay', QA: 'Qatar',
  RO: 'Romania', RW: 'Rwanda', EH: 'Western Sahara', SA: 'Saudi Arabia', SD: 'Sudan',
  SS: 'South Sudan', SN: 'Senegal', SL: 'Sierra Leone', SV: 'El Salvador', RS: 'Serbia',
  SR: 'Suriname', SK: 'Slovakia', SI: 'Slovenia', SE: 'Sweden', SZ: 'Eswatini',
  SY: 'Syria', TD: 'Chad', TG: 'Togo', TH: 'Thailand', TJ: 'Tajikistan',
  TM: 'Turkmenistan', TL: 'Timor-Leste', TN: 'Tunisia', TW: 'Taiwan', TZ: 'Tanzania',
  UG: 'Uganda', UA: 'Ukraine', UY: 'Uruguay', UZ: 'Uzbekistan', VE: 'Venezuela',
  VN: 'Vietnam', YE: 'Yemen', ZM: 'Zambia', ZW: 'Zimbabwe', ZA: 'South Africa',
  XK: 'Kosovo', NL: 'Netherlands', ES: 'Spain', GF: 'French Guiana', AW: 'Aruba',
  AI: 'Anguilla', BH: 'Bahrain', BL: 'Saint Barthélemy', BM: 'Bermuda', BB: 'Barbados',
  CW: 'Curaçao', DM: 'Dominica', GD: 'Grenada', GU: 'Guam', LC: 'Saint Lucia',
  MF: 'Saint Martin', MV: 'Maldives', MH: 'Marshall Islands', MS: 'Montserrat', NR: 'Nauru',
  PW: 'Palau', SX: 'Sint Maarten', TV: 'Tuvalu', VC: 'Saint Vincent and the Grenadines', VG: 'British Virgin Islands',
  BQBO: 'Bonaire', BQSE: 'Saba', BQSA: 'Sint Eustatius', MQ: 'Martinique', YT: 'Mayotte',
  RE: 'Réunion', KP: 'North Korea',
};

const COUNTRY_FLAGS: Partial<Record<CountryCode, string>> = {
  AF: '🇦🇫', AL: '🇦🇱', DZ: '🇩🇿', AE: '🇦🇪', AM: '🇦🇲',
  AT: '🇦🇹', BI: '🇧🇮', BE: '🇧🇪', BJ: '🇧🇯', BF: '🇧🇫',
  BD: '🇧🇩', BG: '🇧🇬', BA: '🇧🇦', BY: '🇧🇾', BZ: '🇧🇿',
  BO: '🇧🇴', BR: '🇧🇷', BN: '🇧🇳', BT: '🇧🇹', BW: '🇧🇼',
  CF: '🇨🇫', CH: '🇨🇭', CI: '🇨🇮', CM: '🇨🇲', CD: '🇨🇩',
  CG: '🇨🇬', CO: '🇨🇴', CR: '🇨🇷', CU: '🇨🇺', CZ: '🇨🇿',
  DE: '🇩🇪', DJ: '🇩🇯', DO: '🇩🇴', EG: '🇪🇬', EC: '🇪🇨',
  ER: '🇪🇷', EE: '🇪🇪', ET: '🇪🇹', FI: '🇫🇮', GA: '🇬🇦',
  GE: '🇬🇪', GH: '🇬🇭', GN: '🇬🇳', GM: '🇬🇲', GW: '🇬🇼',
  GQ: '🇬🇶', GL: '🇬🇱', GT: '🇬🇹', GY: '🇬🇾', HN: '🇭🇳',
  HR: '🇭🇷', HT: '🇭🇹', HU: '🇭🇺', IN: '🇮🇳', IE: '🇮🇪',
  IR: '🇮🇷', IQ: '🇮🇶', IS: '🇮🇸', IL: '🇮🇱', JM: '🇯🇲',
  JO: '🇯🇴', KZ: '🇰🇿', KE: '🇰🇪', KG: '🇰🇬', KH: '🇰🇭',
  KR: '🇰🇷', KW: '🇰🇼', LA: '🇱🇦', LB: '🇱🇧', LR: '🇱🇷',
  LY: '🇱🇾', LK: '🇱🇰', LS: '🇱🇸', LT: '🇱🇹', LU: '🇱🇺',
  LV: '🇱🇻', MA: '🇲🇦', MD: '🇲🇩', MG: '🇲🇬', MX: '🇲🇽',
  MK: '🇲🇰', ML: '🇲🇱', MM: '🇲🇲', MN: '🇲🇳', MZ: '🇲🇿',
  MR: '🇲🇷', MW: '🇲🇼', NA: '🇳🇦', NE: '🇳🇪', NG: '🇳🇬',
  NI: '🇳🇮', NP: '🇳🇵', PK: '🇵🇰', PA: '🇵🇦', PE: '🇵🇪',
  PL: '🇵🇱', PS: '🇵🇸', PT: '🇵🇹', PY: '🇵🇾', QA: '🇶🇦',
  RO: '🇷🇴', RW: '🇷🇼', EH: '🇪🇭', SA: '🇸🇦', SD: '🇸🇩',
  SS: '🇸🇸', SN: '🇸🇳', SL: '🇸🇱', SV: '🇸🇻', RS: '🇷🇸',
  SR: '🇸🇷', SK: '🇸🇰', SI: '🇸🇮', SE: '🇸🇪', SZ: '🇸🇿',
  SY: '🇸🇾', TD: '🇹🇩', TG: '🇹🇬', TH: '🇹🇭', TJ: '🇹🇯',
  TM: '🇹🇲', TL: '🇹🇱', TN: '🇹🇳', TW: '🇹🇼', TZ: '🇹🇿',
  UG: '🇺🇬', UA: '🇺🇦', UY: '🇺🇾', UZ: '🇺🇿', VE: '🇻🇪',
  VN: '🇻🇳', YE: '🇾🇪', ZM: '🇿🇲', ZW: '🇿🇼', ZA: '🇿🇦',
  XK: '🇽🇰', NL: '🇳🇱', ES: '🇪🇸', GF: '🇬🇫', AW: '🇦🇼',
  AI: '🇦🇮', BH: '🇧🇭', BL: '🇧🇱', BM: '🇧🇲', BB: '🇧🇧',
  CW: '🇨🇼', DM: '🇩🇲', GD: '🇬🇩', GU: '🇬🇺', LC: '🇱🇨',
  MF: '🇲🇫', MV: '🇲🇻', MH: '🇲🇭', MS: '🇲🇸', NR: '🇳🇷',
  PW: '🇵🇼', SX: '🇸🇽', TV: '🇹🇻', VC: '🇻🇨', VG: '🇻🇬',
  KP: '🇰🇵',
};

const StatBox = ({ 
  title, 
  value, 
  color = '#ff6b6b', 
  isDark 
}: { 
  title: string; 
  value: number; 
  color?: string;
  isDark: boolean;
}) => (
  <View style={styles.statBox}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={[styles.statTitle, isDark && styles.statTitleDark]}>{title}</Text>
  </View>
);

const CountryItem = ({ 
  code, 
  name, 
  isVisited, 
  onToggle,
  isDark 
}: { 
  code: CountryCode; 
  name: string; 
  isVisited: boolean; 
  onToggle: (code: CountryCode) => void;
  isDark: boolean;
}) => (
  <Pressable 
    style={({ pressed }) => [
      styles.countryItem, 
      isVisited && styles.countryItemVisited,
      isDark && styles.countryItemDark,
      pressed && styles.countryItemPressed
    ]}
    onPress={() => onToggle(code)}
  >
    <Text style={styles.countryFlag}>{COUNTRY_FLAGS[code]}</Text>
    <Text style={[styles.countryName, isDark && styles.countryNameDark]}>{name}</Text>
    {isVisited && <Text style={styles.checkmark}>✓</Text>}
  </Pressable>
);

const WorldMapSVG = ({ 
  visitedCountries, 
  onCountryPress,
  isDark 
}: { 
  visitedCountries: CountryCode[]; 
  onCountryPress: (code: CountryCode) => void;
  isDark: boolean;
}) => {
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [lastScale, setLastScale] = useState(1);
  const [lastTranslateX, setLastTranslateX] = useState(0);
  const [lastTranslateY, setLastTranslateY] = useState(0);

  // Tính toán kích thước map responsive - full width
  const containerWidth = SCREEN_WIDTH - (isSmallScreen ? 24 : 32);
  const containerHeight = isSmallScreen ? 400 : Math.min(SCREEN_HEIGHT * 0.6, 600);
  
  // Map size - larger for better quality when zoomed
  const mapWidth = containerWidth * 2; // Double width for full world map
  const mapHeight = (mapWidth * 550) / 2000 * 1.5; // Increase height for full visibility
  
  return (
    <View style={[styles.mapScrollView, { height: containerHeight }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={true}
        minimumZoomScale={0.5}
        maximumZoomScale={5}
        bounces={true}
        bouncesZoom={true}
        scrollEnabled={true}
        contentContainerStyle={{
          paddingHorizontal: isSmallScreen ? 12 : 16,
          paddingVertical: 8,
        }}
      >
        <View 
          style={[
            styles.svgContainer,
            {
              width: mapWidth,
              height: mapHeight,
              transform: [
                { translateX },
                { translateY },
                { scale },
              ],
            }
          ]}
        >
          <Svg width={mapWidth} height={mapHeight} viewBox="0 0 2000 550" preserveAspectRatio="xMidYMid meet">
            {/* Background */}
            <Path
              d="M0,0 L2000,0 L2000,550 L0,550 Z"
              fill={isDark ? '#1a2332' : '#e8f4f8'}
            />
            
            {/* Countries */}
            {Object.entries(COUNTRIES_PATHS).map(([code, path]) => {
              const isVisited = visitedCountries.includes(code as CountryCode);
              return (
                <Path
                  key={code}
                  d={path}
                  fill={isVisited ? '#ff6b6b' : (isDark ? '#374151' : '#d4d4d4')}
                  stroke={isDark ? '#1f2937' : '#1a1a1a'}
                  strokeWidth={0.8}
                  onPress={() => onCountryPress(code as CountryCode)}
                />
              );
            })}
          </Svg>
        </View>
      </ScrollView>
      
      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <Pressable
          style={({ pressed }) => [
            styles.zoomButton,
            { backgroundColor: isDark ? '#374151' : '#fff' },
            pressed && styles.zoomButtonPressed
          ]}
          onPress={() => {
            const newScale = Math.min(scale * 1.3, 5);
            setScale(newScale);
            setLastScale(newScale);
          }}
        >
          <Text style={[styles.zoomButtonText, { color: isDark ? '#fff' : '#000' }]}>+</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.zoomButton,
            { backgroundColor: isDark ? '#374151' : '#fff' },
            pressed && styles.zoomButtonPressed
          ]}
          onPress={() => {
            const newScale = Math.max(scale / 1.3, 0.5);
            setScale(newScale);
            setLastScale(newScale);
          }}
        >
          <Text style={[styles.zoomButtonText, { color: isDark ? '#fff' : '#000' }]}>−</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.zoomButton,
            { backgroundColor: isDark ? '#374151' : '#fff' },
            pressed && styles.zoomButtonPressed
          ]}
          onPress={() => {
            setScale(1);
            setTranslateX(0);
            setTranslateY(0);
            setLastScale(1);
            setLastTranslateX(0);
            setLastTranslateY(0);
          }}
        >
          <Text style={[styles.zoomButtonText, { color: isDark ? '#fff' : '#000', fontSize: 12 }]}>⟲</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function TravelMapComponent() {
  const { colors, isDarkMode } = useTheme();
  const [visitedCountries, setVisitedCountries] = useState<CountryCode[]>([
    'VN', 'TH', 'PL', 'SE', 'DE', 'BR', 'KR', 'IN'
  ]);
  const [visitedCities] = useState(140);
  const [visitedPlaces] = useState(216);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);

  const toggleCountry = useCallback((code: CountryCode) => {
    setVisitedCountries(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  }, []);

  const handleCountryPress = useCallback((code: CountryCode) => {
    setSelectedCountry(code);
    toggleCountry(code);
    // Hide tooltip after 1.5s
    setTimeout(() => setSelectedCountry(null), 1500);
  }, [toggleCountry]);

  const filteredCountries = (Object.keys(COUNTRY_NAMES) as CountryCode[]).filter(code =>
    COUNTRY_NAMES[code]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const progressPercentage = Math.round(
    (visitedCountries.length / Object.keys(COUNTRY_NAMES).length) * 100
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.main }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? '#1a2332' : '#2c3e50'}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Compact Header */}
        {/* <View style={[styles.header, isDarkMode && styles.headerDark]}>
          <Text style={styles.headerTitle}>🌍 My Travel Map</Text>
          <Text style={styles.headerSubtitle}>
            {progressPercentage}% of the world explored
          </Text>
        </View> */}

        {/* Stats Container */}
        {/* <View style={[styles.statsContainer, { backgroundColor: colors.background.card }]}>
          <StatBox title="Countries" value={visitedCountries.length} color="#ff6b6b" isDark={isDarkMode} />
          <StatBox title="Cities" value={visitedCities} color="#4ecdc4" isDark={isDarkMode} />
          <StatBox title="Places" value={visitedPlaces} color="#ffd93d" isDark={isDarkMode} />
        </View> */}

        {/* World Map - Full Width */}
        <View style={[styles.mapContainer, { backgroundColor: colors.background.card }]}>
          <View style={styles.mapHeader}>
            <Text style={[styles.mapTitle, { color: colors.text.primary }]}>Interactive World Map</Text>
            <Text style={[styles.mapHint, { color: colors.text.secondary }]}>
              Tap countries to mark as visited
            </Text>
          </View>
          
          <WorldMapSVG 
            visitedCountries={visitedCountries}
            onCountryPress={handleCountryPress}
            isDark={isDarkMode}
          />
          
          {/* Tooltip for selected country */}
          {selectedCountry && (
            <View style={[styles.tooltip, { backgroundColor: colors.background.card }]}>
              <Text style={styles.tooltipFlag}>{COUNTRY_FLAGS[selectedCountry]}</Text>
              <Text style={[styles.tooltipText, { color: colors.text.primary }]}>
                {COUNTRY_NAMES[selectedCountry]}
              </Text>
              <Text style={styles.tooltipStatus}>
                {visitedCountries.includes(selectedCountry) ? '✓ Visited' : '+ Added'}
              </Text>
            </View>
          )}
          
          {/* Compact Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ff6b6b' }]} />
              <Text style={[styles.legendText, { color: colors.text.secondary }]}>Visited</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: isDarkMode ? '#374151' : '#d4d4d4' }]} />
              <Text style={[styles.legendText, { color: colors.text.secondary }]}>Not visited</Text>
            </View>
          </View>
        </View>

        {/* Visited Countries Flags - Compact */}
        {/* {visitedCountries.length > 0 && (
          <View style={[styles.flagsSection, { backgroundColor: colors.background.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Visited Countries ({visitedCountries.length})
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flagsScrollContent}
            >
              {visitedCountries.map(code => (
                <Pressable 
                  key={code} 
                  style={({ pressed }) => [
                    styles.flagWrapper,
                    { backgroundColor: isDarkMode ? '#374151' : '#f8f9fa' },
                    pressed && styles.flagWrapperPressed
                  ]}
                  onPress={() => handleCountryPress(code)}
                >
                  <Text style={styles.flagEmoji}>{COUNTRY_FLAGS[code]}</Text>
                  <Text style={[styles.flagLabel, { color: colors.text.secondary }]}>
                    {COUNTRY_NAMES[code]?.substring(0, 8)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )} */}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {/* <Pressable 
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>➕ Add Countries</Text>
          </Pressable> */}
{/*           
          {visitedCountries.length > 0 && (
            <Pressable 
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: colors.border.main, backgroundColor: colors.background.card },
                pressed && styles.secondaryButtonPressed
              ]}
              onPress={() => setVisitedCountries([])}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text.secondary }]}>
                Clear All
              </Text>
            </Pressable>
          )} */}
        </View>
      </ScrollView>

      {/* Country List Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdrop}
            onPress={() => {
              setModalVisible(false);
              setSearchQuery('');
            }}
          />
          <View style={[styles.modalContent, { backgroundColor: colors.background.card }]}>
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Select Countries</Text>
              <Pressable 
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery('');
                }}
                style={styles.closeButtonWrapper}
              >
                <Text style={[styles.closeButton, { color: colors.text.secondary }]}>✕</Text>
              </Pressable>
            </View>

            <TextInput
              style={[
                styles.searchInput, 
                { 
                  backgroundColor: isDarkMode ? '#374151' : '#f8f9fa',
                  color: colors.text.primary 
                }
              ]}
              placeholder="Search countries..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.text.secondary}
            />

            <Text style={[styles.resultCount, { color: colors.text.secondary }]}>
              {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'} found
            </Text>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const countryName = COUNTRY_NAMES[item];
                if (!countryName) return null;
                return (
                  <CountryItem
                    code={item}
                    name={countryName}
                    isVisited={visitedCountries.includes(item)}
                    onToggle={toggleCountry}
                    isDark={isDarkMode}
                  />
                );
              }}
              style={styles.countryList}
              showsVerticalScrollIndicator={false}
              initialNumToRender={15}
              maxToRenderPerBatch={10}
              windowSize={10}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
  },
  headerDark: {
    backgroundColor: '#1a2332',
  },
  headerTitle: {
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 12 : 13,
    color: '#bdc3c7',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: isSmallScreen ? 16 : 20,
    paddingHorizontal: 12,
    marginTop: -16,
    marginHorizontal: isSmallScreen ? 12 : 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: isSmallScreen ? 26 : 32,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: isSmallScreen ? 11 : 13,
    color: '#666',
    fontWeight: '600',
  },
  statTitleDark: {
    color: '#9ca3af',
  },
  mapContainer: {
    marginHorizontal: isSmallScreen ? 12 : 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  mapHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mapHint: {
    fontSize: isSmallScreen ? 11 : 12,
    fontStyle: 'italic',
  },
  mapScrollView: {
    marginBottom: 8,
    position: 'relative',
  },
  mapScrollContent: {
    paddingHorizontal: isSmallScreen ? 12 : 16,
  },
  svgContainer: {
    borderRadius: 12,
    overflow: 'visible',
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'column',
    gap: 8,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  zoomButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  zoomButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tooltip: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  tooltipFlag: {
    fontSize: 24,
  },
  tooltipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tooltipStatus: {
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: isSmallScreen ? 11 : 12,
  },
  flagsSection: {
    marginHorizontal: isSmallScreen ? 12 : 16,
    marginBottom: 12,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 15 : 17,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  flagsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  flagWrapper: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 70,
  },
  flagWrapperPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
  flagEmoji: {
    fontSize: isSmallScreen ? 28 : 32,
    marginBottom: 4,
  },
  flagLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: isSmallScreen ? 12 : 16,
    marginBottom: 20,
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#ff6b6b',
    paddingVertical: isSmallScreen ? 14 : 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: isSmallScreen ? 14 : 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  secondaryButtonPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.98 }],
  },
  secondaryButtonText: {
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: isSmallScreen ? 20 : 22,
    fontWeight: 'bold',
  },
  closeButtonWrapper: {
    padding: 4,
  },
  closeButton: {
    fontSize: 26,
    fontWeight: '300',
  },
  resultCount: {
    fontSize: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  searchInput: {
    paddingHorizontal: 16,
    paddingVertical: isSmallScreen ? 12 : 14,
    borderRadius: 12,
    fontSize: isSmallScreen ? 15 : 16,
    marginBottom: 12,
  },
  countryList: {
    flexGrow: 0,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  countryItemVisited: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  countryFlag: {
    fontSize: isSmallScreen ? 26 : 28,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: isSmallScreen ? 15 : 16,
  },
  checkmark: {
    fontSize: 18,
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  countryItemDark: {
    backgroundColor: 'transparent',
  },
  countryItemPressed: {
    opacity: 0.7,
  },
  countryNameDark: {
    color: '#e5e7eb',
  },
});