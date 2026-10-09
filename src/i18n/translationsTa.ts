import { taCommon } from './locales/taCommon';
import { taPlanner } from './locales/taPlanner';
import { taItinerary } from './locales/taItinerary';
import { taFeatures } from './locales/taFeatures';
import { TranslationKey } from './translationsEn';

export const translationsTa: Record<TranslationKey, string> = {
  ...taCommon,
  ...taPlanner,
  ...taItinerary,
  ...taFeatures,
};
