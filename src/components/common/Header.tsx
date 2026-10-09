import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radii } from '../../config/theme';
import { useTripStore } from '../../store/useTripStore';
import { useTranslation } from '../../i18n';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  canGoBack?: boolean;
  onBack?: () => void;
  onOpenLiveTrip?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  canGoBack,
  onBack,
  onOpenLiveTrip,
}) => {
  const { activeTripSession } = useTripStore();
  const { t, isTamil, setLanguage } = useTranslation();

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        {/* Brand identity */}
        <View style={styles.brandContainer}>
          {canGoBack && onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.75}>
              <Text style={styles.backBtnText}>←</Text>
            </TouchableOpacity>
          )}
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkChar}>த</Text>
          </View>
          <View>
            <View style={styles.brandTitleRow}>
              <Text style={styles.brandName}>{t('brandName')}</Text>
              <View style={styles.pathAccentDot} />
            </View>
            <Text style={styles.tagline}>{t('brandTagline')}</Text>
          </View>
        </View>

        {/* Right Actions: Language Switcher + Demo */}
        <View style={styles.actionRow}>
          <View style={styles.langSwitchWrapper}>
            <TouchableOpacity
              style={[styles.langChip, !isTamil && styles.langChipActive]}
              onPress={() => setLanguage('en')}
              activeOpacity={0.7}
            >
              <Text style={[styles.langText, !isTamil && styles.langTextActive]}>EN</Text>
            </TouchableOpacity>
            <Text style={styles.langDivider}>|</Text>
            <TouchableOpacity
              style={[styles.langChip, isTamil && styles.langChipActive]}
              onPress={() => setLanguage('ta')}
              activeOpacity={0.7}
            >
              <Text style={[styles.langText, isTamil && styles.langTextActive]}>தமிழ்</Text>
            </TouchableOpacity>
          </View>

          {activeTripSession && onOpenLiveTrip && (
            <TouchableOpacity style={styles.liveTripPill} onPress={onOpenLiveTrip}>
              <View style={styles.livePulseDot} />
              <Text style={styles.liveTripPillText}>{t('liveBadge')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkChar: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.warmSand,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  brandSuffix: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gold,
  },
  pathAccentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
    marginLeft: 2,
  },
  tagline: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  liveTripPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.forestGreenLight,
    borderWidth: 1,
    borderColor: colors.forestGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    gap: 4,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.forestGreen,
  },
  liveTripPillText: {
    color: colors.forestGreen,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  langSwitchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  langChip: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  langChipActive: {
    backgroundColor: colors.primary,
  },
  langText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  langTextActive: {
    color: colors.onPrimary,
  },
  langDivider: {
    fontSize: 9,
    color: colors.border,
    fontWeight: '400',
  },
});
