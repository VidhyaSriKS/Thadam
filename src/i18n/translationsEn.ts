import { enCommon } from './locales/enCommon';
import { enPlanner } from './locales/enPlanner';
import { enItinerary } from './locales/enItinerary';
import { enFeatures } from './locales/enFeatures';

export const translationsEn = {
  ...enCommon,
  ...enPlanner,
  ...enItinerary,
  ...enFeatures,
};

export type TranslationKey = keyof typeof translationsEn;
