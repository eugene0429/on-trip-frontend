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
pnpm mobile:start    # Expo dev server
```

## 디자인 검수

별도 웹 목업으로 디자인을 검수합니다.

```bash
cd mockup
npm install
npm run dev          # http://localhost:5173 (또는 5174)
```

자세한 디자인 시스템: [`design-system/on-trip/MASTER.md`](design-system/on-trip/MASTER.md)
