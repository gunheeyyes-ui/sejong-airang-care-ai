# 아이랑 세종 AI MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable React TypeScript demo app for `아이랑 세종 AI` with citizen recommendations, official-info Q&A, an administrative dashboard, sample data, and verified core logic.

**Architecture:** The app is a Vite React single-page app with no backend. Domain behavior lives in small pure functions under `src/features`, sample data lives in `src/data`, and UI pages consume tested domain outputs. Tests cover recommendation scoring, Q&A safety routing, dashboard aggregation, and key UI rendering.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, lucide-react, CSS modules via plain CSS.

---

## File Structure

- Create `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `vitest.setup.ts`
- Create `src/main.tsx`, `src/App.tsx`, `src/styles.css`, `src/vite-env.d.ts`
- Create `src/data/sampleFacilities.ts`, `src/data/sampleOfficialInfo.ts`, `src/data/sampleUsageEvents.ts`
- Create `src/features/recommendation/types.ts`, `normalizePreferences.ts`, `filterFacilities.ts`, `scoreFacility.ts`, `explainRecommendation.ts`, `rankFacilities.ts`, `recommendation.test.ts`
- Create `src/features/qa/types.ts`, `classifyQuestion.ts`, `searchOfficialInfo.ts`, `buildAnswer.ts`, `qa.test.ts`
- Create `src/features/dashboard/types.ts`, `dashboardMetrics.ts`, `dashboardMetrics.test.ts`
- Create `src/components/RecommendationForm.tsx`, `FacilityCard.tsx`, `QaPanel.tsx`, `DashboardPanel.tsx`, `Shell.tsx`
- Create `src/App.test.tsx`

## Task 1: Scaffold Vite React TypeScript App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vitest.setup.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: Add project manifest and scripts**

`package.json` must include these scripts:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Add Vite/Vitest configuration**

`vite.config.ts` must set React and jsdom:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true
  }
});
```

- [ ] **Step 3: Add a minimal app shell**

`src/App.tsx` starts as the smallest initial shell:

```tsx
export default function App() {
  return <main><h1>아이랑 세종 AI</h1></main>;
}
```

- [ ] **Step 4: Run baseline build**

Run: `npm install`

Expected: dependencies install without errors.

Run: `npm run build`

Expected: production build succeeds.

- [ ] **Step 5: Commit**

Run:

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json vitest.setup.ts src
git commit -m "chore: scaffold react app"
```

## Task 2: Add Sample Public Data

**Files:**
- Create: `src/data/sampleFacilities.ts`
- Create: `src/data/sampleOfficialInfo.ts`
- Create: `src/data/sampleUsageEvents.ts`
- Create: `src/features/recommendation/types.ts`
- Create: `src/features/qa/types.ts`
- Create: `src/features/dashboard/types.ts`

- [ ] **Step 1: Define shared recommendation types**

`src/features/recommendation/types.ts` must define `Facility`, `CarePreferenceInput`, `NormalizedCarePreferences`, and `RecommendationResult`. Facility must include fields for life zone, age ranges, official link, updated date, nursing room, diaper station, stroller accessibility, indoor suitability, weather suitability, parking, cost, opening hours, phone, and reservation requirement.

- [ ] **Step 2: Define Q&A and dashboard types**

`src/features/qa/types.ts` must define `QuestionCategory`, `OfficialInfoSource`, and `OfficialAnswer`.

`src/features/dashboard/types.ts` must define `UsageEvent` and `DashboardMetrics`.

- [ ] **Step 3: Add sample facility records**

`sampleFacilities.ts` must include at least 10 facilities across these categories:

```ts
export const sampleFacilities = [
  '도담동 복합커뮤니티센터',
  '아름동 공동육아나눔터',
  '종촌동 시립도서관 영유아자료실',
  '고운동 복합커뮤니티센터',
  '새롬동 가족센터 프로그램실',
  '다정동 공동육아나눔터',
  '국립세종도서관 어린이자료실',
  '국립어린이박물관',
  '대통령기록관 어린이체험관',
  '세종호수공원'
];
```

- [ ] **Step 4: Add official information and usage events**

Official records must include childcare, time-based care, vaccination, health warning, and family-center topics. Usage events must include life zone, age band, time band, condition tags, and event type only.

- [ ] **Step 5: Run TypeScript build**

Run: `npm run build`

Expected: TypeScript compiles.

- [ ] **Step 6: Commit**

Run:

```bash
git add src/data src/features
git commit -m "feat: add sejong sample public data"
```

## Task 3: Recommendation Engine With Tests

**Files:**
- Create: `src/features/recommendation/normalizePreferences.ts`
- Create: `src/features/recommendation/filterFacilities.ts`
- Create: `src/features/recommendation/scoreFacility.ts`
- Create: `src/features/recommendation/explainRecommendation.ts`
- Create: `src/features/recommendation/rankFacilities.ts`
- Create: `src/features/recommendation/recommendation.test.ts`

- [ ] **Step 1: Write failing recommendation tests**

Create tests that assert:

```ts
it('prioritizes indoor twin-stroller-friendly places for rainy 8-month twin outing', () => {});
it('filters out facilities missing required nursing room when nursing is required', () => {});
it('keeps outdoor places lower during bad fine dust conditions', () => {});
it('returns recommendation reasons and official information metadata', () => {});
```

- [ ] **Step 2: Run tests to verify red**

Run: `npm test -- src/features/recommendation/recommendation.test.ts`

Expected: tests fail because functions are not implemented.

- [ ] **Step 3: Implement pure recommendation functions**

Required public API:

```ts
export function normalizePreferences(input: CarePreferenceInput): NormalizedCarePreferences;
export function filterFacilities(facilities: Facility[], preferences: NormalizedCarePreferences): Facility[];
export function scoreFacility(facility: Facility, preferences: NormalizedCarePreferences): FacilityScore;
export function explainRecommendation(facility: Facility, preferences: NormalizedCarePreferences, score: FacilityScore): string[];
export function rankFacilities(facilities: Facility[], input: CarePreferenceInput, limit?: number): RecommendationResult[];
```

- [ ] **Step 4: Run tests to verify green**

Run: `npm test -- src/features/recommendation/recommendation.test.ts`

Expected: recommendation tests pass.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/recommendation
git commit -m "feat: add condition based recommendation engine"
```

## Task 4: Official Information Q&A With Safety Routing

**Files:**
- Create: `src/features/qa/classifyQuestion.ts`
- Create: `src/features/qa/searchOfficialInfo.ts`
- Create: `src/features/qa/buildAnswer.ts`
- Create: `src/features/qa/qa.test.ts`

- [ ] **Step 1: Write failing Q&A tests**

Create tests that assert:

```ts
it('classifies outing questions and returns official source links', () => {});
it('classifies time-based care questions as childcare', () => {});
it('routes fever and breathing questions to health safety guidance without diagnosis', () => {});
it('always includes source name, agency, updated date, and official link', () => {});
```

- [ ] **Step 2: Run tests to verify red**

Run: `npm test -- src/features/qa/qa.test.ts`

Expected: tests fail because functions are not implemented.

- [ ] **Step 3: Implement Q&A functions**

Required public API:

```ts
export function classifyQuestion(question: string): QuestionCategory;
export function searchOfficialInfo(question: string, sources: OfficialInfoSource[]): OfficialInfoSource[];
export function buildAnswer(question: string, sources: OfficialInfoSource[]): OfficialAnswer;
```

Health answers must include this sentence:

```text
이 서비스는 의료 진단이나 치료 조언을 제공하지 않습니다.
```

- [ ] **Step 4: Run tests to verify green**

Run: `npm test -- src/features/qa/qa.test.ts`

Expected: Q&A tests pass.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/qa
git commit -m "feat: add official information qa safety flow"
```

## Task 5: Administrative Dashboard Metrics With Tests

**Files:**
- Create: `src/features/dashboard/dashboardMetrics.ts`
- Create: `src/features/dashboard/dashboardMetrics.test.ts`

- [ ] **Step 1: Write failing dashboard tests**

Create tests that assert:

```ts
it('aggregates demand by life zone and condition tag', () => {});
it('aggregates recommendation requests by age band', () => {});
it('does not expose personal identifiers in dashboard metrics', () => {});
```

- [ ] **Step 2: Run tests to verify red**

Run: `npm test -- src/features/dashboard/dashboardMetrics.test.ts`

Expected: tests fail because aggregation is not implemented.

- [ ] **Step 3: Implement metrics**

Required public API:

```ts
export function buildDashboardMetrics(events: UsageEvent[]): DashboardMetrics;
```

`DashboardMetrics` must contain only aggregate keys and counts, not names, exact addresses, profile ids, or health records.

- [ ] **Step 4: Run tests to verify green**

Run: `npm test -- src/features/dashboard/dashboardMetrics.test.ts`

Expected: dashboard tests pass.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/features/dashboard
git commit -m "feat: add anonymized dashboard metrics"
```

## Task 6: Build Citizen, Q&A, And Dashboard UI

**Files:**
- Create: `src/components/Shell.tsx`
- Create: `src/components/RecommendationForm.tsx`
- Create: `src/components/FacilityCard.tsx`
- Create: `src/components/QaPanel.tsx`
- Create: `src/components/DashboardPanel.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write failing UI tests**

Create tests that assert:

```ts
it('renders the citizen recommendation experience first', () => {});
it('shows recommendations after changing care conditions', () => {});
it('shows medical safety guidance for health questions', () => {});
it('shows anonymized dashboard notice', () => {});
```

- [ ] **Step 2: Run tests to verify red**

Run: `npm test -- src/App.test.tsx`

Expected: UI tests fail because components are not implemented.

- [ ] **Step 3: Implement UI**

UI requirements:

- First screen is the usable recommendation experience, not a marketing landing page.
- Top navigation uses three tabs: `오늘 추천`, `공식정보 Q&A`, `행정 대시보드`.
- Recommendation form has controls for month age, life zone, weather, fine dust, time band, stroller type, nursing room, diaper station, and indoor preference.
- Facility cards show reasons, official links, updated date, phone, opening hours, and visit-before-confirming notice.
- Q&A panel shows official source metadata and health safety disclaimer.
- Dashboard panel shows aggregate metrics and the non-identification notice.
- Layout is responsive for desktop and mobile.

- [ ] **Step 4: Run UI tests and build**

Run: `npm test -- src/App.test.tsx`

Expected: UI tests pass.

Run: `npm run build`

Expected: production build succeeds.

- [ ] **Step 5: Commit**

Run:

```bash
git add src/App.tsx src/App.test.tsx src/components src/styles.css
git commit -m "feat: build airang sejong ai demo ui"
```

## Task 7: Final Verification

**Files:**
- Modify only if verification reveals issues.

- [ ] **Step 1: Run full tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: build succeeds.

- [ ] **Step 3: Start dev server**

Run: `npm run dev -- --port 5173`

Expected: local app serves at `http://127.0.0.1:5173/`.

- [ ] **Step 4: Browser verify**

Use browser verification for desktop and mobile widths. Confirm:

- The first viewport shows the app and recommendation form.
- Recommendation cards are visible and not blank.
- Q&A health question shows the medical safety disclaimer.
- Dashboard metrics and non-identification notice are visible.
- Text does not overlap on desktop or mobile.

- [ ] **Step 5: Final status**

Run:

```bash
git status --short
```

Expected: only intentional final changes are present, or working tree is clean.
