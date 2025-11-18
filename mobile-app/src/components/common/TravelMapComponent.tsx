import React, { useState, useCallback, useRef } from 'react';
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
import Svg, { Path } from 'react-native-svg';
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

// Stats Card Component với animation
const StatCard = ({
  title,
  value,
  icon,
  color = '#FF6B6B',
  isDark
}: {
  title: string;
  value: number;
  icon: string;
  color?: string;
  isDark: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Text style={styles.statIcon}>{icon}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
        {title}
      </Text>
    </Animated.View>
  );
};

// Country Item với animation
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
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      })
    ]).start();
    onToggle(code);
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.countryItem,
          isVisited && styles.countryItemVisited,
          {
            backgroundColor: isVisited
              ? (isDark ? '#1F2937' : '#FFF5F5')
              : (isDark ? '#111827' : '#FFFFFF'),
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.countryItemLeft}>
          <Text style={styles.countryFlag}>{COUNTRY_FLAGS[code]}</Text>
          <Text style={[
            styles.countryName,
            { color: isDark ? '#F3F4F6' : '#1F2937' }
          ]}>
            {name}
          </Text>
        </View>
        {isVisited && (
          <View style={styles.checkmarkContainer}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

// World Map Component
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

  const containerWidth = SCREEN_WIDTH;
  const containerHeight = Math.min(SCREEN_HEIGHT * 0.5, 500);

  const mapWidth = containerWidth * 2;
  const mapHeight = (mapWidth * 550) / 2000 * 1.5;

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.3, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.3, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  return (
    <View style={[styles.mapWrapper, { height: containerHeight }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        bounces={true}
        contentContainerStyle={styles.mapScrollContent}
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
          <Svg
            width={mapWidth}
            height={mapHeight}
            viewBox="0 0 2000 550"
            preserveAspectRatio="xMidYMid meet"
          >
            <Path
              d="M0,0 L2000,0 L2000,550 L0,550 Z"
              fill={isDark ? '#0F172A' : '#F0F9FF'}
            />

            {Object.entries(COUNTRIES_PATHS).map(([code, path]) => {
              const isVisited = visitedCountries.includes(code as CountryCode);
              return (
                <Path
                  key={code}
                  d={path}
                  fill={isVisited ? '#FF6B6B' : (isDark ? '#1E293B' : '#E2E8F0')}
                  stroke={isDark ? '#0F172A' : '#CBD5E1'}
                  strokeWidth={0.5}
                  onPress={() => onCountryPress(code as CountryCode)}
                />
              );
            })}
          </Svg>
        </View>
      </ScrollView>

      <View style={styles.zoomControls}>
        <Pressable
          style={({ pressed }) => [
            styles.zoomButton,
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
            pressed && styles.zoomButtonPressed
          ]}
          onPress={handleZoomIn}
        >
          <Text style={[styles.zoomButtonText, { color: isDark ? '#F3F4F6' : '#1F2937' }]}>
            +
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.zoomButton,
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
            pressed && styles.zoomButtonPressed
          ]}
          onPress={handleZoomOut}
        >
          <Text style={[styles.zoomButtonText, { color: isDark ? '#F3F4F6' : '#1F2937' }]}>
            −
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.zoomButton,
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
            pressed && styles.zoomButtonPressed
          ]}
          onPress={handleReset}
        >
          <Text style={[styles.zoomButtonText, { color: isDark ? '#F3F4F6' : '#1F2937', fontSize: 14 }]}>
            ⟲
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

// Main Component
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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

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
    setTimeout(() => setSelectedCountry(null), 2000);
  }, [toggleCountry]);

  const filteredCountries = (Object.keys(COUNTRY_NAMES) as CountryCode[]).filter(code =>
    COUNTRY_NAMES[code]?.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    const nameA = COUNTRY_NAMES[a] || '';
    const nameB = COUNTRY_NAMES[b] || '';
    return nameA.localeCompare(nameB);
  });

  const progressPercentage = Math.round(
    (visitedCountries.length / Object.keys(COUNTRY_NAMES).length) * 100
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.main }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background.main}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header với Gradient Effect */}
          <View style={[styles.header, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
              🌍 My Travel Journey
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
              Exploring the world, one country at a time
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, { color: colors.text.secondary }]}>
                  World Progress
                </Text>
                <Text style={[styles.progressPercentage, { color: '#FF6B6B' }]}>
                  {progressPercentage}%
                </Text>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progressPercentage}%`, backgroundColor: '#FF6B6B' }
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <StatCard
              title="Countries"
              value={visitedCountries.length}
              icon="🌎"
              color="#FF6B6B"
              isDark={isDarkMode}
            />
            <StatCard
              title="Cities"
              value={visitedCities}
              icon="🏙️"
              color="#4ECDC4"
              isDark={isDarkMode}
            />
            <StatCard
              title="Places"
              value={visitedPlaces}
              icon="📍"
              color="#FFD93D"
              isDark={isDarkMode}
            />
          </View>

          {/* Interactive Map Section */}
          <View style={[styles.mapSection, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
            <View style={styles.mapSectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Interactive World Map
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
                  Tap any country to mark as visited
                </Text>
              </View>
            </View>

            <WorldMapSVG
              visitedCountries={visitedCountries}
              onCountryPress={handleCountryPress}
              isDark={isDarkMode}
            />

            {/* Country Tooltip */}
            {selectedCountry && (
              <View style={[styles.tooltip, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
                <Text style={styles.tooltipFlag}>{COUNTRY_FLAGS[selectedCountry]}</Text>
                <Text style={[styles.tooltipText, { color: colors.text.primary }]}>
                  {COUNTRY_NAMES[selectedCountry]}
                </Text>
                <View style={[
                  styles.tooltipBadge,
                  { backgroundColor: visitedCountries.includes(selectedCountry) ? '#10B981' : '#FF6B6B' }
                ]}>
                  <Text style={styles.tooltipBadgeText}>
                    {visitedCountries.includes(selectedCountry) ? '✓ Visited' : '+ Added'}
                  </Text>
                </View>
              </View>
            )}

            {/* Map Legend */}
            <View style={styles.mapLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
                <Text style={[styles.legendText, { color: colors.text.secondary }]}>
                  Visited
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[
                  styles.legendDot,
                  { backgroundColor: isDarkMode ? '#1E293B' : '#E2E8F0' }
                ]} />
                <Text style={[styles.legendText, { color: colors.text.secondary }]}>
                  Not visited
                </Text>
              </View>
            </View>
          </View>

          {/* Visited Countries Grid */}
          {visitedCountries.length > 0 && (
            <View style={[styles.visitedSection, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
              <View style={styles.visitedHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                  Visited Countries
                </Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{visitedCountries.length}</Text>
                </View>
              </View>

              <View style={styles.flagGrid}>
                {visitedCountries.map(code => (
                  <Pressable
                    key={code}
                    style={({ pressed }) => [
                      styles.flagCard,
                      { backgroundColor: isDarkMode ? '#374151' : '#F9FAFB' },
                      pressed && styles.flagCardPressed
                    ]}
                    onPress={() => handleCountryPress(code)}
                  >
                    <Text style={styles.flagCardEmoji}>{COUNTRY_FLAGS[code]}</Text>
                    <Text
                      style={[styles.flagCardName, { color: colors.text.secondary }]}
                      numberOfLines={2}
                    >
                      {COUNTRY_NAMES[code]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed
              ]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonIcon}>+</Text>
              <Text style={styles.addButtonText}>Add Countries</Text>
            </Pressable>

            {visitedCountries.length > 0 && (
              <Pressable
                style={({ pressed }) => [
                  styles.clearButton,
                  {
                    backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                  },
                  pressed && styles.clearButtonPressed
                ]}
                onPress={() => setVisitedCountries([])}
              >
                <Text style={[styles.clearButtonText, { color: colors.text.secondary }]}>
                  Clear All
                </Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Country Selection Modal */}
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
          <View style={[
            styles.modalContent,
            { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }
          ]}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                Select Countries
              </Text>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery('');
                }}
                style={styles.modalCloseButton}
              >
                <Text style={[styles.modalCloseText, { color: colors.text.secondary }]}>✕</Text>
              </Pressable>
            </View>

            <View style={[
              styles.searchContainer,
              { backgroundColor: isDarkMode ? '#374151' : '#F9FAFB' }
            ]}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={[styles.searchInput, { color: colors.text.primary }]}
                placeholder="Search countries..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.text.secondary}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Text style={[styles.searchClear, { color: colors.text.secondary }]}>✕</Text>
                </Pressable>
              )}
            </View>

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
              initialNumToRender={20}
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
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 13 : 14,
    marginBottom: 20,
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: isSmallScreen ? 24 : 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mapSection: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  mapSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
  },
  mapWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  mapScrollContent: {
    paddingHorizontal: 20,
  },
  svgContainer: {
    overflow: 'visible',
  },
  zoomControls: {
    position: 'absolute',
    right: 28,
    bottom: 20,
    gap: 8,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  zoomButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  zoomButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  tooltip: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    gap: 12,
  },
  tooltipFlag: {
    fontSize: 28,
  },
  tooltipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tooltipBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tooltipBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  visitedSection: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  visitedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  countBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  flagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  flagCard: {
    width: (SCREEN_WIDTH - 80) / 3,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  flagCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  flagCardEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  flagCardName: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    gap: 8,
  },
  addButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  addButtonIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  clearButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  clearButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: isSmallScreen ? 22 : 24,
    fontWeight: '700',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 28,
    fontWeight: '300',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  searchClear: {
    fontSize: 18,
    padding: 4,
  },
  resultCount: {
    fontSize: 12,
    marginBottom: 12,
    fontWeight: '500',
  },
  countryList: {
    flexGrow: 0,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  countryItemVisited: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  countryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  countryFlag: {
    fontSize: 28,
  },
  countryName: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  checkmarkContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
