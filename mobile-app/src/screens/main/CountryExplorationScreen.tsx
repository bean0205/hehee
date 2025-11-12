import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { usePin } from '../../contexts/PinContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useNavigation } from '@react-navigation/native';

// Mapping country names to flag emojis
const COUNTRY_FLAGS: Record<string, string> = {
  'Afghanistan': '🇦🇫', 'Albania': '🇦🇱', 'Algeria': '🇩🇿', 'Andorra': '🇦🇩', 'Angola': '🇦🇴',
  'Argentina': '🇦🇷', 'Armenia': '🇦🇲', 'Úc': '🇦🇺', 'Áo': '🇦🇹', 'Azerbaijan': '🇦🇿',
  'Bahamas': '🇧🇸', 'Bahrain': '🇧🇭', 'Bangladesh': '🇧🇩', 'Barbados': '🇧🇧', 'Belarus': '🇧🇾',
  'Bỉ': '🇧🇪', 'Belize': '🇧🇿', 'Benin': '🇧🇯', 'Bhutan': '🇧🇹', 'Bolivia': '🇧🇴',
  'Bosnia và Herzegovina': '🇧🇦', 'Botswana': '🇧🇼', 'Brazil': '🇧🇷', 'Brunei': '🇧🇳',
  'Bulgaria': '🇧🇬', 'Burkina Faso': '🇧🇫', 'Burundi': '🇧🇮', 'Cabo Verde': '🇨🇻',
  'Cambodia': '🇰🇭', 'Cameroon': '🇨🇲', 'Canada': '🇨🇦', 'Trung Phi': '🇨🇫', 'Chad': '🇹🇩',
  'Chile': '🇨🇱', 'Trung Quốc': '🇨🇳', 'Colombia': '🇨🇴', 'Comoros': '🇰🇲', 'Congo': '🇨🇬',
  'Costa Rica': '🇨🇷', 'Croatia': '🇭🇷', 'Cuba': '🇨🇺', 'Síp': '🇨🇾', 'Séc': '🇨🇿',
  'Đan Mạch': '🇩🇰', 'Djibouti': '🇩🇯', 'Dominica': '🇩🇲', 'Cộng hòa Dominica': '🇩🇴',
  'Ecuador': '🇪🇨', 'Ai Cập': '🇪🇬', 'El Salvador': '🇸🇻', 'Anh': '🇬🇧', 'Estonia': '🇪🇪',
  'Eswatini': '🇸🇿', 'Ethiopia': '🇪🇹', 'Fiji': '🇫🇯', 'Phần Lan': '🇫🇮', 'Pháp': '🇫🇷',
  'Gabon': '🇬🇦', 'Gambia': '🇬🇲', 'Georgia': '🇬🇪', 'Đức': '🇩🇪', 'Ghana': '🇬🇭',
  'Hy Lạp': '🇬🇷', 'Grenada': '🇬🇩', 'Guatemala': '🇬🇹', 'Guinea': '🇬🇳', 'Guinea-Bissau': '🇬🇼',
  'Guyana': '🇬🇾', 'Haiti': '🇭🇹', 'Honduras': '🇭🇳', 'Hungary': '🇭🇺', 'Iceland': '🇮🇸',
  'Ấn Độ': '🇮🇳', 'Indonesia': '🇮🇩', 'Iran': '🇮🇷', 'Iraq': '🇮🇶', 'Ireland': '🇮🇪',
  'Israel': '🇮🇱', 'Ý': '🇮🇹', 'Jamaica': '🇯🇲', 'Nhật Bản': '🇯🇵', 'Jordan': '🇯🇴',
  'Kazakhstan': '🇰🇿', 'Kenya': '🇰🇪', 'Kiribati': '🇰🇮', 'Kuwait': '🇰🇼', 'Kyrgyzstan': '🇰🇬',
  'Lào': '🇱🇦', 'Latvia': '🇱🇻', 'Lebanon': '🇱🇧', 'Lesotho': '🇱🇸', 'Liberia': '🇱🇷',
  'Libya': '🇱🇾', 'Liechtenstein': '🇱🇮', 'Lithuania': '🇱🇹', 'Luxembourg': '🇱🇺',
  'Madagascar': '🇲🇬', 'Malawi': '🇲🇼', 'Malaysia': '🇲🇾', 'Maldives': '🇲🇻', 'Mali': '🇲🇱',
  'Malta': '🇲🇹', 'Mauritania': '🇲🇷', 'Mauritius': '🇲🇺', 'Mexico': '🇲🇽', 'Micronesia': '🇫🇲',
  'Moldova': '🇲🇩', 'Monaco': '🇲🇨', 'Mông Cổ': '🇲🇳', 'Montenegro': '🇲🇪', 'Morocco': '🇲🇦',
  'Mozambique': '🇲🇿', 'Myanmar': '🇲🇲', 'Namibia': '🇳🇦', 'Nauru': '🇳🇷', 'Nepal': '🇳🇵',
  'Hà Lan': '🇳🇱', 'New Zealand': '🇳🇿', 'Nicaragua': '🇳🇮', 'Niger': '🇳🇪', 'Nigeria': '🇳🇬',
  'Bắc Macedonia': '🇲🇰', 'Na Uy': '🇳🇴', 'Oman': '🇴🇲', 'Pakistan': '🇵🇰', 'Palau': '🇵🇼',
  'Palestine': '🇵🇸', 'Panama': '🇵🇦', 'Papua New Guinea': '🇵🇬', 'Paraguay': '🇵🇾', 'Peru': '🇵🇪',
  'Philippines': '🇵🇭', 'Ba Lan': '🇵🇱', 'Bồ Đào Nha': '🇵🇹', 'Qatar': '🇶🇦', 'Romania': '🇷🇴',
  'Nga': '🇷🇺', 'Rwanda': '🇷🇼', 'Saint Lucia': '🇱🇨', 'Samoa': '🇼🇸', 'San Marino': '🇸🇲',
  'Saudi Arabia': '🇸🇦', 'Senegal': '🇸🇳', 'Serbia': '🇷🇸', 'Seychelles': '🇸🇨',
  'Sierra Leone': '🇸🇱', 'Singapore': '🇸🇬', 'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮',
  'Solomon Islands': '🇸🇧', 'Somalia': '🇸🇴', 'Nam Phi': '🇿🇦', 'Hàn Quốc': '🇰🇷',
  'Tây Ban Nha': '🇪🇸', 'Sri Lanka': '🇱🇰', 'Sudan': '🇸🇩', 'Suriname': '🇸🇷', 'Thụy Điển': '🇸🇪',
  'Thụy Sĩ': '🇨🇭', 'Syria': '🇸🇾', 'Đài Loan': '🇹🇼', 'Tajikistan': '🇹🇯', 'Tanzania': '🇹🇿',
  'Thái Lan': '🇹🇭', 'Timor-Leste': '🇹🇱', 'Togo': '🇹🇬', 'Tonga': '🇹🇴',
  'Trinidad và Tobago': '🇹🇹', 'Tunisia': '🇹🇳', 'Thổ Nhĩ Kỳ': '🇹🇷', 'Turkmenistan': '🇹🇲',
  'Tuvalu': '🇹🇻', 'Uganda': '🇺🇬', 'Ukraine': '🇺🇦', 'UAE': '🇦🇪', 'Mỹ': '🇺🇸',
  'Uruguay': '🇺🇾', 'Uzbekistan': '🇺🇿', 'Vanuatu': '🇻🇺', 'Vatican': '🇻🇦',
  'Venezuela': '🇻🇪', 'Việt Nam': '🇻🇳', 'Yemen': '🇾🇪', 'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼'
};

// Countries grouped by continent
const CONTINENTS = {
  'Châu Á': {
    emoji: '🌏',
    countries: ['Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 
      'Brunei', 'Cambodia', 'Trung Quốc', 'Síp', 'Georgia', 'Ấn Độ', 'Indonesia', 'Iran', 
      'Iraq', 'Israel', 'Nhật Bản', 'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Lào', 
      'Lebanon', 'Malaysia', 'Maldives', 'Mông Cổ', 'Myanmar', 'Nepal', 'Oman', 'Pakistan', 
      'Palestine', 'Philippines', 'Qatar', 'Nga', 'Saudi Arabia', 'Singapore', 'Hàn Quốc', 
      'Sri Lanka', 'Syria', 'Đài Loan', 'Tajikistan', 'Thái Lan', 'Timor-Leste', 'Thổ Nhĩ Kỳ', 
      'Turkmenistan', 'UAE', 'Uzbekistan', 'Việt Nam', 'Yemen']
  },
  'Châu Âu': {
    emoji: '🇪🇺',
    countries: ['Albania', 'Andorra', 'Áo', 'Belarus', 'Bỉ', 'Bosnia và Herzegovina', 'Bulgaria', 
      'Croatia', 'Séc', 'Đan Mạch', 'Estonia', 'Phần Lan', 'Pháp', 'Đức', 'Hy Lạp', 'Hungary', 
      'Iceland', 'Ireland', 'Ý', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 
      'Moldova', 'Monaco', 'Montenegro', 'Hà Lan', 'Bắc Macedonia', 'Na Uy', 'Ba Lan', 'Bồ Đào Nha', 
      'Romania', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Tây Ban Nha', 'Thụy Điển', 
      'Thụy Sĩ', 'Ukraine', 'Anh', 'Vatican']
  },
  'Châu Phi': {
    emoji: '🌍',
    countries: ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 
      'Cameroon', 'Trung Phi', 'Chad', 'Comoros', 'Congo', 'Djibouti', 'Ai Cập', 'Eswatini', 
      'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 
      'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 
      'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Senegal', 'Seychelles', 'Sierra Leone', 
      'Somalia', 'Nam Phi', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe']
  },
  'Châu Mỹ': {
    emoji: '🌎',
    countries: ['Argentina', 'Bahamas', 'Barbados', 'Belize', 'Bolivia', 'Brazil', 'Canada', 'Chile', 
      'Colombia', 'Costa Rica', 'Cuba', 'Dominica', 'Cộng hòa Dominica', 'Ecuador', 'El Salvador', 
      'Grenada', 'Guatemala', 'Guyana', 'Haiti', 'Honduras', 'Jamaica', 'Mexico', 'Nicaragua', 
      'Panama', 'Paraguay', 'Peru', 'Saint Lucia', 'Suriname', 'Trinidad và Tobago', 'Mỹ', 
      'Uruguay', 'Venezuela']
  },
  'Châu Đại Dương': {
    emoji: '🌏',
    countries: ['Úc', 'Fiji', 'Kiribati', 'Micronesia', 'Nauru', 'New Zealand', 'Palau', 
      'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu']
  }
};

// List of all countries in the world (simplified - top countries)
const ALL_COUNTRIES = Object.keys(COUNTRY_FLAGS);

export const CountryExplorationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { pins } = usePin();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'visited' | 'notVisited'>('all');
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);

  // Extract visited countries from pins - using string set to avoid type issues
  const visitedCountriesArray = pins.map(p => {
    const name = p.name.toLowerCase();
    if (name.includes('nhật bản') || name.includes('tokyo') || name.includes('osaka') || name.includes('kyoto')) return 'Nhật Bản';
    if (name.includes('pháp') || name.includes('paris')) return 'Pháp';
    if (name.includes('mỹ') || name.includes('new york') || name.includes('los angeles')) return 'Mỹ';
    if (name.includes('trung quốc') || name.includes('bắc kinh') || name.includes('thượng hải')) return 'Trung Quốc';
    if (name.includes('italy') || name.includes('ý') || name.includes('rome') || name.includes('milan')) return 'Ý';
    if (name.includes('thái lan') || name.includes('bangkok')) return 'Thái Lan';
    if (name.includes('hàn quốc') || name.includes('seoul')) return 'Hàn Quốc';
    if (name.includes('singapore')) return 'Singapore';
    if (name.includes('malaysia')) return 'Malaysia';
    if (name.includes('indonesia') || name.includes('bali')) return 'Indonesia';
    if (name.includes('úc') || name.includes('sydney')) return 'Úc';
    if (name.includes('anh') || name.includes('london')) return 'Anh';
    if (name.includes('đức') || name.includes('berlin')) return 'Đức';
    if (name.includes('tây ban nha') || name.includes('barcelona')) return 'Tây Ban Nha';
    return 'Việt Nam';
  });
  
  const visitedCountries: string[] = Array.from(new Set(visitedCountriesArray));

  // Count pins per country
  const countryPinCount = pins.reduce((acc, p) => {
    const name = p.name.toLowerCase();
    let country = 'Việt Nam';
    if (name.includes('nhật bản') || name.includes('tokyo') || name.includes('osaka') || name.includes('kyoto')) country = 'Nhật Bản';
    else if (name.includes('pháp') || name.includes('paris')) country = 'Pháp';
    else if (name.includes('mỹ') || name.includes('new york') || name.includes('los angeles')) country = 'Mỹ';
    else if (name.includes('trung quốc') || name.includes('bắc kinh') || name.includes('thượng hải')) country = 'Trung Quốc';
    else if (name.includes('italy') || name.includes('ý') || name.includes('rome') || name.includes('milan')) country = 'Ý';
    else if (name.includes('thái lan') || name.includes('bangkok')) country = 'Thái Lan';
    else if (name.includes('hàn quốc') || name.includes('seoul')) country = 'Hàn Quốc';
    else if (name.includes('singapore')) country = 'Singapore';
    else if (name.includes('malaysia')) country = 'Malaysia';
    else if (name.includes('indonesia') || name.includes('bali')) country = 'Indonesia';
    else if (name.includes('úc') || name.includes('sydney')) country = 'Úc';
    else if (name.includes('anh') || name.includes('london')) country = 'Anh';
    else if (name.includes('đức') || name.includes('berlin')) country = 'Đức';
    else if (name.includes('tây ban nha') || name.includes('barcelona')) country = 'Tây Ban Nha';
    
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter countries
  let filteredCountries = ALL_COUNTRIES;
  
  // Filter by continent if selected
  if (selectedContinent) {
    filteredCountries = CONTINENTS[selectedContinent as keyof typeof CONTINENTS].countries;
  }
  
  // Filter by search and visited status
  filteredCountries = filteredCountries.filter(country => {
    const matchesSearch = country.toLowerCase().includes(searchQuery.toLowerCase());
    const isVisited = visitedCountries.includes(country);
    
    if (filter === 'visited') return matchesSearch && isVisited;
    if (filter === 'notVisited') return matchesSearch && !isVisited;
    return matchesSearch;
  }).sort((a, b) => {
    // Sort: visited countries first, then by pin count, then alphabetically
    const aVisited = visitedCountries.includes(a);
    const bVisited = visitedCountries.includes(b);
    
    if (aVisited && !bVisited) return -1;
    if (!aVisited && bVisited) return 1;
    
    if (aVisited && bVisited) {
      const aCount = countryPinCount[a] || 0;
      const bCount = countryPinCount[b] || 0;
      if (aCount !== bCount) return bCount - aCount;
    }
    
    return a.localeCompare(b, 'vi');
  });

  const visitedCount = visitedCountries.length;
  const notVisitedCount = ALL_COUNTRIES.length - visitedCount;
  const explorationPercentage = Math.round((visitedCount / ALL_COUNTRIES.length) * 100);

  // Helper function to check if country is visited
  const isCountryVisited = (country: string): boolean => {
    return visitedCountries.includes(country);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Khám phá thế giới</Text>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{explorationPercentage}%</Text>
          <Text style={styles.statLabel}>Đã khám phá</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{visitedCount}</Text>
          <Text style={styles.statLabel}>Đã đến</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{notVisitedCount}</Text>
          <Text style={styles.statLabel}>Chưa đến</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm quốc gia..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.text.secondary}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            Tất cả ({ALL_COUNTRIES.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'visited' && styles.activeFilter]}
          onPress={() => setFilter('visited')}
        >
          <Text style={[styles.filterText, filter === 'visited' && styles.activeFilterText]}>
            Đã đến ({visitedCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'notVisited' && styles.activeFilter]}
          onPress={() => setFilter('notVisited')}
        >
          <Text style={[styles.filterText, filter === 'notVisited' && styles.activeFilterText]}>
            Chưa đến ({notVisitedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Continent Selector */}
      <View style={styles.continentSelectorWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.continentSelectorContent}
        >
          <TouchableOpacity
            style={[styles.continentChip, !selectedContinent && styles.activeContinentChip]}
            onPress={() => setSelectedContinent(null)}
            activeOpacity={0.7}
          >
            <View style={[styles.continentIconWrapper, !selectedContinent && styles.activeContinentIconWrapper]}>
              <Text style={styles.continentEmoji}>🌍</Text>
            </View>
            <Text style={[styles.continentLabel, !selectedContinent && styles.activeContinentLabel]}>
              Tất cả
            </Text>
          </TouchableOpacity>
          {Object.entries(CONTINENTS).map(([continent, data]) => (
            <TouchableOpacity
              key={continent}
              style={[styles.continentChip, selectedContinent === continent && styles.activeContinentChip]}
              onPress={() => setSelectedContinent(continent)}
              activeOpacity={0.7}
            >
              <View style={[styles.continentIconWrapper, selectedContinent === continent && styles.activeContinentIconWrapper]}>
                <Text style={styles.continentEmoji}>{data.emoji}</Text>
              </View>
              <Text style={[styles.continentLabel, selectedContinent === continent && styles.activeContinentLabel]}>
                {continent}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Country List */}
      <ScrollView style={styles.countryList}>
        {filteredCountries.map((country) => {
          const isVisited = isCountryVisited(country);
          const pinCount = countryPinCount[country] || 0;
          const countryFlag = COUNTRY_FLAGS[country] || '🏳️';
          
          return (
            <View key={country} style={styles.countryItem}>
              <View style={styles.countryInfo}>
                <Text style={styles.countryFlag}>
                  {countryFlag}
                </Text>
                <View style={styles.countryTextContainer}>
                  <Text style={[
                    styles.countryName,
                    !isVisited && styles.countryNameNotVisited
                  ]}>
                    {country}
                  </Text>
                  {isVisited && pinCount > 0 && (
                    <Text style={styles.pinCount}>
                      📍 {pinCount} {pinCount === 1 ? 'địa điểm' : 'địa điểm'}
                    </Text>
                  )}
                </View>
              </View>
              {isVisited && (
                <View style={styles.visitedBadge}>
                  <Text style={styles.visitedBadgeText}>Đã đến</Text>
                </View>
              )}
            </View>
          );
        })}
        
        {filteredCountries.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Không tìm thấy quốc gia nào
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray200,
    backgroundColor: colors.neutral.white,
  },
  backButton: {
    marginRight: spacing.md,
  },
  backButtonText: {
    fontSize: typography.fontSize.base,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.semiBold,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.neutral.gray50,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.main,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.neutral.white,
  },
  searchInput: {
    backgroundColor: colors.neutral.gray100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray200,
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: colors.primary.main,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  activeFilterText: {
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.semiBold,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  countryFlag: {
    fontSize: 36,
    marginRight: spacing.md,
    width: 50,
  },
  countryTextContainer: {
    flex: 1,
  },
  countryName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  countryNameNotVisited: {
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.regular,
  },
  pinCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  visitedBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  visitedBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.success,
    fontWeight: typography.fontWeight.semiBold,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  continentSelectorWrapper: {
    backgroundColor: colors.neutral.white,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray200,
  },
  continentSelectorContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  continentChip: {
    alignItems: 'center',
    minWidth: 90,
  },
  activeContinentChip: {
    // Active state handled by child elements
  },
  continentIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeContinentIconWrapper: {
    backgroundColor: colors.primary.light || colors.primary.main + '20',
    borderColor: colors.primary.main,
  },
  continentEmoji: {
    fontSize: 28,
  },
  continentLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  activeContinentLabel: {
    color: colors.primary.main,
    fontWeight: typography.fontWeight.bold,
  },
});
