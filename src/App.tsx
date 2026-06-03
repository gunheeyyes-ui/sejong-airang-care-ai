import { useMemo, useState } from 'react';
import { DashboardPanel } from './components/DashboardPanel';
import { FacilityCard } from './components/FacilityCard';
import { QaPanel } from './components/QaPanel';
import { RecommendationForm } from './components/RecommendationForm';
import { Shell, type ShellTab } from './components/Shell';
import { sampleFacilities } from './data/sampleFacilities';
import { sampleOfficialInfo } from './data/sampleOfficialInfo';
import { sampleUsageEvents } from './data/sampleUsageEvents';
import { buildDashboardMetrics } from './features/dashboard/dashboardMetrics';
import { rankFacilities } from './features/recommendation/rankFacilities';
import type { CarePreferenceInput } from './features/recommendation/types';

const defaultPreferences: CarePreferenceInput = {
  ageMonths: 8,
  lifeZone: '고운동',
  weather: 'rain',
  fineDust: 'moderate',
  timeBand: 'afternoon',
  dayType: 'weekday',
  strollerType: 'twin',
  needsNursingRoom: true,
  needsDiaperStation: true,
  indoorPreferred: true,
  costPreference: 'free-only'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ShellTab>('recommendation');
  const [preferences, setPreferences] = useState<CarePreferenceInput>(defaultPreferences);
  const [recommendations, setRecommendations] = useState(() =>
    rankFacilities(sampleFacilities, defaultPreferences, 3)
  );

  const lifeZoneOptions = useMemo(
    () =>
      Array.from(new Set(sampleFacilities.map((facility) => facility.lifeZone))).map((lifeZone) => ({
        label: lifeZone,
        value: lifeZone
      })),
    []
  );
  const metrics = useMemo(() => buildDashboardMetrics(sampleUsageEvents), []);

  function updatePreferences(patch: Partial<CarePreferenceInput>) {
    setPreferences((current) => ({ ...current, ...patch }));
  }

  function refreshRecommendations() {
    setRecommendations(rankFacilities(sampleFacilities, preferences, 3));
  }

  return (
    <Shell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'recommendation' ? (
        <section className="panel recommendation-panel" aria-labelledby="recommendation-title">
          <div className="panel-heading">
            <p className="eyebrow">시민용 추천</p>
            <h2 id="recommendation-title">오늘 추천</h2>
            <p>월령, 생활권, 날씨, 편의 조건을 기준으로 세종시 공공자원을 추천합니다.</p>
          </div>

          <div className="recommendation-layout">
            <RecommendationForm
              lifeZoneOptions={lifeZoneOptions}
              onChange={updatePreferences}
              onSubmit={refreshRecommendations}
              preferences={preferences}
            />

            <section className="recommendation-results" aria-label="추천 결과">
              <div className="results-header">
                <h3>추천 결과</h3>
                <p>상위 {recommendations.length}곳을 공식 정보와 함께 보여드립니다.</p>
              </div>
              <div className="facility-list">
                {recommendations.map((result) => (
                  <FacilityCard key={result.facility.id} result={result} />
                ))}
              </div>
            </section>
          </div>
        </section>
      ) : null}

      {activeTab === 'qa' ? <QaPanel sources={sampleOfficialInfo} /> : null}
      {activeTab === 'dashboard' ? <DashboardPanel metrics={metrics} /> : null}
    </Shell>
  );
}
