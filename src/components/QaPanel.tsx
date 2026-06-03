import { AlertTriangle, ExternalLink, FileText, Send } from 'lucide-react';
import { useState } from 'react';
import { buildAnswer } from '../features/qa/buildAnswer';
import type { OfficialAnswer, OfficialInfoSource } from '../features/qa/types';

interface QaPanelProps {
  sources: OfficialInfoSource[];
}

function getCategoryLabel(category: OfficialAnswer['category']): string {
  const labels: Record<OfficialAnswer['category'], string> = {
    childcare: '보육',
    'time-based-care': '시간제보육',
    vaccination: '예방접종',
    'health-warning': '건강 이상 신호',
    'family-center': '가족센터',
    outing: '외출·공공시설',
    emergency: '응급 안내',
    general: '일반 안내'
  };

  return labels[category];
}

export function QaPanel({ sources }: QaPanelProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<OfficialAnswer | null>(null);

  return (
    <section className="panel qa-panel" aria-labelledby="qa-title">
      <div className="panel-heading">
        <p className="eyebrow">공식 출처 기반</p>
        <h2 id="qa-title">공식정보 Q&A</h2>
        <p>보육, 외출, 예방접종, 건강 이상 신호 질문을 공식 정보 메타데이터와 함께 보여줍니다.</p>
      </div>

      <form
        className="qa-form"
        onSubmit={(event) => {
          event.preventDefault();
          setAnswer(buildAnswer(question, sources));
        }}
      >
        <label className="field">
          <span>
            <FileText aria-hidden="true" size={16} />
            질문
          </span>
          <textarea
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="예: 아이가 열이 나고 숨쉬기 힘들어 보여요. 119 문의가 필요할까요?"
            rows={4}
            value={question}
          />
        </label>
        <button className="primary-button" type="submit">
          <Send aria-hidden="true" size={18} />
          답변 확인
        </button>
      </form>

      {answer ? (
        <div className="answer-layout">
          <section className="answer-block">
            <p className="meta-line">분류: {getCategoryLabel(answer.category)}</p>
            <h3>답변 요약</h3>
            <p>{answer.answerSummary}</p>
          </section>

          {answer.safetyNotice ? (
            <section className="safety-block" aria-labelledby="safety-title">
              <h3 id="safety-title">
                <AlertTriangle aria-hidden="true" size={18} />
                안전 안내
              </h3>
              <p>{answer.safetyNotice}</p>
              {answer.requiresEmergencyEscalation ? (
                <p>긴급 신호가 있으면 즉시 119에 신고하거나 가까운 의료기관에 연락하세요.</p>
              ) : (
                <p>증상이 지속되거나 보호자가 불안하면 보건소 또는 의료기관에 문의하세요.</p>
              )}
            </section>
          ) : null}

          <section className="answer-block">
            <h3>권장 행동</h3>
            <ul className="reason-list">
              {answer.recommendedActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </section>

          <section className="answer-block">
            <h3>공식 출처</h3>
            {answer.sources.length > 0 ? (
              <ul className="source-list">
                {answer.sources.map((source) => (
                  <li key={source.id}>
                    <div>
                      <strong>{source.sourceName}</strong>
                      <span>
                        {source.agency} · {source.updatedAt}
                      </span>
                    </div>
                    <a href={source.url} rel="noreferrer" target="_blank">
                      공식 링크
                      <ExternalLink aria-hidden="true" size={15} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>질문과 직접 연결되는 샘플 공식 출처가 없어 세종시 공식 누리집 확인이 필요합니다.</p>
            )}
          </section>
        </div>
      ) : null}
    </section>
  );
}
