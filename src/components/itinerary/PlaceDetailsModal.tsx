import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Destination } from '../../types/database';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { DestinationImage } from '../ui/DestinationImage';
import { PlaceDetailsStats } from './PlaceDetailsStats';
import { useTranslation } from '../../i18n';

interface PlaceDetailsModalProps {
  visible: boolean;
  destination: Destination | null;
  onClose: () => void;
  onBookExperience?: (exp?: any) => void;
}

export const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  visible,
  destination,
  onClose,
  onBookExperience,
}) => {
  const { t, formatCurrency, isTamil } = useTranslation();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Story' | 'Facilities'>('Overview');
  const [isFavorited, setIsFavorited] = useState(false);

  if (!destination) return null;
  const fac = destination.facilities;

  const tabNames: Array<{ key: 'Overview' | 'Story' | 'Facilities'; label: string }> = [
    { key: 'Overview', label: t('tabOverview') },
    { key: 'Story', label: t('tabStory') },
    { key: 'Facilities', label: t('tabFacilities') },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />

          {/* Top Control Row */}
          <View style={styles.topControlRow}>
            <TouchableOpacity style={styles.circleBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.circleBtnText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} onPress={() => setIsFavorited(!isFavorited)} activeOpacity={0.8}>
              <Text style={[styles.circleBtnText, isFavorited && { color: colors.coral }]}>{isFavorited ? '♥' : '♡'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* Hero Image */}
            <View style={styles.imageContainer}>
              <DestinationImage destination={destination} style={styles.heroImage} containerStyle={{ width: '100%', height: '100%' }} aspectRatio={16 / 9} showBadge />
              <View style={styles.imageGradientOverlay} />
              <View style={styles.imageTitleBox}>
                <View style={styles.verifiedRow}>
                  <Text style={styles.categoryBadge}>{destination.category}</Text>
                  <View style={styles.verifiedPill}>
                    <Text style={styles.verifiedPillText}>✓ {t('verified')}</Text>
                  </View>
                </View>
                <Text style={styles.heroTitle}>{destination.name}</Text>
                <Text style={styles.heroLocation}>📍 {destination.district}, Tamil Nadu</Text>
              </View>
            </View>

            {/* Segment Tabs */}
            <View style={styles.segmentRow}>
              {tabNames.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <TouchableOpacity key={tab.key} style={[styles.segmentTab, isActive && styles.segmentTabActive]} onPress={() => setActiveTab(tab.key)} activeOpacity={0.8}>
                    <Text style={[styles.segmentTabText, isActive && styles.segmentTabTextActive]}>{tab.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Stats row */}
            <PlaceDetailsStats destination={destination} />

            {/* Tab Contents */}
            {activeTab === 'Overview' && (
              <View style={styles.contentSection}>
                <Text style={styles.sectionHeading}>{t('aboutThisPlace')}</Text>
                <Text style={styles.bodyText}>{destination.description}</Text>
                {destination.culturalSignificance && (
                  <View style={styles.culturalBox}>
                    <Text style={styles.culturalTag}>{t('culturalHeritage')}</Text>
                    <Text style={styles.culturalText}>{destination.culturalSignificance}</Text>
                  </View>
                )}
                <Text style={[styles.sectionHeading, { marginTop: spacing.lg }]}>{t('experienceHighlights')}</Text>
                <View style={styles.highlightsRow}>
                  {destination.tags.map((tag: string, idx: number) => (
                    <View key={idx} style={styles.highlightPill}>
                      <Text style={styles.highlightText}>✦ {tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'Story' && (
              <View style={styles.contentSection}>
                <Text style={styles.sectionHeading}>{t('theLivingHeritage')}</Text>
                <Text style={styles.bodyText}>{destination.culturalSignificance || destination.description}</Text>
                <View style={styles.sourceBox}>
                  <Text style={styles.sourceText}>{t('verifiedRegistrySource')} {destination.source}</Text>
                </View>
              </View>
            )}

            {activeTab === 'Facilities' && (
              <View style={styles.contentSection}>
                <Text style={styles.sectionHeading}>{t('corridorAccessibility')}</Text>
                <View style={styles.facilityList}>
                  <Text style={styles.facilityItem}>{t('hospitalDistance')} {fac.hospitalKm} {t('km')}</Text>
                  <Text style={styles.facilityItem}>{t('fuelDistance')} {fac.fuelKm} {t('km')}</Text>
                  <Text style={styles.facilityItem}>{t('medicalPharmacy')} {fac.pharmacyKm < 5 ? t('pharmacyCorridor') : t('pharmacyJunction')}</Text>
                  <Text style={styles.facilityItem}>{t('verifiedStays')} {fac.hotelKm < 5 ? t('staysNearby') : t('staysEnRoute')}</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Sticky Bottom Bar */}
          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.priceLabel}>{t('estimatedEntry')}</Text>
              <Text style={styles.priceVal}>{destination.entryFee === 0 ? t('freeEntry') : formatCurrency(destination.entryFee)}</Text>
            </View>
            <TouchableOpacity style={styles.ctaBtn} onPress={() => { if (onBookExperience) onBookExperience(); else onClose(); }} activeOpacity={0.9}>
              <Text style={styles.ctaBtnText}>{t('exploreExperience')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(24, 36, 63, 0.45)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: colors.surface, borderTopLeftRadius: radii.sheet, borderTopRightRadius: radii.sheet, paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxl, maxHeight: '92%', width: '100%', maxWidth: 720, alignSelf: 'center', ...shadows.elevated },
  dragHandle: { width: 36, height: 4, borderRadius: radii.full, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.xs },
  topControlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  circleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceSubtle, justifyContent: 'center', alignItems: 'center' },
  circleBtnText: { fontSize: 18, color: colors.textPrimary, fontWeight: '700' },
  scrollArea: { marginBottom: 70 },
  imageContainer: { width: '100%', height: 260, borderRadius: radii.card, overflow: 'hidden', position: 'relative', marginBottom: spacing.lg },
  heroImage: { width: '100%', height: '100%', backgroundColor: colors.surfaceSubtle },
  imageGradientOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, backgroundColor: 'rgba(24, 36, 63, 0.65)' },
  imageTitleBox: { position: 'absolute', bottom: spacing.md, left: spacing.md, right: spacing.md },
  verifiedRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 4 },
  categoryBadge: { fontSize: 10, fontWeight: '700', color: colors.sandLight, letterSpacing: 1 },
  verifiedPill: { backgroundColor: colors.forestGreen, paddingHorizontal: 8, paddingVertical: 2, borderRadius: radii.full },
  verifiedPillText: { fontSize: 10, fontWeight: '700', color: colors.surface },
  heroTitle: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.surface, letterSpacing: -0.4 },
  heroLocation: { fontSize: typography.sizes.xs, color: colors.sandLight, marginTop: 2 },
  segmentRow: { flexDirection: 'row', backgroundColor: colors.surfaceSubtle, borderRadius: radii.full, padding: 3, marginBottom: spacing.lg },
  segmentTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: radii.full },
  segmentTabActive: { backgroundColor: colors.surface, ...shadows.card },
  segmentTabText: { fontSize: typography.sizes.xs, fontWeight: '600', color: colors.textSecondary },
  segmentTabTextActive: { color: colors.primary, fontWeight: '700' },
  contentSection: { paddingVertical: spacing.xs },
  sectionHeading: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.xs },
  bodyText: { fontSize: typography.sizes.xs + 1, color: colors.textSecondary, lineHeight: 20 },
  culturalBox: { marginTop: spacing.md, backgroundColor: colors.sandLight, borderRadius: radii.smCard, padding: spacing.md, borderWidth: 1, borderColor: '#DEC39F' },
  culturalTag: { fontSize: 9, fontWeight: '800', color: colors.accentGold, letterSpacing: 1, marginBottom: 2 },
  culturalText: { fontSize: typography.sizes.xs, color: colors.textPrimary, lineHeight: 18 },
  highlightsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  highlightPill: { backgroundColor: colors.surfaceSubtle, borderRadius: radii.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.borderLight },
  highlightText: { fontSize: 11, color: colors.textPrimary, fontWeight: '600' },
  sourceBox: { marginTop: spacing.md },
  sourceText: { fontSize: 11, fontStyle: 'italic', color: colors.textTertiary },
  facilityList: { gap: spacing.sm, marginTop: spacing.xs },
  facilityItem: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...shadows.elevated },
  priceLabel: { fontSize: 9, fontWeight: '700', color: colors.textTertiary, letterSpacing: 0.5 },
  priceVal: { fontSize: typography.sizes.md, fontWeight: '800', color: colors.primary },
  ctaBtn: { height: 46, paddingHorizontal: spacing.xl, borderRadius: radii.button, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  ctaBtnText: { fontSize: typography.sizes.xs, fontWeight: '700', color: colors.surface, letterSpacing: 1 },
});
