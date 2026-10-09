import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, radii, shadows } from '../../config/theme';
import { useProfileStore } from '../../store/useProfileStore';
import { ProfilePrivacySection } from './ProfilePrivacySection';
import { useTranslation } from '../../i18n';

interface ProfileScreenProps {
  onBack?: () => void;
  onOpenNotifications?: () => void;
}

const ALL_INTERESTS = [
  'Historical', 'Traditional', 'Cultural', 'Food', 'Nature',
  'Beach', 'Rural', 'Spiritual', 'Adventure', 'Photography', 'Shopping', 'Art & Craft',
];

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { profile, completeness, updateProfile, togglePersonalisation, exportData } = useProfileStore();
  const { t, isTamil, setLanguage, translateInterest } = useTranslation();
  const [activeTab, setActiveTab] = useState<'preferences' | 'privacy'>('preferences');

  const toggleInterest = (interest: string) => {
    const current = profile.interests;
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    updateProfile({ interests: updated });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.headerCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userSub}>{profile.homeCity} • {isTamil ? 'தமிழ்' : 'English'}</Text>
            <View style={styles.completenessRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: `${completeness}%` }]} />
              </View>
              <Text style={styles.progressText}>{completeness}% {isTamil ? 'முடிந்தது' : 'Complete'}</Text>
            </View>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'preferences' && styles.tabBtnActive]}
            onPress={() => setActiveTab('preferences')}
          >
            <Text style={[styles.tabText, activeTab === 'preferences' && styles.tabTextActive]}>
              {t('profileTravelPrefs')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'privacy' && styles.tabBtnActive]}
            onPress={() => setActiveTab('privacy')}
          >
            <Text style={[styles.tabText, activeTab === 'privacy' && styles.tabTextActive]}>
              {t('profilePrivacyControls')}
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'preferences' ? (
          <>
            {/* Language Selection Card */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('appLanguageTitle')}</Text>
              <Text style={styles.sectionSub}>{t('appLanguageSub')}</Text>
              <View style={styles.segmentedRow}>
                <TouchableOpacity
                  style={[styles.segmentBtn, !isTamil && styles.segmentBtnActive]}
                  onPress={() => setLanguage('en')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentText, !isTamil && styles.segmentTextActive]}>English</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segmentBtn, isTamil && styles.segmentBtnActive]}
                  onPress={() => setLanguage('ta')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.segmentText, isTamil && styles.segmentTextActive]}>தமிழ்</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Interests Section */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('myInterestsTitle')}</Text>
              <Text style={styles.sectionSub}>{t('myInterestsSub')}</Text>
              <View style={styles.chipsWrap}>
                {ALL_INTERESTS.map((interest) => {
                  const isSelected = profile.interests.includes(interest);
                  return (
                    <TouchableOpacity
                      key={interest}
                      style={[styles.chip, isSelected && styles.chipActive]}
                      onPress={() => toggleInterest(interest)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {translateInterest(interest)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Travel Pace & Crowd */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('travelStyleFlow')}</Text>
              <View style={styles.segmentedRow}>
                {(['relaxed', 'balanced', 'packed'] as const).map((style) => (
                  <TouchableOpacity
                    key={style}
                    style={[styles.segmentBtn, profile.travelStyle === style && styles.segmentBtnActive]}
                    onPress={() => updateProfile({ travelStyle: style })}
                  >
                    <Text style={[styles.segmentText, profile.travelStyle === style && styles.segmentTextActive]}>
                      {isTamil
                        ? style === 'relaxed' ? 'நிதானம்' : style === 'balanced' ? 'சமநிலை' : 'வேகமானது'
                        : style.charAt(0).toUpperCase() + style.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>{t('crowdPreferenceTitle')}</Text>
              <View style={styles.segmentedRow}>
                {(['low', 'moderate', 'any'] as const).map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.segmentBtn, profile.crowd === c && styles.segmentBtnActive]}
                    onPress={() => updateProfile({ crowd: c })}
                  >
                    <Text style={[styles.segmentText, profile.crowd === c && styles.segmentTextActive]}>
                      {c === 'low' ? t('crowdLow') : c === 'moderate' ? t('crowdModerate') : t('crowdAny')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Trusted Contact */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('trustedContactTitle')}</Text>
              <Text style={styles.sectionSub}>{t('trustedContactSub')}</Text>
              <View style={styles.contactBox}>
                <Text style={styles.contactName}>{profile.trustedContact?.name || t('notSet')}</Text>
                <Text style={styles.contactPhone}>{profile.trustedContact?.phone || t('noPhoneAdded')}</Text>
              </View>
            </View>
          </>
        ) : (
          <ProfilePrivacySection
            personalisation={profile.personalisation}
            onTogglePersonalisation={togglePersonalisation}
            onExportData={exportData}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenPadding, paddingBottom: 100 },
  headerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.lg, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, ...shadows.card },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { fontSize: 24, fontWeight: '700', color: colors.onPrimary },
  headerInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: '800', color: colors.ink },
  userSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  completenessRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  progressTrack: { flex: 1, height: 6, backgroundColor: colors.line, borderRadius: 3, marginRight: 8 },
  progressBar: { height: 6, backgroundColor: colors.gold, borderRadius: 3 },
  progressText: { fontSize: 11, fontWeight: '700', color: colors.goldText },
  tabRow: { flexDirection: 'row', marginBottom: spacing.md, backgroundColor: colors.surfaceSubtle, borderRadius: radii.pill, padding: 3 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radii.pill },
  tabBtnActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 12, fontWeight: '700', color: colors.ink },
  tabTextActive: { color: colors.onPrimary },
  sectionCard: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: colors.goldText, letterSpacing: 1, marginBottom: 4 },
  sectionSub: { fontSize: 12, color: colors.textSecondary, marginBottom: spacing.sm },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceSubtle },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.ink },
  chipTextActive: { color: colors.onPrimary },
  segmentedRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  segmentBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, backgroundColor: colors.surfaceSubtle },
  segmentBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentText: { fontSize: 11, fontWeight: '700', color: colors.ink },
  segmentTextActive: { color: colors.onPrimary },
  contactBox: { padding: spacing.sm, backgroundColor: colors.surfaceSubtle, borderRadius: radii.md, marginTop: 4 },
  contactName: { fontSize: 14, fontWeight: '700', color: colors.ink },
  contactPhone: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
