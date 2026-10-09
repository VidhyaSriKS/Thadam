import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { useTripStore } from '../../store/useTripStore';
import { useTranslation } from '../../i18n';

interface AIGenerationScreenProps {
  onComplete: () => void;
}

const STEPS_EN = [
  'Understanding your travel style',
  'Looking beyond the usual',
  'Matching places to your interests',
  'Checking the route',
  'Finding local experiences',
  'Balancing your journey',
  'Your journey is ready',
];

const STEPS_TA = [
  'உங்கள் பயண பாணியைப் புரிந்துகொள்கிறோம்',
  'வழக்கமான இடங்களைத் தாண்டி ஆராய்கிறோம்',
  'உங்கள் ஆர்வங்களுக்கு ஏற்ப இடங்களை இணைக்கிறோம்',
  'பயண வழியைச் சரிபார்க்கிறோம்',
  'உள்ளூர் கலை அனுபவங்களைக் கண்டறிகிறோம்',
  'பயணத்தை சமநிலைப்படுத்துகிறோம்',
  'உங்கள் பயணம் தயாராகிவிட்டது',
];

export const AIGenerationScreen: React.FC<AIGenerationScreenProps> = ({ onComplete }) => {
  const { generateTrip } = useTripStore();
  const { t, isTamil } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = isTamil ? STEPS_TA : STEPS_EN;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          generateTrip();
          setTimeout(() => onComplete(), 500);
          return prev;
        }
      });
    }, 550);

    return () => clearInterval(interval);
  }, [generateTrip, onComplete, steps.length]);

  return (
    <View style={styles.container}>
      <View style={styles.centerCard}>
        <View style={styles.brandIconCircle}>
          <Text style={styles.brandLetter}>த</Text>
        </View>

        <Text style={styles.headline}>{t('genHeadline')}</Text>
        <Text style={styles.subheadline}>{t('genSubheadline')}</Text>

        <View style={styles.pathCanvas}>
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <View key={idx} style={styles.pathNodeRow}>
                <View style={styles.pathColumn}>
                  <View
                    style={[
                      styles.pathDot,
                      isCompleted && styles.pathDotCompleted,
                      isCurrent && styles.pathDotCurrent,
                    ]}
                  >
                    {isCompleted ? (
                      <Text style={styles.dotCheck}>✓</Text>
                    ) : isCurrent ? (
                      <View style={styles.dotPulseCore} />
                    ) : null}
                  </View>
                  {idx < steps.length - 1 && (
                    <View
                      style={[
                        styles.pathConnector,
                        isCompleted ? styles.pathConnectorCompleted : styles.pathConnectorUpcoming,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.labelWrapper}>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCompleted && styles.stepLabelCompleted,
                      isCurrent && styles.stepLabelCurrent,
                      idx > currentStepIndex && styles.stepLabelUpcoming,
                    ]}
                  >
                    {step}
                  </Text>
                  {isCurrent && (
                    <Text style={styles.statusLivePill}>{isTamil ? 'செயலில்' : 'ANALYZING'}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.footnoteRow}>
          <View style={styles.dotGold} />
          <Text style={styles.footnoteText}>
            {isTamil
              ? 'தடம் AI • நேரலை கூட்ட நெரிசல் & உள்ளூர்க் கலைஞர் சரிபார்ப்பு'
              : 'THADAM AI • Verified heritage database & living artisan circuits'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  centerCard: { width: '100%', maxWidth: 440, backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, ...shadows.elevated },
  brandIconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: spacing.md },
  brandLetter: { fontSize: 24, fontWeight: '700', color: colors.warmSand, fontFamily: typography.fontFamilyHeading },
  headline: { fontFamily: typography.fontFamilyHeading, fontSize: 24, fontWeight: '700', color: colors.ink, textAlign: 'center', marginBottom: 4 },
  subheadline: { fontFamily: typography.fontFamily, fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  pathCanvas: { marginTop: spacing.xs },
  pathNodeRow: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 46 },
  pathColumn: { width: 28, alignItems: 'center' },
  pathDot: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface },
  pathDotCompleted: { borderColor: colors.forestGreen, backgroundColor: colors.forestGreen },
  pathDotCurrent: { borderColor: colors.primary, backgroundColor: colors.surface },
  dotCheck: { color: colors.surface, fontSize: 11, fontWeight: '800' },
  dotPulseCore: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold },
  pathConnector: { width: 2, flex: 1, minHeight: 24 },
  pathConnectorCompleted: { backgroundColor: colors.forestGreen },
  pathConnectorUpcoming: { backgroundColor: colors.border },
  labelWrapper: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8 },
  stepLabel: { fontSize: 13, fontFamily: typography.fontFamily, color: colors.textSecondary },
  stepLabelCompleted: { color: colors.ink, fontWeight: '500' },
  stepLabelCurrent: { color: colors.primary, fontWeight: '700' },
  stepLabelUpcoming: { color: colors.textTertiary },
  statusLivePill: { fontSize: 9, fontWeight: '700', color: colors.goldText, backgroundColor: colors.surfaceSubtle, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.pill },
  footnoteRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, gap: 6 },
  dotGold: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold },
  footnoteText: { fontSize: 11, color: colors.textSecondary, fontFamily: typography.fontFamily },
});
