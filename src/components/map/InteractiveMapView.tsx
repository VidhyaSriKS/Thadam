import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Destination } from '../../types/database';
import { FACILITIES } from '../../data/facilities';
import { EXPERIENCES } from '../../data/experiences';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { useTranslation } from '../../i18n';
import { MapPinSheet, MapPinData } from './MapPinSheet';
import { MapCanvasMarkers } from './MapCanvasMarkers';

interface InteractiveMapViewProps {
  stops: Destination[];
  allDestinations: Destination[];
  onSelectDestination?: (dest: Destination) => void;
}

type LayerType = 'all' | 'hidden' | 'experiences' | 'hospitals' | 'fuel';

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  stops,
  allDestinations,
  onSelectDestination,
}) => {
  const { isTamil } = useTranslation();
  const [activeLayer, setActiveLayer] = useState<LayerType>('all');
  const [selectedPin, setSelectedPin] = useState<MapPinData | null>(
    stops.length > 0 ? { type: 'destination', data: stops[0] } : null
  );

  const minLat = 10.70;
  const maxLat = 11.25;
  const minLng = 79.05;
  const maxLng = 79.55;

  const projectCoord = (lat: number, lng: number) => {
    const xPct = Math.min(90, Math.max(10, ((lng - minLng) / (maxLng - minLng)) * 100));
    const yPct = Math.min(86, Math.max(12, ((maxLat - lat) / (maxLat - minLat)) * 100));
    return { left: `${xPct}%`, top: `${yPct}%` };
  };

  const layers: { id: LayerType; label: string }[] = [
    { id: 'all', label: isTamil ? `பயணப் பாதை (${stops.length})` : `Itinerary Route (${stops.length})` },
    { id: 'hidden', label: isTamil ? '✦ மறைந்த இடங்கள்' : '✦ Hidden Discoveries' },
    { id: 'experiences', label: isTamil ? 'கைவினைக் கூடங்கள்' : 'Artisan Guilds' },
    { id: 'hospitals', label: isTamil ? '🏥 மருத்துவமனைகள்' : '🏥 Hospitals' },
    { id: 'fuel', label: isTamil ? '⛽ எரிபொருள்' : '⛽ Fuel Corridor' },
  ];

  return (
    <View style={styles.container}>
      {/* Top Filter Chips */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {layers.map((layer) => {
            const active = activeLayer === layer.id;
            return (
              <TouchableOpacity
                key={layer.id}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveLayer(layer.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {layer.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Map Canvas */}
      <View style={styles.mapCanvas}>
        <View style={styles.cauveryWaterway}>
          <Text style={styles.waterwayLabel}>
            {isTamil ? 'காவிரி ஆற்றுப் படுகை பாதை' : 'Cauvery River Basin Corridor'}
          </Text>
        </View>

        <View style={styles.routeTrack}>
          <View style={styles.dashedPath} />
        </View>

        {/* Floating Controls */}
        <View style={styles.floatingControlsCol}>
          <TouchableOpacity
            style={styles.circleControlBtn}
            onPress={() => setSelectedPin(stops[0] ? { type: 'destination', data: stops[0] } : null)}
            activeOpacity={0.8}
          >
            <Text style={styles.controlIcon}>📍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.circleControlBtn}
            onPress={() => setActiveLayer(activeLayer === 'all' ? 'hidden' : 'all')}
            activeOpacity={0.8}
          >
            <Text style={styles.controlIcon}>🗺️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.circleControlBtn}
            onPress={() => setActiveLayer('hospitals')}
            activeOpacity={0.8}
          >
            <Text style={styles.controlIcon}>🏥</Text>
          </TouchableOpacity>
        </View>

        {/* Canvas Markers */}
        <MapCanvasMarkers
          activeLayer={activeLayer}
          allDestinations={allDestinations}
          stops={stops}
          experiences={EXPERIENCES}
          facilities={FACILITIES}
          selectedPin={selectedPin}
          onSelectPin={(pin) => setSelectedPin(pin)}
          projectCoord={projectCoord}
        />
      </View>

      {/* Selected Node Card */}
      {selectedPin && (
        <MapPinSheet pin={selectedPin} onSelectDestination={onSelectDestination} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBar: {
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  filterRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs + 2,
  },
  filterChip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  filterChipTextActive: {
    color: colors.surface,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#F5EFE6',
    position: 'relative',
    overflow: 'hidden',
  },
  cauveryWaterway: {
    position: 'absolute',
    top: '38%',
    left: '-10%',
    right: '-10%',
    height: 28,
    backgroundColor: '#DCE8E1',
    transform: [{ rotate: '-8deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterwayLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#709482',
    letterSpacing: 1,
  },
  routeTrack: {
    position: 'absolute',
    top: 60,
    bottom: 80,
    left: '25%',
    right: '25%',
    justifyContent: 'center',
  },
  dashedPath: {
    borderLeftWidth: 2,
    borderLeftColor: colors.sand,
    borderStyle: 'dashed',
    height: '100%',
    width: 2,
    alignSelf: 'center',
  },
  floatingControlsCol: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    gap: spacing.sm,
    zIndex: 10,
  },
  circleControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  controlIcon: {
    fontSize: 16,
  },
});
