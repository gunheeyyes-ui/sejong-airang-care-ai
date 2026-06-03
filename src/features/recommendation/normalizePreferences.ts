import type { AgeBand, CarePreferenceInput, NormalizedCarePreferences } from './types';

function normalizeAgeMonths(ageMonths?: number): number {
  if (typeof ageMonths !== 'number' || Number.isNaN(ageMonths)) {
    return 12;
  }

  return Math.min(36, Math.max(0, Math.round(ageMonths)));
}

function getAgeBand(ageMonths: number): AgeBand {
  if (ageMonths <= 6) {
    return '0-6m';
  }

  if (ageMonths <= 12) {
    return '7-12m';
  }

  if (ageMonths <= 24) {
    return '13-24m';
  }

  return '25-36m';
}

export function normalizePreferences(input: CarePreferenceInput): NormalizedCarePreferences {
  const ageMonths = normalizeAgeMonths(input.ageMonths);
  const weather = input.weather ?? 'clear';
  const fineDust = input.fineDust ?? 'moderate';
  const conditionsSuggestIndoor = weather !== 'clear' || fineDust === 'bad' || fineDust === 'very-bad';

  return {
    ageMonths,
    ageBand: getAgeBand(ageMonths),
    lifeZone: input.lifeZone ?? '기타',
    timeBand: input.timeBand ?? 'afternoon',
    dayType: input.dayType ?? 'weekday',
    weather,
    fineDust,
    strollerType: input.strollerType ?? 'single',
    needsNursingRoom: input.needsNursingRoom ?? false,
    needsDiaperStation: input.needsDiaperStation ?? ageMonths <= 24,
    indoorPreferred: input.indoorPreferred ?? conditionsSuggestIndoor,
    costPreference: input.costPreference ?? 'low-cost-ok'
  };
}
