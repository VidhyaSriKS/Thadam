import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors, spacing, radii } from '../../config/theme';
import { AccommodationType } from '../../types/preferences';
import { useTranslation, FACILITY_LABELS } from '../../i18n';

const ALL_STAYS: AccommodationType[] = ['Budget', 'Standard', 'Premium', 'Homestay', 'Resort', 'No stay'];
const ALL_FOODS = ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Traditional', 'Local', 'Street food', 'Premium', 'Budget'];
const FACILITY_KEYS = Object.keys(FACILITY_LABELS);

interface PlannerStayFoodSafetyProps {
  stay: AccommodationType;
  onStayChange: (val: AccommodationType) => void;
  foods: string[];
  onToggleFood: (val: string) => void;
  facilities: { [key: string]: boolean };
  onToggleFacility: (key: string) => void;
  notes: string;
  onNotesChange: (val: string) => void;
}

export const PlannerStayFoodSafety: React.FC<PlannerStayFoodSafetyProps> = ({
  stay,
  onStayChange,
  foods,
  onToggleFood,
  facilities,
  onToggleFacility,
  notes,
  onNotesChange,
}) => {
  const { t, translateStay, translateFood, translateFacility } = useTranslation();

  return (
    <View style={styles.container}>
      {/* 11. Accommodation */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>{t('secAccommodation')}</Text>
        <View style={styles.chipsWrap}>
          {ALL_STAYS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, stay === s && styles.chipOn]}
              onPress={() => onStayChange(s)}
            >
              <Text style={[styles.chipText, stay === s && styles.chipTextOn]}>
                {translateStay(s)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 12. Food Preferences */}
        <Text style={[styles.sectionHeading, { marginTop: 14 }]}>{t('secFood')}</Text>
        <View style={styles.chipsWrap}>
          {ALL_FOODS.map((f) => {
            const on = foods.includes(f);
            return (
              <TouchableOpacity
                key={f}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => onToggleFood(f)}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>
                  {on ? `✓ ${translateFood(f)}` : translateFood(f)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 13. Facility & Travel Requirements */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>{t('secFacilities')}</Text>
        <Text style={styles.hintText}>{t('facilitiesHint')}</Text>
        <View style={styles.chipsWrap}>
          {FACILITY_KEYS.map((key) => {
            const on = !!facilities[key];
            const label = translateFacility(key);
            return (
              <TouchableOpacity
                key={key}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => onToggleFacility(key)}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>
                  {on ? `✓ ${label}` : label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 14. Additional Requirements */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>{t('secNotes')}</Text>
        <TextInput
          style={styles.textArea}
          value={notes}
          onChangeText={onNotesChange}
          placeholder={t('notesPlaceholder')}
          placeholderTextColor={colors.goldText}
          multiline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: colors.goldText, letterSpacing: 1, marginBottom: 8 },
  hintText: { fontSize: 11, color: colors.textSecondary, marginBottom: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { minHeight: 38, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.ink, fontWeight: '500' },
  chipTextOn: { color: colors.onPrimary, fontWeight: '700' },
  textArea: { minHeight: 74, borderWidth: 1, borderColor: colors.border, borderRadius: radii.input, padding: 10, backgroundColor: colors.background, fontSize: 13, color: colors.ink, textAlignVertical: 'top' },
});
