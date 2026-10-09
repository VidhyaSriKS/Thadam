import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Destination, Experience, TripStop } from '../../types/database';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { useTripStore } from '../../store/useTripStore';
import { findAlternatives } from '../../services/aiPlannerService';
import { PressureBadge } from '../common/Badge';
import { DestinationImage } from '../ui/DestinationImage';
import { useTranslation } from '../../i18n';

interface ReplaceModalProps {
  visible: boolean;
  stop: TripStop | null;
  dayNumber: number;
  onClose: () => void;
  onSelectReplacement: (newDest: Destination, newExp?: Experience) => void;
}

const REASONS: Array<{ key: string; labelEn: string; labelTa: string }> = [
  { key: 'Too crowded', labelEn: 'Too crowded', labelTa: 'அதிக கூட்டம்' },
  { key: 'Too expensive', labelEn: 'Too expensive', labelTa: 'அதிக செலவு' },
  { key: 'Too far', labelEn: 'Too far', labelTa: 'அதிக தொலைவு' },
  { key: 'Already visited', labelEn: 'Already visited', labelTa: 'ஏற்கனவே பார்த்த இடம்' },
  { key: 'Not interested', labelEn: 'Not interested', labelTa: 'ஆர்வம் இல்லை' },
  { key: 'Want something hidden', labelEn: 'Want something hidden', labelTa: 'அறியப்படாத ரகசிய இடம்' },
  { key: 'Need family-friendly', labelEn: 'Need family-friendly', labelTa: 'குடும்பத்திற்கு ஏற்ற இடம்' },
  { key: 'Need senior-friendly', labelEn: 'Need senior-friendly', labelTa: 'முதியோருக்கு ஏற்ற இடம்' },
];

export const ReplaceModal: React.FC<ReplaceModalProps> = ({
  visible,
  stop,
  dayNumber,
  onClose,
  onSelectReplacement,
}) => {
  const { preferences, currentTrip } = useTripStore();
  const { t, isTamil, formatCurrency } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<string>('Too crowded');
  const [candidates, setCandidates] = useState<
    Array<{
      destination: Destination;
      scoreMatch: number;
      distanceKm: number;
      estimatedCost: number;
      reasons: string[];
      experience?: Experience;
    }>
  >([]);

  React.useEffect(() => {
    if (stop && currentTrip) {
      const results = findAlternatives(stop, selectedReason, preferences, currentTrip);
      setCandidates(results);
    }
  }, [stop, selectedReason, currentTrip, preferences]);

  if (!stop) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetHeading}>{t('replaceTitle')}</Text>
              <Text style={styles.sheetSub} numberOfLines={1}>
                {t('replaceSubtitle')} {stop.destination.name}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>{t('whyChange')}</Text>
            <View style={styles.chipsRow}>
              {REASONS.map((r) => {
                const active = selectedReason === r.key;
                return (
                  <TouchableOpacity
                    key={r.key}
                    style={[styles.reasonPill, active && styles.reasonPillActive]}
                    onPress={() => setSelectedReason(r.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.reasonPillText, active && styles.reasonPillTextActive]}>
                      {isTamil ? r.labelTa : r.labelEn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.matchesHeader}>
              <Text style={styles.matchesHeading}>{t('betterMatches')}</Text>
              <Text style={styles.matchesMeta}>
                {t('optimizedForDay')} 0{dayNumber}
              </Text>
            </View>

            <View style={styles.cardsContainer}>
              {candidates.map((cand) => (
                <View key={cand.destination.id} style={styles.matchCard}>
                  <DestinationImage
                    destination={cand.destination}
                    style={styles.cardImage}
                    containerStyle={{ width: '100%', height: 110, overflow: 'hidden' }}
                    aspectRatio={16 / 9}
                  />

                  <View style={styles.cardBody}>
                    <View style={styles.cardTopRow}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{cand.destination.name}</Text>
                      <PressureBadge level={cand.destination.pressureLevel} />
                    </View>

                    <Text style={styles.cardMeta}>
                      {cand.scoreMatch}% {t('matchLabel')} • {cand.distanceKm} {t('km')} • ~{formatCurrency(cand.estimatedCost)}
                    </Text>

                    <View style={styles.whyFitsBox}>
                      <Text style={styles.whyFitsText} numberOfLines={2}>
                        ✦ {cand.reasons[0] || t('fitsPacePreferences')}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.useThisBtn}
                      onPress={() => onSelectReplacement(cand.destination, cand.experience)}
                      activeOpacity={0.88}
                    >
                      <Text style={styles.useThisBtnText}>{t('useThisAlternative')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(58, 15, 24, 0.45)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl, maxHeight: '88%', ...shadows.elevated },
  dragHandle: { width: 36, height: 4, borderRadius: radii.full, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  sheetHeading: { fontFamily: typography.fontFamilyHeading, fontSize: 18, fontWeight: '700', color: colors.ink },
  sheetSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  closeBtn: { padding: spacing.xs },
  closeBtnText: { fontSize: 18, color: colors.textSecondary, fontWeight: '700' },
  scrollArea: { maxHeight: 520 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: colors.goldText, letterSpacing: 0.8, marginBottom: spacing.sm },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: spacing.lg },
  reasonPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: colors.surfaceSubtle, borderWidth: 1, borderColor: colors.border },
  reasonPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  reasonPillText: { fontSize: 12, fontWeight: '600', color: colors.ink },
  reasonPillTextActive: { color: colors.onPrimary },
  matchesHeader: { marginBottom: spacing.sm },
  matchesHeading: { fontFamily: typography.fontFamilyHeading, fontSize: 16, fontWeight: '700', color: colors.ink },
  matchesMeta: { fontSize: 11, color: colors.goldText, fontWeight: '600', marginTop: 2 },
  cardsContainer: { gap: spacing.md, paddingBottom: spacing.xl },
  matchCard: { backgroundColor: colors.background, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...shadows.card },
  cardImage: { width: '100%', height: 130, resizeMode: 'cover' },
  cardBody: { padding: spacing.md },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontFamily: typography.fontFamilyHeading, fontSize: 15, fontWeight: '700', color: colors.ink, flex: 1, marginRight: 8 },
  cardMeta: { fontSize: 11, color: colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  whyFitsBox: { backgroundColor: colors.surfaceSubtle, padding: 8, borderRadius: radii.sm, marginBottom: spacing.sm },
  whyFitsText: { fontSize: 11, color: colors.primary, fontWeight: '600', lineHeight: 15 },
  useThisBtn: { backgroundColor: colors.primary, borderRadius: radii.pill, paddingVertical: 10, alignItems: 'center' },
  useThisBtnText: { color: colors.onPrimary, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
});
