import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radii } from '../../config/theme';
import { Experience } from '../../types/database';
import { CURATED_TRAILS } from '../../engine/home';
import { useTranslation } from '../../i18n';

interface HomeScreenSectionsProps {
  experiencesList: Experience[];
  onSelectExperience: (exp: Experience) => void;
  onStartTrail: (trailId: string) => void;
}

export const HomeScreenSections: React.FC<HomeScreenSectionsProps> = ({
  experiencesList,
  onSelectExperience,
  onStartTrail,
}) => {
  const { t, isTamil, formatCurrency, formatDays } = useTranslation();

  return (
    <View>
      {/* Curated Trails */}
      <View style={styles.sectionWrap}>
        <Text style={styles.sectionHeading}>{t('sectionFollowTrail')}</Text>
        {CURATED_TRAILS.map((trail) => (
          <View key={trail.id} style={styles.trailCard}>
            <View style={styles.trailLeft}>
              <Text style={styles.trailTitle}>{trail.title}</Text>
              <Text style={styles.trailDesc}>{trail.description}</Text>
              <Text style={styles.trailMeta}>{formatDays(trail.estimatedDays)} • {trail.theme}</Text>
            </View>
            <TouchableOpacity style={styles.trailBtn} onPress={() => onStartTrail(trail.id)}>
              <Text style={styles.trailBtnText}>{t('startTrailCta')}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Local Experiences */}
      <View style={[styles.sectionWrap, { marginBottom: 40 }]}>
        <Text style={styles.sectionHeading}>{t('sectionMeetPeople')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {experiencesList.map((exp) => (
            <TouchableOpacity
              key={exp.id}
              style={styles.expCard}
              onPress={() => onSelectExperience(exp)}
              activeOpacity={0.85}
            >
              <Text style={styles.expTitle} numberOfLines={2}>{exp.title || exp.name}</Text>
              <Text style={styles.expProvider}>{exp.providerName}</Text>
              <View style={styles.expFooter}>
                <Text style={styles.expPrice}>{formatCurrency(exp.price)}</Text>
                <Text style={styles.expSeats}>{exp.availableSlots} {t('seatsLeft')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrap: { marginTop: spacing.lg, paddingHorizontal: spacing.screenPadding },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: colors.goldText, letterSpacing: 1, marginBottom: 8 },
  hScroll: { gap: 12 },
  trailCard: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trailLeft: { flex: 1, paddingRight: spacing.sm },
  trailTitle: { fontSize: 14, fontWeight: '800', color: colors.ink },
  trailDesc: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  trailMeta: { fontSize: 10, color: colors.goldText, fontWeight: '700', marginTop: 4 },
  trailBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.primary, borderRadius: radii.sm },
  trailBtnText: { color: colors.onPrimary, fontSize: 11, fontWeight: '700' },
  expCard: { width: 160, backgroundColor: colors.surface, padding: spacing.md, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, justifyContent: 'space-between' },
  expTitle: { fontSize: 12, fontWeight: '700', color: colors.ink },
  expProvider: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  expFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  expPrice: { fontSize: 13, fontWeight: '800', color: colors.primary },
  expSeats: { fontSize: 10, color: colors.forestGreen, fontWeight: '700' },
});
