import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export interface Location {
  lat: number;
  lon: number;
}

export interface Pin {
  id: string;                 // JSON trả number
  uuid: string;
  userId: number;
  placeName: string;
  placeIdGoogle?: string | null;
  location: Location;
  addressFormatted?: string | null;
  addressCity?: string | null;
  addressCountry?: string | null;
  addressCountryCode?: string | null;
  status: 'active' | 'visited' | 'wantToGo'; // thêm 'active' vì backend trả
  notes?: string | null;
  visitedDate?: string | null;
  rating?: number | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  images?: string[]; // có thể null nếu backend trả
}
interface PinCardProps {
  pin: Pin;
  onPress: () => void;
}

export const PinCard: React.FC<PinCardProps> = ({ pin, onPress }) => {
  const statusColor = pin.status === 'visited' ? colors.status.visited : colors.status.wantToGo;
  const statusText = pin.status === 'visited' ? 'Đã đến' : 'Muốn đến';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {pin.images && pin.images.length > 0 ? (
        <Image source={{ uri: pin.images[0] }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {pin.placeName}
        </Text>
        <View style={styles.footer}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
          {pin.visitedDate && (
            <Text style={styles.date}>
              {new Date(pin.visitedDate).toLocaleDateString('vi-VN')}
            </Text>
          )}
        </View>
        {pin.rating && pin.status === 'visited' && (
          <Text style={styles.rating}>⭐ {pin.rating}/5</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: colors.neutral.gray200,
  },
  content: {
    padding: spacing.md,
  },
  name: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral.white,
  },
  date: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  rating: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});
