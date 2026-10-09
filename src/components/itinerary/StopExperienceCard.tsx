import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Experience, TripStop } from '../../types/database';
import { colors, typography, spacing, radii } from '../../config/theme';
import { useTranslation } from '../../i18n';

interface StopExperienceCardProps {
  experience: Experience;
  stop: TripStop;
  onBookExperience?: (stop: TripStop) => void;
}

export const StopExperienceCard: React.FC<StopExperienceCardProps> = ({
  experience,
  stop,
  onBookExperience,
}) => {
  const { t, formatCurrency } = useTranslation();

  return (
    <TouchableOpacity
      style={styles.experienceCard}
      activeOpacity={0.88}
      onPress={() => onBookExperience && onBookExperience(stop)}
    >
      <View style={styles.expHeader}>
        <Text style={styles.expTag}>{t('meetTheLocals')}</Text>
        <Text style={styles.expPrice}>{formatCurrency(experience.price)} / {t('perPerson')}</Text>
      </View>
      <Text style={styles.expName}>{experience.name}</Text>
      <Text style={styles.expHost}>{t('hostedBy')} {experience.providerName} • ✓ {t('verified')}</Text>
      <View style={styles.expCtaRow}>
        <Text style={styles.expCtaText}>
          {t('reserveSlot')} ({experience.availableSlots} {t('slotsAvailable')}) →
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  experienceCard: {
    marginTop: spacing.md,
    backgroundColor: colors.sandLight,
    borderRadius: radii.smCard,
    padding: spacing.sm + 2,
    borderWidth: 1,
    borderColor: '#DFCBB1',
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  expTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.accentGold,
    letterSpacing: 1,
  },
  expPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  expName: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  expHost: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  expCtaRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#DEC39F',
  },
  expCtaText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.forestGreen,
  },
});
