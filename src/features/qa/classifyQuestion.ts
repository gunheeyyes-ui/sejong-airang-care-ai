import type { QuestionCategory } from './types';

const categoryKeywords: Array<[QuestionCategory, string[]]> = [
  ['emergency', ['호흡곤란', '숨을 못', '숨못', '숨이 안', '경련', '의식', '119', '응급', '위급', '실신', '구급', '신고']],
  ['health-warning', ['발열', '열', '고열', '호흡', '숨쉬', '숨', '기침', '건강', '증상', '탈수', '아파', '아픈']],
  ['time-based-care', ['시간제보육', '시간제 보육', '일시돌봄', '일시 돌봄', '예약', '시간 단위', '잠깐', '임시돌봄']],
  ['vaccination', ['예방접종', '접종', '백신', '국가예방접종', '질병관리청']],
  ['outing', ['외출', '나들이', '공원', '도서관', '놀이터', '공공시설', '운영시간', '복합커뮤니티', '갈만한']],
  ['family-center', ['가족센터', '공동육아', '부모교육', '프로그램', '문화센터']],
  ['childcare', ['보육', '어린이집', '육아', '가정양육', '양육수당', '입소', '지원']]
];

function normalize(value: string): string {
  return value.toLocaleLowerCase('ko-KR').replace(/\s+/g, '');
}

export function classifyQuestion(question: string): QuestionCategory {
  const normalizedQuestion = normalize(question);

  for (const [category, keywords] of categoryKeywords) {
    if (keywords.some((keyword) => normalizedQuestion.includes(normalize(keyword)))) {
      return category;
    }
  }

  return 'general';
}
