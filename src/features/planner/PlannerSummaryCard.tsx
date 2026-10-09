import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { useTranslation } from '../../i18n';

interface PlannerSummaryCardProps {
  startDistrict: string;
  durationText: string;
  travelersText: string;
  budget: number;
  interests: string[];
  destMixText: string;
  crowd: string;
  transport: string;
  maxTravelLoad: string;
  stay: string;
  foods: string[];
  requirements: string[];
  onEditPress?: () => void;
}

export const PlannerSummaryCard: React.FC<PlannerSummaryCardProps> = ({
  startDistrict,
  durationText,
  travelersText,
  budget,
  interests,
  destMixText,
  crowd,
  transport,
  maxTravelLoad,
  stay,
  foods,
  requirements,
  onEditPress,
}) => {
  const { t, formatCurrency, translateInterest, translateFood, translateFacility } = useTranslation();

  const formattedInterests = interests.slice(0, 3).map(translateInterest).join(', ') +
    (interests.length > 3 ? ` +${interests.length - 3}` : '');
  const formattedFoods = foods.slice(0, 2).map(translateFood).join(', ');
  const formattedRequirements = requirements.length > 0
    ? requirements.map(translateFacility).join(', ')
    : t('standardSafety');

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleCol}>
          <Text style={styles.preTitle}>{t('summaryPreTitle')}</Text>
          <Text style={styles.title}>{t('summaryTitle')}</Text>
        </View>
        {onEditPress && (
          <TouchableOpacity style={styles.editBtn} onPress={onEditPress}>
            <Text style={styles.editBtnText}>{t('edit')} ✎</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.grid}>
        <Text style={styles.item} numberOfLines={1}>
          📍 <Text style={styles.bold}>{t('summaryStartingDistrict')} </Text>{startDistrict}
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          📅 <Text style={styles.bold}>{t('summaryDuration')} </Text>{durationText}
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          👥 <Text style={styles.bold}>{t('summaryTravelers')} </Text>{travelersText}
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          💰 <Text style={styles.bold}>{t('summaryBudget')} </Text>{formatCurrency(budget)}
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          ❤️ <Text style={styles.bold}>{t('summaryInterests')} </Text>{formattedInterests}
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          🧭 <Text style={styles.bold}>{t('summaryDestMix')} </Text>{destMixText}
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          👥 <Text style={styles.bold}>{t('summaryCrowd')} </Text>{crowd}
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          🚗 <Text style={styles.bold}>{t('summaryTransport')} </Text>{transport}
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          ⏱️ <Text style={styles.bold}>{t('summaryMaxTravel')} </Text>{maxTravelLoad}
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          🏨 <Text style={styles.bold}>{t('summaryStay')} </Text>{stay}
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          🍴 <Text style={styles.bold}>{t('summaryFood')} </Text>{formattedFoods}
        </Text>
        <Text style={styles.item} numberOfLines={1}>
          🛡️ <Text style={styles.bold}>{t('summaryRequirements')} </Text>{formattedRequirements}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md, borderWidth: 1.5, borderColor: colors.gold, marginBottom: spacing.md, ...shadows.card },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line, paddingBottom: 8 },
  titleCol: { flex: 1 },
  preTitle: { fontSize: 10, fontWeight: '800', color: colors.goldText, letterSpacing: 1 },
  title: { fontFamily: typography.fontFamilyHeading, fontSize: 20, fontWeight: '700', color: colors.ink, marginTop: 2 },
  editBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill, backgroundColor: colors.surfaceSubtle, borderWidth: 1, borderColor: colors.border },
  editBtnText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  grid: { gap: 6 },
  item: { fontSize: 12, color: colors.ink, lineHeight: 18 },
  bold: { fontWeight: '700', color: colors.primary },
});
