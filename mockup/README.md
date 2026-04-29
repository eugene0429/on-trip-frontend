# On-Trip Mockup — Web Preview

S1 본격 개발 전 디자인 톤·레이아웃·핵심 동선을 검수하기 위한 throwaway 웹 목업.

**스펙:** [`docs/superpowers/specs/2026-04-29-on-trip-mockup-web-preview-design.md`](../docs/superpowers/specs/2026-04-29-on-trip-mockup-web-preview-design.md)

## 실행

```bash
cd mockup
npm install        # 또는 pnpm install
npm run dev        # 또는 pnpm dev
```

브라우저: <http://localhost:5173> (포트 점유 시 5174 등으로 자동 변경)

## 두 가지 뷰 모드

- **Storyboard (기본)**: 디바이스 3개 가로 정렬 — Map / Region Detail / Poke Modal — 디자인 흐름을 한눈에 보기. 디바이스 클릭 시 Single Device로 진입.
- **Single Device**: 핀 탭 → Region Detail → 콕 모달 클릭 동선이 실제로 동작.

## 검수 후 수정 가이드

| 의견 종류 | 수정 위치 |
|---|---|
| 색상 토큰 (primary 노랑이 형광) | `tailwind.config.ts` colors.* + `src/tokens.ts` |
| 핀 위치/인구 | `src/data/regions.ts` |
| 일행 카피/태그 | `src/data/companions.ts` |
| 화면별 레이아웃 | `src/screens/*.tsx` |
| 모달 슬라이드업 속도 | `src/screens/PokeModal.tsx` transition duration |
| 회전 강도 | `src/components/StickerCard.tsx` 또는 화면에서 rotate prop |

## 범위

**포함:** Map / Region Detail / Poke Modal 3개 화면, 8개 공용 컴포넌트, mock 데이터.

**제외:** 카카오맵 SDK, 백엔드, 인증, mechanical press 애니메이션, 햅틱, activity / chat / trip-profile 화면, 다크모드, 모바일 실기 테스트.

## S1과의 관계

`mockup/`은 본 모노레포 (`apps/backend`, `apps/mobile`)와 분리된 자체 Vite 프로젝트입니다. S1의 `pnpm-workspace.yaml`이 `packages: ['apps/*', 'packages/*']`로 한정되므로 자동 제외됩니다.

디자인이 픽스되면 `mockup/`은 그대로 두거나(참고용) 삭제. 토큰 값은 `src/tokens.ts` → `apps/mobile/src/design/tokens.ts`로 옮길 때 형식만 RN StyleSheet에 맞게 변환합니다.
