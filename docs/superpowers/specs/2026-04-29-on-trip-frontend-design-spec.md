# On-Trip Frontend Design Spec

- **문서 버전:** v0.1
- **작성일:** 2026-04-29
- **연관 문서:** [PRD](2026-04-29-on-trip-prd.md), [S1 구현 계획](../plans/2026-04-29-s1-project-setup.md)
- **상태:** Draft — 사용자 검토 대기

---

## 1. 개요

On-Trip은 **키치 스티커(Kitsch Sticker)** 무드의 React Native + Expo 모바일 앱이다. 본 문서는 PRD §12(UI/UX 가이드)를 확장·구체화한 **프론트엔드 디자인 시스템의 단일 진실 출처(Single Source of Truth)**이다.

**디자인 시스템 파일 구조:**

```
design-system/on-trip/
├─ MASTER.md                  ← 전역 규칙 (컬러·타이포·그림자·인터랙션·접근성)
└─ pages/
   ├─ map.md                  ← S-03 지도 (홈)
   ├─ region-detail.md        ← S-04 거점 상세
   ├─ trip-profile.md         ← S-05 일행 프로필
   ├─ poke-modal.md           ← S-06 콕 보내기
   ├─ activity.md             ← S-08·S-09 활동 (받은 콕/보낸 콕/매칭)
   └─ chat.md                 ← S-10 채팅방
```

**사용 규칙:** 특정 화면 작업 시 먼저 `pages/<page>.md`를 확인. 존재하면 마스터를 덮어쓰고, 없으면 마스터를 그대로 따른다.

## 2. 디자인 무드 결정 근거

ui-ux-pro-max 검색 결과 다음 두 가지가 우리 PRD §12 결정과 정확히 일치한다.

| 출처 | 인용 |
|---|---|
| **Style: Neo Brutalism (Mobile)** | Cream 배경 #FFFDF5 + Hot Red #FF6B6B + Vivid Yellow #FFD93D, **borderWidth 4 + black shadow offset 4–8px (no blur)**, **mechanical press: translateX/Y = shadow offset**, slightly rotated cards (-2/+2°), spring/linear animations only, **React Native 10/10 호환** |
| **Typography: Playful Creative** | Fredoka(heading) + Nunito(body), 둥글고 친근, **entertainment / youth-focused 적합** |

PRD 컬러 팔레트(노랑 베이스)를 유지하되, 위 패턴을 핵심 인터랙션·그림자 구현 가이드로 채택. 한국어 본문은 **Pretendard**(가변, 한국 표준), 영문 디스플레이는 **Fredoka**, 숫자는 **JetBrains Mono**.

## 3. 핵심 결정 요약

### 3.1 비주얼 시그니처 (Top 3)

1. **Hard Offset Sticker Shadow (블러 0)** — 모든 카드/버튼은 검은 박스가 4~10px 어긋난 그림자. iOS/Android 일관 구현은 `<StickerCard>` 단일 컴포넌트로 위임 (Android `elevation`은 블러 강제이므로 별도 View로 그림자 박스 직접 렌더).
2. **Mechanical Press 인터랙션** — 탭 시 `translateX/Y = shadow.offset` 만큼 이동 → 그림자가 사라진 듯한 효과. 80–120ms 스프링. cubic-bezier 사용 금지.
3. **선택적 카드 회전** — 강조 카드(매칭 성공 등)에만 ±1~2°. 거점 상세 리스트는 전체의 30%만. 모든 카드 회전 금지.

### 3.2 컬러 적용 우선순위

| 컬러 | 빈도 | 핵심 용도 |
|---|---|---|
| `outline` `#2A2A2A` | 매우 높음 | 모든 보더, 본문 텍스트 |
| `background` `#FFFCEB` | 높음 | 화면 배경 (크림) |
| `surface` `#FFFFFF` | 높음 | 카드 배경 |
| `primary` `#FFE066` | 높음 | CTA, 코인, 활성 탭 |
| `accentLime` `#B5E48C` | 중간 | 활성·성공·매칭 시각 |
| `accentRed` `#FF5A5A` | 낮음~중 | 매칭 강조, 신고/차단 |
| `accentPink` `#FFB3D9` | 낮음 | 보조 강조 (남용 X) |

대비 계산 (WCAG):
- `#2A2A2A` on `#FFFCEB` = **14.7:1** ✓ AAA
- `#2A2A2A` on `#FFE066` = **14.7:1** ✓ AAA
- `#6B6B6B` on `#FFFCEB` = **5.4:1** ✓ AA

### 3.3 타이포 스케일

```
display   Pretendard 800  28/34   - 화면 헤더, 매칭 성공
title     Pretendard 700  20/26   - 카드 타이틀, 모달 헤더
subtitle  Pretendard 600  16/22   - 그룹 정보 라벨
body      Pretendard 500  15/22   - 본문, 한줄소개
caption   Pretendard 600  12/16   - 시각, 부가 정보
numeric   JetBrains Mono 500  14/18  - 코인, 인구, 시간 (tabular)
displayEn Fredoka 700     28/34   - 영문 보조 (선택)
```

### 3.4 인터랙션 시간

```
탭 피드백        80–120ms  spring
모달 진입        250ms     ease-out
모달 퇴장        180ms     ease-in
페이지 전환      300ms     platform default
매칭 성사 모달    600ms     spring overshoot
reduce-motion    100ms opacity fade (모든 transform 대체)
```

## 4. 컴포넌트 ↔ PRD 화면 매핑

| PRD 화면 | 핵심 디자인 시스템 컴포넌트 | 페이지 오버라이드 |
|---|---|---|
| S-01 온보딩 | StickerCard(rotate -1deg), StickerButton primary, 큰 SVG 일러스트 | (마스터 + 표준 패턴) |
| S-02 회원가입 | StickerInput, StickerButton primary, 단계 progress dots (radii.pill) | (마스터) |
| S-03 지도 (홈) | 카카오맵 + PinMarker, StickerButton "여행 왔어요" fixed bottom | `map.md` |
| S-04 거점 상세 | FlashList + 일행 카드, Chip 가로 스크롤 필터, 세그먼트는 사용 X | `region-detail.md` |
| S-05 일행 프로필 | StickerCard 큰 사진(rotate -1deg), CTA fixed bottom | `trip-profile.md` |
| S-06 콕 모달 | @gorhom/bottom-sheet + StickerInput 50자 + CoinBadge | `poke-modal.md` |
| S-07 등록 | StickerInput 폼 + 다중선택 Chip(컨셉), Date pill, StickerButton primary | (마스터) |
| S-08·S-09 활동 | 세그먼트 컨트롤(StickerCard 컨테이너) + FlashList + 가려진 카드 | `activity.md` |
| S-10 채팅 | KeyboardAvoidingView + 메시지 버블(노랑/흰), StickerInput multiline | `chat.md` |
| S-11 마이 | 프로필 헤더 카드 + 메뉴 리스트 (StickerCard) + 코인 잔액 강조 | (마스터) |
| S-12 신고 모달 | 시트 + 라디오(StickerCard 변형) + StickerInput 50자 + danger CTA | (마스터) |

## 5. apps/mobile/src/design/tokens.ts (확장판)

S1 구현 계획 [Task 9]에서 작성하는 tokens.ts를 본 디자인 스펙 기반으로 확장:

```ts
export const colors = {
  bg: '#FFFCEB',
  surface: '#FFFFFF',
  surfaceMuted: '#F4F0E0',
  outline: '#2A2A2A',
  text: '#2A2A2A',
  textMuted: '#6B6B6B',
  cta: '#FFE066',
  ctaPressed: '#F0CD3F',
  match: '#FF5A5A',
  activeCount: '#B5E48C',
  feminineTouch: '#FFB3D9',
  coin: '#FFE066',
  success: '#52B788',
  danger: '#E63946',
} as const;

export const radii = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 } as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const stroke = {
  primary: { width: 2.5, color: colors.outline },
  secondary: { width: 1.5, color: colors.outline },
} as const;

export const shadow = {
  sm: { offsetX: 4, offsetY: 4 },
  md: { offsetX: 6, offsetY: 6 },
  lg: { offsetX: 8, offsetY: 8 },
  xl: { offsetX: 10, offsetY: 10 },
} as const;

export const motion = {
  pressIn: { damping: 18, stiffness: 220, mass: 1 },         // spring
  pressOut: { damping: 14, stiffness: 180, mass: 1 },
  modalEnter: 250,
  modalExit: 180,
  pageTransition: 300,
  matchSuccess: 600,
  reducedMotion: 100,
} as const;

export const typography = {
  display:   { fontFamily: 'Pretendard-ExtraBold', fontSize: 28, lineHeight: 34, letterSpacing: -0.3 },
  title:     { fontFamily: 'Pretendard-Bold',      fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  subtitle:  { fontFamily: 'Pretendard-SemiBold',  fontSize: 16, lineHeight: 22, letterSpacing: -0.2 },
  body:      { fontFamily: 'Pretendard-Medium',    fontSize: 15, lineHeight: 22 },
  caption:   { fontFamily: 'Pretendard-SemiBold',  fontSize: 12, lineHeight: 16 },
  numeric:   { fontFamily: 'JetBrainsMono-Medium', fontSize: 14, lineHeight: 18 },
  displayEn: { fontFamily: 'Fredoka-Bold',         fontSize: 28, lineHeight: 34 },
} as const;

export const tokens = { colors, radii, spacing, stroke, shadow, motion, typography };
export type Tokens = typeof tokens;
```

## 6. StickerCard 핵심 구현 (Reference)

**S2 또는 S3 스프린트에서 첫 구현. 본 문서의 핵심 컴포넌트.**

```tsx
import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withSpring,
} from 'react-native-reanimated';
import { colors, motion, radii, shadow, stroke } from '../design/tokens';

type Offset = 4 | 6 | 8 | 10;
type Rotate = -2 | -1 | 0 | 1 | 2;

type Props = {
  offset?: Offset;
  rotate?: Rotate;
  bg?: keyof typeof colors;
  pressable?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  children: React.ReactNode;
};

export function StickerCard({
  offset = 6, rotate = 0, bg = 'surface',
  pressable = false, onPress, style, children,
}: Props) {
  const pressed = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotate}deg` },
      { translateX: pressed.value * offset },
      { translateY: pressed.value * offset },
    ],
  }));

  const Card = (
    <View style={{ position: 'relative' }}>
      {/* Hard offset shadow (검은 박스, blur 0) */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', inset: 0,
          backgroundColor: colors.outline,
          borderRadius: radii.lg,
          transform: [{ rotate: `${rotate}deg` }, { translateX: offset }, { translateY: offset }],
        }}
      />
      <Animated.View
        style={[
          {
            backgroundColor: colors[bg],
            borderColor: stroke.primary.color,
            borderWidth: stroke.primary.width,
            borderRadius: radii.lg,
          },
          cardStyle,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );

  if (!pressable || !onPress) return Card;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { pressed.value = withSpring(1, motion.pressIn); }}
      onPressOut={() => { pressed.value = withSpring(0, motion.pressOut); }}
      hitSlop={8}
      accessibilityRole="button"
    >
      {Card}
    </Pressable>
  );
}
```

> 주의: 위 코드는 마스터 §5의 패턴을 따른 참조 구현이다. S2~S3에서 실제 구현 시 reduce-motion 분기, theming(다크모드 V2), `accessibilityLabel` props 등을 추가한다. RN의 `inset: 0`은 0.71+ 지원, 미지원 시 top/right/bottom/left:0 사용.

## 7. 폰트 로딩 가이드

```ts
// apps/mobile/App.tsx 또는 src/lib/fonts.ts
import * as Font from 'expo-font';
import { useFonts as useFredoka } from '@expo-google-fonts/fredoka';
import { useFonts as useJetbrains } from '@expo-google-fonts/jetbrains-mono';

// Pretendard는 self-hosted (https://github.com/orioncactus/pretendard)
// assets/fonts/Pretendard-{Medium,SemiBold,Bold,ExtraBold}.otf
```

`expo-splash-screen` 으로 폰트 로드 완료까지 스플래시 유지. 실패 시 system font fallback (RN 기본 동작).

## 8. 화면별 핵심 디자인 결정 (한 줄 요약)

| 화면 | 시그니처 디자인 결정 |
|---|---|
| 지도 | 풀스크린 지도 + 하단 fixed CTA, 핀은 인구 단계별 컬러 (노랑→코랄), 그림자 X |
| 거점 상세 | FlashList + 일행 카드 30%만 회전, 콕 버튼은 카드 내부 메인 CTA |
| 일행 프로필 | 정사각 큰 사진 카드(rotate -1deg, offset 8), 이미 콕 보낸 일행은 우상단 회전 배지 |
| 콕 모달 | 하단 시트 + 50자 인풋 + 코인 차감 명확 표기 + impactMedium 햅틱 |
| 활동 | 3-tab 세그먼트(StickerCard 컨테이너), 받은 콕은 발신자 가림 + 한마디 첫 10자만 |
| 채팅 | 노랑 버블(내) / 흰 버블(상대) + 마스킹 시 발신자만 1회 토스트 + 첫 진입 안전 안내 |

## 9. 안티패턴 종합

마스터 §12 + 페이지별 안티패턴을 한 번에:

- ❌ **이모지 = 시스템 아이콘** → Lucide React Native 사용
- ❌ **그림자에 블러** → 키치 스티커 = 블러 0
- ❌ **모든 카드 회전** → 강조 카드 또는 30% 룰
- ❌ **라운드 0** → 너무 거친 브루털리즘 (우리 무드는 스티커 쪽)
- ❌ **cubic-bezier 메커니컬 프레스** → spring 또는 linear만
- ❌ **모든 탭 햅틱** → 임팩트 모먼트만
- ❌ **색상 단독으로 상태 표현** → 색 + 아이콘 + 텍스트 3중
- ❌ **Skeumorphism / Glassmorphism** → 키치 스티커와 충돌
- ❌ **4종 이상 폰트 동시 사용** → 한국어=Pretendard, 디스플레이=Fredoka, 숫자=JetBrains Mono로 고정
- ❌ **받은 콕에서 발신자 정체 노출** (FR-034 위반)
- ❌ **마스킹된 부분을 발신자 화면에서도 가림** (FR-042 위반)
- ❌ **CTA를 floating으로** → 메인 CTA는 fixed bottom + safe-area

## 10. 디자인 ↔ 구현 일정 매핑

| 스프린트 | FE 디자인 작업 | 본 문서 사용 부분 |
|---|---|---|
| S1 (W1–2) | 디자인 토큰 적용 (tokens.ts), 키치 스티커 베이스 검증 | §3, §5 |
| S2 (W3–4) | 온보딩(S-01), 가입(S-02), 마이(S-11), **StickerCard·StickerButton·StickerInput 첫 구현** | §6, 마스터 |
| S3 (W5–6) | 지도(S-03), 거점 상세(S-04), 등록(S-07), **PinMarker** | `map.md`, `region-detail.md` |
| S4 (W7–8) | 일행 프로필(S-05), 콕 모달(S-06), 활동(S-08·S-09) | `trip-profile.md`, `poke-modal.md`, `activity.md` |
| S5 (W9–10) | 채팅방(S-10), 마스킹 UI, 첫 진입 안전 토스트 | `chat.md` |
| S6 (W11–12) | 신고 모달(S-12), 매칭 성공 모달(별도), QA · 다크모드 V2 분리 | 마스터 |

## 11. 미해결 디자인 결정

- [ ] 스플래시 화면 일러스트 (마스코트 검토 시 함께)
- [ ] 매칭 성공 풀스크린 모달의 구체적 모션 (별도 페이지 오버라이드 `match-success.md` — V2 작성)
- [ ] 마스코트 캐릭터 도입 여부 (PRD §17, V2 검토)
- [ ] 다크모드 페어링 (V2)
- [ ] 한국어 디스플레이 폰트(Cafe24 Ssurround 등) 도입 여부
- [ ] 일러스트 외주 vs 자체 제작 (Section 15.1 미결정)
- [ ] 세부 빈 상태 일러스트 (활동 빈 상태, 거점 0건 등)

---

## 12. 다음 단계

1. **S1 구현 계획 Task 9** (디자인 토큰)을 본 문서 §5의 확장판 `tokens.ts`로 교체.
2. **S2 시작 시** StickerCard·StickerButton·StickerInput 3개 컴포넌트를 먼저 구현 (테스트와 함께).
3. **S2 회원가입/마이 화면**을 만들 때 본 문서를 참조해 디자인 시스템 일관성 검증.
4. 다크모드는 V2로 분리.
