import { describe, expect, it } from 'vitest';

import { sampleUsageEvents } from '../../data/sampleUsageEvents';
import { buildDashboardMetrics } from './dashboardMetrics';

function countBy<T extends string>(values: T[]): Partial<Record<T, number>> {
  const counts: Partial<Record<T, number>> = {};

  for (const value of values) {
    counts[value] = (counts[value] ?? 0) + 1;
  }

  return counts;
}

describe('buildDashboardMetrics', () => {
  it('aggregates demand by life zone and condition tag', () => {
    const metrics = buildDashboardMetrics(sampleUsageEvents);
    const expectedByLifeZone = countBy(sampleUsageEvents.map((event) => event.lifeZone));
    const expectedByConditionTag = countBy(
      sampleUsageEvents.flatMap((event) => event.conditionTags)
    );

    expect(metrics.totalEvents).toBe(sampleUsageEvents.length);
    expect(metrics.byLifeZone).toEqual(expectedByLifeZone);
    expect(metrics.byConditionTag).toEqual(expectedByConditionTag);
    expect(metrics.byConditionTag.rain).toBe(3);
    expect(metrics.byConditionTag['indoor-suitability']).toBe(12);
  });

  it('aggregates recommendation requests by age band', () => {
    const recommendationRequests = sampleUsageEvents.filter(
      (event) => event.eventType === 'recommendation-requested'
    );
    const metrics = buildDashboardMetrics(sampleUsageEvents);

    expect(metrics.byAgeBand).toEqual(
      countBy(recommendationRequests.map((event) => event.ageBand))
    );
    expect(metrics.byAgeBand['13-24m']).toBe(4);
    expect(metrics.byAgeBand['7-12m']).toBe(1);
  });

  it('aggregates by timeBand, dayType, monthBucket, and eventType', () => {
    const metrics = buildDashboardMetrics(sampleUsageEvents);

    expect(metrics.byTimeBand).toEqual(countBy(sampleUsageEvents.map((event) => event.timeBand)));
    expect(metrics.byDayType).toEqual(countBy(sampleUsageEvents.map((event) => event.dayType)));
    expect(metrics.byMonthBucket).toEqual(
      countBy(sampleUsageEvents.map((event) => event.monthBucket))
    );
    expect(metrics.byEventType).toEqual(countBy(sampleUsageEvents.map((event) => event.eventType)));
    expect(metrics.byMonthBucket['2026-06']).toBe(13);
    expect(metrics.byEventType['recommendation-requested']).toBe(7);
  });

  it('does not expose personal identifiers in dashboard metrics', () => {
    const metrics = buildDashboardMetrics(sampleUsageEvents);
    const serializedMetrics = JSON.stringify(metrics).toLowerCase();
    const forbiddenTerms = ['name', 'childName', 'address', 'profileId', 'healthRecord', 'phone'];

    for (const term of forbiddenTerms) {
      expect(serializedMetrics).not.toContain(term.toLowerCase());
    }
  });

  it('handles empty event arrays with zero totals and empty maps', () => {
    expect(buildDashboardMetrics([])).toEqual({
      totalEvents: 0,
      byLifeZone: {},
      byAgeBand: {},
      byTimeBand: {},
      byDayType: {},
      byMonthBucket: {},
      byConditionTag: {},
      byEventType: {}
    });
  });
});
