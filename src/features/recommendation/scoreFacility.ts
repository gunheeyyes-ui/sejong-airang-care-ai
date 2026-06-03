import type {
  ConditionKey,
  CostPreference,
  Facility,
  FacilityAmenityStatus,
  FacilityScore,
  FineDustLevel,
  LifeZone,
  ManagementScope,
  NormalizedCarePreferences,
  ParkingAvailability,
  ReservationRequirement,
  StrollerAccessibility,
  StrollerType,
  SuitabilityLevel,
  TimeBand
} from './types';

const nearbyLifeZones: LifeZone[][] = [
  ['도담동', '아름동', '종촌동', '고운동'],
  ['새롬동', '다정동'],
  ['어진동', '세종동', '호수공원권'],
  ['반곡동']
];

const suitabilityScore: Record<SuitabilityLevel, number> = {
  high: 1,
  medium: 0.55,
  low: 0
};

const managementTrustScore: Record<ManagementScope, number> = {
  national: 8,
  'sejong-city': 7,
  'dong-office': 6,
  'family-center': 6,
  'public-library': 7,
  'public-park': 6
};

const parkingScore: Record<ParkingAvailability, number> = {
  available: 3,
  nearby: 2,
  limited: 2,
  paid: 1,
  none: 0
};

const reservationScore: Record<ReservationRequirement, number> = {
  'not-required': 4,
  recommended: 3,
  'program-only': 2,
  required: 1
};

const timeBandWindows: Record<TimeBand, { startsAt: string; endsAt: string }> = {
  morning: { startsAt: '09:00', endsAt: '12:00' },
  afternoon: { startsAt: '12:00', endsAt: '17:00' },
  evening: { startsAt: '17:00', endsAt: '21:00' }
};

const scoreWeights = {
  ageExact: 22,
  ageRangeOnly: 18,
  ageNearBase: 8,
  ageDistancePenalty: 1.5,
  lifeZoneDefault: 6,
  lifeZoneExact: 20,
  lifeZoneNearby: 10,
  lifeZoneOther: 2,
  nursingRequired: 10,
  nursingOptional: 3,
  diaperRequired: 8,
  diaperOptional: 3,
  stroller: 14,
  indoorPreferred: 12,
  indoorOptional: 4,
  weather: 14,
  fineDust: 18,
  lowFineDustPenalty: 14,
  mediumVeryBadFineDustPenalty: 3,
  timeOpen: 12,
  timePartial: 4,
  managementMinimum: 6
} as const;

function addCondition(
  condition: ConditionKey,
  target: 'matched' | 'missing',
  matchedConditions: Set<ConditionKey>,
  missingConditions: Set<ConditionKey>
) {
  if (target === 'matched') {
    matchedConditions.add(condition);
    missingConditions.delete(condition);
    return;
  }

  if (!matchedConditions.has(condition)) {
    missingConditions.add(condition);
  }
}

function isNearbyLifeZone(a: LifeZone, b: LifeZone): boolean {
  return nearbyLifeZones.some((group) => group.includes(a) && group.includes(b));
}

function scoreAgeFit(facility: Facility, preferences: NormalizedCarePreferences): number {
  if (
    facility.ageBands.includes(preferences.ageBand) &&
    preferences.ageMonths >= facility.ageRangeMonths.min &&
    preferences.ageMonths <= facility.ageRangeMonths.max
  ) {
    return scoreWeights.ageExact;
  }

  if (preferences.ageMonths >= facility.ageRangeMonths.min && preferences.ageMonths <= facility.ageRangeMonths.max) {
    return scoreWeights.ageRangeOnly;
  }

  const distance =
    preferences.ageMonths < facility.ageRangeMonths.min
      ? facility.ageRangeMonths.min - preferences.ageMonths
      : preferences.ageMonths - facility.ageRangeMonths.max;

  return Math.max(0, scoreWeights.ageNearBase - distance * scoreWeights.ageDistancePenalty);
}

function scoreLifeZoneFit(facility: Facility, preferences: NormalizedCarePreferences): number {
  if (preferences.lifeZone === '기타') {
    return scoreWeights.lifeZoneDefault;
  }

  if (facility.lifeZone === preferences.lifeZone) {
    return scoreWeights.lifeZoneExact;
  }

  if (isNearbyLifeZone(facility.lifeZone, preferences.lifeZone)) {
    return scoreWeights.lifeZoneNearby;
  }

  return scoreWeights.lifeZoneOther;
}

function scoreAmenity(status: FacilityAmenityStatus): number {
  if (status === 'available') {
    return 1;
  }

  if (status === 'limited') {
    return 0.55;
  }

  return 0;
}

function scoreStrollerAccessibility(
  accessibility: StrollerAccessibility,
  strollerType: StrollerType
): number {
  if (strollerType === 'none') {
    return 1;
  }

  if (strollerType === 'single') {
    if (accessibility === 'single' || accessibility === 'twin') {
      return 1;
    }

    if (accessibility === 'limited') {
      return 0.35;
    }

    return 0;
  }

  if (accessibility === 'twin') {
    return 1;
  }

  if (accessibility === 'single') {
    return 0.35;
  }

  if (accessibility === 'limited') {
    return 0.2;
  }

  return 0;
}

function parseMinutes(time: string): number {
  const [hours = '0', minutes = '0'] = time.split(':');
  return Number(hours) * 60 + Number(minutes);
}

function isOpenForTimeBand(facility: Facility, preferences: NormalizedCarePreferences): boolean {
  const hours = facility.openingHours.find((openingHour) => openingHour.dayType === preferences.dayType);

  if (!hours) {
    return false;
  }

  const window = timeBandWindows[preferences.timeBand];
  const opensAt = parseMinutes(hours.opensAt);
  const closesAt = parseMinutes(hours.closesAt);
  const startsAt = parseMinutes(window.startsAt);
  const endsAt = parseMinutes(window.endsAt);

  return opensAt < endsAt && closesAt > startsAt;
}

function scoreCost(facility: Facility, costPreference: CostPreference): number {
  if (costPreference === 'free-only') {
    if (facility.cost.type === 'free') {
      return 10;
    }

    if (facility.cost.type === 'partially-paid') {
      return 2;
    }

    return -8;
  }

  if (costPreference === 'low-cost-ok') {
    if (facility.cost.type === 'free') {
      return 8;
    }

    if (facility.cost.type === 'partially-paid') {
      return 6;
    }

    return 1;
  }

  return 5;
}

function scoreFineDustSuitability(level: SuitabilityLevel, fineDust: FineDustLevel): number {
  const base = suitabilityScore[level] * scoreWeights.fineDust;

  if ((fineDust === 'bad' || fineDust === 'very-bad') && level === 'low') {
    return base - scoreWeights.lowFineDustPenalty;
  }

  if (fineDust === 'very-bad' && level === 'medium') {
    return base - scoreWeights.mediumVeryBadFineDustPenalty;
  }

  return base;
}

export function scoreFacility(
  facility: Facility,
  preferences: NormalizedCarePreferences
): FacilityScore {
  const matchedConditions = new Set<ConditionKey>();
  const missingConditions = new Set<ConditionKey>();

  const ageFit = scoreAgeFit(facility, preferences);
  addCondition('age-fit', ageFit >= 18 ? 'matched' : 'missing', matchedConditions, missingConditions);

  const lifeZoneFit = scoreLifeZoneFit(facility, preferences);
  addCondition(
    'life-zone-fit',
    lifeZoneFit >= 10 || preferences.lifeZone === '기타' ? 'matched' : 'missing',
    matchedConditions,
    missingConditions
  );

  const nursingScore = scoreAmenity(facility.nursingRoom);
  const diaperScore = scoreAmenity(facility.diaperStation);
  const amenityFit =
    nursingScore * (preferences.needsNursingRoom ? scoreWeights.nursingRequired : scoreWeights.nursingOptional) +
    diaperScore * (preferences.needsDiaperStation ? scoreWeights.diaperRequired : scoreWeights.diaperOptional);

  addCondition('nursing-room', nursingScore > 0 ? 'matched' : 'missing', matchedConditions, missingConditions);
  addCondition('diaper-station', diaperScore > 0 ? 'matched' : 'missing', matchedConditions, missingConditions);

  const strollerFit = scoreStrollerAccessibility(facility.strollerAccessibility, preferences.strollerType);
  const accessibilityFit = strollerFit * scoreWeights.stroller + parkingScore[facility.parking.availability];
  addCondition(
    'stroller-accessibility',
    strollerFit >= 1 || preferences.strollerType === 'none' ? 'matched' : 'missing',
    matchedConditions,
    missingConditions
  );
  addCondition('parking', parkingScore[facility.parking.availability] > 0 ? 'matched' : 'missing', matchedConditions, missingConditions);

  const indoorFit =
    suitabilityScore[facility.indoorSuitability] *
    (preferences.indoorPreferred ? scoreWeights.indoorPreferred : scoreWeights.indoorOptional);
  const weatherFit = suitabilityScore[facility.weatherSuitability[preferences.weather]] * scoreWeights.weather;
  const fineDustFit = scoreFineDustSuitability(
    facility.fineDustSuitability[preferences.fineDust],
    preferences.fineDust
  );
  const environmentFit = indoorFit + weatherFit + fineDustFit;

  if (preferences.indoorPreferred) {
    addCondition(
      'indoor-suitability',
      facility.indoorSuitability === 'high' || facility.indoorSuitability === 'medium' ? 'matched' : 'missing',
      matchedConditions,
      missingConditions
    );
  }

  addCondition(
    'weather-suitability',
    facility.weatherSuitability[preferences.weather] === 'low' ? 'missing' : 'matched',
    matchedConditions,
    missingConditions
  );
  addCondition(
    'fine-dust-suitability',
    facility.fineDustSuitability[preferences.fineDust] === 'low' ? 'missing' : 'matched',
    matchedConditions,
    missingConditions
  );

  const openForTimeBand = isOpenForTimeBand(facility, preferences);
  const hasDayType = facility.openingHours.some((openingHour) => openingHour.dayType === preferences.dayType);
  const timeFit =
    (openForTimeBand ? scoreWeights.timeOpen : hasDayType ? scoreWeights.timePartial : 0) +
    reservationScore[facility.reservationRequirement];
  addCondition('day-type-fit', hasDayType ? 'matched' : 'missing', matchedConditions, missingConditions);
  addCondition('time-band-fit', openForTimeBand ? 'matched' : 'missing', matchedConditions, missingConditions);
  addCondition(
    'reservation',
    facility.reservationRequirement === 'required' ? 'missing' : 'matched',
    matchedConditions,
    missingConditions
  );

  const costFit = scoreCost(facility, preferences.costPreference);
  addCondition('cost', costFit > 0 ? 'matched' : 'missing', matchedConditions, missingConditions);

  const managementFit = managementTrustScore[facility.managementScope];
  addCondition(
    'management-scope',
    managementFit >= scoreWeights.managementMinimum ? 'matched' : 'missing',
    matchedConditions,
    missingConditions
  );

  const total =
    ageFit +
    lifeZoneFit +
    amenityFit +
    accessibilityFit +
    environmentFit +
    timeFit +
    costFit +
    managementFit;

  return {
    facilityId: facility.id,
    total: Number(total.toFixed(2)),
    ageFit: Number(ageFit.toFixed(2)),
    lifeZoneFit: Number(lifeZoneFit.toFixed(2)),
    amenityFit: Number(amenityFit.toFixed(2)),
    accessibilityFit: Number(accessibilityFit.toFixed(2)),
    environmentFit: Number(environmentFit.toFixed(2)),
    timeFit: Number(timeFit.toFixed(2)),
    costFit: Number(costFit.toFixed(2)),
    managementFit: Number(managementFit.toFixed(2)),
    matchedConditions: Array.from(matchedConditions),
    missingConditions: Array.from(missingConditions)
  };
}
