import type { OfficialInfoSource, QuestionCategory } from './types';
import { classifyQuestion, normalizeQuestionText } from './classifyQuestion';

const relatedCategoryScore: Partial<Record<QuestionCategory, QuestionCategory[]>> = {
  emergency: ['health-warning'],
  'health-warning': ['emergency'],
  'time-based-care': ['childcare']
};

const genericQuestionTerms = new Set([
  '공식',
  '안내',
  '세종시',
  '세종',
  '정보',
  '확인',
  '알려주세요',
  '알려줘',
  '필요',
  '필요해요',
  '관련'
]);

function getQuestionTerms(question: string): string[] {
  return question
    .toLocaleLowerCase('ko-KR')
    .split(/[^\p{L}\p{N}]+/u)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2)
    .filter((term) => !genericQuestionTerms.has(term));
}

function isGenericKeyword(keyword: string): boolean {
  return genericQuestionTerms.has(normalizeQuestionText(keyword));
}

export function searchOfficialInfo(
  question: string,
  sources: OfficialInfoSource[]
): OfficialInfoSource[] {
  const category = classifyQuestion(question);
  const normalizedQuestion = normalizeQuestionText(question);
  const questionTerms = getQuestionTerms(question);
  const relatedCategories = relatedCategoryScore[category] ?? [];

  const rankedSources = sources
    .map((source, index) => {
      const sourceText = normalizeQuestionText(
        [source.sourceName, source.agency, source.category, source.summary, ...source.keywords].join(' ')
      );
      const keywordScore = source.keywords.reduce((score, keyword) => {
        const normalizedKeyword = normalizeQuestionText(keyword);
        return !isGenericKeyword(keyword) && normalizedQuestion.includes(normalizedKeyword) ? score + 20 : score;
      }, 0);
      const genericScore = questionTerms.reduce((score, term) => {
        return sourceText.includes(normalizeQuestionText(term)) ? score + 1 : score;
      }, 0);
      const categoryScore =
        source.category === category ? 100 : relatedCategories.includes(source.category) ? 40 : 0;

      return {
        source,
        index,
        score: categoryScore + keywordScore + genericScore
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.index - right.index;
    });

  if (rankedSources.length > 0) {
    return rankedSources.map((entry) => entry.source);
  }

  if (category !== 'general') {
    return sources.filter((source) => source.category === category);
  }

  return [];
}
