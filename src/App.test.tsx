import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import App from './App';

const dashboardNotice =
  '비식별 집계 데이터이며 개인·가구별 이용 여부를 판단하는 용도로 사용할 수 없습니다.';

describe('아이랑 세종 AI UI', () => {
  it('renders the citizen recommendation experience first', () => {
    render(<App />);

    expect(screen.getByRole('tab', { name: '오늘 추천' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: '오늘 추천' })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /아이 월령/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /생활권/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /날씨/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /미세먼지/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /추천 보기/ })).toBeInTheDocument();
  });

  it('shows recommendations after changing care conditions', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.clear(screen.getByRole('spinbutton', { name: /아이 월령/ }));
    await user.type(screen.getByRole('spinbutton', { name: /아이 월령/ }), '8');
    await user.selectOptions(
      screen.getByRole('combobox', { name: /생활권/ }),
      screen.getByRole('option', { name: '고운동' })
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: /날씨/ }),
      screen.getByRole('option', { name: '비' })
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: /미세먼지/ }),
      screen.getByRole('option', { name: '나쁨' })
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: /유모차 유형/ }),
      screen.getByRole('option', { name: '쌍둥이 유모차' })
    );
    await user.click(screen.getByRole('button', { name: /추천 보기/ }));

    const recommendations = screen.getByRole('region', { name: '추천 결과' });
    expect(within(recommendations).getAllByRole('article')).toHaveLength(3);
    expect(within(recommendations).getAllByText('추천 이유').length).toBeGreaterThan(0);
    expect(
      within(recommendations).getAllByText(/방문 전 공식 링크 또는 전화로 최신 운영 정보를 확인하세요/)
        .length
    ).toBeGreaterThan(0);
  });

  it('shows medical safety guidance for health questions', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('tab', { name: '공식정보 Q&A' }));
    await user.type(
      screen.getByRole('textbox', { name: /질문/ }),
      '아이가 열이 나고 숨쉬기 힘들어 보여요. 119 문의가 필요할까요?'
    );
    await user.click(screen.getByRole('button', { name: /답변 확인/ }));

    const safetyHeading = screen.getByRole('heading', { name: '안전 안내' });
    const safetySection = safetyHeading.closest('section');

    expect(safetyHeading).toBeInTheDocument();
    expect(safetySection).toBeTruthy();
    expect(screen.getByText(/이 서비스는 의료 진단이나 치료 조언을 제공하지 않습니다/)).toBeInTheDocument();
    expect(within(safetySection as HTMLElement).getByText(/119|의료기관|보건소/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '공식 출처' })).toBeInTheDocument();
  });

  it('shows anonymized dashboard notice', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('tab', { name: '행정 대시보드' }));

    expect(screen.getByText(dashboardNotice)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '행정 대시보드' })).toBeInTheDocument();
    expect(screen.getByText(/전체 이벤트/)).toBeInTheDocument();
  });

  it('switches between 오늘 추천, 공식정보 Q&A, 행정 대시보드 tabs', async () => {
    const user = userEvent.setup();

    render(<App />);

    const recommendationTab = screen.getByRole('tab', { name: '오늘 추천' });
    const qaTab = screen.getByRole('tab', { name: '공식정보 Q&A' });
    const dashboardTab = screen.getByRole('tab', { name: '행정 대시보드' });

    expect(recommendationTab).toHaveAttribute('aria-selected', 'true');

    await user.click(qaTab);
    expect(qaTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('textbox', { name: /질문/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /추천 보기/ })).not.toBeInTheDocument();

    await user.click(dashboardTab);
    expect(dashboardTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(dashboardNotice)).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: /질문/ })).not.toBeInTheDocument();

    await user.click(recommendationTab);
    expect(recommendationTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: /추천 보기/ })).toBeInTheDocument();
  });
});
