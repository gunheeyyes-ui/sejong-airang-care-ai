import type { Facility, FacilityAmenityStatus, NormalizedCarePreferences } from './types';

function hasUsableAmenity(status: FacilityAmenityStatus): boolean {
  return status === 'available' || status === 'limited';
}

function isAgeCompatible(facility: Facility, preferences: NormalizedCarePreferences): boolean {
  return (
    facility.ageBands.includes(preferences.ageBand) &&
    preferences.ageMonths >= facility.ageRangeMonths.min &&
    preferences.ageMonths <= facility.ageRangeMonths.max
  );
}

function isStrollerCompatible(facility: Facility, preferences: NormalizedCarePreferences): boolean {
  if (preferences.strollerType !== 'twin') {
    return true;
  }

  return facility.strollerAccessibility === 'twin';
}

export function filterFacilities(
  facilities: Facility[],
  preferences: NormalizedCarePreferences
): Facility[] {
  return facilities.filter((facility) => {
    if (!isAgeCompatible(facility, preferences)) {
      return false;
    }

    if (!isStrollerCompatible(facility, preferences)) {
      return false;
    }

    if (preferences.needsNursingRoom && !hasUsableAmenity(facility.nursingRoom)) {
      return false;
    }

    if (preferences.needsDiaperStation && !hasUsableAmenity(facility.diaperStation)) {
      return false;
    }

    return true;
  });
}
