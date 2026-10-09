import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DESTINATIONS } from '../../data/destinations';
import { EXPERIENCES } from '../../data/experiences';
import { Destination, Experience } from '../../types/database';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { PopularityBadge, PressureBadge } from '../../components/common/Badge';
import { DataBadge } from '../../components/ui/DataBadge';
import { DestinationImage } from '../../components/ui/DestinationImage';
import { ExploreLocalsSection } from './ExploreLocalsSection';
import { useTranslation } from '../../i18n';

interface ExploreScreenProps {
  onSelectDestination: (dest: Destination) => void;
  onSelectExperience: (exp: Experience) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectDestination,
  onSelectExperience,
}) => {
  const { t, isTamil } = useTranslation();
  const [selectedType, setSelectedType] = useState<'All' | 'famous' | 'moderate' | 'hidden'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = isTamil
    ? ['அனைத்தும்', 'மறைக்கப்பட்ட பாரம்பரியம்', 'கைவினை கலைக் கூடம்', 'பாரம்பரிய கட்டிடக்கலை', 'ஆன்மீகம் & இயற்கை']
    : ['All', 'Hidden Heritage', 'Living Craft & Artisan Guild', 'Heritage & Architecture', 'Nature & Spiritual'];

  const filteredDestinations = DESTINATIONS.filter((d) => {
    if (selectedType !== 'All' && d.popularityType !== selectedType) return false;
    return true;
  });

  const filterOptions: Array<{ key: 'All' | 'hidden' | 'moderate' | 'famous'; label: string }> = [
    { key: 'All', label: t('allPlacesFilter') },
    { key: 'hidden', label: t('hiddenFilter') },
    { key: 'moderate', label: t('balancedFilter') },
    { key: 'famous', label: t('famousFilter') },
  ];

  return (
    <View style={styles.container}>
      {/* Editorial Header */}
      <View style={styles.header}>
        <Text style={styles.preTitle}>{t('explorePreTitle')}</Text>
        <Text style={styles.headerTitle}>{t('exploreTitle')}</Text>
        <Text style={styles.headerSub}>{t('exploreSub')}</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filterOptions.map((opt) => {
            const active = selectedType === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setSelectedType(opt.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {categories.map((c) => {
            const active = selectedCategory === c || (selectedCategory === 'All' && c === categories[0]);
            return (
              <TouchableOpacity
                key={c}
                style={[styles.catPill, active && styles.catPillActive]}
                onPress={() => setSelectedCategory(c)}
                activeOpacity={0.8}
              >
                <Text style={[styles.catPillText, active && styles.catPillTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Count Label */}
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {filteredDestinations.length} {t('showingDestinationsCount')}
          </Text>
        </View>

        {/* Destination Cards */}
        <View style={styles.cardsGrid}>
          {filteredDestinations.map((dest) => (
            <TouchableOpacity
              key={dest.id}
              style={styles.destCard}
              onPress={() => onSelectDestination(dest)}
              activeOpacity={0.9}
            >
              <DestinationImage
                destination={dest}
                style={styles.cardImage}
                containerStyle={{ width: '100%', height: 180, overflow: 'hidden' }}
                aspectRatio={4 / 3}
                showBadge
              />

              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardCategory}>{dest.category}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <PressureBadge level={dest.pressureLevel} />
                    <DataBadge type="DEMO" />
                  </View>
                </View>

                <Text style={styles.cardTitle}>{dest.name}</Text>
                <Text style={styles.cardLocation}>
                  {dest.district} • {dest.facilities.hospitalKm} {t('km')} {t('hospitalAccess')}
                </Text>

                <Text style={styles.cardSnippet} numberOfLines={2}>
                  {dest.description}
                </Text>

                <View style={styles.cardFooter}>
                  <PopularityBadge type={dest.popularityType} />
                  <Text style={styles.exploreCta}>{t('explorePlace')} →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section: Meet the Locals */}
        <ExploreLocalsSection
          experiences={EXPERIENCES}
          onSelectExperience={onSelectExperience}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm, backgroundColor: colors.background },
  preTitle: { fontSize: 10, fontWeight: '800', color: colors.accentGold, letterSpacing: 1, marginBottom: 2 },
  headerTitle: { fontSize: typography.sizes['2xl'], fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  headerSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.md },
  filterRow: { gap: spacing.xs + 2, paddingBottom: spacing.xs },
  filterPill: { height: 36, paddingHorizontal: 14, borderRadius: radii.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterPillText: { fontSize: typography.sizes.xs, fontWeight: '600', color: colors.textPrimary },
  filterPillTextActive: { color: colors.surface },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: 110 },
  categoryRow: { gap: spacing.xs, paddingVertical: spacing.sm },
  catPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.full, backgroundColor: colors.surfaceSubtle, borderWidth: 1, borderColor: colors.borderLight },
  catPillActive: { backgroundColor: colors.sandLight, borderColor: '#DEC39F' },
  catPillText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  catPillTextActive: { color: colors.primary, fontWeight: '700' },
  metaRow: { marginVertical: spacing.xs },
  metaText: { fontSize: 11, color: colors.textTertiary },
  cardsGrid: { gap: spacing.lg, marginTop: spacing.xs },
  destCard: { backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...shadows.card },
  cardImage: { width: '100%', height: 180, backgroundColor: colors.surfaceSubtle },
  cardBody: { padding: spacing.md },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardCategory: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, letterSpacing: 1 },
  cardTitle: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.3 },
  cardLocation: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2, marginBottom: 6 },
  cardSnippet: { fontSize: typography.sizes.xs, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.sm },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.xs, borderTopWidth: 1, borderTopColor: colors.borderLight },
  exploreCta: { fontSize: 12, fontWeight: '700', color: colors.primary },
});
