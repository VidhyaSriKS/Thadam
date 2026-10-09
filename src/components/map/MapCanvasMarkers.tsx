import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Destination, Experience } from '../../types/database';
import { FacilityPoint } from '../../data/facilities';
import { colors, shadows } from '../../config/theme';
import { MapPinData } from './MapPinSheet';

interface MapCanvasMarkersProps {
  activeLayer: 'all' | 'hidden' | 'experiences' | 'hospitals' | 'fuel';
  allDestinations: Destination[];
  stops: Destination[];
  experiences: Experience[];
  facilities: FacilityPoint[];
  selectedPin: MapPinData | null;
  onSelectPin: (pin: MapPinData) => void;
  projectCoord: (lat: number, lng: number) => { left: string; top: string };
}

export const MapCanvasMarkers: React.FC<MapCanvasMarkersProps> = ({
  activeLayer,
  allDestinations,
  stops,
  experiences,
  facilities,
  selectedPin,
  onSelectPin,
  projectCoord,
}) => {
  return (
    <>
      {(activeLayer === 'all' || activeLayer === 'hidden') &&
        allDestinations.map((dest, idx) => {
          const isItinerary = stops.some((s) => s.id === dest.id);
          const isHidden = dest.popularityType === 'hidden';
          if (activeLayer === 'hidden' && !isHidden) return null;

          const pos = projectCoord(dest.lat, dest.lng);
          const isSelected = selectedPin?.data.id === dest.id;

          const markerBg = isSelected
            ? colors.primary
            : isHidden
            ? colors.accentGold
            : isItinerary
            ? colors.forestGreen
            : colors.secondary;

          return (
            <TouchableOpacity
              key={dest.id}
              style={[
                styles.markerCircle,
                {
                  left: pos.left as any,
                  top: pos.top as any,
                  backgroundColor: markerBg,
                },
                isSelected && styles.markerSelectedRing,
              ]}
              onPress={() => onSelectPin({ type: 'destination', data: dest })}
              activeOpacity={0.85}
            >
              <Text style={styles.markerText}>
                {isHidden ? '✦' : isItinerary ? `${idx + 1}` : '•'}
              </Text>
            </TouchableOpacity>
          );
        })}

      {activeLayer === 'experiences' &&
        experiences.map((exp) => {
          const relatedDest = allDestinations.find((d) => d.id === exp.destinationId);
          if (!relatedDest) return null;
          const pos = projectCoord(relatedDest.lat, relatedDest.lng);
          return (
            <TouchableOpacity
              key={exp.id}
              style={[styles.markerCircle, { left: pos.left as any, top: pos.top as any, backgroundColor: colors.accentGold }]}
              onPress={() => onSelectPin({ type: 'experience', data: exp })}
              activeOpacity={0.85}
            >
              <Text style={styles.markerText}>🔨</Text>
            </TouchableOpacity>
          );
        })}

      {(activeLayer === 'hospitals' || activeLayer === 'fuel') &&
        facilities
          .filter((f) => (activeLayer === 'hospitals' ? f.type === 'HOSPITAL' : f.type === 'FUEL'))
          .map((f) => {
            const pos = projectCoord(f.lat, f.lng);
            return (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.markerCircle,
                  {
                    left: pos.left as any,
                    top: pos.top as any,
                    backgroundColor: f.type === 'HOSPITAL' ? colors.coral : colors.forestGreen,
                  },
                ]}
                onPress={() => onSelectPin({ type: 'facility', data: f })}
                activeOpacity={0.85}
              >
                <Text style={styles.markerText}>{f.type === 'HOSPITAL' ? '🏥' : '⛽'}</Text>
              </TouchableOpacity>
            );
          })}
    </>
  );
};

const styles = StyleSheet.create({
  markerCircle: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
    ...shadows.card,
  },
  markerSelectedRing: {
    borderColor: colors.accentGold,
    transform: [{ scale: 1.15 }],
  },
  markerText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.surface,
  },
});
