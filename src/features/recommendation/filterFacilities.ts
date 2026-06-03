import type { Facility, FacilityAmenityStatus, NormalizedCarePreferences } from './types';

function hasUsableAmenity(status: FacilityAmenityStatus): boolean {
  return status === 'available' || status === 'limited';
}

export function filterFacilities(
  facilities: Facility[],
  preferences: NormalizedCarePreferences
): Facility[] {
  return facilities.filter((facility) => {
    if (preferences.needsNursingRoom && !hasUsableAmenity(facility.nursingRoom)) {
      return false;
    }

    if (preferences.needsDiaperStation && !hasUsableAmenity(facility.diaperStation)) {
      return false;
    }

    return true;
  });
}
