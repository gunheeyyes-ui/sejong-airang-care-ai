import type { OfficialInfoSource } from './types';
import { classifyQuestion } from './classifyQuestion';

const relatedCategoryScore: Record<string, string[]> = {
  emergency: ['health-warning'],
  'health-warning': ['emergency'],
  'time-based-care': ['childcare']
};

function normalize(value: string): string {
  return value.toLocaleLowerCase('ko-KR').replace(/\s+/g, '');
}

function getQuestionTerms(question: string): string[] {
  return question
    .toLocaleLowerCase('ko-KR')
    .split(/[^\p{L}\p{N}]+/u)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2);
}

export function searchOfficialInfo(
  question: string,
  sources: OfficialInfoSource[]
): OfficialInfoSource[] {
  const category = classifyQuestion(question);
  const normalizedQuestion = normalize(question);
  const questionTerms = getQuestionTerms(question);
  const relatedCategories = relatedCategoryScore[category] ?? [];

  const rankedSources = sources
    .map((source, index) => {
      const sourceText = normalize(
        [source.sourceName, source.agency, source.category, source.summary, ...source.keywords].join(' ')
      );
      const keywordScore = source.keywords.reduce((score, keyword) => {
        const normalizedKeyword = normalize(keyword);
        return normalizedQuestion.includes(normalizedKeyword) ? score + 20 : score;
      }, 0);
      const genericScore = questionTerms.reduce((score, term) => {
        return sourceText.includes(normalize(term)) ? score + 1 : score;
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
