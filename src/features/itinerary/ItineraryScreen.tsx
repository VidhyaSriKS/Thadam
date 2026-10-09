import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Booking, Destination, Experience, TripStop } from '../../types/database';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { useTripStore } from '../../store/useTripStore';
import { StopCard } from '../../components/itinerary/StopCard';
import { ReplaceModal } from '../../components/itinerary/ReplaceModal';
import { PlaceDetailsModal } from '../../components/itinerary/PlaceDetailsModal';
import { BookingModal } from '../../components/experiences/BookingModal';
import { DigitalTicketModal } from '../../components/experiences/DigitalTicketModal';
import { TrailThread } from '../../components/ui/TrailThread';
import { ItinerarySummaryCard } from './ItinerarySummaryCard';
import { useTranslation } from '../../i18n';

interface ItineraryScreenProps {
  onOpenMap: () => void;
  onStartLiveTrip: () => void;
  onModifyPreferences: () => void;
}

export const ItineraryScreen: React.FC<ItineraryScreenProps> = ({
  onOpenMap,
  onStartLiveTrip,
  onModifyPreferences,
}) => {
  const { currentTrip, replaceStop, removeStop } = useTripStore();
  const { t, isTamil, formatCurrency } = useTranslation();
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);

  // Modals state
  const [replacingStop, setReplacingStop] = useState<{ stop: TripStop; dayNumber: number } | null>(null);
  const [inspectingDestination, setInspectingDestination] = useState<Destination | null>(null);
  const [bookingExperience, setBookingExperience] = useState<Experience | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [savedOffline, setSavedOffline] = useState(false);

  if (!currentTrip) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{t('noJourneyPlanned')}</Text>
        <Text style={styles.emptySubtitle}>{t('nextJourneyWaiting')}</Text>
        <TouchableOpacity style={styles.planBtn} onPress={onModifyPreferences}>
          <Text style={styles.planBtnText}>{t('planATrip')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const activeDay = currentTrip.days.find((d) => d.dayNumber === selectedDayNumber) || currentTrip.days[0];

  const handleConfirmReplace = (newDest: Destination, newExp?: Experience) => {
    if (replacingStop) {
      replaceStop(replacingStop.dayNumber, replacingStop.stop.id, newDest, newExp);
      setReplacingStop(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Editorial Summary Card */}
        <ItinerarySummaryCard
          currentTrip={currentTrip}
          savedOffline={savedOffline}
          onModifyPreferences={onModifyPreferences}
          onOpenMap={onOpenMap}
          onToggleOffline={() => setSavedOffline(!savedOffline)}
        />

        {/* Day Selector Pills */}
        <View style={styles.dayTabsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayTabsContent}>
            {currentTrip.days.map((day) => {
              const isSelected = day.dayNumber === selectedDayNumber;
              return (
                <TouchableOpacity
                  key={day.dayNumber}
                  style={[styles.dayTabPill, isSelected && styles.dayTabPillActive]}
                  onPress={() => setSelectedDayNumber(day.dayNumber)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.dayTabTitle, isSelected && styles.dayTabTitleActive]}>
                    {isTamil ? `நாள் 0${day.dayNumber}` : `DAY 0${day.dayNumber}`}
                  </Text>
                  <Text style={[styles.dayTabDate, isSelected && styles.dayTabDateActive]}>
                    {day.date.slice(5)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Day Header */}
        <View style={styles.dayHeader}>
          <View style={styles.dayHeaderLeft}>
            <Text style={styles.dayHeaderNumber}>{isTamil ? `நாள் 0${activeDay.dayNumber}` : `DAY 0${activeDay.dayNumber}`}</Text>
            <Text style={styles.dayHeaderTitle}>{activeDay.title}</Text>
            <Text style={styles.dayHeaderMeta}>
              {activeDay.stops.length} {isTamil ? 'இடங்கள்' : 'destinations'} • {t('estSpend')}: {formatCurrency(activeDay.totalEstimatedCost)} • {activeDay.totalTravelMinutes} {t('min')} {t('scenicDrive')}
            </Text>
          </View>
          <View style={styles.threadBadgeWrap}>
            <TrailThread
              stopsCount={activeDay.stops.length}
              currentStopIndex={0}
              stopPressures={activeDay.stops.map((s) => s.crowdStatus)}
              height={56}
            />
          </View>
        </View>

        {/* Timeline Stops */}
        <View style={styles.timelineList}>
          {activeDay.stops.map((stop, idx) => (
            <StopCard
              key={stop.id}
              stop={stop}
              dayNumber={activeDay.dayNumber}
              isLast={idx === activeDay.stops.length - 1}
              onOpenDetails={(s) => setInspectingDestination(s.destination)}
              onReplace={(s, dayNum) => setReplacingStop({ stop: s, dayNumber: dayNum })}
              onRemove={(stopId, dayNum) => removeStop(dayNum, stopId)}
              onBookExperience={(s) => s.experience && setBookingExperience(s.experience)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Bottom Bar: START LIVE TRIP */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.startLiveBtn} onPress={onStartLiveTrip} activeOpacity={0.9}>
          <View style={styles.livePulseDot} />
          <Text style={styles.startLiveBtnText}>{t('startLiveTrip')}</Text>
        </TouchableOpacity>
      </View>

      <ReplaceModal
        visible={replacingStop !== null}
        stop={replacingStop?.stop || null}
        dayNumber={replacingStop?.dayNumber || 1}
        onClose={() => setReplacingStop(null)}
        onSelectReplacement={handleConfirmReplace}
      />

      <PlaceDetailsModal
        visible={inspectingDestination !== null}
        destination={inspectingDestination}
        onClose={() => setInspectingDestination(null)}
        onBookExperience={(exp) => {
          setInspectingDestination(null);
          setBookingExperience(exp);
        }}
      />

      <BookingModal
        visible={bookingExperience !== null}
        experience={bookingExperience}
        onClose={() => setBookingExperience(null)}
        onBookingSuccess={(booking) => {
          setBookingExperience(null);
          setConfirmedBooking(booking);
        }}
      />

      <DigitalTicketModal
        visible={confirmedBooking !== null}
        booking={confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 100 },
  emptyContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyTitle: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.textPrimary },
  emptySubtitle: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.xl },
  planBtn: { height: 48, paddingHorizontal: spacing.xl, borderRadius: radii.button, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  planBtnText: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.surface, letterSpacing: 0.5 },
  dayTabsWrapper: { marginBottom: spacing.lg },
  dayTabsContent: { gap: spacing.sm },
  dayTabPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: radii.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  dayTabPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayTabTitle: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, letterSpacing: 0.5 },
  dayTabTitleActive: { color: colors.surface },
  dayTabDate: { fontSize: 10, color: colors.textTertiary, marginTop: 1 },
  dayTabDateActive: { color: colors.sandLight },
  dayHeader: { marginBottom: spacing.md, paddingLeft: spacing.xs, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayHeaderLeft: { flex: 1, paddingRight: spacing.sm },
  threadBadgeWrap: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  dayHeaderNumber: { fontSize: 11, fontWeight: '800', color: colors.accentGold, letterSpacing: 1 },
  dayHeaderTitle: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.3, marginTop: 2 },
  dayHeaderMeta: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 4 },
  timelineList: { marginTop: spacing.xs },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, ...shadows.elevated },
  startLiveBtn: { height: 50, borderRadius: radii.button, backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  livePulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.forestGreen },
  startLiveBtnText: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.surface, letterSpacing: 1 },
});
