import type { OfficialAnswer, OfficialInfoSource } from './types';
import { classifyQuestion } from './classifyQuestion';
import { searchOfficialInfo } from './searchOfficialInfo';

const medicalSafetyNotice = '이 서비스는 의료 진단이나 치료 조언을 제공하지 않습니다.';
const emergencyKeywords = ['호흡곤란', '숨을 못', '숨못', '숨이 안', '경련', '의식', '119', '응급', '위급', '실신'];

function normalize(value: string): string {
  return value.toLocaleLowerCase('ko-KR').replace(/\s+/g, '');
}

function hasEmergencyKeyword(question: string): boolean {
  const normalizedQuestion = normalize(question);

  return emergencyKeywords.some((keyword) => normalizedQuestion.includes(normalize(keyword)));
}

function getAnswerSummary(category: OfficialAnswer['category'], matchedSources: OfficialInfoSource[]): string {
  const leadSource = matchedSources[0];
  const sourcePhrase = leadSource
    ? `${leadSource.sourceName}(${leadSource.agency}, ${leadSource.updatedAt})`
    : '제공된 공식 자료';

  if (category === 'health-warning' || category === 'emergency') {
    return `${sourcePhrase}를 기준으로 건강 이상 신호와 긴급 상황 안내를 확인할 수 있습니다.`;
  }

  if (category === 'general') {
    return `${sourcePhrase}에서 질문과 직접 관련된 공식 안내를 확인하세요.`;
  }

  return `${sourcePhrase}에서 ${category} 관련 공식 안내를 확인할 수 있습니다.`;
}

function getRecommendedActions(
  category: OfficialAnswer['category'],
  matchedSources: OfficialInfoSource[],
  requiresEmergencyEscalation: boolean
): string[] {
  const sourceAction =
    matchedSources.length > 0
      ? '아래 공식 출처의 기관명, 업데이트 날짜, 링크를 함께 확인하세요.'
      : '세종시 또는 관계 기관의 공식 누리집에서 최신 안내를 확인하세요.';

  if (category === 'health-warning' || category === 'emergency') {
    const actions = [
      '증상 판단은 공식 안내와 보호자의 관찰 정보를 바탕으로 의료기관 또는 119 등 공적 창구에 확인하세요.',
      sourceAction
    ];

    if (requiresEmergencyEscalation) {
      actions.unshift('호흡곤란, 경련, 의식 저하, 119가 필요한 상황처럼 긴급 신호가 있으면 즉시 119 안내를 우선 확인하세요.');
    }

    return actions;
  }

  return [
    '가장 관련성이 높은 공식 출처를 먼저 확인하세요.',
    sourceAction,
    '신청, 예약, 이용 조건은 공식 링크에서 최신 공지 기준으로 확인하세요.'
  ];
}

export function buildAnswer(question: string, sources: OfficialInfoSource[]): OfficialAnswer {
  const category = classifyQuestion(question);
  const matchedSources = searchOfficialInfo(question, sources);
  const requiresEmergencyEscalation = hasEmergencyKeyword(question);
  const isHealthOrEmergency = category === 'health-warning' || category === 'emergency';

  return {
    question,
    category,
    answerSummary: getAnswerSummary(category, matchedSources),
    sources: matchedSources,
    recommendedActions: getRecommendedActions(category, matchedSources, requiresEmergencyEscalation),
    safetyNotice: isHealthOrEmergency ? medicalSafetyNotice : undefined,
    isMedicalAdvice: false,
    requiresEmergencyEscalation
  };
}
