import {
  Accessibility,
  AlertTriangle,
  Baby,
  CalendarCheck,
  Clock,
  ExternalLink,
  Phone,
  Wallet
} from 'lucide-react';
import type {
  DayType,
  FacilityAmenityStatus,
  FacilityType,
  RecommendationResult,
  ReservationRequirement,
  StrollerAccessibility
} from '../features/recommendation/types';

interface FacilityCardProps {
  result: RecommendationResult;
}

const facilityTypeLabels: Record<FacilityType, string> = {
  'community-center': '복합커뮤니티센터',
  'childcare-share': '공동육아나눔터',
  library: '도서관',
  'family-center': '가족센터',
  museum: '박물관',
  'experience-center': '체험관',
  'outdoor-park': '공원'
};

const dayTypeLabels: Record<DayType, string> = {
  weekday: '평일',
  weekend: '주말',
  holiday: '공휴일'
};

const amenityLabels: Record<FacilityAmenityStatus, string> = {
  available: '이용 가능',
  limited: '제한적',
  unavailable: '없음',
  unknown: '확인 필요'
};

const strollerLabels: Record<StrollerAccessibility, string> = {
  none: '유모차 접근 어려움',
  single: '일반 유모차',
  twin: '쌍둥이 유모차',
  limited: '일부 제한'
};

const reservationLabels: Record<ReservationRequirement, string> = {
  'not-required': '예약 불필요',
  recommended: '예약 권장',
  required: '예약 필요',
  'program-only': '프로그램별 확인'
};

export function FacilityCard({ result }: FacilityCardProps) {
  const { facility } = result;
  const officialCaution = result.reasons.find((reason) => reason.includes('방문 전'));
  const recommendationReasons = result.reasons.filter((reason) => !reason.includes('방문 전'));

  return (
    <article className="facility-card">
      <div className="facility-card-header">
        <div>
          <p className="meta-line">
            {facilityTypeLabels[facility.type]} · {facility.lifeZone}
          </p>
          <h3>{facility.name}</h3>
        </div>
        <span className="score-pill">적합도 {result.score.total}</span>
      </div>

      <p className="facility-summary">{facility.summary}</p>

      <section className="card-section">
        <h4>추천 이유</h4>
        <ul className="reason-list">
          {recommendationReasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <p className="caution-line">
        <AlertTriangle aria-hidden="true" size={17} />
        {officialCaution
          ? '방문 전 공식 링크 또는 전화로 최신 운영 정보를 확인하세요.'
          : '방문 전 공식 링크 또는 전화로 최신 운영 정보를 확인하세요.'}
      </p>

      <dl className="facility-details">
        <div>
          <dt>
            <Clock aria-hidden="true" size={16} />
            운영 시간
          </dt>
          <dd>
            {facility.openingHours.map((hours) => (
              <span key={`${hours.dayType}-${hours.opensAt}`}>
                {dayTypeLabels[hours.dayType]} {hours.opensAt}-{hours.closesAt}
                {hours.notes ? ` (${hours.notes})` : ''}
              </span>
            ))}
          </dd>
        </div>
        <div>
          <dt>
            <Phone aria-hidden="true" size={16} />
            전화
          </dt>
          <dd>{facility.phone}</dd>
        </div>
        <div>
          <dt>
            <CalendarCheck aria-hidden="true" size={16} />
            갱신일
          </dt>
          <dd>{result.updatedAt}</dd>
        </div>
        <div>
          <dt>
            <Baby aria-hidden="true" size={16} />
            편의시설
          </dt>
          <dd>
            수유실 {amenityLabels[facility.nursingRoom]} · 기저귀 교환대{' '}
            {amenityLabels[facility.diaperStation]}
          </dd>
        </div>
        <div>
          <dt>
            <Accessibility aria-hidden="true" size={16} />
            유모차·접근성
          </dt>
          <dd>{strollerLabels[facility.strollerAccessibility]}</dd>
        </div>
        <div>
          <dt>
            <Wallet aria-hidden="true" size={16} />
            비용·예약
          </dt>
          <dd>
            {facility.cost.amountDescription} · {reservationLabels[facility.reservationRequirement]}
          </dd>
        </div>
      </dl>

      <a className="official-link" href={result.officialLink} rel="noreferrer" target="_blank">
        공식 링크 열기
        <ExternalLink aria-hidden="true" size={16} />
      </a>
    </article>
  );
}
