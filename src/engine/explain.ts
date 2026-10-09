import { Destination, Experience } from '../types/database';
import { TouristPreferences } from '../types/preferences';
import { ScoreFactors } from './score';

export function explainStop(
  dest: Destination,
  prefs: TouristPreferences,
  factors: ScoreFactors,
  experience?: Experience,
  lang?: 'en' | 'ta'
): string[] {
  const isTa = lang === 'ta' || prefs.language === 'Tamil';
  const reasons: string[] = [];

  // Factor 1: Intent & Category
  const matched = dest.tags.filter((t) => prefs.interests.includes(t as any));
  if (isTa) {
    if (matched.length > 0) {
      reasons.push(`${matched.slice(0, 2).join(' & ')} மீதான உங்கள் ஆர்வத்திற்குப் பொருந்துகிறது`);
    } else {
      reasons.push(`${dest.category} பயண விருப்பத்திற்கு உகந்தது`);
    }
  } else {
    if (matched.length > 0) {
      reasons.push(`Matches your interest in ${matched.slice(0, 2).join(' & ')}`);
    } else {
      reasons.push(`Curated for your ${dest.category} journey preference`);
    }
  }

  // Factor 2: Destination Preference & Heritage Mix
  if (isTa) {
    if (dest.popularityType === 'hidden') {
      reasons.push(`சரிபார்க்கப்பட்ட அரிய பொக்கிஷம் (கண்டுபிடிப்பு குறியீடு ${dest.discoveryScore}/100)`);
    } else if (dest.popularityType === 'famous') {
      reasons.push(`தமிழ்நாட்டின் முதன்மை வரலாற்றுப் பாரம்பரிய சின்னம்`);
    } else {
      reasons.push(`${dest.district} மாவட்டத்தின் சமநிலையான பண்பாட்டு நிறுத்தம்`);
    }
  } else {
    if (dest.popularityType === 'hidden') {
      reasons.push(`Verified lesser-known discovery (${dest.discoveryScore}/100 discovery index)`);
    } else if (dest.popularityType === 'famous') {
      reasons.push(`Iconic Tamil Nadu heritage landmark`);
    } else {
      reasons.push(`Balanced regional cultural stop in ${dest.district}`);
    }
  }

  // Factor 3: Pressure & Flow
  if (isTa) {
    if (dest.pressureLevel === 'LOW') {
      reasons.push(`குறைந்த கூட்ட நெரிசல் உள்ள அமைதியான சூழல்`);
    } else if (dest.pressureLevel === 'MODERATE') {
      reasons.push(`மிதமான சுற்றுலாப் பயணிகள் மற்றும் சௌகரியமான நடைபாதை`);
    } else {
      reasons.push(`கூட்ட நெரிசலைத் தவிர்க்க உகந்த நேரத்தில் திட்டமிடப்பட்டது`);
    }
  } else {
    if (dest.pressureLevel === 'LOW') {
      reasons.push(`Low crowd pressure fits your tranquil travel style`);
    } else if (dest.pressureLevel === 'MODERATE') {
      reasons.push(`Moderate footfall with comfortable visitor flow`);
    } else {
      reasons.push(`Scheduled during optimal visiting hours to avoid peak congestion`);
    }
  }

  // Factor 4: Verified Trust & Safety
  if (isTa) {
    if (dest.trustScore >= 90) {
      reasons.push(`நம்பகத்தன்மை குறியீடு ${dest.trustScore}% கொண்ட சரிபார்க்கப்பட்ட இடம்`);
    } else {
      reasons.push(`பயண வழித்தடத்தில் அத்தியாவசிய வசதிகள் உறுதி செய்யப்பட்டுள்ளன`);
    }
  } else {
    if (dest.trustScore >= 90) {
      reasons.push(`Verified heritage record with ${dest.trustScore}% trust index`);
    } else {
      reasons.push(`Essential facilities verified within regional travel corridor`);
    }
  }

  // Factor 5: Local Experience (if applicable)
  if (experience) {
    if (isTa) {
      reasons.push(`${experience.providerName} வழங்கும் சரிபார்க்கப்பட்ட நேரடிப் பயிலரங்கம்`);
    } else {
      reasons.push(`Includes verified local workshop with ${experience.providerName}`);
    }
  }

  return reasons;
}
