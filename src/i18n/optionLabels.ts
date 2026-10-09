export const INTEREST_LABELS: Record<string, { en: string; ta: string }> = {
  Historical: { en: 'Historical', ta: 'வரலாறு' },
  Traditional: { en: 'Traditional', ta: 'பாரம்பரியம்' },
  Cultural: { en: 'Cultural', ta: 'பண்பாடு' },
  Food: { en: 'Food', ta: 'உணவு' },
  Nature: { en: 'Nature', ta: 'இயற்கை' },
  Beach: { en: 'Beach', ta: 'கடற்கரை' },
  Rural: { en: 'Rural', ta: 'கிராமப்புறம்' },
  Spiritual: { en: 'Spiritual', ta: 'ஆன்மீகம்' },
  Adventure: { en: 'Adventure', ta: 'சாகசம்' },
  Photography: { en: 'Photography', ta: 'புகைப்படம்' },
  Shopping: { en: 'Shopping', ta: 'ஷாப்பிங்' },
  'Art & Craft': { en: 'Art & Craft', ta: 'கலை & கைவினை' },
};

export const TRANSPORT_LABELS: Record<string, { en: string; ta: string }> = {
  Walking: { en: 'Walking', ta: 'நடைப்பயணம்' },
  'Two-wheeler': { en: 'Two-wheeler', ta: 'இருசக்கர வாகனம்' },
  Car: { en: 'Car', ta: 'கார்' },
  Bus: { en: 'Bus', ta: 'பேருந்து' },
  Train: { en: 'Train', ta: 'ரயில்' },
  Cab: { en: 'Cab', ta: 'வாடகை கார்' },
};

export const STAY_LABELS: Record<string, { en: string; ta: string }> = {
  Budget: { en: 'Budget', ta: 'குறைந்த கட்டணம்' },
  Standard: { en: 'Standard', ta: 'வழக்கமானது' },
  Premium: { en: 'Premium', ta: 'பிரீமியம்' },
  Homestay: { en: 'Homestay', ta: 'ஹோம்ஸ்டே' },
  Resort: { en: 'Resort', ta: 'ரிசார்ட்' },
  'No stay': { en: 'No stay', ta: 'தங்குமிடம் இல்லை' },
};

export const FOOD_LABELS: Record<string, { en: string; ta: string }> = {
  Vegetarian: { en: 'Vegetarian', ta: 'சைவம்' },
  'Non-vegetarian': { en: 'Non-vegetarian', ta: 'அசைவம்' },
  Vegan: { en: 'Vegan', ta: 'வீகன்' },
  Traditional: { en: 'Traditional', ta: 'பாரம்பரிய உணவு' },
  Local: { en: 'Local', ta: 'உள்ளூர் உணவு' },
  'Street food': { en: 'Street food', ta: 'தெருவோர உணவு' },
  Premium: { en: 'Premium', ta: 'பிரீமியம்' },
  Budget: { en: 'Budget', ta: 'மலிவு' },
};

export const FACILITY_LABELS: Record<string, { en: string; ta: string }> = {
  hospitalNearby: { en: '🏥 Hospital nearby', ta: '🏥 அருகிலுள்ள மருத்துவமனை' },
  pharmacyNearby: { en: '💊 Pharmacy nearby', ta: '💊 அருகிலுள்ள மருந்தகம்' },
  hotelNearby: { en: '🏨 Hotel nearby', ta: '🏨 அருகிலுள்ள தங்குமிடம்' },
  fuelNearby: { en: '⛽ Fuel nearby', ta: '⛽ அருகிலுள்ள எரிபொருள் நிலையம்' },
  publicTransport: { en: '🚌 Public transport', ta: '🚌 பொதுப் போக்குவரத்து' },
  avoidIsolatedPlaces: { en: '🛡️ Avoid isolated places', ta: '🛡️ தனித்த இடங்களைத் தவிர்' },
  familyFriendly: { en: '👨‍👩‍👧 Family friendly', ta: '👨‍👩‍👧 குடும்பத்திற்கு ஏற்றது' },
  seniorFriendly: { en: '👵 Senior friendly', ta: '👵 முதியோருக்கு ஏற்றது' },
  wheelchairAccessible: { en: '♿ Accessible', ta: '♿ சக்கர நாற்காலி அணுகல்' },
};

export const TRAVEL_TIME_LABELS: Record<string, { en: string; ta: string }> = {
  '1 hour': { en: '1 hour', ta: '1 மணி நேரம்' },
  '2 hours': { en: '2 hours', ta: '2 மணி நேரம்' },
  '3 hours': { en: '3 hours', ta: '3 மணி நேரம்' },
  Flexible: { en: 'Flexible', ta: 'நெகிழ்வானது' },
};

export const MONTH_NAMES: Record<'en' | 'ta', string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ta: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
};

export const DAY_NAMES: Record<'en' | 'ta', string[]> = {
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  ta: ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'],
};
