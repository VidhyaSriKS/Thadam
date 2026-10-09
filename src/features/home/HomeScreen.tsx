import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, radii } from '../../config/theme';
import { DestinationImage } from '../../components/ui/DestinationImage';
import { useTripStore } from '../../store/useTripStore';
import { useProfileStore } from '../../store/useProfileStore';
import { Destination, Experience } from '../../types/database';
import { DESTINATIONS } from '../../data/destinations';
import { EXPERIENCES } from '../../data/experiences';
import { HomeTopBar } from './HomeTopBar';
import { HomeQuickStarts } from './HomeQuickStarts';
import { HomeHeroSection } from './HomeHeroSection';
import { HomeScreenSections } from './HomeScreenSections';
import {
  recommendForYou,
  lowCrowdNow,
  hiddenDiscoveries,
  localExperiences,
  trailToRequest,
} from '../../engine/home';
import { DataBadge } from '../../components/ui/DataBadge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useTranslation } from '../../i18n';

interface HomeScreenProps {
  onPlanTrip: () => void;
  onExplore: () => void;
  onSelectDestination: (dest: Destination) => void;
  onSelectExperience: (exp: Experience) => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onResumeLiveTrip?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlanTrip,
  onExplore,
  onSelectDestination,
  onSelectExperience,
  onOpenProfile,
  onOpenNotifications,
  onResumeLiveTrip,
}) => {
  const { activeTripSession, setPreferences, generateTrip } = useTripStore();
  const { profile } = useProfileStore();
  const { t, isTamil } = useTranslation();

  const dataSet = { destinations: DESTINATIONS, experiences: EXPERIENCES };
  const forYouList = recommendForYou(profile, dataSet, 5);
  const lowCrowdList = lowCrowdNow(dataSet, profile.homeCity, 4);
  const hiddenGems = hiddenDiscoveries(profile, dataSet, 5);
  const experiencesList = localExperiences(profile, dataSet, 5);

  const handleSelectPreset = (key: string) => {
    if (key === 'weekend') {
      setPreferences({ daysCount: 2, travelStyle: 'Relaxed', crowdPreference: 'Low' });
    } else if (key === 'heritage') {
      setPreferences({ daysCount: 3, travelStyle: 'Balanced', interests: ['Historical', 'Spiritual'] as any });
    } else if (key === 'hidden') {
      setPreferences({ daysCount: 3, destinationMix: { famous: 10, moderate: 30, hidden: 60 }, crowdPreference: 'Low' });
    } else if (key === 'family') {
      setPreferences({ daysCount: 3, travelStyle: 'Relaxed', crowdPreference: 'Low' });
    }
    onPlanTrip();
  };

  const handleStartTrail = (trailId: string) => {
    const req = trailToRequest(trailId, profile);
    setPreferences(req);
    generateTrip();
    onPlanTrip();
  };

  return (
    <View style={styles.container}>
      <HomeTopBar onOpenProfile={onOpenProfile} onOpenNotifications={onOpenNotifications} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <HomeHeroSection
          isTripActive={!!(activeTripSession && activeTripSession.isActive)}
          onResumeLiveTrip={onResumeLiveTrip}
          onPlanTrip={onPlanTrip}
          onExplore={onExplore}
        />

        {/* Quick Starts */}
        <HomeQuickStarts
          onSelectPreset={handleSelectPreset}
          onContinue={onPlanTrip}
          onOpenProfile={onOpenProfile}
        />

        {/* Based On You Carousel */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>
              {profile.personalisation ? t('sectionPickedForYou') : t('sectionPopularVerified')}
            </Text>
            <DataBadge status="DEMO" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {forYouList.map((item) => (
              <TouchableOpacity
                key={item.destination.id}
                style={styles.card}
                onPress={() => onSelectDestination(item.destination)}
                activeOpacity={0.85}
              >
                <DestinationImage
                  destination={item.destination}
                  style={styles.cardImg}
                  containerStyle={{ width: '100%', height: 100, overflow: 'hidden' }}
                  aspectRatio={16 / 9}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardName} numberOfLines={1}>{item.destination.name}</Text>
                  <Text style={styles.cardArea}>{item.destination.district} • {item.matchScore}% {t('matchLabel')}</Text>
                  <View style={styles.reasonPill}>
                    <Text style={styles.reasonText} numberOfLines={1}>{item.reason}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Low Crowd Right Now */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeading}>{t('sectionQuieterNow')}</Text>
          {lowCrowdList.map((dest) => (
            <TouchableOpacity
              key={dest.id}
              style={styles.listRow}
              onPress={() => onSelectDestination(dest)}
              activeOpacity={0.85}
            >
              <View style={styles.listRowInfo}>
                <Text style={styles.listRowName}>{dest.name}</Text>
                <Text style={styles.listRowMeta}>{dest.district} • {t('pressureComfortable')}</Text>
              </View>
              <StatusBadge status="comfortable" text={t('lowFootfall')} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Hidden Discoveries */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionHeading}>{t('sectionBeyondRoute')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {hiddenGems.map((dest) => (
              <TouchableOpacity
                key={dest.id}
                style={styles.card}
                onPress={() => onSelectDestination(dest)}
                activeOpacity={0.85}
              >
                <DestinationImage
                  destination={dest}
                  style={styles.cardImg}
                  containerStyle={{ width: '100%', height: 100, overflow: 'hidden' }}
                  aspectRatio={16 / 9}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardName} numberOfLines={1}>{dest.name}</Text>
                  <Text style={styles.cardArea}>{dest.district}</Text>
                  <View style={styles.hiddenPill}>
                    <Text style={styles.hiddenPillText}>★ {t('verifiedHiddenGem')}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Curated Trails & Local Experiences */}
        <HomeScreenSections
          experiencesList={experiencesList}
          onSelectExperience={onSelectExperience}
          onStartTrail={handleStartTrail}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 110 },
  sectionWrap: { marginTop: spacing.lg, paddingHorizontal: spacing.screenPadding },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: colors.goldText, letterSpacing: 1, marginBottom: 8 },
  hScroll: { gap: 12 },
  card: { width: 170, backgroundColor: colors.surface, borderRadius: radii.card, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardImg: { width: '100%', height: 100 },
  cardContent: { padding: spacing.sm },
  cardName: { fontSize: 13, fontWeight: '700', color: colors.ink },
  cardArea: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  reasonPill: { marginTop: 6, backgroundColor: colors.surfaceSubtle, paddingHorizontal: 6, paddingVertical: 3, borderRadius: radii.sm },
  reasonText: { fontSize: 10, color: colors.goldText, fontWeight: '600' },
  listRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.sm, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, marginBottom: 6 },
  listRowInfo: { flex: 1 },
  listRowName: { fontSize: 13, fontWeight: '700', color: colors.ink },
  listRowMeta: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  hiddenPill: { marginTop: 6, backgroundColor: 'rgba(184, 134, 43, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.sm },
  hiddenPillText: { fontSize: 10, color: colors.goldText, fontWeight: '700' },
});
