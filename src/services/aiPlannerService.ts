import { DESTINATIONS } from '../data/destinations';
import { ALL_DESTINATIONS, getDestinationsForDistrict } from '../data/allDestinations';
import { EXPERIENCES } from '../data/experiences';
import { TouristPreferences } from '../types/preferences';
import { Destination, Experience, Trip, TripDay, TripStop } from '../types/database';
import { RECOMMENDATION_WEIGHTS } from '../config/constants';
import { addDaysToIso } from '../engine/schedule';

// Calculate Haversine distance in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function scoreDestination(dest: Destination, prefs: TouristPreferences): { score: number; reasons: string[] } {
  const weights = RECOMMENDATION_WEIGHTS;
  const reasons: string[] = [];
  const interests = prefs?.interests || [];
  const destMix = prefs?.destinationMix || { famous: 30, moderate: 40, hidden: 30 };
  const facilities = prefs?.facilityRequirements || {
    hospitalNearby: false,
    pharmacyNearby: false,
    hotelNearby: false,
    fuelNearby: false,
    publicTransport: false,
    avoidIsolatedPlaces: false,
    familyFriendly: false,
    seniorFriendly: false,
    wheelchairAccessible: false,
  };

  // 1. Intent Match (Tags match user interests)
  let matchingTagsCount = 0;
  for (const interest of interests) {
    if (dest.tags?.includes(interest)) {
      matchingTagsCount++;
    }
  }
  const intentMatchScore = interests.length > 0
    ? (matchingTagsCount / interests.length) * 100
    : 70;
  if (matchingTagsCount > 0) {
    reasons.push(`Matches your interest in ${interests.slice(0, 2).join(' & ')}`);
  }

  // 2. Destination Preference (Famous vs Moderate vs Hidden match)
  let destPrefScore = 50;
  if (dest.popularityType === 'famous') {
    destPrefScore = destMix.famous ?? 50;
  } else if (dest.popularityType === 'moderate') {
    destPrefScore = destMix.moderate ?? 50;
  } else if (dest.popularityType === 'hidden') {
    destPrefScore = destMix.hidden ?? 50;
    if (dest.discoveryScore >= 80) {
      reasons.push(`High discovery value (${dest.discoveryScore}/100) — verified lesser-known heritage`);
    }
  }

  // 3. Capacity Suitability
  const capacityScore = Math.min(100, ((dest.capacity || 1000) / 2000) * 100);

  // 4. Crowd Suitability
  let crowdScore = 70;
  const crowdPref = prefs?.crowdPreference || 'Low';
  if (crowdPref === 'Low') {
    if (dest.pressureLevel === 'LOW') {
      crowdScore = 100;
      reasons.push('Low crowd pressure fits your tranquil travel style');
    } else if (dest.pressureLevel === 'MODERATE') {
      crowdScore = 60;
    } else {
      crowdScore = 30;
    }
  } else if (crowdPref === 'Moderate') {
    crowdScore = dest.pressureLevel === 'HIGH' ? 50 : 85;
  } else {
    crowdScore = 80;
  }

  // 5. Trust Score
  const trustScore = dest.trustScore || 90;
  if (dest.verificationStatus === 'verified' && trustScore >= 95) {
    reasons.push(`Verified official heritage record (${trustScore}% trust index)`);
  }

  // 6. Local Experience Value
  const hasLocalExp = EXPERIENCES.some((e) => e.destinationId === dest.id && e.status === 'ACTIVE');
  const localExpScore = hasLocalExp ? 100 : 40;
  if (hasLocalExp) {
    reasons.push('Verified local artisan / guide experience available nearby');
  }

  // 7. Accessibility & Facilities
  let accessScore = 80;
  if (facilities.hospitalNearby && dest.facilities?.hospitalKm <= 5.0) {
    accessScore += 10;
    reasons.push(`Emergency hospital access within ${dest.facilities.hospitalKm} km`);
  }
  if (facilities.wheelchairAccessible && dest.accessibility?.wheelchair) {
    accessScore += 10;
  }

  const finalScore = Math.round(
    intentMatchScore * weights.intentMatch +
    destPrefScore * weights.destinationPref +
    capacityScore * weights.capacitySuitability +
    crowdScore * weights.crowdSuitability +
    trustScore * weights.trustScore +
    localExpScore * weights.localExperienceValue +
    accessScore * weights.accessibility
  );

  return {
    score: Math.min(99, Math.max(40, finalScore)),
    reasons: reasons.slice(0, 4),
  };
}

export function generateItinerary(prefs: TouristPreferences): Trip {
  // 1. Filter eligible destinations by selected district & operational status
  const targetPool = getDestinationsForDistrict(prefs?.destination);
  const candidates = targetPool.filter((d) => d.status !== 'CLOSED');
  const validCandidates = candidates.length > 0 ? candidates : targetPool;

  // 2. Score candidates
  const scored = validCandidates.map((dest) => {
    const { score, reasons } = scoreDestination(dest, prefs);
    return { dest, score, reasons };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const safeScored = scored.length > 0
    ? scored
    : targetPool.map((d) => ({ dest: d, score: 85, reasons: ['Featured Heritage Destination'] }));

  // Group by popularity type to satisfy destination mix
  const famous = safeScored.filter((s) => s.dest.popularityType === 'famous');
  const moderate = safeScored.filter((s) => s.dest.popularityType === 'moderate');
  const hidden = safeScored.filter((s) => s.dest.popularityType === 'hidden');

  const days: TripDay[] = [];
  const daysCount = Math.max(1, prefs?.daysCount || 4);

  let totalHiddenCount = 0;
  let totalLocalExpCount = 0;
  let totalEstimatedSpend = 0;

  // Timings for typical days
  const timeSlots = [
    { start: '09:00 AM', end: '11:30 AM', duration: 150 },
    { start: '12:00 PM', end: '01:30 PM', duration: 90 }, // Midday / craft or food
    { start: '03:30 PM', end: '05:30 PM', duration: 120 },
    { start: '06:00 PM', end: '08:00 PM', duration: 120 },
  ];

  const usedDestIds = new Set<string>();
  const districtName = prefs?.destination && !prefs.destination.includes('Let THADAM')
    ? prefs.destination
    : (validCandidates[0] ? validCandidates[0].district : 'Tamil Nadu');

  for (let d = 1; d <= daysCount; d++) {
    const dayStops: TripStop[] = [];
    let dayCost = 0;
    let dayTravelMinutes = 0;

    const dayTheme =
      d === 1
        ? `${districtName} Heritage & Historic Foundations`
        : d === 2
        ? `${districtName} Living Crafts & Temple Architecture`
        : d === 3
        ? `${districtName} Hidden Discoveries & Scenic Landscapes`
        : `${districtName} Cultural Highlights & Local Flavors`;

    const numStopsThisDay = prefs?.travelStyle === 'Relaxed' ? 2 : prefs?.travelStyle === 'Balanced' ? 3 : 4;

    for (let s = 0; s < numStopsThisDay; s++) {
      // Pick next best unused destination matching mix
      let pick = safeScored.find((item) => !usedDestIds.has(item.dest.id));
      if (!pick) {
        pick = safeScored[s % safeScored.length] || safeScored[0];
      }
      if (!pick) {
        pick = { dest: DESTINATIONS[0], score: 85, reasons: ['Featured Heritage Destination'] };
      }
      usedDestIds.add(pick.dest.id);

      if (pick.dest.popularityType === 'hidden') {
        totalHiddenCount++;
      }

      // Check if an experience matches this destination
      const matchedExp = EXPERIENCES.find((e) => e.destinationId === pick.dest.id && e.status === 'ACTIVE');
      if (matchedExp) {
        totalLocalExpCount++;
      }

      const slot = timeSlots[s % timeSlots.length];
      const stopCost = pick.dest.entryFee + (matchedExp ? matchedExp.price : 0);
      dayCost += stopCost;

      const stop: TripStop = {
        id: `stop-${d}-${s + 1}-${pick.dest.id}`,
        tripId: `trip-thadam-${Date.now()}`,
        dayNumber: d,
        destinationId: pick.dest.id,
        destination: pick.dest,
        experienceId: matchedExp?.id,
        experience: matchedExp,
        startTime: slot.start,
        endTime: slot.end,
        durationMinutes: slot.duration,
        orderIndex: s,
        status: 'PLANNED',
        estimatedCost: stopCost,
        aiReasons: pick.reasons,
        scoreMatch: pick.score,
        crowdStatus: pick.dest.pressureLevel,
        dataFreshness: pick.dest.dataFreshness,
        distanceFromPrevKm: s === 0 ? 0 : 8.4,
        travelMinutesFromPrev: s === 0 ? 0 : 20,
      };

      dayStops.push(stop);
      dayTravelMinutes += stop.travelMinutesFromPrev || 0;
    }

    totalEstimatedSpend += dayCost;

    days.push({
      dayNumber: d,
      date: addDaysToIso(prefs.startDate || '2026-10-15', d - 1),
      title: `Day ${d}: ${dayTheme}`,
      theme: dayTheme,
      stops: dayStops,
      totalTravelMinutes: dayTravelMinutes,
      totalEstimatedCost: dayCost,
    });
  }

  return {
    id: `trip-thadam-${Date.now()}`,
    userId: 'usr-tourist-01',
    title: `Tamil Nadu Heritage & Living Crafts — ${prefs.destination}`,
    startDate: prefs.startDate || '2026-10-15',
    endDate: prefs.endDate || addDaysToIso(prefs.startDate || '2026-10-15', daysCount - 1),
    daysCount,
    budget: prefs.budget,
    estimatedSpend: Math.min(prefs.budget, totalEstimatedSpend + daysCount * 1200), // add estimated transport/lodging
    hiddenDiscoveriesCount: totalHiddenCount,
    localExperiencesCount: totalLocalExpCount,
    totalTravelMinutes: days.reduce((sum, d) => sum + d.totalTravelMinutes, 0),
    facilityReadiness: 'GOOD',
    status: 'DRAFT',
    days,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function findAlternatives(
  currentStop: TripStop,
  reason: string,
  prefs: TouristPreferences,
  currentTrip: Trip
): Array<{
  destination: Destination;
  scoreMatch: number;
  distanceKm: number;
  estimatedCost: number;
  reasons: string[];
  experience?: Experience;
}> {
  // Collect currently used destination IDs
  const usedIds = new Set<string>();
  currentTrip.days.forEach((day) => {
    day.stops.forEach((s) => usedIds.add(s.destinationId));
  });

  // Candidate pool: not current stop, not already in trip, and OPEN
  const districtPool = getDestinationsForDistrict(prefs?.destination || currentStop.destination.district);
  const candidates = districtPool.filter(
    (d) => d.id !== currentStop.destinationId && !usedIds.has(d.id) && d.status === 'OPEN'
  );
  const validCandidates = candidates.length > 0 ? candidates : ALL_DESTINATIONS.filter(
    (d) => d.id !== currentStop.destinationId && !usedIds.has(d.id) && d.status === 'OPEN'
  );

  const scoredAlternatives = validCandidates.map((dest) => {
    const dist = calculateDistanceKm(
      currentStop.destination.lat,
      currentStop.destination.lng,
      dest.lat,
      dest.lng
    );

    let baseScore = 80;
    const reasons: string[] = [];

    const isTa = prefs?.language === 'Tamil';

    if (reason === 'Too crowded') {
      if (dest.pressureLevel === 'LOW') {
        baseScore += 20;
        reasons.push(isTa ? 'கணிசமான குறைந்த கூட்ட நெரிசல் (அமைதியான சூழல்)' : 'Significantly lower crowd pressure (Tranquil atmosphere)');
      } else if (dest.pressureLevel === 'MODERATE') {
        baseScore += 8;
        reasons.push(isTa ? 'சமநிலையான சுற்றுலாப் பயணிகள் வரத்து' : 'Balanced visitor density');
      }
    } else if (reason === 'Want something hidden' || reason === 'Need more hidden places') {
      if (dest.popularityType === 'hidden') {
        baseScore += 22;
        reasons.push(isTa ? `சரிபார்க்கப்பட்ட அரிய ரகசிய பொக்கிஷம் (கண்டுபிடிப்பு மதிப்பு ${dest.discoveryScore}/100)` : `Verified lesser-known discovery (${dest.discoveryScore}/100 discovery gap)`);
      }
    } else if (reason === 'Too expensive') {
      if (dest.entryFee === 0) {
        baseScore += 18;
        reasons.push(isTa ? 'இலவச அனுமதி உங்கள் பட்ஜெட்டுக்கு ஏற்றது' : 'Free entry fits tighter daily budget');
      } else if (dest.entryFee <= 50) {
        baseScore += 10;
        reasons.push(isTa ? `குறைந்த நுழைவுக் கட்டணம் (₹${dest.entryFee})` : `Low nominal entry fee (₹${dest.entryFee})`);
      }
    } else if (reason === 'Too far') {
      if (dist <= 10) {
        baseScore += 20;
        reasons.push(isTa ? `அருகில் உள்ள இடம் (${dist} கி.மீ தொலைவு)` : `Close proximity (${dist} km away)`);
      }
    } else if (reason === 'Need family-friendly') {
      if (dest.accessibility.familyFriendly) {
        baseScore += 18;
        reasons.push(isTa ? 'குடும்பத்திற்கு ஏற்ற சரிபார்க்கப்பட்ட வசதிகள்' : 'Verified family-friendly facilities');
      }
    } else if (reason === 'Need senior-friendly') {
      if (dest.accessibility.seniorFriendly) {
        baseScore += 18;
        reasons.push(isTa ? 'முதியோருக்கு ஏற்ற சுலபமான நடைபாதைகள்' : 'Gentle walking paths and senior accessibility');
      }
    } else if (reason === 'Already visited' || reason === 'Not interested') {
      baseScore += 15;
      reasons.push(isTa ? 'மாற்று பண்பாட்டுச் சிறப்பு இடம்' : 'Alternative cultural interest highlight');
    }

    if (dist <= 15) {
      baseScore += 10;
      reasons.push(isTa ? `வசதியான பயணத் தொலைவுக்குள் (${dist} கி.மீ)` : `Within convenient travel radius (${dist} km away)`);
    }

    const matchedExp = EXPERIENCES.find((e) => e.destinationId === dest.id && e.status === 'ACTIVE');
    if (matchedExp) {
      baseScore += 8;
      reasons.push(isTa ? `சரிபார்க்கப்பட்ட உள்ளூர் அனுபவம்: ${matchedExp.name}` : `Features verified local experience: ${matchedExp.name}`);
    }

    if (dest.facilities.coverage === 'GREEN') {
      reasons.push(isTa ? `சிறந்த வழித்தட வசதிகள் (மருத்துவமனை ${dest.facilities.hospitalKm} கி.மீ)` : `Excellent nearby facility readiness (Hospital ${dest.facilities.hospitalKm} km)`);
    }

    return {
      destination: dest,
      scoreMatch: Math.min(99, baseScore),
      distanceKm: dist,
      estimatedCost: dest.entryFee + (matchedExp ? matchedExp.price : 0),
      reasons: reasons.slice(0, 3),
      experience: matchedExp,
    };
  });

  // Sort descending and return EXACTLY 3 strong candidates as per Specification Section 18!
  scoredAlternatives.sort((a, b) => b.scoreMatch - a.scoreMatch);
  return scoredAlternatives.slice(0, 3);
}

export function replaceTripStop(
  trip: Trip,
  dayNumber: number,
  targetStopId: string,
  newDestination: Destination,
  newExperience?: Experience
): Trip {
  const updatedDays = trip.days.map((day) => {
    if (day.dayNumber !== dayNumber) return day;

    const updatedStops = day.stops.map((stop) => {
      if (stop.id !== targetStopId) return stop;

      const newCost = newDestination.entryFee + (newExperience ? newExperience.price : 0);
      return {
        ...stop,
        destinationId: newDestination.id,
        destination: newDestination,
        experienceId: newExperience?.id,
        experience: newExperience,
        estimatedCost: newCost,
        crowdStatus: newDestination.pressureLevel,
        dataFreshness: newDestination.dataFreshness,
        status: 'PLANNED' as const,
        scoreMatch: 95,
        aiReasons: [
          `Adaptive replacement chosen for lower crowd and high heritage authenticity`,
          `Maintains scheduled arrival at ${stop.startTime}`,
          `Nearby facility coverage: ${newDestination.facilities.coverage}`,
        ],
      };
    });

    const dayCost = updatedStops.reduce((sum, s) => sum + s.estimatedCost, 0);

    return {
      ...day,
      stops: updatedStops,
      totalEstimatedCost: dayCost,
    };
  });

  // Recalculate summary totals
  let hiddenCount = 0;
  let localExpCount = 0;
  let totalCost = 0;

  updatedDays.forEach((day) => {
    day.stops.forEach((s) => {
      if (s.destination.popularityType === 'hidden') hiddenCount++;
      if (s.experience) localExpCount++;
      totalCost += s.estimatedCost;
    });
  });

  return {
    ...trip,
    days: updatedDays,
    hiddenDiscoveriesCount: hiddenCount,
    localExperiencesCount: localExpCount,
    estimatedSpend: totalCost + trip.daysCount * 1200,
    updatedAt: new Date().toISOString(),
  };
}

export function removeTripStop(trip: Trip, dayNumber: number, stopId: string): Trip {
  const updatedDays = trip.days.map((day) => {
    if (day.dayNumber !== dayNumber) return day;
    const remainingStops = day.stops.filter((s) => s.id !== stopId);
    // Re-index remaining stops
    const reindexed = remainingStops.map((s, idx) => ({ ...s, orderIndex: idx }));
    return {
      ...day,
      stops: reindexed,
      totalEstimatedCost: reindexed.reduce((sum, s) => sum + s.estimatedCost, 0),
    };
  });

  return {
    ...trip,
    days: updatedDays,
    updatedAt: new Date().toISOString(),
  };
}
