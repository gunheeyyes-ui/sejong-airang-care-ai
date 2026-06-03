import { explainRecommendation } from './explainRecommendation';
import { filterFacilities } from './filterFacilities';
import { normalizePreferences } from './normalizePreferences';
import { scoreFacility } from './scoreFacility';
import type { CarePreferenceInput, Facility, RecommendationResult } from './types';

export function rankFacilities(
  facilities: Facility[],
  input: CarePreferenceInput,
  limit = 3
): RecommendationResult[] {
  const preferences = normalizePreferences(input);
  const requestedLimit = Math.max(0, limit);

  return filterFacilities(facilities, preferences)
    .map((facility) => {
      const score = scoreFacility(facility, preferences);

      return {
        facility,
        score,
        reasons: explainRecommendation(facility, preferences, score),
        officialLink: facility.officialLink,
        updatedAt: facility.updatedAt
      };
    })
    .sort((a, b) => {
      if (b.score.total !== a.score.total) {
        return b.score.total - a.score.total;
      }

      return a.facility.name.localeCompare(b.facility.name, 'ko-KR');
    })
    .slice(0, requestedLimit);
}
