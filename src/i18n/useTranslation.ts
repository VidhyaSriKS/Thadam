import { useProfileStore } from '../store/useProfileStore';
import { useTripStore } from '../store/useTripStore';
import { translationsEn, TranslationKey } from './translationsEn';
import { translationsTa } from './translationsTa';
import {
  INTEREST_LABELS,
  TRANSPORT_LABELS,
  STAY_LABELS,
  FOOD_LABELS,
  FACILITY_LABELS,
  TRAVEL_TIME_LABELS,
} from './optionLabels';

export function useTranslation() {
  const { profile, updateProfile } = useProfileStore();
  const { setPreferences } = useTripStore();

  const lang: 'en' | 'ta' = profile.language === 'ta' ? 'ta' : 'en';

  const setLanguage = (newLang: 'en' | 'ta') => {
    updateProfile({ language: newLang });
    setPreferences({ language: newLang === 'ta' ? 'Tamil' : 'English' });
  };

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ta' : 'en';
    setLanguage(next);
  };

  const t = (key: TranslationKey, fallback?: string): string => {
    const dict = lang === 'ta' ? translationsTa : translationsEn;
    return dict[key] || fallback || translationsEn[key] || key;
  };

  const formatCurrency = (amount: number): string => {
    const formatted = Math.round(amount).toLocaleString('en-IN');
    return lang === 'ta' ? `ரூ. ${formatted}` : `₹${formatted}`;
  };

  const formatDays = (days: number): string => {
    return lang === 'ta' ? `${days} நாட்கள்` : `${days} Days`;
  };

  const translateInterest = (interest: string): string => {
    return INTEREST_LABELS[interest]?.[lang] || interest;
  };

  const translateTransport = (transport: string): string => {
    return TRANSPORT_LABELS[transport]?.[lang] || transport;
  };

  const translateStay = (stay: string): string => {
    return STAY_LABELS[stay]?.[lang] || stay;
  };

  const translateFood = (food: string): string => {
    return FOOD_LABELS[food]?.[lang] || food;
  };

  const translateFacility = (facilityKey: string): string => {
    return FACILITY_LABELS[facilityKey]?.[lang] || facilityKey;
  };

  const translateTravelTime = (time: string): string => {
    return TRAVEL_TIME_LABELS[time]?.[lang] || time;
  };

  return {
    t,
    lang,
    language: lang,
    isTamil: lang === 'ta',
    setLanguage,
    toggleLanguage,
    formatCurrency,
    formatDays,
    translateInterest,
    translateTransport,
    translateStay,
    translateFood,
    translateFacility,
    translateTravelTime,
  };
}
