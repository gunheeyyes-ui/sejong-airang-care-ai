import type { DashboardMetrics, UsageEvent } from './types';

type CountMap<Key extends string> = Partial<Record<Key, number>>;

function addCount<Key extends string>(counts: CountMap<Key>, key: Key): void {
  counts[key] = (counts[key] ?? 0) + 1;
}

export function buildDashboardMetrics(events: UsageEvent[]): DashboardMetrics {
  const metrics: DashboardMetrics = {
    totalEvents: events.length,
    byLifeZone: {},
    byAgeBand: {},
    byTimeBand: {},
    byDayType: {},
    byMonthBucket: {},
    byConditionTag: {},
    byEventType: {}
  };

  for (const event of events) {
    addCount(metrics.byLifeZone, event.lifeZone);
    addCount(metrics.byTimeBand, event.timeBand);
    addCount(metrics.byDayType, event.dayType);
    addCount(metrics.byMonthBucket, event.monthBucket);
    addCount(metrics.byEventType, event.eventType);

    if (event.eventType === 'recommendation-requested') {
      addCount(metrics.byAgeBand, event.ageBand);
    }

    for (const conditionTag of event.conditionTags) {
      addCount(metrics.byConditionTag, conditionTag);
    }
  }

  return metrics;
}
