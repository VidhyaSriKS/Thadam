import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Destination, Experience } from '../../types/database';
import { FacilityPoint } from '../../data/facilities';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { DestinationImage } from '../ui/DestinationImage';
import { useTranslation } from '../../i18n';

export type MapPinData =
  | { type: 'destination'; data: Destination }
  | { type: 'facility'; data: FacilityPoint }
  | { type: 'experience'; data: Experience };

interface MapPinSheetProps {
  pin: MapPinData;
  onSelectDestination?: (dest: Destination) => void;
}

export const MapPinSheet: React.FC<MapPinSheetProps> = ({ pin, onSelectDestination }) => {
  const { isTamil } = useTranslation();

  const getTag = () => {
    if (pin.type === 'destination') {
      return pin.data.popularityType === 'hidden'
        ? isTamil ? '✦ மறைந்த இடம்' : '✦ HIDDEN DISCOVERY'
        : isTamil ? 'பயண இலக்கு' : 'ITINERARY DESTINATION';
    }
    if (pin.type === 'experience') {
      return isTamil ? 'பாரம்பரியக் கலைக் கூடம்' : 'LOCAL ARTISAN GUILD';
    }
    return isTamil ? 'பாதுகாப்பு & வசதி' : 'SAFETY FACILITY';
  };

  const getSubtitle = () => {
    if (pin.type === 'destination') {
      return pin.data.district;
    }
    if (pin.type === 'facility') {
      return pin.data.address || pin.data.district;
    }
    return isTamil ? 'கும்பகோணம் பகுதி' : 'Kumbakonam Corridor';
  };

  return (
    <View style={styles.pinSheet}>
      <View style={styles.pinSheetHeader}>
        {pin.type === 'destination' && (
          <DestinationImage
            destination={pin.data}
            containerStyle={styles.imageContainer}
            style={styles.image}
            aspectRatio={1}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.pinTag}>{getTag()}</Text>
          <Text style={styles.pinTitle} numberOfLines={1}>
            {pin.data.name}
          </Text>
          <Text style={styles.pinSub} numberOfLines={1}>
            {getSubtitle()}
          </Text>
        </View>

        {pin.type === 'destination' && onSelectDestination && (
          <TouchableOpacity
            style={styles.pinActionBtn}
            onPress={() => onSelectDestination(pin.data)}
            activeOpacity={0.8}
          >
            <Text style={styles.pinActionText}>{isTamil ? 'விவரங்கள்' : 'Details'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pinSheet: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.elevated,
  },
  pinSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: 64,
    height: 64,
  },
  textContainer: {
    flex: 1,
  },
  pinTag: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accentGold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  pinTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pinSub: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  pinActionBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.surface,
  },
});
