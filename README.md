# On-Trip

여행 중 같은 지역에 있는 일행을 지도 위 인구 핀으로 발견하고, "콕"으로 매칭하는 모바일 앱.

## 모노레포 구조

```
on-trip/
├─ apps/
│  └─ mobile/         Expo + RN + TypeScript
├─ packages/
│  └─ shared/         BE OpenAPI codegen 산출물 자리 (S1 후반부 채움)
├─ mockup/            디자인 검수용 웹 목업 (Vite + React, throwaway)
├─ docs/              스펙 + 플랜
└─ design-system/     디자인 시스템 마크다운 (단일 출처)
```

`apps/backend/` 와 `compose.yml` 은 BE 팀원이 합류 시 추가됩니다.

## 사전 요구

- Node 20 (`.nvmrc` 참조)
- pnpm 9+

## 시작

```bash
pnpm install
```

### FE 단독 검수 — 두 가지 방법

**A. 웹 브라우저 (가장 빠름, 데스크톱)**

```bash
pnpm --filter mobile run web    # http://localhost:8081 (또는 8082)
```

react-native-web 으로 렌더 — 레이아웃·색·타이포는 거의 동일. 일부 네이티브 효과(메커니컬 프레스 등)는 근사치.

**B. 폰 (Expo Go) — 정확한 RN UI**

1. Play Store / App Store 에서 "Expo Go" 설치
2. `pnpm mobile:start` → 터미널에 QR 코드 출력
3. 폰으로 QR 스캔 (Android: Expo Go 앱 / iOS: 카메라)
4. 폰과 PC 가 같은 Wi-Fi 에 있어야 함

## 디자인 시안 검수 (mockup)

본 RN 앱과 별개의 웹 목업 — 디자인 픽스 및 의견 수렴 단계용.

```bash
cd mockup
npm install
npm run dev          # http://localhost:5173 (또는 5174)
```

자세한 디자인 시스템: [`design-system/on-trip/MASTER.md`](design-system/on-trip/MASTER.md)
