# On-Trip Mockup — Web Preview Design Spec

> **Date:** 2026-04-29
> **Status:** Approved (brainstorming complete)
> **Type:** Throwaway design preview (not production code)
> **Goal:** S1 본격 개발 전에 디자인 톤·레이아웃·핵심 동선을 브라우저에서 검수하고 수정하기 위한 클릭 가능한 웹 목업.

---

## 1. 배경 & 목적

`design-system/on-trip/MASTER.md` + `pages/*.md` 에 정의된 "키치 스티커" 디자인 시스템이 마크다운 스펙으로만 존재한다. S1(모노레포·백엔드·Expo 셋업)을 시작하기 전에 디자인 시안을 시각적으로 확인하고 수정 의견을 반영하는 단계가 필요하다.

S1 인프라와 별개의 **버릴(throwaway) 웹 정적 프로토타입**으로 핵심 3개 화면을 구현해 검수 후 폐기하거나 참고 자산으로 둔다. RN 본 코드는 디자인이 픽스된 후 S1에서 시작.

---

## 2. 범위

### 2.1 포함

- 화면 3개: **Map (홈)**, **Region Detail (거점 상세)**, **Poke Modal (콕 모달)**
- 두 가지 뷰 모드:
  - **Storyboard**: 디바이스 3개 가로 정렬 + 흐름 화살표
  - **Single Device**: 디바이스 1개 + 실제 클릭 동선 (핀 탭 → region-detail → 콕 버튼 → modal)
- MASTER.md 디자인 토큰 (color/radius/shadow/typography) 1:1 구현
- 공용 컴포넌트 8개 (StickerCard/Button/Input, Chip, CoinBadge, PinMarker, DeviceFrame, TabBar)
- Mock 데이터: 거점 7개, 일행 5명

### 2.2 제외 (Out of Scope)

- 진짜 카카오맵 SDK / 인터랙티브 지도 (정적 서울 지도 이미지 + 절대 좌표 핀으로 대체)
- 백엔드 / 인증 / 실시간 데이터
- Mechanical press 애니메이션, 햅틱, reduce-motion
- 화면: activity, chat, trip-profile, poke-list 등 (3개로 한정)
- 다크모드, safe-area, status bar
- 모바일 실기 테스트 (데스크톱 브라우저 검수만)
- 본 RN 앱과 코드 공유 (토큰 값만 마크다운 기준으로 수동 동기화)

---

## 3. 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| 빌드 | Vite 5 | 빠른 HMR, RN과 무관한 가벼운 웹 셋업 |
| 프레임워크 | React 18 + TypeScript | RN 본가와 멘탈 모델 동일 |
| 스타일 | Tailwind CSS v3 + custom config | 토큰 매핑 용이, 인라인 변경 빠름 |
| 라우팅 | `useState` (React Router 미사용) | 화면 3개뿐, 오버킬 회피 |
| 아이콘 | `lucide-react` | RN 본가 `lucide-react-native`와 동형 |
| 폰트 | Pretendard CDN, JetBrains Mono CDN | MASTER.md 명시 폰트 |
| 패키지 매니저 | pnpm (권장) 또는 npm | 사용자 환경에 따름 |

영문 보조 폰트 Fredoka는 검수 단계에서 불필요해 생략. 본 RN 앱에서 본격 검토.

---

## 4. 아키텍처

### 4.1 뷰 모드 토글

상단 툴바에 토글 버튼 두 개. App 컴포넌트가 `viewMode: 'storyboard' | 'single'` state 보유.

**Storyboard 모드**
- 데스크톱 폭 1280px+ 가정
- `DeviceFrame` 3개를 horizontal flex로 정렬
- 디바이스 사이에 화살표 SVG + 라벨 ("핀 탭", "콕 탭")
- 디바이스 영역 클릭 시 → Single Device 모드 + 해당 화면으로 진입

**Single Device 모드**
- `DeviceFrame` 1개를 화면 가운데 배치
- 내부에서 실제 navigation: `currentScreen: 'map' | 'region-detail' | 'poke-modal'`
- 상단 툴바 좌측에 "← 스토리보드로" 버튼

### 4.2 디바이스 프레임

- 사이즈: 390×844 (iPhone 14 viewport 기준, 노치 없음)
- 외곽: `border-radius: 36px`, `border: 2.5px solid #2A2A2A`, `box-shadow: 8px 8px 0 0 #2A2A2A`
- 우상단 작은 라벨 칩 (예: "Map", "Region Detail")
- `overflow: hidden` 으로 내부 화면 클리핑

### 4.3 화면 간 전환 (Single Device 모드)

- map → region-detail: 페이드/슬라이드 left (180ms)
- region-detail 하단 CTA → poke-modal 슬라이드업 (250ms ease-out, 외부 스크림 40% black)
- modal 외부 탭 / 핸들 스와이프 / X 버튼으로 닫기 (180ms ease-in)

키치 스티커 mechanical press는 본 사양에서 **제외** (RN 본 구현 시 검증).

---

## 5. 디자인 토큰

### 5.1 Tailwind config 매핑

```ts
// tailwind.config.ts
colors: {
  cream: '#FFFCEB',
  surface: '#FFFFFF',
  surfaceMuted: '#F4F0E0',
  outline: '#2A2A2A',
  textMuted: '#6B6B6B',
  primary: '#FFE066',
  primaryPressed: '#F0CD3F',
  accentRed: '#FF5A5A',
  accentLime: '#B5E48C',
  accentPink: '#FFB3D9',
  success: '#52B788',
  danger: '#E63946',
},
borderRadius: {
  sm: '8px', md: '14px', lg: '20px', xl: '28px', pill: '999px',
},
boxShadow: {
  'sticker-sm': '4px 4px 0 0 #2A2A2A',
  'sticker-md': '6px 6px 0 0 #2A2A2A',
  'sticker-lg': '8px 8px 0 0 #2A2A2A',
  'sticker-xl': '10px 10px 0 0 #2A2A2A',
},
fontFamily: {
  sans: ['Pretendard', 'system-ui', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'monospace'],
},
spacing: { /* 4/8/12/16/24/32/48 (Tailwind 기본 + 부분 보강) */ },
```

타이포 사이즈는 utility 클래스로 표현 (display: text-[28px] leading-[34px] font-extrabold 등).

### 5.2 보더 정책

- 인터랙티브/주요 컨테이너: `border-[2.5px] border-outline`
- 보조 컨테이너: `border-[1.5px] border-outline`
- Tailwind는 2.5px 직접 안 되므로 `[2.5px]` arbitrary 값 사용

---

## 6. 컴포넌트 카탈로그

| 컴포넌트 | Props | 설명 |
|---|---|---|
| `StickerCard` | `offset` (4/6/8/10), `rotate` (-2~2), `bg`, `pressable`, `onClick` | 모든 카드/모달 컨테이너 베이스. 보더 2.5 + shadow-sticker-* + 옵션 회전 |
| `StickerButton` | `variant` (primary/secondary/danger/ghost/disabled), `size` (lg=56/md=48/sm=36) | CTA. 가로 padding 24, 폰트 700 |
| `StickerInput` | `label`, `placeholder`, `value`, `onChange` | 라벨 위, focus 시 outline → accentRed |
| `Chip` | `bg`, `children` | pill + shadow-sticker-sm(2/2 가까이) |
| `CoinBadge` | `count` | 노랑 원형 + JetBrains Mono 숫자 |
| `PinMarker` | `count`, `name`, `position {x%, y%}` | 인구수 비례 크기 (32 + min(count/3, 32)) + 색상 단계 |
| `DeviceFrame` | `label`, `children`, `onClick` | 390×844 컨테이너 |
| `TabBar` | `active` ('map' / 'activity' / 'my') | 하단 3탭, 활성 탭 outline + 노랑 점 |

PinMarker 색상 단계 (`design-system/on-trip/pages/map.md` 그대로):

| 인원수 | Background | Text |
|---|---|---|
| 1–9 | surface (#FFF) | outline |
| 10–29 | primary (#FFE066) | outline |
| 30–69 | accentPink (#FFB3D9) | outline |
| 70+ | accentRed (#FF5A5A) | white |

---

## 7. 페이지 구성

### 7.1 Map (S-03 홈)

레이아웃 (`design-system/on-trip/pages/map.md` 기반):

- 헤더 (z-10, 투명 배경 위 카드 칩):
  - 좌: "On-Trip" 로고 칩
  - 우: Activity 칩 (`bell` 아이콘 + 빨간 점 뱃지) + My 칩 (`user`)
- 본문: 정적 서울 지도 이미지 (`/public/seoul-map.png`) full-bleed
- 핀 7개 (절대 좌표 % 기반): 강남, 홍대, 이태원, 명동, 신촌, 종로, 잠실
- 우하단: 내 위치 버튼 (StickerCard sm + `crosshair` 아이콘)
- 하단 fixed: "🚀 여행 왔어요" CTA (StickerButton primary, 56dp)
- TabBar (활성: Map)

핀 탭 → Single Device 모드일 때 region-detail로 push.

### 7.2 Region Detail

- 헤더: ← 뒤로 (`arrow-left`) + 거점명 "강남역 9번 출구" + 인구 칩 `⚪ 55명`
- 본문: 일행 StickerCard 5개 (rotate ±1deg 결정론, id 해시 기반)
  - 좌: 프로필 동그라미 (radii.lg 정사각형 + outline)
  - 우: 닉네임/나이/성별 1줄, 자기소개 1줄, 컨셉 칩 2~3개
- 하단 fixed CTA: "콕 보내기 (1코인)" (StickerButton primary)

CTA 클릭 → Poke Modal 슬라이드업.

### 7.3 Poke Modal

- 외부 스크림: 40% black, 클릭 시 닫힘
- 시트: 하단 슬라이드업, shadow-sticker-lg, radii.lg 상단 모서리
- 시트 내용 (위에서 아래):
  - 핸들 바 (회색 작은 가로 바)
  - 우상단 X 버튼
  - 타이틀 "○○님에게 콕 보내기" (display)
  - CoinBadge (잔액 12) + 보조 텍스트 "1코인 차감"
  - StickerInput "한 줄 메시지 (선택)" placeholder "여기서 만날래요?"
  - StickerButton primary "콕 발사" (lg 56dp)
  - StickerButton ghost "취소"

---

## 8. Mock 데이터

### 8.1 `data/regions.ts` (서울 거점 7개)

```ts
export const regions = [
  { id: 'gangnam', name: '강남역 9번 출구', count: 55, x: 52, y: 68 },
  { id: 'hongdae', name: '홍대입구역', count: 28, x: 28, y: 42 },
  { id: 'itaewon', name: '이태원역', count: 12, x: 48, y: 56 },
  { id: 'myeongdong', name: '명동성당', count: 8, x: 50, y: 38 },
  { id: 'sinchon', name: '신촌역', count: 45, x: 32, y: 38 },
  { id: 'jongno', name: '종로3가', count: 18, x: 52, y: 32 },
  { id: 'jamsil', name: '잠실역', count: 3, x: 72, y: 60 },
];
```

### 8.2 `data/companions.ts` (일행 5명, 강남 거점 가정)

```ts
export const companions = [
  { id: 1, nickname: '여행토끼', age: 24, gender: 'F', intro: '강남 맛집 같이 가실 분~', tags: ['맛집', '카페'] },
  { id: 2, nickname: '서울러버', age: 26, gender: 'M', intro: '술 한잔 어떠세요?', tags: ['술자리'] },
  { id: 3, nickname: 'mintchoco', age: 22, gender: 'F', intro: '액티비티 좋아하시면 콕!', tags: ['액티비티', '맛집'] },
  { id: 4, nickname: '제주촌놈', age: 29, gender: 'M', intro: '서울 처음이라 가이드해주실 분', tags: ['관광', '맛집'] },
  { id: 5, nickname: '월요병', age: 25, gender: 'F', intro: '늦은 밤 산책할 사람?', tags: ['산책'] },
];
```

지도 이미지는 무료 정적 지도(예: OpenStreetMap 스크린샷 또는 일러스트형 stock 이미지)를 `public/seoul-map.png`로 배치. 핀 좌표 %는 이미지에 맞춰 수동 보정.

---

## 9. 파일 구조

```
mockup/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ tailwind.config.ts
├─ postcss.config.js
├─ public/
│  └─ seoul-map.png
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx                     뷰 모드 토글 + 화면 라우팅 state
│  ├─ index.css                   Tailwind directives + 폰트 import
│  ├─ tokens.ts                   JS 토큰 export (Tailwind config와 1:1)
│  ├─ components/
│  │  ├─ StickerCard.tsx
│  │  ├─ StickerButton.tsx
│  │  ├─ StickerInput.tsx
│  │  ├─ Chip.tsx
│  │  ├─ CoinBadge.tsx
│  │  ├─ PinMarker.tsx
│  │  ├─ DeviceFrame.tsx
│  │  └─ TabBar.tsx
│  ├─ screens/
│  │  ├─ MapScreen.tsx
│  │  ├─ RegionDetailScreen.tsx
│  │  └─ PokeModal.tsx
│  └─ data/
│     ├─ regions.ts
│     └─ companions.ts
└─ README.md
```

---

## 10. 실행 방법

```bash
cd mockup
pnpm install        # or npm install
pnpm dev            # or npm run dev
# → http://localhost:5173
```

수정 검수 흐름: 브라우저에서 보고 → 수정 의견을 채팅으로 → 코드 수정 → Vite HMR 자동 반영.

---

## 11. S1과의 분리

- `mockup/`은 본 모노레포(`apps/backend`, `apps/mobile`, `packages/shared`)와 무관, 자체 `package.json`.
- S1이 `pnpm-workspace.yaml`을 만들 때 `packages: ['apps/*', 'packages/*']`로 한정해 `mockup/`은 워크스페이스에서 자동 제외됨 (`pnpm install` 영향 없음).
- 디자인 픽스 후: `mockup/` 그대로 두거나(참고용) 삭제. 토큰 값은 `mockup/src/tokens.ts` → `apps/mobile/src/design/tokens.ts`로 옮길 때 형식만 RN StyleSheet에 맞게 변환.

---

## 12. 검수 후 수정 패턴 (예시)

| 의견 | 수정 위치 |
|---|---|
| "콕 모달 타이틀 폰트 더 크게" | `screens/PokeModal.tsx` className |
| "강남 핀 위치 더 남쪽으로" | `data/regions.ts` y 좌표 |
| "primary 노랑이 너무 형광색" | `tailwind.config.ts` colors.primary |
| "일행 카드 회전이 어지러움" | `screens/RegionDetailScreen.tsx` rotate 적용 비율 |
| "콕 모달 슬라이드업 더 빠르게" | `screens/PokeModal.tsx` transition duration |

---

## 13. 성공 기준

- 데스크톱 브라우저(`localhost:5173`)에서 Storyboard 뷰가 한 화면에 들어오고 3개 화면이 동시 보인다
- Single Device 토글 시 map → region-detail → poke-modal 클릭 동선이 끊김 없이 동작한다
- MASTER.md의 컬러·라운드·그림자가 시각적으로 구현되어 있다 (눈으로 검수 가능)
- 토큰/좌표/카피 수정이 1~2개 파일 수정으로 끝나는 단순 구조다
