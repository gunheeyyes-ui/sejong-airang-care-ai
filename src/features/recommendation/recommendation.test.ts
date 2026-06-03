import { describe, expect, it } from 'vitest';

import { sampleFacilities } from '../../data/sampleFacilities';
import { filterFacilities } from './filterFacilities';
import { normalizePreferences } from './normalizePreferences';
import { rankFacilities } from './rankFacilities';
import type { Facility } from './types';

describe('recommendation engine', () => {
  it('prioritizes indoor twin-stroller-friendly places for rainy 8-month twin outing', () => {
    const results = rankFacilities(sampleFacilities, {
      ageMonths: 8,
      lifeZone: '고운동',
      timeBand: 'afternoon',
      dayType: 'weekday',
      weather: 'rain',
      fineDust: 'moderate',
      strollerType: 'twin',
      needsNursingRoom: true,
      needsDiaperStation: true,
      indoorPreferred: true,
      costPreference: 'free-only'
    });

    expect(results).toHaveLength(3);
    expect(results[0]?.facility.id).toBe('facility-goun-community-center');
    expect(results[0]?.score.matchedConditions).toEqual(
      expect.arrayContaining(['age-fit', 'life-zone-fit', 'stroller-accessibility', 'indoor-suitability'])
    );
    expect(results[0]?.reasons.join(' ')).toMatch(/실내|쌍둥이 유모차/);
  });

  it('filters out facilities missing required nursing room when nursing is required', () => {
    const preferences = normalizePreferences({
      ageMonths: 8,
      needsNursingRoom: true,
      needsDiaperStation: false
    });
    const unavailableNursingRoom: Facility = {
      ...sampleFacilities[0],
      id: 'facility-without-nursing-room',
      nursingRoom: 'unavailable'
    };
    const unknownNursingRoom: Facility = {
      ...sampleFacilities[1],
      id: 'facility-unknown-nursing-room',
      nursingRoom: 'unknown'
    };

    const filtered = filterFacilities([unavailableNursingRoom, unknownNursingRoom, sampleFacilities[3]], preferences);

    expect(filtered.map((facility) => facility.id)).toEqual(['facility-goun-community-center']);
  });

  it('keeps outdoor places lower during bad fine dust conditions', () => {
    const results = rankFacilities(
      sampleFacilities,
      {
        ageMonths: 8,
        lifeZone: '호수공원권',
        timeBand: 'morning',
        dayType: 'weekend',
        weather: 'clear',
        fineDust: 'bad',
        strollerType: 'twin',
        indoorPreferred: true,
        costPreference: 'free-only'
      },
      10
    );

    const lakePark = results.find((result) => result.facility.id === 'facility-sejong-lake-park');
    const nationalLibrary = results.find(
      (result) => result.facility.id === 'facility-national-sejong-library-childrens-room'
    );

    expect(lakePark).toBeDefined();
    expect(nationalLibrary).toBeDefined();
    expect(lakePark!.score.environmentFit).toBeLessThan(nationalLibrary!.score.environmentFit);
    expect(lakePark!.score.total).toBeLessThan(nationalLibrary!.score.total);
  });

  it('returns recommendation reasons and official information metadata', () => {
    const [result] = rankFacilities(
      sampleFacilities,
      {
        ageMonths: 14,
        lifeZone: '어진동',
        timeBand: 'afternoon',
        dayType: 'weekday',
        weather: 'rain',
        fineDust: 'bad',
        strollerType: 'single',
        needsNursingRoom: true,
        needsDiaperStation: true,
        indoorPreferred: true,
        costPreference: 'low-cost-ok'
      },
      1
    );

    expect(result).toBeDefined();
    expect(result.officialLink).toBe(result.facility.officialLink);
    expect(result.updatedAt).toBe(result.facility.updatedAt);
    expect(result.officialLink).toMatch(/^https:\/\//);
    expect(result.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.reasons.length).toBeGreaterThanOrEqual(3);
    expect(result.reasons.every((reason) => /[가-힣]/.test(reason))).toBe(true);
    expect(result.reasons.join(' ')).not.toMatch(/보장|반드시/);
  });

  it('filters out age-incompatible facilities so they cannot be recommended', () => {
    const preferences = normalizePreferences({ ageMonths: 8 });

    const filtered = filterFacilities(sampleFacilities, preferences);
    const results = rankFacilities(sampleFacilities, { ageMonths: 8 }, 10);

    expect(filtered.map((facility) => facility.id)).not.toEqual(
      expect.arrayContaining([
        'facility-national-childrens-museum',
        'facility-presidential-archives-childrens-experience'
      ])
    );
    expect(results.map((result) => result.facility.id)).not.toEqual(
      expect.arrayContaining([
        'facility-national-childrens-museum',
        'facility-presidential-archives-childrens-experience'
      ])
    );
  });

  it('filters out non-twin stroller facilities only when a twin stroller is required', () => {
    const twinPreferences = normalizePreferences({
      ageMonths: 8,
      strollerType: 'twin',
      needsDiaperStation: false
    });
    const singlePreferences = normalizePreferences({
      ageMonths: 8,
      strollerType: 'single',
      needsDiaperStation: false
    });
    const candidates = [sampleFacilities[0], sampleFacilities[3]];

    const twinFiltered = filterFacilities(candidates, twinPreferences);
    const singleFiltered = filterFacilities(candidates, singlePreferences);

    expect(twinFiltered.map((facility) => facility.id)).toEqual(['facility-goun-community-center']);
    expect(singleFiltered.map((facility) => facility.id)).toEqual([
      'facility-dodam-community-center',
      'facility-goun-community-center'
    ]);
  });

  it('includes an official confirmation caution in every recommendation result', () => {
    const results = rankFacilities(sampleFacilities, {
      ageMonths: 8,
      lifeZone: '고운동',
      strollerType: 'twin',
      needsNursingRoom: true,
      needsDiaperStation: true,
      indoorPreferred: true
    });

    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every((result) =>
        result.reasons.some((reason) => reason.includes('방문 전') && /공식 링크|전화/.test(reason))
      )
    ).toBe(true);
  });

  it('adds parent-facing caution when a required diaper station is limited but allowed', () => {
    const [result] = rankFacilities(
      [sampleFacilities[9]],
      {
        ageMonths: 8,
        lifeZone: '호수공원권',
        weather: 'clear',
        fineDust: 'good',
        strollerType: 'twin',
        needsDiaperStation: true,
        indoorPreferred: false
      },
      1
    );

    expect(result).toBeDefined();
    expect(result.reasons.join(' ')).toMatch(/기저귀.*제한|제한.*기저귀/);
    expect(result.reasons.join(' ')).toMatch(/방문 전/);
  });
});
