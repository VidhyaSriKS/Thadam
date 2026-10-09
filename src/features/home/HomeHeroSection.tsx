import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { TrailThread } from '../../components/ui/TrailThread';
import { useTranslation } from '../../i18n';

interface HomeHeroSectionProps {
  isTripActive: boolean;
  onResumeLiveTrip?: () => void;
  onPlanTrip: () => void;
  onExplore: () => void;
}

export const HomeHeroSection: React.FC<HomeHeroSectionProps> = ({
  isTripActive,
  onResumeLiveTrip,
  onPlanTrip,
  onExplore,
}) => {
  const { t } = useTranslation();

  return (
    <View>
      {/* Live Trip Pill */}
      {isTripActive && (
        <TouchableOpacity style={styles.liveTripPill} onPress={onResumeLiveTrip} activeOpacity={0.9}>
          <View style={styles.liveDot} />
          <Text style={styles.livePillText}>{t('liveJourneyBanner')}</Text>
          <Text style={styles.liveResumeBtn}>{t('resumeTrip')}</Text>
        </TouchableOpacity>
      )}

      {/* Arch Hero */}
      <View style={styles.archHero}>
        <View style={styles.archTrailThread}>
          <TrailThread stopsCount={3} currentStopIndex={1} height={44} />
        </View>
        <Text style={styles.heroPre}>{t('heroPre')}</Text>
        <Text style={styles.heroTitle}>{t('heroTitle')}</Text>
        <View style={styles.heroBtnRow}>
          <TouchableOpacity style={styles.heroPrimaryBtn} onPress={onPlanTrip} activeOpacity={0.85}>
            <Text style={styles.heroPrimaryBtnText}>{t('heroPlanBtn')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroSecondaryBtn} onPress={onExplore} activeOpacity={0.85}>
            <Text style={styles.heroSecondaryBtnText}>{t('heroNearMeBtn')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  liveTripPill: {
    marginHorizontal: spacing.screenPadding,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold, marginRight: 8 },
  livePillText: { flex: 1, color: colors.onPrimary, fontSize: 12, fontWeight: '700' },
  liveResumeBtn: { color: colors.gold, fontSize: 11, fontWeight: '800' },
  archHero: {
    marginHorizontal: spacing.screenPadding,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 160,
    borderTopRightRadius: 160,
    borderRadius: radii.card,
    borderWidth: 2,
    borderColor: colors.gold,
    padding: spacing.xl,
    paddingTop: 36,
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  archTrailThread: { opacity: 0.65, marginBottom: 6 },
  heroPre: { fontSize: 10, fontWeight: '800', color: colors.goldText, letterSpacing: 1.5, marginBottom: 6 },
  heroTitle: {
    fontFamily: typography.fontFamilyHeading,
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  heroBtnRow: { flexDirection: 'row', gap: 10 },
  heroPrimaryBtn: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: colors.primary, borderRadius: radii.pill },
  heroPrimaryBtnText: { color: colors.onPrimary, fontSize: 12, fontWeight: '700' },
  heroSecondaryBtn: { paddingVertical: 10, paddingHorizontal: 18, backgroundColor: colors.surfaceSubtle, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border },
  heroSecondaryBtnText: { color: colors.ink, fontSize: 12, fontWeight: '700' },
});
