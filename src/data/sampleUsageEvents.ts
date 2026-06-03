import type { UsageEvent } from '../features/dashboard/types';

export const sampleUsageEvents: UsageEvent[] = [
  {
    lifeZone: '도담동',
    ageBand: '7-12m',
    timeBand: 'afternoon',
    dayType: 'weekday',
    monthBucket: '2026-06',
    conditionTags: ['rain', 'nursing-room', 'single-stroller', 'indoor-suitability'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '고운동',
    ageBand: '7-12m',
    timeBand: 'afternoon',
    dayType: 'weekday',
    monthBucket: '2026-06',
    conditionTags: ['rain', 'twin-stroller', 'nursing-room', 'indoor-suitability'],
    eventType: 'facility-detail-opened'
  },
  {
    lifeZone: '아름동',
    ageBand: '13-24m',
    timeBand: 'morning',
    dayType: 'weekday',
    monthBucket: '2026-06',
    conditionTags: ['diaper-station', 'cost', 'indoor-suitability'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '다정동',
    ageBand: '0-6m',
    timeBand: 'morning',
    dayType: 'weekday',
    monthBucket: '2026-06',
    conditionTags: ['nursing-room', 'diaper-station', 'single-stroller'],
    eventType: 'official-info-opened'
  },
  {
    lifeZone: '새롬동',
    ageBand: '25-36m',
    timeBand: 'afternoon',
    dayType: 'weekend',
    monthBucket: '2026-06',
    conditionTags: ['reservation', 'parking', 'indoor-suitability'],
    eventType: 'qa-question-asked'
  },
  {
    lifeZone: '종촌동',
    ageBand: '13-24m',
    timeBand: 'afternoon',
    dayType: 'weekday',
    monthBucket: '2026-06',
    conditionTags: ['fine-dust-bad', 'indoor-suitability', 'diaper-station'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '어진동',
    ageBand: '25-36m',
    timeBand: 'morning',
    dayType: 'weekend',
    monthBucket: '2026-06',
    conditionTags: ['parking', 'indoor-suitability', 'reservation'],
    eventType: 'facility-detail-opened'
  },
  {
    lifeZone: '호수공원권',
    ageBand: '13-24m',
    timeBand: 'evening',
    dayType: 'weekday',
    monthBucket: '2026-06',
    conditionTags: ['outdoor-ok', 'twin-stroller', 'parking'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '세종동',
    ageBand: '25-36m',
    timeBand: 'afternoon',
    dayType: 'weekend',
    monthBucket: '2026-06',
    conditionTags: ['reservation', 'parking', 'diaper-station'],
    eventType: 'official-info-opened'
  },
  {
    lifeZone: '고운동',
    ageBand: '0-6m',
    timeBand: 'morning',
    dayType: 'weekday',
    monthBucket: '2026-07',
    conditionTags: ['heatwave', 'nursing-room', 'indoor-suitability', 'twin-stroller'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '도담동',
    ageBand: '7-12m',
    timeBand: 'afternoon',
    dayType: 'weekday',
    monthBucket: '2026-06',
    conditionTags: ['fine-dust-bad', 'indoor-suitability', 'diaper-station'],
    eventType: 'qa-question-asked'
  },
  {
    lifeZone: '아름동',
    ageBand: '25-36m',
    timeBand: 'morning',
    dayType: 'weekend',
    monthBucket: '2026-05',
    conditionTags: ['cost', 'single-stroller', 'indoor-suitability'],
    eventType: 'facility-detail-opened'
  },
  {
    lifeZone: '다정동',
    ageBand: '13-24m',
    timeBand: 'afternoon',
    dayType: 'weekday',
    monthBucket: '2026-06',
    conditionTags: ['rain', 'twin-stroller', 'nursing-room', 'indoor-suitability'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '새롬동',
    ageBand: '7-12m',
    timeBand: 'morning',
    dayType: 'holiday',
    monthBucket: '2026-06',
    conditionTags: ['reservation', 'diaper-station', 'indoor-suitability'],
    eventType: 'official-info-opened'
  },
  {
    lifeZone: '종촌동',
    ageBand: '25-36m',
    timeBand: 'afternoon',
    dayType: 'weekend',
    monthBucket: '2026-05',
    conditionTags: ['cost', 'single-stroller', 'indoor-suitability'],
    eventType: 'recommendation-requested'
  },
  {
    lifeZone: '호수공원권',
    ageBand: '7-12m',
    timeBand: 'evening',
    dayType: 'weekend',
    monthBucket: '2026-06',
    conditionTags: ['outdoor-ok', 'single-stroller', 'parking'],
    eventType: 'facility-detail-opened'
  }
];
