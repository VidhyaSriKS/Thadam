import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { useTripStore } from '../../store/useTripStore';
import { useTranslation } from '../../i18n';

interface DisruptionAlertBannerProps {
  onOpenAdaptiveModal: () => void;
}

export const DisruptionAlertBanner: React.FC<DisruptionAlertBannerProps> = ({ onOpenAdaptiveModal }) => {
  const { disruptionAlert, dismissDisruptionAlert } = useTripStore();
  const { t, isTamil } = useTranslation();

  if (!disruptionAlert) return null;

  const desc = disruptionAlert.reason
    ? (isTamil ? `${disruptionAlert.reason}. தடம் 3 சரிபார்க்கப்பட்ட மாற்று இடங்களைக் கண்டறிந்துள்ளது.` : `${disruptionAlert.reason}. THADAM has found 3 verified alternative stops.`)
    : (isTamil ? 'கோயில் பராமரிப்பு அல்லது கூட்ட நெரிசல் காரணமாக மூடப்பட்டுள்ளது. மாற்று இடங்கள் தயார்.' : 'Temporarily closed. THADAM has found 3 verified alternative stops.');

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.topRow}>
        <View style={styles.tagRow}>
          <View style={styles.coralDot} />
          <Text style={styles.alertTag}>{t('routeAdvisory')}</Text>
        </View>
        <TouchableOpacity onPress={dismissDisruptionAlert} activeOpacity={0.7}>
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>
        {t('stopUnavailable')} {disruptionAlert.destinationName}
      </Text>
      <Text style={styles.desc}>
        {desc}
      </Text>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onOpenAdaptiveModal} activeOpacity={0.9}>
          <Text style={styles.primaryBtnText}>
            {isTamil ? 'மாற்று இடங்களைப் பார்' : 'REVIEW ALTERNATIVES'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#FDF6F0',
    padding: spacing.md,
    borderRadius: radii.card,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: '#F2D0C6',
    ...shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coralDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.coral,
  },
  alertTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.coral,
    letterSpacing: 1,
  },
  dismissText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
    padding: 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  desc: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    marginTop: 2,
    lineHeight: 16,
  },
  actionRow: {
    marginTop: spacing.sm,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    height: 38,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: colors.surface,
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
