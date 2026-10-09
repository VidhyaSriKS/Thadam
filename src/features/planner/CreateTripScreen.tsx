import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radii, shadows } from '../../config/theme';
import { useTripStore } from '../../store/useTripStore';
import { DestinationPreference, InterestCategory, TransportMode, AccommodationType, CrowdPreference } from '../../types/preferences';
import { DistrictSelectModal } from './DistrictSelectModal';
import { DestinationSelectModal } from './DestinationSelectModal';
import { PlannerTravelersBudget } from './PlannerTravelersBudget';
import { PlannerPreferences } from './PlannerPreferences';
import { PlannerStayFoodSafety } from './PlannerStayFoodSafety';
import { PlannerSummaryCard } from './PlannerSummaryCard';
import { useTranslation } from '../../i18n';
import { calculateDaysBetween } from '../../engine/schedule';

const iso = (d: number) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);

interface CreateTripScreenProps {
  onBuildTrip: () => void;
  onOpenSavedTrip?: () => void;
}

export const CreateTripScreen: React.FC<CreateTripScreenProps> = ({ onBuildTrip }) => {
  const { setPreferences } = useTripStore();
  const { t, isTamil } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);

  // Form State
  const [startDistrict, setStartDistrict] = useState('Coimbatore');
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [destination, setDestination] = useState('Thanjavur');
  const [showDestinationModal, setShowDestinationModal] = useState(false);

  const [startDate, setStartDate] = useState(iso(14));
  const [endDate, setEndDate] = useState(iso(18));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);
  const [budget, setBudget] = useState(25000);

  const [interests, setInterests] = useState<InterestCategory[]>(['Historical', 'Traditional', 'Cultural']);
  const [destPreference, setDestPreference] = useState<DestinationPreference>('Mixed');
  const [famousMix, setFamousMix] = useState(40);
  const [moderateMix, setModerateMix] = useState(30);
  const [hiddenMix, setHiddenMix] = useState(30);
  const [crowd, setCrowd] = useState<CrowdPreference>('Low');
  const [transportPreferred, setTransportPreferred] = useState<TransportMode>('Car');
  const [transportAlternative, setTransportAlternative] = useState<TransportMode>('Cab');
  const [maxTravelTime, setMaxTravelTime] = useState<'1 hour' | '2 hours' | '3 hours' | 'Flexible'>('2 hours');
  const [stay, setStay] = useState<AccommodationType>('Standard');
  const [foods, setFoods] = useState<string[]>(['Traditional', 'Local']);
  const [facilities, setFacilities] = useState<{ [key: string]: boolean }>({ hospitalNearby: true, familyFriendly: true });
  const [notes, setNotes] = useState('');
  const [dateError, setDateError] = useState('');

  const diffDays = calculateDaysBetween(startDate, endDate);
  const dUnit = diffDays === 1 ? t('dayUnit') : t('daysUnit');
  const nDays = Math.max(0, diffDays - 1);
  const nUnit = nDays === 1 ? t('nightUnit') : t('nightsUnit');
  const durationText = `${diffDays} ${dUnit} / ${nDays} ${nUnit}`;

  const handleStartDateChange = (s: string) => {
    setStartDate(s);
    if (endDate && s > endDate) setEndDate(s);
    setDateError('');
  };

  const handleEndDateChange = (e: string) => {
    setEndDate(e);
    if (startDate && e < startDate) setStartDate(e);
    setDateError('');
  };

  const handleSubmit = () => {
    if (startDate && endDate && endDate < startDate) {
      setDateError(t('dateErrorOrder'));
      return;
    }
    setDateError('');

    const mixMap = {
      Famous: { famous: 100, moderate: 0, hidden: 0 },
      Moderate: { famous: 0, moderate: 100, hidden: 0 },
      Hidden: { famous: 0, moderate: 0, hidden: 100 },
      Mixed: { famous: famousMix, moderate: moderateMix, hidden: hiddenMix },
    };

    setPreferences({
      language: isTamil ? 'Tamil' : 'English',
      startLocation: startDistrict,
      destination: destination.includes('Let THADAM') || destination.includes('தடமே') ? 'Thanjavur-Kumbakonam' : destination,
      startDate,
      endDate,
      daysCount: diffDays,
      budget,
      travelers: { adults, children, seniors, groupStyle: adults > 1 ? 'Couple' : 'Solo' },
      interests,
      travelStyle: 'Balanced',
      destinationMix: mixMap[destPreference],
      crowdPreference: crowd,
      transport: transportPreferred,
      maxTravelTime,
      accommodation: stay,
      foodPreferences: foods,
      facilityRequirements: {
        hospitalNearby: !!facilities.hospitalNearby,
        pharmacyNearby: !!facilities.pharmacyNearby,
        hotelNearby: !!facilities.hotelNearby,
        fuelNearby: !!facilities.fuelNearby,
        publicTransport: !!facilities.publicTransport,
        avoidIsolatedPlaces: !!facilities.avoidIsolatedPlaces,
        familyFriendly: !!facilities.familyFriendly,
        seniorFriendly: !!facilities.seniorFriendly,
        wheelchairAccessible: !!facilities.wheelchairAccessible,
      },
      notes,
    });
    onBuildTrip();
  };

  const travelersText = `${adults} ${isTamil ? 'பெரியவர்கள்' : 'Adults'}${
    children ? `, ${children} ${isTamil ? 'குழந்தைகள்' : 'Children'}` : ''
  }${seniors ? `, ${seniors} ${isTamil ? 'முதியவர்கள்' : 'Seniors'}` : ''}`;

  return (
    <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBlock}>
        <Text style={styles.brandTitle}>{t('brandName')}</Text>
        <Text style={styles.brandSub}>{t('brandPhilosophy')}</Text>
        <Text style={styles.philosophyTag}>{t('brandSubtext')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeading}>{t('secStartLocation')}</Text>
        <Text style={styles.fieldLabel}>{t('selectStartDistrict')}</Text>
        <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowDistrictModal(true)} activeOpacity={0.8}>
          <Text style={styles.dropdownText}>📍 {startDistrict} ▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeading}>{t('secDestination')}</Text>
        <Text style={styles.fieldLabel}>{t('selectDestinationRegion')}</Text>
        <TouchableOpacity style={styles.dropdownBtn} onPress={() => setShowDestinationModal(true)} activeOpacity={0.8}>
          <Text style={styles.dropdownText}>🏛️ {destination} ▼</Text>
        </TouchableOpacity>
        <View style={styles.selectedRow}>
          <Text style={styles.selectedLabel}>{t('selectedDestination')}</Text>
          <Text style={styles.selectedValue} numberOfLines={1}>{destination}</Text>
        </View>
      </View>

      <PlannerTravelersBudget
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        durationText={durationText}
        dateError={dateError}
        adults={adults}
        children={children}
        seniors={seniors}
        onAdultsChange={setAdults}
        onChildrenChange={setChildren}
        onSeniorsChange={setSeniors}
        budget={budget}
        onBudgetChange={setBudget}
      />

      <PlannerPreferences
        interests={interests}
        onToggleInterest={(v) => setInterests((p) => p.includes(v) ? p.filter((i) => i !== v) : [...p, v])}
        destPreference={destPreference}
        onDestPreferenceChange={setDestPreference}
        famousMix={famousMix}
        moderateMix={moderateMix}
        hiddenMix={hiddenMix}
        onMixChange={(f, m, h) => { setFamousMix(f); setModerateMix(m); setHiddenMix(h); }}
        crowd={crowd}
        onCrowdChange={setCrowd}
        transportPreferred={transportPreferred}
        onTransportPreferredChange={setTransportPreferred}
        transportAlternative={transportAlternative}
        onTransportAlternativeChange={setTransportAlternative}
        maxTravelTime={maxTravelTime}
        onMaxTravelTimeChange={setMaxTravelTime}
      />

      <PlannerStayFoodSafety
        stay={stay}
        onStayChange={setStay}
        foods={foods}
        onToggleFood={(f) => setFoods((p) => p.includes(f) ? p.filter((x) => x !== f) : [...p, f])}
        facilities={facilities}
        onToggleFacility={(k) => setFacilities((p) => ({ ...p, [k]: !p[k] }))}
        notes={notes}
        onNotesChange={setNotes}
      />

      <PlannerSummaryCard
        startDistrict={startDistrict}
        durationText={durationText}
        travelersText={travelersText}
        budget={budget}
        interests={interests}
        destMixText={destPreference === 'Mixed' ? `${famousMix}% Famous / ${moderateMix}% Moderate / ${hiddenMix}% Hidden` : destPreference}
        crowd={crowd}
        transport={transportPreferred}
        maxTravelLoad={maxTravelTime}
        stay={stay}
        foods={foods}
        requirements={Object.keys(facilities).filter((k) => facilities[k])}
        onEditPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
      />

      <TouchableOpacity style={styles.primaryCta} onPress={handleSubmit} activeOpacity={0.88}>
        <Text style={styles.primaryCtaText}>{t('createSmartTrip')}</Text>
      </TouchableOpacity>
      <Text style={styles.ctaSubtitle}>{t('ctaSubtitle')}</Text>

      <DistrictSelectModal
        visible={showDistrictModal}
        selectedDistrict={startDistrict}
        onSelect={setStartDistrict}
        onClose={() => setShowDistrictModal(false)}
      />
      <DestinationSelectModal
        visible={showDestinationModal}
        selectedDestination={destination}
        onSelect={setDestination}
        onClose={() => setShowDestinationModal(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenPadding, paddingBottom: 110 },
  headerBlock: { marginBottom: spacing.md, alignItems: 'center' },
  brandTitle: { fontFamily: typography.fontFamilyHeading, fontSize: 32, fontWeight: '700', color: colors.primary },
  brandSub: { fontSize: 10, fontWeight: '800', color: colors.goldText, letterSpacing: 1.5, marginTop: 2, textAlign: 'center' },
  philosophyTag: { fontSize: 11, color: colors.textSecondary, marginTop: 4, fontWeight: '600', textAlign: 'center' },
  card: { backgroundColor: colors.surface, borderRadius: radii.card, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, ...shadows.card },
  sectionHeading: { fontSize: 11, fontWeight: '800', color: colors.goldText, letterSpacing: 1, marginBottom: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.ink, marginBottom: 6 },
  dropdownBtn: { minHeight: 46, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radii.input, paddingHorizontal: 14, justifyContent: 'center', backgroundColor: colors.background },
  dropdownText: { fontSize: 14, fontWeight: '700', color: colors.ink },
  selectedRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  selectedLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  selectedValue: { fontSize: 12, color: colors.primary, fontWeight: '700', flex: 1 },
  primaryCta: { marginTop: spacing.md, minHeight: 52, borderRadius: radii.pill, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', ...shadows.elevated },
  primaryCtaText: { color: colors.onPrimary, fontSize: 15, fontWeight: '800', letterSpacing: 0.5, textAlign: 'center' },
  ctaSubtitle: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 16, paddingHorizontal: spacing.sm },
});
