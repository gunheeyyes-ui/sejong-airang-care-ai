import type { AgeBand, ConditionKey, DayType, LifeZone, TimeBand } from '../recommendation/types';

export type MonthBucket = `${number}-${'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'}`;

type DashboardRecommendationCondition = Extract<
  ConditionKey,
  | 'nursing-room'
  | 'diaper-station'
  | 'stroller-accessibility'
  | 'indoor-suitability'
  | 'weather-suitability'
  | 'fine-dust-suitability'
  | 'parking'
  | 'cost'
  | 'reservation'
>;

export type DashboardConditionTag =
  | 'rain'
  | 'heatwave'
  | 'fine-dust-bad'
  | 'single-stroller'
  | 'twin-stroller'
  | 'outdoor-ok'
  | DashboardRecommendationCondition;

export type UsageEventType =
  | 'recommendation-requested'
  | 'facility-detail-opened'
  | 'official-info-opened'
  | 'qa-question-asked';

export interface UsageEvent {
  lifeZone: LifeZone;
  ageBand: AgeBand;
  timeBand: TimeBand;
  dayType: DayType;
  monthBucket: MonthBucket;
  conditionTags: DashboardConditionTag[];
  eventType: UsageEventType;
}

export interface DashboardMetrics {
  totalEvents: number;
  byLifeZone: Partial<Record<LifeZone, number>>;
  byAgeBand: Partial<Record<AgeBand, number>>;
  byTimeBand: Partial<Record<TimeBand, number>>;
  byDayType: Partial<Record<DayType, number>>;
  byMonthBucket: Partial<Record<MonthBucket, number>>;
  byConditionTag: Partial<Record<DashboardConditionTag, number>>;
  byEventType: Partial<Record<UsageEventType, number>>;
}
