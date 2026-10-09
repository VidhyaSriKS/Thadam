import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, radii, shadows } from '../../config/theme';
import { useSavedTripsStore } from '../../store/useSavedTripsStore';
import { SavedTrip, DetectedTripChange } from '../../engine/types';
import { detectTripChanges } from '../../engine/detect';
import { DESTINATIONS } from '../../data/destinations';
import { EXPERIENCES } from '../../data/experiences';
import { DestinationImage } from '../../components/ui/DestinationImage';
import { TripOptionsMenuModal } from './TripOptionsMenuModal';
import { useTranslation } from '../../i18n';

interface TripsScreenProps {
  onContinueTrip: (trip: SavedTrip) => void;
  onPlanNew: () => void;
}

export const TripsScreen: React.FC<TripsScreenProps> = ({ onContinueTrip, onPlanNew }) => {
  const { savedTrips, activeDraft, deleteTrip, undoDelete, deletedBackup, renameTrip, duplicateTrip } = useSavedTripsStore();
  const { t, isTamil, formatCurrency, formatDays } = useTranslation();
  const [filter, setFilter] = useState<'drafts' | 'saved' | 'upcoming' | 'past'>('drafts');
  const [activeMenuTripId, setActiveMenuTripId] = useState<string | null>(null);
  const [activeChangesBanner, setActiveChangesBanner] = useState<{ trip: SavedTrip; changes: DetectedTripChange[] } | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);
  const allTrips = activeDraft ? [activeDraft, ...savedTrips] : savedTrips;

  const filtered = allTrips.filter((trip) => {
    if (filter === 'drafts') return trip.status === 'draft';
    if (filter === 'saved') return trip.status === 'saved';
    if (filter === 'upcoming') return trip.status === 'saved' && (!trip.trip || trip.trip.startDate >= todayStr);
    if (filter === 'past') return trip.trip ? trip.trip.startDate < todayStr : false;
    return true;
  });

  const filterOptions: Array<{ key: 'drafts' | 'saved' | 'upcoming' | 'past'; label: string }> = [
    { key: 'drafts', label: t('filterDrafts') },
    { key: 'saved', label: t('filterSaved') },
    { key: 'upcoming', label: t('filterUpcoming') },
    { key: 'past', label: t('filterPast') },
  ];

  const handleOpenTrip = (trip: SavedTrip) => {
    const changes = detectTripChanges(trip, { destinations: DESTINATIONS, experiences: EXPERIENCES });
    if (changes.length > 0) setActiveChangesBanner({ trip, changes });
    else onContinueTrip(trip);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('myTripsTitle')}</Text>
          <Text style={styles.headerSub}>{t('myTripsSub')}</Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {filterOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.filterPill, filter === opt.key && styles.filterPillActive]}
              onPress={() => setFilter(opt.key)}
            >
              <Text style={[styles.filterText, filter === opt.key && styles.filterTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeChangesBanner && (
          <View style={styles.changesBanner}>
            <Text style={styles.changesBannerTitle}>
              ⚠️ {activeChangesBanner.changes.length} {t('thingsChangedAlert')}
            </Text>
            {activeChangesBanner.changes.map((c, idx) => (
              <Text key={idx} style={styles.changesDesc}>• {c.description}</Text>
            ))}
            <TouchableOpacity
              style={styles.reviewBtn}
              onPress={() => {
                const tr = activeChangesBanner.trip;
                setActiveChangesBanner(null);
                onContinueTrip(tr);
              }}
            >
              <Text style={styles.reviewBtnText}>{t('continueToTrip')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{t('noJourneysCategory')}</Text>
            <Text style={styles.emptySub}>{t('startPlanningEngine')}</Text>
            <TouchableOpacity style={styles.planBtn} onPress={onPlanNew}>
              <Text style={styles.planBtnText}>{t('planNewTrip')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((trip) => (
            <View key={trip.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badgeWrap}>
                  <Text style={[styles.statusBadge, trip.status === 'draft' ? styles.draftBadge : styles.savedBadge]}>
                    {trip.status === 'draft' ? (isTamil ? 'வரைவு' : 'DRAFT') : (isTamil ? 'சேமிக்கப்பட்டது' : 'SAVED')}
                  </Text>
                  <Text style={styles.progressText}>{trip.progressLabel}</Text>
                </View>
                <TouchableOpacity
                  style={styles.kebabBtn}
                  onPress={() => setActiveMenuTripId(activeMenuTripId === trip.id ? null : trip.id)}
                >
                  <Text style={styles.kebabText}>⋮</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.tripTitle}>{trip.title}</Text>
              <Text style={styles.tripMeta}>
                {formatDays(trip.request.daysCount)} • {formatCurrency(trip.request.budget)} • {trip.request.destination}
              </Text>

              <DestinationImage
                destination={trip.trip?.days[0]?.stops[0]?.destination || trip.request.destination}
                containerStyle={{ width: '100%', height: 110, borderRadius: radii.md, marginBottom: spacing.md, overflow: 'hidden' }}
                aspectRatio={16 / 9}
              />

              <TouchableOpacity style={styles.continueBtn} onPress={() => handleOpenTrip(trip)}>
                <Text style={styles.continueBtnText}>{t('continue')} ➔</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Undo Snackbar */}
      {deletedBackup && (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>{t('tripDeleted')}</Text>
          <TouchableOpacity onPress={undoDelete}>
            <Text style={styles.undoText}>{t('undoAction')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Options Menu Modal */}
      <TripOptionsMenuModal
        activeMenuTripId={activeMenuTripId}
        allTrips={allTrips}
        onCloseMenu={() => setActiveMenuTripId(null)}
        onRename={renameTrip}
        onDuplicate={duplicateTrip}
        onDelete={deleteTrip}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenPadding, paddingBottom: 100 },
  header: { marginBottom: spacing.md },
  headerTitle: { fontSize: 24, fontWeight: '800', color: colors.ink },
  headerSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  filterRow: { flexDirection: 'row', gap: 6, marginBottom: spacing.md },
  filterPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill, backgroundColor: colors.surfaceSubtle, borderWidth: 1, borderColor: colors.border },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 12, fontWeight: '700', color: colors.ink },
  filterTextActive: { color: colors.onPrimary },
  changesBanner: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.warning, padding: spacing.md, borderRadius: radii.md, marginBottom: spacing.md },
  changesBannerTitle: { fontSize: 13, fontWeight: '800', color: colors.warning, marginBottom: 4 },
  changesDesc: { fontSize: 12, color: colors.ink, marginBottom: 2 },
  reviewBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.primary, borderRadius: radii.sm, alignSelf: 'flex-start', marginTop: 8 },
  reviewBtnText: { fontSize: 11, fontWeight: '700', color: colors.onPrimary },
  card: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, ...shadows.card },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  badgeWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusBadge: { fontSize: 9, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.pill },
  draftBadge: { backgroundColor: colors.sandLight, color: colors.goldText },
  savedBadge: { backgroundColor: 'rgba(23, 112, 47, 0.12)', color: colors.forestGreen },
  progressText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  kebabBtn: { padding: 4, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  kebabText: { fontSize: 18, color: colors.ink, fontWeight: '700' },
  tripTitle: { fontSize: 16, fontWeight: '800', color: colors.ink, marginBottom: 2 },
  tripMeta: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.md },
  continueBtn: { paddingVertical: 10, backgroundColor: colors.primary, borderRadius: radii.sm, alignItems: 'center' },
  continueBtnText: { fontSize: 12, fontWeight: '700', color: colors.onPrimary },
  snackbar: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: colors.ink, padding: spacing.md, borderRadius: radii.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  snackbarText: { color: colors.onPrimary, fontSize: 13, fontWeight: '600' },
  undoText: { color: colors.gold, fontSize: 13, fontWeight: '800' },
  empty: { padding: spacing.xl, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.ink },
  emptySub: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 4, marginBottom: spacing.lg },
  planBtn: { paddingHorizontal: spacing.lg, paddingVertical: 10, backgroundColor: colors.primary, borderRadius: radii.button },
  planBtnText: { color: colors.onPrimary, fontSize: 12, fontWeight: '700' },
});
