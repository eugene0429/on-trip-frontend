# On-Trip Design System — MASTER (Source of Truth)

> **LOGIC:** When building a specific page, first check `design-system/on-trip/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file. If not, strictly follow the rules below.

> **Updated:** 2026-04-29
> **Style:** Kitsch Sticker (Neo Brutalism Mobile 기반 변형)
> **Stack:** React Native + Expo + TypeScript

---

## 1. 디자인 철학

키치 스티커 = **굵은 검은 라인 + 비비드 컬러 + 하드 오프셋 그림자(블러 0)** + **약간 기울어진 카드** + **메커니컬 프레스 인터랙션(translate = shadow offset)**.

여행 앱의 풋풋함은 **둥근 라운드 코너 + 스티커 텍스처 + 가벼운 회전(-2°~+2°)** 으로 표현. 데이팅 앱 색채를 누르고 SNS·Z세대 친화적인 키치 무드를 유지합니다.

**Performance 주의 (Neo Brutalism 변형이므로):** 카드 수가 많아지면 그림자·transform이 부담. FlashList + memoization 필수.

---

## 2. 컬러 토큰

### 2.1 코어 팔레트 (PRD 확정)

| 역할 | Hex | 용도 |
|---|---|---|
| `primary` | `#FFE066` | 노랑 — 주요 CTA 배경, 콕 버튼 |
| `accentRed` | `#FF5A5A` | 코랄 — 매칭 성사, 위험/중요 강조 |
| `accentLime` | `#B5E48C` | 라임 — 성공, 활성 인구 표시 |
| `accentPink` | `#FFB3D9` | 핑크 — 보조 강조, 여성 친화 톤 |
| `outline` | `#2A2A2A` | 소프트 블랙 — 모든 보더 + 텍스트 |
| `background` | `#FFFCEB` | 크림 화이트 — 메인 배경 |
| `surface` | `#FFFFFF` | 카드/시트 배경 |
| `surfaceMuted` | `#F4F0E0` | 비활성 카드/입력 배경 |
| `textSecondary` | `#6B6B6B` | 보조 텍스트 |
| `success` | `#52B788` | 활성/완료 |
| `danger` | `#E63946` | 신고/차단/만료 |

### 2.2 Semantic 토큰

```ts
// apps/mobile/src/design/tokens.ts
colors.bg              = #FFFCEB
colors.surface         = #FFFFFF
colors.outline         = #2A2A2A
colors.text            = #2A2A2A
colors.textMuted       = #6B6B6B
colors.cta             = #FFE066
colors.ctaPressed      = #F0CD3F
colors.match           = #FF5A5A
colors.activeCount     = #B5E48C
colors.feminineTouch   = #FFB3D9
colors.coin            = #FFE066    // 코인 강조도 노랑 베이스
colors.success         = #52B788
colors.danger          = #E63946
```

### 2.3 다크모드 (V2 — 미구현)

마스터 라이트 모드 우선 출시. 다크 페어링은 V2에서 별도 페이지 오버라이드로 추가.

---

## 3. 타이포그래피

| Role | Font | Weight | Size / Line Height |
|---|---|---|---|
| `display` | Pretendard | 800 | 28 / 34 |
| `title` | Pretendard | 700 | 20 / 26 |
| `subtitle` | Pretendard | 600 | 16 / 22 |
| `body` | Pretendard | 500 | 15 / 22 |
| `caption` | Pretendard | 600 | 12 / 16 |
| `numeric` | JetBrains Mono | 500 | 14 / 18 (코인·인구·시간) |
| `displayEn` | Fredoka | 700 | 28 / 34 (영문 헤더 보조, 선택적) |

**규칙:**
- 본문 최소 15px (모바일 자동 줌 방지엔 16px도 OK).
- letter-spacing은 -0.2~-0.3 한글 본문에 살짝 (Pretendard 권장값).
- **숫자/코인/시간은 JetBrains Mono** — 레이아웃 시프트 방지 (tabular figures).
- 영문은 한 디자인 안에서 Fredoka(둥글고 친근) 또는 Pretendard 통일 — 섞지 말 것.

**한국어 전용 디스플레이 (선택):** 큰 슬로건/홈히어로/매칭 성공 화면 등 감정 포인트에 한정해서 **Cafe24 Ssurround / 산돌 그레타** 같은 둥근 한글 디스플레이 폰트 검토 (V2).

**라이선스:** Pretendard·Fredoka·JetBrains Mono 모두 무료(Open Font License). expo-font + self-hosted 또는 `@expo-google-fonts/*`.

---

## 4. 형태 (Shape)

| Token | Value | 용도 |
|---|---|---|
| `radii.sm` | 8 | 작은 칩, 토스트 |
| `radii.md` | 14 | 입력, 작은 카드, 리스트 셀 |
| `radii.lg` | 20 | 일행 카드, 모달, 시트 |
| `radii.xl` | 28 | 메인 CTA 버튼 |
| `radii.pill` | 999 | 칩, 배지 |

**라운드 정책:** 키치 스티커는 0 라운드(브루털리즘)와 풀 라운드(스티커)가 공존. 본 시스템은 스티커 쪽으로 기울임 — 입력은 14, 카드는 20, CTA는 28. **0 라운드는 사용 안 함**.

**보더(Stroke):** 모든 인터랙티브/주요 컨테이너는 `borderWidth: 2.5`, `borderColor: outline`. 보조 컨테이너는 1.5.

---

## 5. 그림자 (Hard Offset Sticker Shadow)

키치 스티커의 핵심. **블러 0**, 단색 검은 박스가 카드 뒤에 4~10px 어긋나 있는 형태.

### 5.1 구현 (React Native)

iOS의 `shadowOffset`은 `shadowRadius:0`, `shadowOpacity:1`, `shadowColor: outline`로 처리하면 가까운 효과. Android는 `elevation`이 블러를 강제하므로 **별도 View로 그림자 박스를 직접 렌더**해야 동일한 결과가 나옵니다.

**전용 컴포넌트 패턴 (StickerCard):** 검은 박스(absolute, 같은 크기, translate offset/offset) + 흰 박스(같은 크기) 위에 children.

### 5.2 토큰

| Token | Offset | 용도 |
|---|---|---|
| `shadow.sm` | 4/4 | 작은 칩, 토스트 |
| `shadow.md` | 6/6 | 일반 카드, 입력 |
| `shadow.lg` | 8/8 | 메인 CTA, 모달 |
| `shadow.xl` | 10/10 | 매칭 성사 모달 (감정 강조) |

**Pressed 상태:** `translateX/Y` 를 shadow offset과 동일하게 이동시켜 **그림자가 사라진 듯한 메커니컬 프레스** 효과. §7 참조.

---

## 6. 스페이싱 + 그리드

| Token | Value (dp) |
|---|---|
| `xs` | 4 |
| `sm` | 8 |
| `md` | 12 |
| `lg` | 16 |
| `xl` | 24 |
| `xxl` | 32 |
| `xxxl` | 48 |

- 4/8dp 리듬 엄수 (Material 표준).
- 컨테이너 horizontal padding: 모바일 16dp, 큰 화면 24dp.
- 섹션 간 vertical gap: 24~32dp.
- 카드 내부 padding: 16dp (sm 카드는 12dp).

---

## 7. 인터랙션 패턴

### 7.1 Mechanical Press (핵심)

모든 탭 가능한 카드/버튼은 누르는 동안 그림자 offset 만큼 이동 → 그림자가 시각적으로 사라짐 → 손가락 뗌 → 원위치.

```ts
// useAnimatedStyle (reanimated v3)
const pressed = useSharedValue(0);
const style = useAnimatedStyle(() => ({
  transform: [
    { translateX: pressed.value * 6 },
    { translateY: pressed.value * 6 },
  ],
}));
// onPressIn: pressed.value = withSpring(1, { damping: 18, stiffness: 220 })
// onPressOut: pressed.value = withSpring(0)
```

**Duration:** 80–120ms. 스프링 또는 선형 (cubic-bezier 사용 금지).

### 7.2 카드 회전

리스트 카드 중 일부에 `transform: [{ rotate: '-1deg' }]` 또는 `'1deg'`를 결정론적으로 적용 (id 해시 기반). **모든 카드 회전 금지** — 강조 카드(매칭 성사 등)에만.

### 7.3 햅틱 (Expo Haptics)

다음 순간에만 가벼운 햅틱:
- 콕 발사 성공: `impactMedium`
- 매칭 성사 모달 진입: `notificationSuccess`
- 신고/차단 확정: `impactHeavy`
- 일반 탭: **사용 안 함** (피로감)

### 7.4 모달/시트

- 콕 모달, 매칭 모달: 하단에서 슬라이드 업 + 외부 스크림 40~50% 검정.
- 모달 내부 그림자는 `shadow.lg` ~ `shadow.xl`.
- 닫기는 ① 외부 탭 ② 시트 핸들 스와이프 다운 ③ 우상단 X 버튼 — 셋 다 제공.

### 7.5 애니메이션 시간

| 종류 | Duration | Easing |
|---|---|---|
| 마이크로 (탭 피드백) | 80–120 ms | spring |
| 일반 (모달 진입) | 250 ms | ease-out |
| 일반 (모달 퇴장) | 180 ms | ease-in (퇴장은 진입의 70%) |
| 페이지 전환 | 300 ms | platform default |
| 매칭 성사 (특수) | 600 ms | spring with overshoot |

**reduce-motion** 활성 시 모든 transform 애니메이션 → opacity 페이드 100ms로 대체.

---

## 8. 컴포넌트 카탈로그

### 8.1 StickerCard

```ts
type StickerCardProps = {
  offset?: 4 | 6 | 8 | 10;       // shadow offset
  rotate?: -2 | -1 | 0 | 1 | 2;
  bg?: keyof Colors;
  pressable?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
};
```

핵심 컴포넌트. 모든 카드/버튼/모달 컨테이너의 베이스.

### 8.2 StickerButton

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| `primary` | `#FFE066` | outline | outline 2.5 | 메인 CTA |
| `secondary` | `#FFFFFF` | outline | outline 2.5 | 보조 |
| `danger` | `#FF5A5A` | white | outline 2.5 | 신고/차단 |
| `ghost` | transparent | outline | outline 1.5 | 텍스트 링크형 |
| `disabled` | `surfaceMuted` | textSecondary | outline 1.5 (점선) | 비활성 |

**Height:** 56dp (메인), 48dp (작은 폼), 36dp (인라인). 가로 padding 24dp.

### 8.3 StickerInput

흰 배경 + outline 2.5 + radii.md(14). 포커스 시 outline 컬러를 `accentRed`로 변경 (대비 큼). 라벨은 위에 배치, placeholder는 보조 힌트.

### 8.4 Chip

`radii.pill` + `outline 2px` + 작은 그림자(2/2). 컨셉 태그(맛집/술자리/액티비티), 인구 카운트 등.

### 8.5 CoinBadge

노랑 원형 + outline + 코인 숫자 (JetBrains Mono). 콕 버튼 옆, 마이 페이지, 결제 직전 등에 일관 사용.

### 8.6 PinMarker (지도)

지도 핀의 모양:
- 원형 백그라운드 (인구수에 비례한 크기, 32~64dp)
- outline 2.5px
- 중앙: 인구 숫자 (JetBrains Mono Bold)
- 거점명은 핀 아래 작은 칩으로

색상: 인구가 많을수록 노랑 → 코랄로 그라데이션 단계 (3 단계).

---

## 9. 화면 패턴

### 9.1 네비게이션 구조

- **Bottom Tab (3개):** Map (홈) / Activity (활동) / My (마이)
- 매칭 성사 채팅방, 모달은 모두 stack 푸시.
- 탭 아이콘: Lucide React Native (`map-pin`, `bell` + 뱃지, `user`).
- 활성 탭: outline 컬러 + 라벨 굵음 + 작은 노랑 점.

### 9.2 헤더

기본 stack 헤더는 사용 X — 키치 무드와 안 맞음. 화면별로 자체 헤더 (페이지 오버라이드 참조). 공통 패턴:
- 좌측: 뒤로가기 (Lucide `arrow-left`, hitSlop 10)
- 중앙: 화면 타이틀 (display)
- 우측: 보조 액션

### 9.3 빈 상태 (Empty State)

모든 빈 화면은:
- 큰 일러스트(스티커 캐릭터 — V2 마스코트 진입점) 또는 큰 SVG 아이콘
- 공감 카피 ("아직 콕 받지 않았어요!")
- CTA 버튼 ("다른 일행 찾아보기")

---

## 10. 접근성 (Required)

- **터치 타깃 ≥ 44pt**, 작은 아이콘은 `hitSlop`.
- **대비:** 본문 텍스트 4.5:1 이상. 노랑 배경(`#FFE066`) + 검정 텍스트(`#2A2A2A`) = 14.7:1 ✓. 회색 보조 텍스트(`#6B6B6B`) on 크림 배경(`#FFFCEB`) = 5.4:1 ✓.
- **포커스 링:** Pressable에 `accessibilityRole="button"` + `accessibilityLabel` 필수.
- **VoiceOver:** 매칭 성사 시 `accessibilityLiveRegion="polite"` (Android) / `accessibilityLabel` 동적 갱신.
- **Dynamic Type:** 본문 폰트는 `allowFontScaling` 유지. 디스플레이는 max scale clamp.
- **prefers-reduced-motion:** §7.5 참조.
- **색상 단독 의미 금지:** 매칭/신고/거절 같은 상태는 색 + 아이콘 + 텍스트 3중 표시.

---

## 11. 성능 가드

- 리스트(거점 상세, 활동 목록): **FlashList** + 아이템 `React.memo` + 안정 `keyExtractor`.
- 그림자 비싼 만큼 한 화면 동시 노출 카드 ≤ 8개 (가상화로 컨트롤).
- 이미지: `expo-image` (자동 캐시, WebP).
- 애니메이션: **react-native-reanimated v3** (`useSharedValue`, `useAnimatedStyle`) — JS 스레드 차단 0.
- 제스처: **react-native-gesture-handler** (모달 스와이프 다운).
- 60fps 유지: 한 프레임 렌더 ≤ 16ms.

---

## 12. 안티패턴

- ❌ 이모지를 시스템 아이콘으로 사용 (Lucide SVG 사용)
- ❌ 그림자 블러 적용 (키치 스티커 = 블러 0)
- ❌ 카드 모두에 회전 적용 (어지럼증)
- ❌ 라운드 0 컨테이너 (브루털리즘 → 우리 무드 아님)
- ❌ Cubic-bezier로 메커니컬 프레스 (스프링/선형만)
- ❌ 햅틱 남발
- ❌ 색만으로 상태 표현
- ❌ Skeumorphism / Glassmorphism
- ❌ 4종 이상 폰트 동시 사용

---

## 13. 추천 라이브러리

| 목적 | 라이브러리 |
|---|---|
| 애니메이션 | `react-native-reanimated@3` |
| 제스처 | `react-native-gesture-handler` |
| 리스트 | `@shopify/flash-list` |
| 아이콘 | `lucide-react-native` |
| 폰트 | `expo-font` + Pretendard self-hosted, `@expo-google-fonts/fredoka`, `@expo-google-fonts/jetbrains-mono` |
| 이미지 | `expo-image` |
| 햅틱 | `expo-haptics` |
| Safe Area | `react-native-safe-area-context` |
| Bottom Sheet | `@gorhom/bottom-sheet` |

---

## 14. Pre-Delivery Checklist

- [ ] 모든 인터랙티브 요소가 mechanical press 패턴 적용
- [ ] StickerCard 컴포넌트 1개로 모든 카드 구현
- [ ] 회전은 강조 카드에만 적용 (남용 X)
- [ ] 본문 최소 15px, 노랑 배경 + 검정 텍스트 대비 확인
- [ ] hitSlop 적용 (작은 아이콘 32px 미만)
- [ ] Lucide 아이콘만 사용 (이모지 금지)
- [ ] safe-area-context 모든 화면 적용
- [ ] FlashList + 아이템 memoization
- [ ] reanimated v3로 애니메이션
- [ ] reduce-motion 분기 처리
- [ ] accessibilityLabel 모든 인터랙티브 요소
- [ ] 다크모드 — V2 (현재 라이트 only)
