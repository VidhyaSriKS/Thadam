import { env } from '../config/env';
import { TouristPreferences } from '../types/preferences';

export interface BackendHealthResponse {
  status: string;
  model_loaded: boolean;
  dataset_rows: number;
  feature_count: number;
}

export interface BackendRecommendationItem {
  rank: number;
  destination_name: string;
  district: string;
  destination_category: string;
  latitude: number;
  longitude: number;
  entry_cost_inr: number;
  average_visit_duration_hours: number;
  average_visitor_rating_5: number;
  core_interest_score: number;
  preference_score: number;
  crowd_score: number;
  transport_score: number;
  accommodation_score: number;
  food_score: number;
  facility_score: number;
  ai_similarity: number;
  final_score: number;
  matched_interests: string[];
  match_reasons: string[];
}

export interface BackendRecommendResponse {
  success: boolean;
  recommendations: BackendRecommendationItem[];
}

export interface AIBackendServiceInterface {
  checkHealth: () => Promise<BackendHealthResponse | null>;
  getRecommendations: (
    prefs: TouristPreferences,
    topN?: number
  ) => Promise<BackendRecommendationItem[] | null>;
}

function parseTravelHours(maxTravelTime: string): number {
  if (maxTravelTime.includes('1')) return 1.0;
  if (maxTravelTime.includes('2')) return 2.0;
  if (maxTravelTime.includes('3')) return 3.0;
  return 4.0;
}

class AIBackendService implements AIBackendServiceInterface {
  private get baseUrl(): string {
    return env.aiApiUrl || 'http://127.0.0.1:8000';
  }

  async checkHealth(): Promise<BackendHealthResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) return null;
      return (await response.json()) as BackendHealthResponse;
    } catch {
      return null;
    }
  }

  async getRecommendations(
    prefs: TouristPreferences,
    _topN: number = 10
  ): Promise<BackendRecommendationItem[] | null> {
    const facilitiesList: string[] = [];
    if (prefs.facilityRequirements.hospitalNearby) facilitiesList.push('hospital nearby');
    if (prefs.facilityRequirements.pharmacyNearby) facilitiesList.push('pharmacy nearby');
    if (prefs.facilityRequirements.hotelNearby) facilitiesList.push('hotel nearby');
    if (prefs.facilityRequirements.fuelNearby) facilitiesList.push('fuel nearby');
    if (prefs.facilityRequirements.publicTransport) facilitiesList.push('public transport');
    if (prefs.facilityRequirements.avoidIsolatedPlaces) facilitiesList.push('avoid isolated places');
    if (prefs.facilityRequirements.familyFriendly) facilitiesList.push('family friendly');
    if (prefs.facilityRequirements.seniorFriendly) facilitiesList.push('senior friendly');
    if (prefs.facilityRequirements.wheelchairAccessible) facilitiesList.push('wheelchair accessible');

    const payload = {
      start_location: prefs.startLocation || 'Coimbatore',
      destination: prefs.destination || 'Thanjavur-Kumbakonam',
      start_date: prefs.startDate || '',
      end_date: prefs.endDate || '',
      adults: prefs.travelers.adults,
      children: prefs.travelers.children,
      seniors: prefs.travelers.seniors,
      total_budget: prefs.budget,
      interests: prefs.interests.map((i) => i.toLowerCase()),
      destination_mix: {
        famous: prefs.destinationMix.famous,
        moderate: prefs.destinationMix.moderate,
        hidden: prefs.destinationMix.hidden,
      },
      crowd: prefs.crowdPreference,
      transport: [prefs.transport.toLowerCase()],
      max_continuous_travel_hours: parseTravelHours(prefs.maxTravelTime || '2 hours'),
      accommodation: [prefs.accommodation.toLowerCase()],
      food: prefs.foodPreferences.map((f) => f.toLowerCase()),
      facilities: facilitiesList,
      optional_text: prefs.notes || '',
    };

    try {
      const response = await fetch(`${this.baseUrl}/api/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as BackendRecommendResponse;
      return data.recommendations || [];
    } catch {
      return null;
    }
  }
}

export const aiBackendService = new AIBackendService();
