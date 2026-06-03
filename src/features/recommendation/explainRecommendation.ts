import type { Facility, FacilityScore, NormalizedCarePreferences } from './types';

export function explainRecommendation(
  facility: Facility,
  preferences: NormalizedCarePreferences,
  score: FacilityScore
): string[] {
  const reasons: string[] = [];
  const matched = new Set(score.matchedConditions);

  if (matched.has('age-fit')) {
    reasons.push(`${preferences.ageMonths}개월 아이의 월령 범위와 비교적 잘 맞습니다.`);
  }

  if (facility.lifeZone === preferences.lifeZone) {
    reasons.push(`${preferences.lifeZone} 생활권 안에 있어 이동 부담을 줄이는 데 도움이 될 수 있습니다.`);
  } else if (matched.has('life-zone-fit')) {
    reasons.push(`선택한 생활권과 가까운 권역으로 볼 수 있습니다.`);
  }

  if (preferences.needsNursingRoom && facility.nursingRoom === 'available') {
    reasons.push('수유실 이용 가능 정보가 있어 영아 외출 조건에 맞는 편입니다.');
  } else if (preferences.needsNursingRoom && facility.nursingRoom === 'limited') {
    reasons.push('수유 공간은 제한적으로 안내되어 있어 방문 전 확인이 필요합니다.');
  }

  if (preferences.needsDiaperStation && facility.diaperStation === 'available') {
    reasons.push('기저귀 교체 시설 정보가 있어 짧은 외출 준비에 도움이 됩니다.');
  }

  if (preferences.strollerType === 'twin' && facility.strollerAccessibility === 'twin') {
    reasons.push('쌍둥이 유모차 이동에 맞는 접근성이 안내되어 있습니다.');
  } else if (preferences.strollerType === 'single' && matched.has('stroller-accessibility')) {
    reasons.push('유모차 이동 접근성이 비교적 알맞게 안내되어 있습니다.');
  }

  if (preferences.indoorPreferred && facility.indoorSuitability === 'high') {
    reasons.push('실내 이용 적합도가 높아 날씨 영향을 줄이는 데 도움이 될 수 있습니다.');
  }

  if (preferences.weather === 'rain' && facility.weatherSuitability.rain === 'high') {
    reasons.push('비 오는 날에도 이용 적합도가 높은 편으로 분류되어 있습니다.');
  }

  if ((preferences.fineDust === 'bad' || preferences.fineDust === 'very-bad') && matched.has('fine-dust-suitability')) {
    reasons.push('미세먼지 조건을 고려했을 때 실내 대안으로 검토하기 좋습니다.');
  }

  if (matched.has('time-band-fit')) {
    reasons.push('선택한 요일과 시간대에 운영 정보가 맞는 편입니다.');
  }

  if (matched.has('cost')) {
    reasons.push('비용 조건이 선택한 선호와 비교적 잘 맞습니다.');
  }

  if (matched.has('management-scope')) {
    reasons.push('공공기관 관리 정보와 공식 안내 링크를 기준으로 보여드립니다.');
  }

  if (reasons.length === 0) {
    reasons.push('입력한 조건과 일부 항목이 맞는 후보로 볼 수 있습니다.');
  }

  return reasons.slice(0, 6);
}
