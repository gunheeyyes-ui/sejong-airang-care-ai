import type { OfficialInfoSource } from '../features/qa/types';

export const sampleOfficialInfo: OfficialInfoSource[] = [
  {
    id: 'info-childcare-basic',
    sourceName: '세종시 보육 지원 안내',
    agency: '세종특별자치시',
    category: 'childcare',
    ageBands: ['0-6m', '7-12m', '13-24m', '25-36m'],
    summary: '어린이집, 육아종합지원, 가정양육 관련 공공 보육 정보를 확인할 수 있는 기본 안내입니다.',
    url: 'https://www.sejong.go.kr',
    updatedAt: '2026-06-03',
    keywords: ['보육', '어린이집', '육아종합지원', '가정양육', '세종시']
  },
  {
    id: 'info-time-based-care',
    sourceName: '시간제보육 및 일시돌봄 안내',
    agency: '보건복지부',
    category: 'time-based-care',
    ageBands: ['7-12m', '13-24m', '25-36m'],
    summary: '보호자가 필요한 시간에 이용할 수 있는 시간제보육 신청 대상, 이용 방법, 예약 확인 안내입니다.',
    url: 'https://www.childcare.go.kr',
    updatedAt: '2026-06-03',
    keywords: ['시간제보육', '일시돌봄', '예약', '보육통합정보', '부모']
  },
  {
    id: 'info-vaccination',
    sourceName: '어린이 국가예방접종 지원사업',
    agency: '질병관리청',
    category: 'vaccination',
    ageBands: ['0-6m', '7-12m', '13-24m', '25-36m'],
    summary: '영유아 예방접종 일정, 지정 의료기관, 접종 기록 확인에 대한 국가예방접종 공식 안내입니다.',
    url: 'https://nip.kdca.go.kr',
    updatedAt: '2026-06-03',
    keywords: ['예방접종', '국가예방접종', '영유아', '접종일정', '질병관리청']
  },
  {
    id: 'info-health-warning',
    sourceName: '영유아 건강 이상 신호 안내',
    agency: '질병관리청',
    category: 'health-warning',
    ageBands: ['0-6m', '7-12m', '13-24m', '25-36m'],
    summary: '발열, 호흡곤란, 경련, 탈수 의심 등 위험 신호가 있을 때 의료기관 또는 119 안내를 우선하도록 돕는 안전 정보입니다.',
    url: 'https://www.kdca.go.kr',
    updatedAt: '2026-06-03',
    keywords: ['발열', '호흡곤란', '경련', '탈수', '응급', '119', '의료기관']
  },
  {
    id: 'info-family-center',
    sourceName: '세종시 가족센터 프로그램 안내',
    agency: '세종시가족센터',
    category: 'family-center',
    ageBands: ['0-6m', '7-12m', '13-24m', '25-36m'],
    summary: '공동육아나눔터, 부모교육, 가족 프로그램 모집 일정과 이용 방법을 확인하는 가족센터 안내입니다.',
    url: 'https://sejong.familynet.or.kr',
    updatedAt: '2026-06-03',
    keywords: ['가족센터', '공동육아나눔터', '부모교육', '프로그램', '품앗이']
  },
  {
    id: 'info-outing-public-facilities',
    sourceName: '세종시 공공시설 및 공원 이용 안내',
    agency: '세종특별자치시',
    category: 'outing',
    ageBands: ['0-6m', '7-12m', '13-24m', '25-36m'],
    summary: '도서관, 복합커뮤니티센터, 공원 등 공공 외출 장소의 운영 시간과 공지사항 확인을 권장하는 안내입니다.',
    url: 'https://www.sejong.go.kr',
    updatedAt: '2026-06-03',
    keywords: ['외출', '공공시설', '공원', '도서관', '복합커뮤니티센터', '운영시간']
  },
  {
    id: 'info-emergency-119',
    sourceName: '119 응급상황 신고 및 상담 안내',
    agency: '소방청',
    category: 'emergency',
    ageBands: ['0-6m', '7-12m', '13-24m', '25-36m'],
    summary: '위급 증상, 사고, 즉시 도움이 필요한 상황에서는 119 신고와 의료기관 안내를 우선하도록 안내합니다.',
    url: 'https://www.119.go.kr',
    updatedAt: '2026-06-03',
    keywords: ['119', '응급', '신고', '사고', '의료기관', '위급']
  }
];
