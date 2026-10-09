import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, StyleProp, ImageStyle, ViewStyle } from 'react-native';
import { colors, radii } from '../../config/theme';
import { getVerifiedImageUrl } from '../../services/destinationImageService';

interface DestinationImageProps {
  destination: { id?: string; name?: string; image?: string; district?: string } | string | null | undefined;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  aspectRatio?: number;
  resizeMode?: 'cover' | 'contain';
  showBadge?: boolean;
}

export const DestinationImage: React.FC<DestinationImageProps> = ({
  destination,
  style,
  containerStyle,
  aspectRatio = 16 / 9,
  resizeMode = 'cover',
  showBadge = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const resolvedUri = getVerifiedImageUrl(destination);

  // If no verified image was found or network failed, render the clean "Image unavailable" placeholder
  if (!resolvedUri || hasError) {
    return (
      <View style={[styles.placeholderContainer, { aspectRatio }, containerStyle]}>
        <View style={styles.placeholderContent}>
          <Text style={styles.placeholderIcon}>🏛️</Text>
          <Text style={styles.placeholderTitle}>Image unavailable</Text>
          <Text style={styles.placeholderSub}>Verified photo pending</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.imageWrapper, { aspectRatio }, containerStyle]}>
      {loading && (
        <View style={styles.skeletonOverlay}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      <Image
        source={{ uri: resolvedUri }}
        style={[styles.image, style]}
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setHasError(true);
        }}
      />
      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeDot}>●</Text>
          <Text style={styles.badgeText}>VERIFIED PHOTO</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.surfaceSubtle,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  skeletonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  placeholderContainer: {
    width: '100%',
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: 12,
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  placeholderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: 0.2,
  },
  placeholderSub: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(58, 15, 24, 0.78)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
    zIndex: 2,
  },
  badgeDot: {
    color: '#34D399',
    fontSize: 9,
    marginRight: 4,
  },
  badgeText: {
    color: '#FFF8F0',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
