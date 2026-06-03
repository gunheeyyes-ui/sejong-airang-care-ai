import type { UsageEvent } from '../features/dashboard/types';

export const sampleUsageEvents: UsageEvent[] = [
  {
    lifeZone: '도담동',
    ageBand: '7-12m',
    timeBand: 'afternoon',
    conditionTags: ['rain', 'nursing-room-needed', 'single-stroller', 'indoor-preferred'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '고운동',
    ageBand: '7-12m',
    timeBand: 'afternoon',
    conditionTags: ['rain', 'twin-stroller', 'nursing-room-needed', 'indoor-preferred'],
    eventType: 'facility-detail-opened'
  },
  {
    lifeZone: '아름동',
    ageBand: '13-24m',
    timeBand: 'morning',
    conditionTags: ['diaper-station-needed', 'free-cost-preferred', 'indoor-preferred'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '다정동',
    ageBand: '0-6m',
    timeBand: 'morning',
    conditionTags: ['nursing-room-needed', 'diaper-station-needed', 'single-stroller'],
    eventType: 'official-info-opened'
  },
  {
    lifeZone: '새롬동',
    ageBand: '25-36m',
    timeBand: 'weekend',
    conditionTags: ['reservation-needed', 'parking-needed', 'indoor-preferred'],
    eventType: 'qa-question-asked'
  },
  {
    lifeZone: '종촌동',
    ageBand: '13-24m',
    timeBand: 'afternoon',
    conditionTags: ['fine-dust-bad', 'indoor-preferred', 'diaper-station-needed'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '어진동',
    ageBand: '25-36m',
    timeBand: 'weekend',
    conditionTags: ['parking-needed', 'indoor-preferred', 'reservation-needed'],
    eventType: 'facility-detail-opened'
  },
  {
    lifeZone: '호수공원권',
    ageBand: '13-24m',
    timeBand: 'evening',
    conditionTags: ['outdoor-ok', 'twin-stroller', 'parking-needed'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '세종동',
    ageBand: '25-36m',
    timeBand: 'weekend',
    conditionTags: ['reservation-needed', 'parking-needed', 'diaper-station-needed'],
    eventType: 'official-info-opened'
  },
  {
    lifeZone: '고운동',
    ageBand: '0-6m',
    timeBand: 'morning',
    conditionTags: ['heatwave', 'nursing-room-needed', 'indoor-preferred', 'twin-stroller'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '도담동',
    ageBand: '7-12m',
    timeBand: 'afternoon',
    conditionTags: ['fine-dust-bad', 'indoor-preferred', 'diaper-station-needed'],
    eventType: 'qa-question-asked'
  },
  {
    lifeZone: '아름동',
    ageBand: '25-36m',
    timeBand: 'weekend',
    conditionTags: ['free-cost-preferred', 'single-stroller', 'indoor-preferred'],
    eventType: 'facility-detail-opened'
  },
  {
    lifeZone: '다정동',
    ageBand: '13-24m',
    timeBand: 'afternoon',
    conditionTags: ['rain', 'twin-stroller', 'nursing-room-needed', 'indoor-preferred'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '새롬동',
    ageBand: '7-12m',
    timeBand: 'morning',
    conditionTags: ['reservation-needed', 'diaper-station-needed', 'indoor-preferred'],
    eventType: 'official-info-opened'
  },
  {
    lifeZone: '종촌동',
    ageBand: '25-36m',
    timeBand: 'weekend',
    conditionTags: ['free-cost-preferred', 'single-stroller', 'indoor-preferred'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '호수공원권',
    ageBand: '7-12m',
    timeBand: 'evening',
    conditionTags: ['outdoor-ok', 'single-stroller', 'parking-needed'],
    eventType: 'facility-detail-opened'
  }
];
