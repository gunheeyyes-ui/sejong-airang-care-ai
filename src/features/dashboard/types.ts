import type { AgeBand, LifeZone, TimeBand } from '../recommendation/types';

export type DashboardConditionTag =
  | 'rain'
  | 'heatwave'
  | 'fine-dust-bad'
  | 'nursing-room-needed'
  | 'diaper-station-needed'
  | 'single-stroller'
  | 'twin-stroller'
  | 'indoor-preferred'
  | 'parking-needed'
  | 'reservation-needed'
  | 'free-cost-preferred'
  | 'outdoor-ok';

export type UsageEventType =
  | 'recommendation-requested'
  | 'facility-detail-opened'
  | 'official-info-opened'
  | 'qa-question-asked';

export interface UsageEvent {
  lifeZone: LifeZone;
  ageBand: AgeBand;
  timeBand: TimeBand;
  conditionTags: DashboardConditionTag[];
  eventType: UsageEventType;
}

export interface DashboardMetrics {
  totalEvents: number;
  byLifeZone: Partial<Record<LifeZone, number>>;
  byAgeBand: Partial<Record<AgeBand, number>>;
  byTimeBand: Partial<Record<TimeBand, number>>;
  byConditionTag: Partial<Record<DashboardConditionTag, number>>;
  byEventType: Partial<Record<UsageEventType, number>>;
}
