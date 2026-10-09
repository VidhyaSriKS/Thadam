import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { useTripStore } from '../../store/useTripStore';
import { PressureBadge } from '../../components/common/Badge';
import { DestinationImage } from '../../components/ui/DestinationImage';
import { LiveTripEmergencyModal } from './LiveTripEmergencyModal';
import { useTranslation } from '../../i18n';

interface LiveTripScreenProps {
  onBackToItinerary: () => void;
  onOpenMap: () => void;
}

export const LiveTripScreen: React.FC<LiveTripScreenProps> = ({
  onBackToItinerary,
  onOpenMap,
}) => {
  const { currentTrip, activeTripSession, nextLiveStop, endLiveTrip } = useTripStore();
  const { t, isTamil } = useTranslation();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  if (!currentTrip || !activeTripSession) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{t('noActiveSession')}</Text>
        <Text style={styles.emptySub}>{t('startLiveFromPlan')}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={onBackToItinerary} activeOpacity={0.8}>
          <Text style={styles.backBtnText}>{t('returnToItinerary')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentDay =
    currentTrip.days.find((d) => d.dayNumber === activeTripSession.currentDayNumber) ||
    currentTrip.days[0];
  const currentStop = currentDay.stops[activeTripSession.currentStopIndex] || currentDay.stops[0];
  const nextStop = currentDay.stops[activeTripSession.currentStopIndex + 1];

  const dest = currentStop.destination;
  const fac = dest.facilities;

  return (
    <View style={styles.container}>
      {/* Top Header Row */}
      <View style={styles.topHeader}>
        <View style={styles.liveTagRow}>
          <View style={styles.livePulseDot} />
          <Text style={styles.liveTagText}>{t('liveTripTitle')}</Text>
        </View>

        <TouchableOpacity style={styles.endPill} onPress={endLiveTrip} activeOpacity={0.8}>
          <Text style={styles.endPillText}>{t('endJourney')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Next Destination Arrival Hero */}
        <View style={styles.arrivalHero}>
          <Text style={styles.arrivalLabel}>{t('nextDestinationLabel')}</Text>
          <Text style={styles.destMainHeading}>{dest.name}</Text>

          <View style={styles.metricsBanner}>
            <View style={styles.metricBlock}>
              <Text style={styles.metricBig}>18 {t('min')}</Text>
              <Text style={styles.metricSub}>{t('estimatedArrival')}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBlock}>
              <Text style={styles.metricBig}>5.4 {t('km')}</Text>
              <Text style={styles.metricSub}>{t('distanceRemaining')}</Text>
            </View>
          </View>
        </View>

        {/* Destination Editorial Sheet Card */}
        <View style={styles.destSheetCard}>
          <DestinationImage
            destination={dest}
            style={styles.destImage}
            containerStyle={{ width: '100%', height: 180, overflow: 'hidden' }}
            aspectRatio={16 / 9}
            showBadge
          />

          <View style={styles.sheetBody}>
            <View style={styles.statusRow}>
              <PressureBadge level={currentStop.crowdStatus} />
              <View style={styles.verifiedChip}>
                <Text style={styles.verifiedChipText}>✓ {t('verifiedRegistry')}</Text>
              </View>
            </View>

            <Text style={styles.districtText}>
              {dest.district} • {dest.category} • {t('scheduledUntil')} {currentStop.endTime}
            </Text>

            <View style={styles.facilitiesBox}>
              <Text style={styles.facilityHeadline}>{t('safetyCorridorFacilities')}</Text>
              <Text style={styles.facilityNote}>
                🏥 {fac.hospitalKm} {t('km')} • ⛽ {fac.fuelKm} {t('km')} • 🏨 {fac.hotelKm < 5 ? (isTamil ? 'அருகில்' : 'Nearby') : (isTamil ? 'வழியில்' : 'En route')}
              </Text>
            </View>

            {currentStop.experience && (
              <View style={styles.experienceCallout}>
                <Text style={styles.expTag}>{t('localHostScheduled')}</Text>
                <Text style={styles.expTitle}>{currentStop.experience.name}</Text>
                <Text style={styles.expHost}>
                  {t('hostedBy')} {currentStop.experience.providerName} • {currentStop.experience.durationMinutes} {t('min')}
                </Text>
              </View>
            )}

            <View style={styles.actionCol}>
              <TouchableOpacity style={styles.navigateBtn} onPress={onOpenMap} activeOpacity={0.9}>
                <Text style={styles.navigateBtnText}>{t('navigateBtn')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.nextStopBtn} onPress={nextLiveStop} activeOpacity={0.8}>
                <Text style={styles.nextStopBtnText}>
                  {nextStop ? t('proceedNextStop') : t('completeDay')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Up Next Preview */}
        {nextStop && (
          <View style={styles.nextCard}>
            <Text style={styles.nextTag}>{t('upNext')} • {nextStop.startTime}</Text>
            <Text style={styles.nextTitle}>{nextStop.destination.name}</Text>
            <Text style={styles.nextSub}>
              {nextStop.destination.district} • {nextStop.durationMinutes} {t('visitDuration')}
            </Text>
          </View>
        )}

        {/* Emergency Assistance Card */}
        <TouchableOpacity style={styles.emergencyCard} onPress={() => setShowEmergencyModal(true)} activeOpacity={0.8}>
          <Text style={styles.emergencyIcon}>🛡️</Text>
          <View style={styles.emergencyTextWrap}>
            <Text style={styles.emergencyTitle}>{t('corridorSafetyEmergency')}</Text>
            <Text style={styles.emergencySub}>{t('corridorEmergencySub')}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Emergency Bottom Sheet */}
      <LiveTripEmergencyModal
        visible={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  liveTagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  livePulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.forestGreen },
  liveTagText: { fontSize: 11, fontWeight: '800', color: colors.primary, letterSpacing: 1.5 },
  endPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.full, backgroundColor: colors.surfaceSubtle, borderWidth: 1, borderColor: colors.border },
  endPillText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: 110 },
  arrivalHero: { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginVertical: spacing.md, ...shadows.card },
  arrivalLabel: { fontSize: 10, fontWeight: '800', color: colors.accentGold, letterSpacing: 1, marginBottom: 4 },
  destMainHeading: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.4 },
  metricsBanner: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight },
  metricBlock: { flex: 1, alignItems: 'center' },
  metricBig: { fontSize: 26, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 },
  metricSub: { fontSize: 9, fontWeight: '700', color: colors.textTertiary, letterSpacing: 0.5, marginTop: 2, textAlign: 'center' },
  metricDivider: { width: 1, height: 36, backgroundColor: colors.border },
  destSheetCard: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: spacing.lg, ...shadows.card },
  destImage: { width: '100%', height: 180, backgroundColor: colors.surfaceSubtle },
  sheetBody: { padding: spacing.lg },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  verifiedChip: { backgroundColor: '#EEF4F0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.full },
  verifiedChipText: { fontSize: 10, fontWeight: '700', color: colors.forestGreen },
  districtText: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.md },
  facilitiesBox: { backgroundColor: colors.surfaceSubtle, borderRadius: radii.smCard, padding: spacing.md, marginBottom: spacing.md },
  facilityHeadline: { fontSize: 9, fontWeight: '800', color: colors.textTertiary, letterSpacing: 0.5, marginBottom: 3 },
  facilityNote: { fontSize: 11, color: colors.textSecondary, lineHeight: 16 },
  experienceCallout: { backgroundColor: colors.sandLight, borderRadius: radii.smCard, padding: spacing.md, borderWidth: 1, borderColor: '#DEC39F', marginBottom: spacing.md },
  expTag: { fontSize: 9, fontWeight: '800', color: colors.accentGold, letterSpacing: 1, marginBottom: 2 },
  expTitle: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.textPrimary },
  expHost: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  actionCol: { gap: spacing.sm, marginTop: spacing.xs },
  navigateBtn: { height: 50, borderRadius: radii.button, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  navigateBtnText: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.surface, letterSpacing: 1 },
  nextStopBtn: { height: 44, borderRadius: radii.button, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center' },
  nextStopBtnText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  nextCard: { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  nextTag: { fontSize: 9, fontWeight: '800', color: colors.textTertiary, letterSpacing: 1, marginBottom: 2 },
  nextTitle: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.textPrimary },
  nextSub: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  emergencyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceSubtle, borderRadius: radii.md, padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight, gap: spacing.sm },
  emergencyIcon: { fontSize: 20 },
  emergencyTextWrap: { flex: 1 },
  emergencyTitle: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  emergencySub: { fontSize: 10, color: colors.textSecondary },
  emptyContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.textPrimary },
  emptySub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.lg, textAlign: 'center' },
  backBtn: { height: 44, paddingHorizontal: spacing.xl, borderRadius: radii.button, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { color: colors.surface, fontSize: typography.sizes.xs, fontWeight: '700' },
});
