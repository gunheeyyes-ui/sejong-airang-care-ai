import { describe, expect, it } from 'vitest';

import { sampleOfficialInfo } from '../../data/sampleOfficialInfo';
import { buildAnswer } from './buildAnswer';
import { classifyQuestion } from './classifyQuestion';
import { searchOfficialInfo } from './searchOfficialInfo';

const medicalNotice = '이 서비스는 의료 진단이나 치료 조언을 제공하지 않습니다.';

describe('official information Q&A', () => {
  it('classifies outing questions and returns official source links', () => {
    const question = '아이랑 세종시 공원이나 도서관으로 외출하려면 운영시간을 어디서 확인하나요?';

    expect(classifyQuestion(question)).toBe('outing');

    const sources = searchOfficialInfo(question, sampleOfficialInfo);

    expect(sources[0]?.id).toBe('info-outing-public-facilities');
    expect(sources[0]?.category).toBe('outing');
    expect(sources[0]?.url).toMatch(/^https:\/\//);
  });

  it('classifies childcare and time-based care questions as appropriate', () => {
    expect(classifyQuestion('어린이집 보육 지원과 가정양육 정보를 알고 싶어요')).toBe('childcare');
    expect(classifyQuestion('시간제보육이나 일시돌봄 예약은 어떻게 확인하나요?')).toBe('time-based-care');

    const sources = searchOfficialInfo('시간제보육 예약 가능한 공식 안내가 필요해요', sampleOfficialInfo);

    expect(sources[0]?.id).toBe('info-time-based-care');
    expect(sources[0]?.category).toBe('time-based-care');
  });

  it('routes fever and breathing questions to health safety guidance without diagnosis', () => {
    const answer = buildAnswer('아이가 발열이 있고 숨쉬기가 불편해 보여요. 공식 안내가 궁금해요.', sampleOfficialInfo);
    const answerText = [
      answer.answerSummary,
      answer.safetyNotice,
      ...answer.recommendedActions
    ].join(' ');

    expect(answer.category).toBe('health-warning');
    expect(answer.isMedicalAdvice).toBe(false);
    expect(answer.safetyNotice).toContain(medicalNotice);
    expect(answer.sources.some((source) => source.category === 'health-warning')).toBe(true);
    expect(answerText).not.toMatch(/진단명|치료하세요|해열제|복용|괜찮습니다|안전합니다/);
  });

  it('always includes source name, agency, updated date, and official link', () => {
    const answer = buildAnswer('시간제보육 예약 공식 안내를 알려주세요', sampleOfficialInfo);

    expect(answer.sources.length).toBeGreaterThan(0);
    answer.sources.forEach((source) => {
      expect(source.sourceName).toEqual(expect.any(String));
      expect(source.sourceName.length).toBeGreaterThan(0);
      expect(source.agency).toEqual(expect.any(String));
      expect(source.agency.length).toBeGreaterThan(0);
      expect(source.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(source.url).toMatch(/^https?:\/\//);
    });
  });

  it.each(['호흡곤란', '경련', '의식', '119'])(
    'sets requiresEmergencyEscalation for emergency keyword %s',
    (keyword) => {
      const answer = buildAnswer(`아이에게 ${keyword} 관련 상황이 있어 공식 안내가 필요해요`, sampleOfficialInfo);

      expect(answer.requiresEmergencyEscalation).toBe(true);
      expect(answer.safetyNotice).toContain(medicalNotice);
    }
  );
});
