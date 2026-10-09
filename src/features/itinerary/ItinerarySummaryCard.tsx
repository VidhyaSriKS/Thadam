import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trip } from '../../types/database';
import { colors, spacing, radii, shadows } from '../../config/theme';
import { useTranslation } from '../../i18n';

interface ItinerarySummaryCardProps {
  currentTrip: Trip;
  savedOffline: boolean;
  onModifyPreferences: () => void;
  onOpenMap: () => void;
  onToggleOffline: () => void;
}

export const ItinerarySummaryCard: React.FC<ItinerarySummaryCardProps> = ({
  currentTrip,
  savedOffline,
  onModifyPreferences,
  onOpenMap,
  onToggleOffline,
}) => {
  const { t, formatCurrency, formatDays } = useTranslation();

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTopRow}>
        <View style={styles.summaryTitleCol}>
          <Text style={styles.summaryTag}>{t('adaptiveItineraryTag')}</Text>
          <Text style={styles.summaryTitle}>{currentTrip.title}</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={onModifyPreferences} activeOpacity={0.8}>
          <Text style={styles.editBtnText}>{t('editDna')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricVal}>{formatDays(currentTrip.daysCount)}</Text>
          <Text style={styles.metricLbl}>{t('daysUnit')}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricVal}>{formatCurrency(currentTrip.estimatedSpend)}</Text>
          <Text style={styles.metricLbl}>{t('estSpend')}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={[styles.metricVal, { color: colors.forestGreen }]}>
            {currentTrip.hiddenDiscoveriesCount}
          </Text>
          <Text style={styles.metricLbl}>{t('hiddenGems')}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={[styles.metricVal, { color: colors.accentGold }]}>
            {currentTrip.localExperiencesCount}
          </Text>
          <Text style={styles.metricLbl}>{t('localCrafts')}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onOpenMap} activeOpacity={0.8}>
          <Text style={styles.actionButtonText}>{t('viewRouteFacilities')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, savedOffline && styles.actionButtonActive]}
          onPress={onToggleOffline}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>
            {savedOffline ? t('savedOffline') : t('saveOffline')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryCard: { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg, ...shadows.card },
  summaryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  summaryTitleCol: { flex: 1, paddingRight: spacing.sm },
  summaryTag: { fontSize: 10, fontWeight: '700', color: colors.accentGold, letterSpacing: 1, marginBottom: 2 },
  summaryTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.4 },
  editBtn: { paddingHorizontal: 12, height: 32, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surfaceSubtle },
  editBtnText: { fontSize: 11, fontWeight: '600', color: colors.secondary },
  metricsGrid: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.surfaceSubtle, borderRadius: radii.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.md },
  metricItem: { alignItems: 'center' },
  metricVal: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  metricLbl: { fontSize: 9, fontWeight: '600', color: colors.textTertiary, letterSpacing: 0.5, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  actionButton: { flex: 1, height: 38, borderRadius: radii.button, backgroundColor: colors.surfaceSubtle, borderWidth: 1, borderColor: colors.borderLight, justifyContent: 'center', alignItems: 'center' },
  actionButtonActive: { backgroundColor: colors.sandLight, borderColor: '#DEC39F' },
  actionButtonText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
});
