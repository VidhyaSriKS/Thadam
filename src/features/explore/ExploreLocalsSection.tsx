import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Experience } from '../../types/database';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { DestinationImage } from '../../components/ui/DestinationImage';
import { useTranslation } from '../../i18n';

interface ExploreLocalsSectionProps {
  experiences: Experience[];
  onSelectExperience: (exp: Experience) => void;
}

export const ExploreLocalsSection: React.FC<ExploreLocalsSectionProps> = ({
  experiences,
  onSelectExperience,
}) => {
  const { t, formatCurrency } = useTranslation();

  return (
    <View>
      <View style={styles.localsSectionHeader}>
        <Text style={styles.localsPreTitle}>{t('craftGuilds')}</Text>
        <Text style={styles.localsTitle}>{t('meetTheLocals')}</Text>
        <Text style={styles.localsSub}>{t('experienceTamilNaduLocals')}</Text>
      </View>

      <View style={styles.experiencesGrid}>
        {experiences.map((exp) => (
          <TouchableOpacity
            key={exp.id}
            style={styles.expCard}
            onPress={() => onSelectExperience(exp)}
            activeOpacity={0.9}
          >
            <DestinationImage
              destination={{ id: exp.id, name: exp.name, image: exp.photos[0], district: exp.locationNote }}
              style={styles.expImage}
              containerStyle={{ width: '100%', height: 160, overflow: 'hidden' }}
              aspectRatio={16 / 9}
            />

            <View style={styles.expBody}>
              <View style={styles.expTopRow}>
                <Text style={styles.expCategory}>{exp.category}</Text>
                <Text style={styles.expPrice}>{formatCurrency(exp.price)} / {t('perPerson')}</Text>
              </View>

              <Text style={styles.expTitle}>{exp.name}</Text>
              <Text style={styles.expHost}>{t('hostedBy')} {exp.providerName}</Text>

              <View style={styles.expFooter}>
                <View style={styles.verifiedTag}>
                  <Text style={styles.verifiedTagText}>✓ {t('verifiedHost')}</Text>
                </View>
                <Text style={styles.bookCtaText}>{t('bookExperienceCta')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  localsSectionHeader: { marginTop: spacing['2xl'], marginBottom: spacing.md },
  localsPreTitle: { fontSize: 10, fontWeight: '800', color: colors.accentGold, letterSpacing: 1, marginBottom: 2 },
  localsTitle: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.4 },
  localsSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  experiencesGrid: { gap: spacing.md },
  expCard: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...shadows.card },
  expImage: { width: '100%', height: 160, backgroundColor: colors.surfaceSubtle },
  expBody: { padding: spacing.md },
  expTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  expCategory: { fontSize: 10, fontWeight: '800', color: colors.accentGold, letterSpacing: 1 },
  expPrice: { fontSize: typography.sizes.sm, fontWeight: '800', color: colors.primary },
  expTitle: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.textPrimary, marginTop: 2 },
  expHost: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.sm },
  expFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.xs, borderTopWidth: 1, borderTopColor: colors.borderLight },
  verifiedTag: { backgroundColor: '#EEF4F0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.full },
  verifiedTagText: { fontSize: 10, fontWeight: '700', color: colors.forestGreen },
  bookCtaText: { fontSize: 12, fontWeight: '700', color: colors.forestGreen },
});
