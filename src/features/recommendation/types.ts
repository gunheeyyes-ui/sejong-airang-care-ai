export type AgeBand = '0-6m' | '7-12m' | '13-24m' | '25-36m';

export type LifeZone =
  | '도담동'
  | '아름동'
  | '종촌동'
  | '고운동'
  | '새롬동'
  | '다정동'
  | '어진동'
  | '세종동'
  | '호수공원권'
  | '반곡동'
  | '기타';

export type FacilityType =
  | 'community-center'
  | 'childcare-share'
  | 'library'
  | 'family-center'
  | 'museum'
  | 'experience-center'
  | 'outdoor-park';

export type FacilityAmenityStatus = 'available' | 'limited' | 'unavailable' | 'unknown';

export type SuitabilityLevel = 'high' | 'medium' | 'low';

export type WeatherCondition = 'clear' | 'rain' | 'snow' | 'heatwave';

export type FineDustLevel = 'good' | 'moderate' | 'bad' | 'very-bad';

export type TimeBand = 'morning' | 'afternoon' | 'evening';

export type DayType = 'weekday' | 'weekend' | 'holiday';

export type StrollerType = 'none' | 'single' | 'twin';

export type StrollerAccessibility = 'none' | 'single' | 'twin' | 'limited';

export type ParkingAvailability = 'available' | 'limited' | 'paid' | 'nearby' | 'none';

export type CostType = 'free' | 'paid' | 'partially-paid';

export type ReservationRequirement = 'not-required' | 'recommended' | 'required' | 'program-only';

export type ManagementScope =
  | 'national'
  | 'sejong-city'
  | 'dong-office'
  | 'family-center'
  | 'public-library'
  | 'public-park';

export type CostPreference = 'free-only' | 'low-cost-ok' | 'any';

export type ConditionKey =
  | 'age-fit'
  | 'life-zone-fit'
  | 'time-band-fit'
  | 'day-type-fit'
  | 'nursing-room'
  | 'diaper-station'
  | 'stroller-accessibility'
  | 'indoor-suitability'
  | 'weather-suitability'
  | 'fine-dust-suitability'
  | 'parking'
  | 'cost'
  | 'reservation'
  | 'management-scope';

export interface AgeRangeMonths {
  min: number;
  max: number;
}

export interface OpeningHours {
  dayType: DayType;
  opensAt: string;
  closesAt: string;
  notes?: string;
}

export interface FacilityCost {
  type: CostType;
  amountDescription: string;
}

export interface FacilityParking {
  availability: ParkingAvailability;
  notes: string;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  lifeZone: LifeZone;
  summary: string;
  ageBands: AgeBand[];
  ageRangeMonths: AgeRangeMonths;
  officialLink: string;
  updatedAt: string;
  nursingRoom: FacilityAmenityStatus;
  diaperStation: FacilityAmenityStatus;
  strollerAccessibility: StrollerAccessibility;
  indoorSuitability: SuitabilityLevel;
  weatherSuitability: Record<WeatherCondition, SuitabilityLevel>;
  fineDustSuitability: Record<FineDustLevel, SuitabilityLevel>;
  parking: FacilityParking;
  cost: FacilityCost;
  openingHours: OpeningHours[];
  phone: string;
  reservationRequirement: ReservationRequirement;
  managementScope: ManagementScope;
  visitNotes: string[];
}

export interface CarePreferenceInput {
  ageMonths?: number;
  lifeZone?: LifeZone;
  timeBand?: TimeBand;
  dayType?: DayType;
  weather?: WeatherCondition;
  fineDust?: FineDustLevel;
  strollerType?: StrollerType;
  needsNursingRoom?: boolean;
  needsDiaperStation?: boolean;
  indoorPreferred?: boolean;
  costPreference?: CostPreference;
}

export interface NormalizedCarePreferences {
  ageMonths: number;
  ageBand: AgeBand;
  lifeZone: LifeZone;
  timeBand: TimeBand;
  dayType: DayType;
  weather: WeatherCondition;
  fineDust: FineDustLevel;
  strollerType: StrollerType;
  needsNursingRoom: boolean;
  needsDiaperStation: boolean;
  indoorPreferred: boolean;
  costPreference: CostPreference;
}

export interface FacilityScore {
  facilityId: string;
  total: number;
  ageFit: number;
  lifeZoneFit: number;
  amenityFit: number;
  accessibilityFit: number;
  environmentFit: number;
  timeFit: number;
  costFit: number;
  managementFit: number;
  matchedConditions: ConditionKey[];
  missingConditions: ConditionKey[];
}

export interface RecommendationResult {
  facility: Facility;
  score: FacilityScore;
  reasons: string[];
  officialLink: string;
  updatedAt: string;
}
