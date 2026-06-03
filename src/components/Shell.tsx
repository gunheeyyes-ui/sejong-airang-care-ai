import { BarChart3, HelpCircle, MapPinned } from 'lucide-react';
import type { ReactNode } from 'react';

export type ShellTab = 'recommendation' | 'qa' | 'dashboard';

interface ShellProps {
  activeTab: ShellTab;
  children: ReactNode;
  onTabChange: (tab: ShellTab) => void;
}

const tabs: Array<{
  id: ShellTab;
  label: string;
  description: string;
  Icon: typeof MapPinned;
}> = [
  {
    id: 'recommendation',
    label: '오늘 추천',
    description: '오늘 조건별 공공자원',
    Icon: MapPinned
  },
  {
    id: 'qa',
    label: '공식정보 Q&A',
    description: '공식 출처 기반 답변',
    Icon: HelpCircle
  },
  {
    id: 'dashboard',
    label: '행정 대시보드',
    description: '비식별 이용 흐름',
    Icon: BarChart3
  }
];

export function Shell({ activeTab, children, onTabChange }: ShellProps) {
  return (
    <div className="app-shell">
      <header className="shell-header">
        <div className="brand-block">
          <p className="eyebrow">세종 영유아 공공자원 안내</p>
          <h1>아이랑 세종 AI</h1>
        </div>
        <nav className="tab-list" aria-label="주요 화면" role="tablist">
          {tabs.map(({ id, label, description, Icon }) => (
            <button
              key={id}
              aria-label={label}
              aria-selected={activeTab === id}
              className="tab-button"
              onClick={() => onTabChange(id)}
              role="tab"
              type="button"
            >
              <Icon aria-hidden="true" size={18} />
              <span>
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
            </button>
          ))}
        </nav>
      </header>
      <main className="shell-content">{children}</main>
    </div>
  );
}
