import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radii } from '../../config/theme';
import { LinkedSliders } from '../../components/ui/LinkedSliders';
import {
  CrowdPreference,
  DestinationPreference,
  InterestCategory,
  TransportMode,
} from '../../types/preferences';
import { useTranslation } from '../../i18n';

const ALL_INTERESTS: InterestCategory[] = [
  'Historical', 'Traditional', 'Cultural', 'Food', 'Nature', 'Beach',
  'Rural', 'Spiritual', 'Adventure', 'Photography', 'Shopping', 'Art & Craft',
];
const ALL_TRANSPORTS: TransportMode[] = ['Walking', 'Two-wheeler', 'Car', 'Bus', 'Train', 'Cab'];
const ALL_TRAVEL_TIMES: Array<'1 hour' | '2 hours' | '3 hours' | 'Flexible'> = ['1 hour', '2 hours', '3 hours', 'Flexible'];

interface PlannerPreferencesProps {
  interests: InterestCategory[];
  onToggleInterest: (val: InterestCategory) => void;
  destPreference: DestinationPreference;
  onDestPreferenceChange: (val: DestinationPreference) => void;
  famousMix: number;
  moderateMix: number;
  hiddenMix: number;
  onMixChange: (f: number, m: number, h: number) => void;
  crowd: CrowdPreference;
  onCrowdChange: (val: CrowdPreference) => void;
  transportPreferred: TransportMode;
  onTransportPreferredChange: (val: TransportMode) => void;
  transportAlternative: TransportMode;
  onTransportAlternativeChange: (val: TransportMode) => void;
  maxTravelTime: '1 hour' | '2 hours' | '3 hours' | 'Flexible';
  onMaxTravelTimeChange: (val: any) => void;
}

export const PlannerPreferences: React.FC<PlannerPreferencesProps> = ({
  interests,
  onToggleInterest,
  destPreference,
  onDestPreferenceChange,
  famousMix,
  moderateMix,
  hiddenMix,
  onMixChange,
  crowd,
  onCrowdChange,
  transportPreferred,
  onTransportPreferredChange,
  transportAlternative,
  onTransportAlternativeChange,
  maxTravelTime,
  onMaxTravelTimeChange,
}) => {
  const { t, translateInterest, translateTransport, translateTravelTime, isTamil } = useTranslation();

  const destOptions: Array<{ key: DestinationPreference; label: string }> = [
    { key: 'Famous', label: t('prefFamous') },
    { key: 'Moderate', label: t('prefModerate') },
    { key: 'Hidden', label: t('prefHidden') },
    { key: 'Mixed', label: t('prefMixed') },
  ];

  return (
    <View style={styles.container}>
      {/* 6. Interests */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>{t('secInterests')}</Text>
        <Text style={styles.hintText}>{t('interestsHint')}</Text>
        <View style={styles.chipsWrap}>
          {ALL_INTERESTS.map((item) => {
            const on = interests.includes(item);
            const label = translateInterest(item);
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => onToggleInterest(item)}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>
                  {on ? `✓ ${label}` : label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 7. Destination Preference & Mix */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>{t('secDestPreference')}</Text>
        <View style={styles.chipsWrap}>
          {destOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.chip, destPreference === opt.key && styles.chipOn]}
              onPress={() => onDestPreferenceChange(opt.key)}
            >
              <Text style={[styles.chipText, destPreference === opt.key && styles.chipTextOn]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {destPreference === 'Mixed' && (
          <View style={styles.mixBox}>
            <Text style={styles.subTitle}>{t('smartMixSubtitle')}</Text>
            <LinkedSliders
              famous={famousMix}
              moderate={moderateMix}
              hidden={hiddenMix}
              onChange={onMixChange}
            />
            <Text style={styles.explainText}>{t('hiddenMixExplanation')}</Text>
          </View>
        )}
      </View>

      {/* 8. Crowd Preference */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>{t('secCrowd')}</Text>
        <View style={styles.segmentedRow}>
          {(['Low', 'Moderate', 'Any'] as CrowdPreference[]).map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.segmentBtn, crowd === opt && styles.segmentBtnActive]}
              onPress={() => onCrowdChange(opt)}
            >
              <Text style={[styles.segmentText, crowd === opt && styles.segmentTextActive]}>
                {opt === 'Low' ? t('crowdLow') : opt === 'Moderate' ? t('crowdModerate') : t('crowdAny')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 9 & 10. Transport & Max Continuous Travel */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>{t('secTransport')}</Text>
        <Text style={styles.subTitle}>{t('preferredTransportLabel')}</Text>
        <View style={styles.chipsWrap}>
          {ALL_TRANSPORTS.map((tr) => (
            <TouchableOpacity
              key={tr}
              style={[styles.chip, transportPreferred === tr && styles.chipOn]}
              onPress={() => onTransportPreferredChange(tr)}
            >
              <Text style={[styles.chipText, transportPreferred === tr && styles.chipTextOn]}>
                {translateTransport(tr)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.subTitle, { marginTop: 8 }]}>{t('alternativeTransportLabel')}</Text>
        <View style={styles.chipsWrap}>
          {ALL_TRANSPORTS.map((tr) => (
            <TouchableOpacity
              key={tr}
              style={[styles.chip, transportAlternative === tr && styles.chipOn]}
              onPress={() => onTransportAlternativeChange(tr)}
            >
              <Text style={[styles.chipText, transportAlternative === tr && styles.chipTextOn]}>
                {translateTransport(tr)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.subTitle, { marginTop: 8 }]}>{t('maxTravelTimeLabel')}</Text>
        <View style={styles.chipsWrap}>
          {ALL_TRAVEL_TIMES.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.chip, maxTravelTime === time && styles.chipOn]}
              onPress={() => onMaxTravelTimeChange(time)}
            >
              <Text style={[styles.chipText, maxTravelTime === time && styles.chipTextOn]}>
                {translateTravelTime(time)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: colors.goldText, letterSpacing: 1, marginBottom: 8 },
  subTitle: { fontSize: 12, fontWeight: '700', color: colors.ink, marginBottom: 6 },
  hintText: { fontSize: 11, color: colors.textSecondary, marginBottom: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { minHeight: 38, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, color: colors.ink, fontWeight: '500' },
  chipTextOn: { color: colors.onPrimary, fontWeight: '700' },
  mixBox: { marginTop: 10, backgroundColor: colors.background, borderRadius: radii.md, padding: 10 },
  explainText: { fontSize: 11, color: colors.textSecondary, fontStyle: 'italic', marginTop: 4, lineHeight: 16 },
  segmentedRow: { flexDirection: 'row', gap: 8 },
  segmentBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
  segmentBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentText: { fontSize: 12, fontWeight: '600', color: colors.ink },
  segmentTextActive: { color: colors.onPrimary, fontWeight: '700' },
});
