import { BarChart3, Clock, Database, ShieldCheck, Users } from 'lucide-react';
import type { DashboardMetrics } from '../features/dashboard/types';

interface DashboardPanelProps {
  metrics: DashboardMetrics;
}

const dashboardNotice =
  '비식별 집계 데이터이며 개인·가구별 이용 여부를 판단하는 용도로 사용할 수 없습니다.';

const ageBandLabels: Record<string, string> = {
  '0-6m': '0-6개월',
  '7-12m': '7-12개월',
  '13-24m': '13-24개월',
  '25-36m': '25-36개월'
};

const timeBandLabels: Record<string, string> = {
  morning: '오전',
  afternoon: '오후',
  evening: '저녁'
};

const eventTypeLabels: Record<string, string> = {
  'recommendation-requested': '추천 요청',
  'facility-detail-opened': '시설 상세 확인',
  'official-info-opened': '공식 정보 열람',
  'qa-question-asked': 'Q&A 질문'
};

const conditionLabels: Record<string, string> = {
  rain: '비',
  heatwave: '폭염',
  'fine-dust-bad': '미세먼지 나쁨',
  'single-stroller': '일반 유모차',
  'twin-stroller': '쌍둥이 유모차',
  'outdoor-ok': '야외 가능',
  'nursing-room': '수유실',
  'diaper-station': '기저귀 교환대',
  'stroller-accessibility': '유모차 접근성',
  'indoor-suitability': '실내 적합',
  'weather-suitability': '날씨 적합',
  'fine-dust-suitability': '미세먼지 적합',
  parking: '주차',
  cost: '비용',
  reservation: '예약'
};

function topEntries(counts: Partial<Record<string, number>>, limit = 5) {
  return Object.entries(counts)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .slice(0, limit);
}

function formatLabel(value: string, labels: Record<string, string>) {
  return labels[value] ?? value;
}

export function DashboardPanel({ metrics }: DashboardPanelProps) {
  return (
    <section className="panel dashboard-panel" aria-labelledby="dashboard-title">
      <div className="panel-heading">
        <p className="eyebrow">행정 참고용</p>
        <h2 id="dashboard-title">행정 대시보드</h2>
        <p>샘플 이용 이벤트를 생활권, 월령대, 시간대, 조건 태그별 집계로만 확인합니다.</p>
      </div>

      <p className="privacy-notice">
        <ShieldCheck aria-hidden="true" size={18} />
        {dashboardNotice}
      </p>

      <div className="metric-grid">
        <div className="metric-tile">
          <Database aria-hidden="true" size={20} />
          <span>전체 이벤트</span>
          <strong>{metrics.totalEvents.toLocaleString('ko-KR')}</strong>
        </div>
        <div className="metric-tile">
          <Users aria-hidden="true" size={20} />
          <span>추천 요청</span>
          <strong>{metrics.byEventType['recommendation-requested'] ?? 0}</strong>
        </div>
        <div className="metric-tile">
          <Clock aria-hidden="true" size={20} />
          <span>주요 시간대</span>
          <strong>
            {formatLabel(topEntries(metrics.byTimeBand, 1)[0]?.[0] ?? '-', timeBandLabels)}
          </strong>
        </div>
        <div className="metric-tile">
          <BarChart3 aria-hidden="true" size={20} />
          <span>조건 태그 수</span>
          <strong>{Object.keys(metrics.byConditionTag).length}</strong>
        </div>
      </div>

      <div className="dashboard-lists">
        <section>
          <h3>생활권별 수요</h3>
          <ol className="rank-list">
            {topEntries(metrics.byLifeZone).map(([label, count]) => (
              <li key={label}>
                <span>{label}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3>월령대별 추천 요청</h3>
          <ol className="rank-list">
            {topEntries(metrics.byAgeBand).map(([label, count]) => (
              <li key={label}>
                <span>{formatLabel(label, ageBandLabels)}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3>자주 나타난 조건</h3>
          <ol className="rank-list">
            {topEntries(metrics.byConditionTag).map(([label, count]) => (
              <li key={label}>
                <span>{formatLabel(label, conditionLabels)}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3>이벤트 흐름</h3>
          <ol className="rank-list">
            {topEntries(metrics.byEventType).map(([label, count]) => (
              <li key={label}>
                <span>{formatLabel(label, eventTypeLabels)}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
