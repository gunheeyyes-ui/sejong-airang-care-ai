import { Baby, CalendarDays, CloudSun, MapPin, Search, Wind } from 'lucide-react';
import type {
  CarePreferenceInput,
  CostPreference,
  DayType,
  FineDustLevel,
  LifeZone,
  StrollerType,
  TimeBand,
  WeatherCondition
} from '../features/recommendation/types';

interface Option<Value extends string> {
  label: string;
  value: Value;
}

interface RecommendationFormProps {
  lifeZoneOptions: Array<Option<LifeZone>>;
  onChange: (patch: Partial<CarePreferenceInput>) => void;
  onSubmit: () => void;
  preferences: CarePreferenceInput;
}

const weatherOptions: Array<Option<WeatherCondition>> = [
  { value: 'clear', label: '맑음' },
  { value: 'rain', label: '비' },
  { value: 'snow', label: '눈' },
  { value: 'heatwave', label: '폭염' }
];

const fineDustOptions: Array<Option<FineDustLevel>> = [
  { value: 'good', label: '좋음' },
  { value: 'moderate', label: '보통' },
  { value: 'bad', label: '나쁨' },
  { value: 'very-bad', label: '매우 나쁨' }
];

const timeBandOptions: Array<Option<TimeBand>> = [
  { value: 'morning', label: '오전' },
  { value: 'afternoon', label: '오후' },
  { value: 'evening', label: '저녁' }
];

const dayTypeOptions: Array<Option<DayType>> = [
  { value: 'weekday', label: '평일' },
  { value: 'weekend', label: '주말' },
  { value: 'holiday', label: '공휴일' }
];

const strollerOptions: Array<Option<StrollerType>> = [
  { value: 'none', label: '사용 안 함' },
  { value: 'single', label: '일반 유모차' },
  { value: 'twin', label: '쌍둥이 유모차' }
];

const costOptions: Array<Option<CostPreference>> = [
  { value: 'free-only', label: '무료만' },
  { value: 'low-cost-ok', label: '저비용 가능' },
  { value: 'any', label: '상관없음' }
];

export function RecommendationForm({
  lifeZoneOptions,
  onChange,
  onSubmit,
  preferences
}: RecommendationFormProps) {
  return (
    <form
      className="recommendation-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="form-header">
        <h3>맞춤 추천 조건</h3>
        <p>아이 월령과 오늘의 외출 조건을 바꾸면 공식 정보 기준 추천을 다시 계산합니다.</p>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>
            <Baby aria-hidden="true" size={16} />
            아이 월령
          </span>
          <input
            max={36}
            min={0}
            name="ageMonths"
            onChange={(event) =>
              onChange({
                ageMonths: event.target.value === '' ? undefined : Number(event.target.value)
              })
            }
            type="number"
            value={preferences.ageMonths ?? ''}
          />
        </label>

        <label className="field">
          <span>
            <MapPin aria-hidden="true" size={16} />
            생활권
          </span>
          <select
            name="lifeZone"
            onChange={(event) => onChange({ lifeZone: event.target.value as LifeZone })}
            value={preferences.lifeZone}
          >
            {lifeZoneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>
            <CloudSun aria-hidden="true" size={16} />
            날씨
          </span>
          <select
            name="weather"
            onChange={(event) => onChange({ weather: event.target.value as WeatherCondition })}
            value={preferences.weather}
          >
            {weatherOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>
            <Wind aria-hidden="true" size={16} />
            미세먼지
          </span>
          <select
            name="fineDust"
            onChange={(event) => onChange({ fineDust: event.target.value as FineDustLevel })}
            value={preferences.fineDust}
          >
            {fineDustOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>
            <CalendarDays aria-hidden="true" size={16} />
            시간대
          </span>
          <select
            name="timeBand"
            onChange={(event) => onChange({ timeBand: event.target.value as TimeBand })}
            value={preferences.timeBand}
          >
            {timeBandOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>요일 유형</span>
          <select
            name="dayType"
            onChange={(event) => onChange({ dayType: event.target.value as DayType })}
            value={preferences.dayType}
          >
            {dayTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>유모차 유형</span>
          <select
            name="strollerType"
            onChange={(event) => onChange({ strollerType: event.target.value as StrollerType })}
            value={preferences.strollerType}
          >
            {strollerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>비용 선호</span>
          <select
            name="costPreference"
            onChange={(event) =>
              onChange({ costPreference: event.target.value as CostPreference })
            }
            value={preferences.costPreference}
          >
            {costOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="toggle-group">
        <legend>필요한 편의 조건</legend>
        <label>
          <input
            checked={Boolean(preferences.needsNursingRoom)}
            onChange={(event) => onChange({ needsNursingRoom: event.target.checked })}
            type="checkbox"
          />
          수유실
        </label>
        <label>
          <input
            checked={Boolean(preferences.needsDiaperStation)}
            onChange={(event) => onChange({ needsDiaperStation: event.target.checked })}
            type="checkbox"
          />
          기저귀 교환대
        </label>
        <label>
          <input
            checked={Boolean(preferences.indoorPreferred)}
            onChange={(event) => onChange({ indoorPreferred: event.target.checked })}
            type="checkbox"
          />
          실내 선호
        </label>
      </fieldset>

      <button className="primary-button" type="submit">
        <Search aria-hidden="true" size={18} />
        추천 보기
      </button>
    </form>
  );
}
