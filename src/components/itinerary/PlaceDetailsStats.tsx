import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Destination } from '../../types/database';
import { colors, radii, spacing, typography } from '../../config/theme';
import { DataBadge } from '../ui/DataBadge';
import { useTranslation } from '../../i18n';

interface PlaceDetailsStatsProps {
  destination: Destination;
}

export const PlaceDetailsStats: React.FC<PlaceDetailsStatsProps> = ({ destination }) => {
  const { t, isTamil } = useTranslation();
  const fac = destination.facilities;

  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Text style={styles.statLabel}>{t('corridorSafety')}</Text>
        <Text style={[styles.statValue, { color: colors.forestGreen }]}>
          {fac.hospitalKm} {t('km')}
        </Text>
        <Text style={styles.statSub}>{t('hospitalNearby')}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>{t('corridorCrowd')}</Text>
        <Text style={[styles.statValue, { color: colors.primary }]}>
          {destination.pressureLevel}
        </Text>
        <View style={{ marginTop: 4, alignItems: 'center' }}>
          <DataBadge type="DEMO" />
        </View>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>{t('discoveryScore')}</Text>
        <Text style={[styles.statValue, { color: colors.accentGold }]}>
          {destination.discoveryScore}/100
        </Text>
        <Text style={styles.statSub}>{t('lesserKnown')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radii.smCard,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  statLabel: { fontSize: 8, fontWeight: '700', color: colors.textTertiary, letterSpacing: 0.5, marginBottom: 2, textAlign: 'center' },
  statValue: { fontSize: typography.sizes.sm, fontWeight: '800' },
  statSub: { fontSize: 9, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
});
