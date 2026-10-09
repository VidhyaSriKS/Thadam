import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TripStop } from '../../types/database';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { PopularityBadge, PressureBadge } from '../common/Badge';
import { DataBadge } from '../ui/DataBadge';
import { DestinationImage } from '../ui/DestinationImage';
import { StopExperienceCard } from './StopExperienceCard';
import { useTranslation } from '../../i18n';

interface StopCardProps {
  stop: TripStop;
  dayNumber: number;
  isLast?: boolean;
  onOpenDetails: (stop: TripStop) => void;
  onReplace: (stop: TripStop, dayNumber: number) => void;
  onRemove: (stopId: string, dayNumber: number) => void;
  onBookExperience?: (stop: TripStop) => void;
}

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  dayNumber,
  isLast = false,
  onOpenDetails,
  onReplace,
  onRemove,
  onBookExperience,
}) => {
  const { t, isTamil } = useTranslation();
  const [showExplanation, setShowExplanation] = useState(false);
  const dest = stop.destination;

  const isDisrupted = stop.crowdStatus === 'HIGH';
  const isCurrent = stop.startTime <= '12:00' && stop.endTime >= '10:00';
  const nodeColor = isDisrupted ? colors.coral : isCurrent ? colors.primary : colors.textTertiary;

  return (
    <View style={styles.timelineRow}>
      {/* Timeline Column */}
      <View style={styles.timelineCol}>
        <Text style={styles.timelineTimeText}>{stop.startTime}</Text>
        <View style={[styles.timelineNode, { borderColor: nodeColor, backgroundColor: isCurrent ? colors.primary : colors.surface }]}>
          {isCurrent && <View style={styles.innerNodeDot} />}
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      {/* Card Column */}
      <View style={styles.cardCol}>
        {stop.travelMinutesFromPrev && stop.travelMinutesFromPrev > 0 ? (
          <View style={styles.transitionPill}>
            <Text style={styles.transitionText}>
              ↓ {stop.distanceFromPrevKm} {t('km')} • {stop.travelMinutesFromPrev} {t('min')} {t('scenicDrive')}
            </Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.topMetaRow}>
            <Text style={styles.categoryLabel}>{dest.category}</Text>
            <View style={styles.badgesWrapper}>
              <PressureBadge level={stop.crowdStatus} />
              <DataBadge type="DEMO" />
              <PopularityBadge type={dest.popularityType} />
            </View>
          </View>

          <View style={styles.mainContentRow}>
            <DestinationImage
              destination={dest}
              style={styles.thumbnail}
              containerStyle={styles.thumbnailContainer}
              aspectRatio={1}
            />
            <View style={styles.textContainer}>
              <Text style={styles.destinationName}>{dest.name}</Text>
              <Text style={styles.locationSubtitle}>
                {dest.district} • {stop.durationMinutes} {t('visitDuration')}
              </Text>
              <View style={styles.matchBadge}>
                <Text style={styles.matchText}>{stop.scoreMatch}% {t('itineraryMatch')}</Text>
              </View>
            </View>
          </View>

          {stop.experience && (
            <StopExperienceCard
              experience={stop.experience}
              stop={stop}
              onBookExperience={onBookExperience}
            />
          )}

          {/* Explainability Accordion */}
          <TouchableOpacity
            style={styles.explainToggle}
            onPress={() => setShowExplanation(!showExplanation)}
            activeOpacity={0.7}
          >
            <Text style={styles.explainToggleText}>
              {showExplanation ? t('hideReasons') : t('whyThisFits')}
            </Text>
          </TouchableOpacity>

          {showExplanation && (
            <View style={styles.explainBox}>
              {stop.aiReasons.map((reason, idx) => (
                <View key={idx} style={styles.reasonRow}>
                  <Text style={styles.reasonBullet}>•</Text>
                  <Text style={styles.reasonText}>{reason}</Text>
                </View>
              ))}
              <Text style={styles.sourceLabel}>{t('verifiedRegistrySource')} {dest.source}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.detailsBtn} onPress={() => onOpenDetails(stop)} activeOpacity={0.8}>
              <Text style={styles.detailsBtnText}>{t('explorePlace')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.replaceBtn} onPress={() => onReplace(stop, dayNumber)} activeOpacity={0.8}>
              <Text style={styles.replaceBtnText}>{t('replaceStop')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(stop.id, dayNumber)} activeOpacity={0.8}>
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineRow: { flexDirection: 'row', marginBottom: spacing.lg },
  timelineCol: { width: 52, alignItems: 'center', paddingTop: 14 },
  timelineTimeText: { fontSize: typography.sizes.xs, fontWeight: '700', color: colors.primary, marginBottom: 6 },
  timelineNode: { width: 16, height: 16, borderRadius: 8, borderWidth: 2.5, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  innerNodeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.surface },
  timelineLine: { width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4 },
  cardCol: { flex: 1, paddingRight: spacing.xs },
  transitionPill: { backgroundColor: colors.sandLight, paddingVertical: 4, paddingHorizontal: spacing.sm, borderRadius: radii.full, alignSelf: 'flex-start', marginBottom: 8 },
  transitionText: { fontSize: 11, fontWeight: '600', color: colors.secondary },
  card: { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  topMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  categoryLabel: { fontSize: 10, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1 },
  badgesWrapper: { flexDirection: 'row', gap: 6 },
  mainContentRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  thumbnail: { width: 84, height: 84, borderRadius: radii.smCard },
  thumbnailContainer: { width: 84, height: 84, borderRadius: radii.smCard, overflow: 'hidden' },
  textContainer: { flex: 1, justifyContent: 'center' },
  destinationName: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.3 },
  locationSubtitle: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 3 },
  matchBadge: { marginTop: 6, alignSelf: 'flex-start', backgroundColor: colors.surfaceSubtle, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.full },
  matchText: { fontSize: 11, fontWeight: '600', color: colors.secondary },
  explainToggle: { marginTop: spacing.sm, paddingVertical: 4 },
  explainToggleText: { fontSize: 12, fontWeight: '600', color: colors.secondary },
  explainBox: { marginTop: 4, padding: spacing.sm, backgroundColor: colors.surfaceSubtle, borderRadius: radii.sm },
  reasonRow: { flexDirection: 'row', marginBottom: 4 },
  reasonBullet: { fontSize: 12, color: colors.forestGreen, fontWeight: '700', marginRight: 6 },
  reasonText: { fontSize: 12, color: colors.textSecondary, flex: 1, lineHeight: 16 },
  sourceLabel: { fontSize: 10, color: colors.textTertiary, marginTop: 4, fontStyle: 'italic' },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderLight, alignItems: 'center' },
  detailsBtn: { flex: 1, height: 38, borderRadius: radii.button, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  detailsBtnText: { fontSize: 12, fontWeight: '700', color: colors.surface },
  replaceBtn: { paddingHorizontal: 12, height: 38, borderRadius: radii.button, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  replaceBtnText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  removeBtn: { width: 38, height: 38, borderRadius: radii.button, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  removeBtnText: { fontSize: 13, fontWeight: '600', color: colors.coral },
});
