# On-Trip Mockup Web Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** S1 본격 개발 전 디자인 검수용 throwaway 웹 목업 — Map / Region Detail / Poke Modal 3개 화면을 Vite + React + Tailwind로 구현하고 Storyboard 뷰 + Single Device 토글로 검수 가능하게 만든다.

**Architecture:** `mockup/` 디렉토리에 본 모노레포와 분리된 자체 Vite 프로젝트. `tailwind.config.ts`로 키치 스티커 토큰 1:1 매핑. 화면 라우팅은 `useState` 두 개(viewMode, currentScreen)로 단순 처리. 카카오맵은 정적 placeholder로 대체.

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind CSS 3, lucide-react, Pretendard/JetBrains Mono (CDN).

**Spec:** [docs/superpowers/specs/2026-04-29-on-trip-mockup-web-preview-design.md](../specs/2026-04-29-on-trip-mockup-web-preview-design.md)

---

## File Structure

```
mockup/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ tsconfig.node.json
├─ tailwind.config.ts
├─ postcss.config.js
├─ .gitignore
├─ public/
│  └─ seoul-map.svg              placeholder 지도 (CSS-그려진 SVG)
├─ src/
│  ├─ main.tsx                   React 진입점
│  ├─ App.tsx                    뷰 모드 + 화면 라우팅 state
│  ├─ index.css                  Tailwind directives + 폰트 import
│  ├─ tokens.ts                  JS 토큰 export (Tailwind config와 1:1)
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

`mockup/`은 본 레포의 `pnpm-workspace.yaml`(추후 S1에서 생성)에 포함되지 않도록 `.gitignore`로 제외하지 않고 그대로 커밋한다. 워크스페이스 분리는 S1의 `packages: ['apps/*', 'packages/*']` 제한으로 자연 분리.

**Verification 패턴:** 각 컴포넌트 단위 테스트는 throwaway 프로젝트 특성상 생략. 대신 `pnpm typecheck` (TypeScript 컴파일 검증) + `pnpm dev` (브라우저 시각 확인)을 verification 수단으로 사용. 빌드(`pnpm build`)는 마지막에 한 번 검증.

---

## Task 1: 프로젝트 스캐폴드 + Vite 셋업

**Files:**
- Create: `mockup/package.json`
- Create: `mockup/vite.config.ts`
- Create: `mockup/tsconfig.json`
- Create: `mockup/tsconfig.node.json`
- Create: `mockup/index.html`
- Create: `mockup/.gitignore`
- Create: `mockup/src/main.tsx`
- Create: `mockup/src/App.tsx`

- [ ] **Step 1.1: 디렉토리 생성**

```bash
mkdir -p mockup/src mockup/public
```

- [ ] **Step 1.2: `mockup/package.json`**

```json
{
  "name": "on-trip-mockup",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "typecheck": "tsc -b --noEmit",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.460.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vite": "^5.4.10"
  }
}
```

- [ ] **Step 1.3: `mockup/vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
});
```

- [ ] **Step 1.4: `mockup/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 1.5: `mockup/tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 1.6: `mockup/index.html`**

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>On-Trip Mockup</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 1.7: `mockup/.gitignore`**

```
node_modules
dist
.DS_Store
*.local
```

- [ ] **Step 1.8: `mockup/src/main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 1.9: `mockup/src/App.tsx` (placeholder)**

```tsx
export default function App() {
  return <div style={{ padding: 24 }}>On-Trip Mockup — scaffolding OK</div>;
}
```

- [ ] **Step 1.10: 의존성 설치 + dev 서버 기동 확인**

```bash
cd mockup && pnpm install
```

(pnpm 없으면 `npm install`. 이하 모든 단계 동일.)

```bash
cd mockup && pnpm dev
```

브라우저 `http://localhost:5173` 열어 "On-Trip Mockup — scaffolding OK" 표시 확인. 종료 후 다음 단계로.

- [ ] **Step 1.11: 타입체크 통과 확인**

```bash
cd mockup && pnpm typecheck
```

Expected: 에러 없음.

- [ ] **Step 1.12: Commit**

```bash
git add mockup/
git commit -m "chore(mockup): scaffold Vite + React + TS project"
```

---

## Task 2: Tailwind + 디자인 토큰 + 폰트

**Files:**
- Create: `mockup/tailwind.config.ts`
- Create: `mockup/postcss.config.js`
- Create: `mockup/src/index.css`
- Create: `mockup/src/tokens.ts`
- Modify: `mockup/src/main.tsx` (import index.css)
- Modify: `mockup/src/App.tsx` (smoke test for tokens)

- [ ] **Step 2.1: `mockup/tailwind.config.ts`**

MASTER.md §2 컬러, §4 라운드, §5.2 그림자, §6 스페이싱, §3 폰트 1:1 매핑.

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
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
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
        pill: '999px',
      },
      boxShadow: {
        'sticker-xs': '2px 2px 0 0 #2A2A2A',
        'sticker-sm': '4px 4px 0 0 #2A2A2A',
        'sticker-md': '6px 6px 0 0 #2A2A2A',
        'sticker-lg': '8px 8px 0 0 #2A2A2A',
        'sticker-xl': '10px 10px 0 0 #2A2A2A',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 2.2: `mockup/postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 2.3: `mockup/src/index.css`**

Pretendard와 JetBrains Mono를 CDN(@font-face) 임포트. Pretendard는 cdn.jsdelivr.net의 공식 CSS, JetBrains Mono는 Google Fonts.

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root {
  height: 100%;
}
body {
  font-family: 'Pretendard', system-ui, sans-serif;
  letter-spacing: -0.2px;
  background: #F4F0E0;
  color: #2A2A2A;
}
```

- [ ] **Step 2.4: `mockup/src/tokens.ts`**

JS 측에서도 토큰을 참조할 수 있도록 export. PinMarker 색상 단계 등 동적 계산에 사용.

```ts
export const colors = {
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
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const shadowOffsets = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
} as const;
```

- [ ] **Step 2.5: `mockup/src/main.tsx` 수정 — index.css 임포트**

`main.tsx` 상단에 한 줄 추가:

```tsx
import './index.css';
```

- [ ] **Step 2.6: `mockup/src/App.tsx` 수정 — 토큰 smoke test**

크림 배경 위에 노랑 카드(primary) + outline 보더 + sticker 그림자, 그리고 JetBrains Mono 숫자가 표시되는 것을 확인.

```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center font-sans">
      <div className="bg-primary border-[2.5px] border-outline rounded-xl shadow-sticker-md p-6">
        <div className="text-[20px] font-bold text-outline">키치 스티커 토큰 OK</div>
        <div className="font-mono text-outline mt-2">42 코인</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2.7: 시각 확인**

```bash
cd mockup && pnpm dev
```

브라우저에서:
- 배경이 크림(`#FFFCEB`)인 것은 보장 안 됨(body는 surfaceMuted), 카드 영역만 cream — 그래도 무관, smoke test임
- 노랑 박스 + 검정 보더 + 우하단 검정 하드 그림자(블러 0)
- 본문 폰트: Pretendard, "42 코인" 폰트: JetBrains Mono (등폭)

확인 후 dev 서버 종료.

- [ ] **Step 2.8: 타입체크 + Commit**

```bash
cd mockup && pnpm typecheck
```

Expected: 에러 없음.

```bash
git add mockup/tailwind.config.ts mockup/postcss.config.js mockup/src/index.css mockup/src/tokens.ts mockup/src/main.tsx mockup/src/App.tsx
git commit -m "feat(mockup): wire Tailwind with kitsch sticker design tokens"
```

---

## Task 3: StickerCard 컴포넌트

**Files:**
- Create: `mockup/src/components/StickerCard.tsx`
- Modify: `mockup/src/App.tsx` (smoke test)

- [ ] **Step 3.1: `mockup/src/components/StickerCard.tsx`**

`offset` prop은 토큰 키(`xs/sm/md/lg/xl`) 기반. `rotate`는 -2~2 정수, `bg`는 Tailwind 색상 키. `pressable=true`이면 클릭 시 80ms translate offset 만큼 이동(메커니컬 프레스 근사).

```tsx
import { ReactNode, useState } from 'react';

type Offset = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Rotate = -2 | -1 | 0 | 1 | 2;

const SHADOW_BY_OFFSET: Record<Offset, string> = {
  xs: 'shadow-sticker-xs',
  sm: 'shadow-sticker-sm',
  md: 'shadow-sticker-md',
  lg: 'shadow-sticker-lg',
  xl: 'shadow-sticker-xl',
};

const TRANSLATE_BY_OFFSET: Record<Offset, number> = {
  xs: 2, sm: 4, md: 6, lg: 8, xl: 10,
};

export type StickerCardProps = {
  offset?: Offset;
  rotate?: Rotate;
  bg?: string;          // Tailwind 색상 키 (예: 'bg-primary'), 미지정 시 surface
  border?: 'normal' | 'thin'; // normal=2.5, thin=1.5
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'pill';
  pressable?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
};

export default function StickerCard({
  offset = 'md',
  rotate = 0,
  bg = 'bg-surface',
  border = 'normal',
  rounded = 'lg',
  pressable = false,
  onClick,
  className = '',
  children,
}: StickerCardProps) {
  const [pressed, setPressed] = useState(false);
  const translate = pressed ? TRANSLATE_BY_OFFSET[offset] : 0;
  const borderClass = border === 'normal' ? 'border-[2.5px]' : 'border-[1.5px]';
  const roundedClass = `rounded-${rounded}`;
  const shadowClass = pressed ? '' : SHADOW_BY_OFFSET[offset];

  const handleDown = () => pressable && setPressed(true);
  const handleUp = () => pressable && setPressed(false);

  return (
    <div
      role={pressable ? 'button' : undefined}
      tabIndex={pressable ? 0 : undefined}
      className={`${bg} ${borderClass} border-outline ${roundedClass} ${shadowClass} ${className}`}
      style={{
        transform: `translate(${translate}px, ${translate}px) rotate(${rotate}deg)`,
        transition: 'transform 80ms ease-out, box-shadow 80ms ease-out',
        cursor: pressable ? 'pointer' : undefined,
      }}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
      onTouchStart={handleDown}
      onTouchEnd={handleUp}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3.2: `mockup/src/App.tsx` smoke test 갱신**

다양한 offset, rotate, pressable을 한 화면에 보여줌.

```tsx
import StickerCard from './components/StickerCard';

export default function App() {
  return (
    <div className="min-h-screen bg-cream p-8 flex flex-wrap gap-8 font-sans">
      <StickerCard offset="sm" bg="bg-surface" className="p-4">
        <div className="font-bold">offset sm</div>
      </StickerCard>
      <StickerCard offset="md" bg="bg-primary" rotate={-1} className="p-4">
        <div className="font-bold">offset md, rotate -1</div>
      </StickerCard>
      <StickerCard offset="lg" bg="bg-accentPink" rotate={1} className="p-4">
        <div className="font-bold">offset lg, rotate +1</div>
      </StickerCard>
      <StickerCard offset="md" bg="bg-accentRed" pressable className="p-4">
        <div className="font-bold text-surface">pressable (눌러보기)</div>
      </StickerCard>
    </div>
  );
}
```

- [ ] **Step 3.3: 시각 확인**

`pnpm dev` → 4개 카드, 각자 그림자/회전/색 다르게, 마지막 빨간 카드는 누르면 그림자가 사라지며 우하단으로 8px 이동.

- [ ] **Step 3.4: 타입체크 + Commit**

```bash
cd mockup && pnpm typecheck
git add mockup/src/components/StickerCard.tsx mockup/src/App.tsx
git commit -m "feat(mockup): add StickerCard with mechanical press"
```

---

## Task 4: StickerButton + StickerInput

**Files:**
- Create: `mockup/src/components/StickerButton.tsx`
- Create: `mockup/src/components/StickerInput.tsx`
- Modify: `mockup/src/App.tsx` (smoke test)

- [ ] **Step 4.1: `mockup/src/components/StickerButton.tsx`**

5개 variant + 3개 size. 내부적으로 `StickerCard`(pressable=true)를 래핑.

```tsx
import { ReactNode } from 'react';
import StickerCard from './StickerCard';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'disabled';
type Size = 'lg' | 'md' | 'sm';

const VARIANT_BG: Record<Variant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-surface',
  danger: 'bg-accentRed',
  ghost: 'bg-transparent',
  disabled: 'bg-surfaceMuted',
};

const VARIANT_TEXT: Record<Variant, string> = {
  primary: 'text-outline',
  secondary: 'text-outline',
  danger: 'text-surface',
  ghost: 'text-outline',
  disabled: 'text-textMuted',
};

const SIZE_HEIGHT: Record<Size, string> = {
  lg: 'h-14',   // 56px
  md: 'h-12',   // 48px
  sm: 'h-9',    // 36px
};

export type StickerButtonProps = {
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  fullWidth?: boolean;
  children: ReactNode;
};

export default function StickerButton({
  variant = 'primary',
  size = 'lg',
  onClick,
  fullWidth = false,
  children,
}: StickerButtonProps) {
  const disabled = variant === 'disabled';
  const offset = size === 'sm' ? 'sm' : 'md';
  const border = variant === 'ghost' || disabled ? 'thin' : 'normal';

  return (
    <div className={fullWidth ? 'w-full' : 'inline-block'}>
      <StickerCard
        offset={offset}
        bg={VARIANT_BG[variant]}
        rounded="xl"
        border={border}
        pressable={!disabled}
        onClick={disabled ? undefined : onClick}
        className={`${SIZE_HEIGHT[size]} px-6 flex items-center justify-center ${fullWidth ? 'w-full' : ''}`}
      >
        <span className={`font-bold text-[16px] ${VARIANT_TEXT[variant]}`}>
          {children}
        </span>
      </StickerCard>
    </div>
  );
}
```

- [ ] **Step 4.2: `mockup/src/components/StickerInput.tsx`**

라벨 위, 입력칸 흰 배경 + 보더 2.5, focus 시 보더 → accentRed.

```tsx
import { useState } from 'react';

export type StickerInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};

export default function StickerInput({
  label,
  placeholder,
  value,
  onChange,
}: StickerInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block">
      {label && (
        <div className="text-[14px] font-semibold text-outline mb-1">{label}</div>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full h-12 px-4 bg-surface rounded-md text-[15px] text-outline placeholder:text-textMuted outline-none border-[2.5px] ${
          focused ? 'border-accentRed' : 'border-outline'
        }`}
      />
    </label>
  );
}
```

- [ ] **Step 4.3: `mockup/src/App.tsx` smoke test 갱신**

```tsx
import { useState } from 'react';
import StickerButton from './components/StickerButton';
import StickerInput from './components/StickerInput';

export default function App() {
  const [val, setVal] = useState('');
  return (
    <div className="min-h-screen bg-cream p-8 flex flex-col gap-4 max-w-md font-sans">
      <StickerButton variant="primary" fullWidth onClick={() => alert('primary')}>
        🚀 여행 왔어요
      </StickerButton>
      <StickerButton variant="secondary" fullWidth>보조 버튼</StickerButton>
      <StickerButton variant="danger" fullWidth>신고 / 차단</StickerButton>
      <StickerButton variant="ghost" fullWidth>고스트</StickerButton>
      <StickerButton variant="disabled" fullWidth>비활성</StickerButton>
      <StickerButton size="sm">인라인 sm</StickerButton>
      <StickerInput label="한 줄 메시지" placeholder="여기서 만날래요?" value={val} onChange={setVal} />
    </div>
  );
}
```

- [ ] **Step 4.4: 시각 확인**

`pnpm dev` → 5개 버튼이 각자 다른 색·텍스트로 표시, primary 클릭 시 alert. 입력 칸에 포커스하면 보더가 빨강으로 변함.

- [ ] **Step 4.5: 타입체크 + Commit**

```bash
cd mockup && pnpm typecheck
git add mockup/src/components/StickerButton.tsx mockup/src/components/StickerInput.tsx mockup/src/App.tsx
git commit -m "feat(mockup): add StickerButton variants and StickerInput"
```

---

## Task 5: Chip + CoinBadge

**Files:**
- Create: `mockup/src/components/Chip.tsx`
- Create: `mockup/src/components/CoinBadge.tsx`
- Modify: `mockup/src/App.tsx` (smoke test)

- [ ] **Step 5.1: `mockup/src/components/Chip.tsx`**

```tsx
import { ReactNode } from 'react';

export type ChipProps = {
  bg?: string;          // Tailwind 색상 키, 기본 surface
  size?: 'sm' | 'md';
  children: ReactNode;
};

export default function Chip({ bg = 'bg-surface', size = 'md', children }: ChipProps) {
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-[12px]';
  return (
    <span className={`${bg} ${padding} font-semibold text-outline border-[2px] border-outline rounded-pill shadow-sticker-xs inline-block`}>
      {children}
    </span>
  );
}
```

- [ ] **Step 5.2: `mockup/src/components/CoinBadge.tsx`**

노랑 원형 + 숫자(JetBrains Mono).

```tsx
export type CoinBadgeProps = {
  count: number;
  size?: 'sm' | 'md' | 'lg';
};

const SIZE_PX: Record<'sm' | 'md' | 'lg', number> = { sm: 32, md: 40, lg: 56 };
const SIZE_FONT: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-[12px]',
  md: 'text-[14px]',
  lg: 'text-[20px]',
};

export default function CoinBadge({ count, size = 'md' }: CoinBadgeProps) {
  const px = SIZE_PX[size];
  return (
    <div
      className={`bg-primary border-[2.5px] border-outline rounded-pill shadow-sticker-sm flex items-center justify-center font-mono font-bold text-outline ${SIZE_FONT[size]}`}
      style={{ width: px, height: px }}
    >
      {count}
    </div>
  );
}
```

- [ ] **Step 5.3: `mockup/src/App.tsx` smoke test 갱신**

```tsx
import Chip from './components/Chip';
import CoinBadge from './components/CoinBadge';

export default function App() {
  return (
    <div className="min-h-screen bg-cream p-8 flex flex-col gap-6 font-sans">
      <div className="flex gap-2 flex-wrap">
        <Chip>맛집</Chip>
        <Chip bg="bg-primary">술자리</Chip>
        <Chip bg="bg-accentPink">액티비티</Chip>
        <Chip bg="bg-accentLime">관광</Chip>
        <Chip size="sm">sm</Chip>
      </div>
      <div className="flex gap-3 items-center">
        <CoinBadge count={3} size="sm" />
        <CoinBadge count={12} size="md" />
        <CoinBadge count={99} size="lg" />
      </div>
    </div>
  );
}
```

- [ ] **Step 5.4: 시각 확인 + 타입체크 + Commit**

```bash
cd mockup && pnpm dev   # 시각 확인 후 종료
cd mockup && pnpm typecheck
git add mockup/src/components/Chip.tsx mockup/src/components/CoinBadge.tsx mockup/src/App.tsx
git commit -m "feat(mockup): add Chip and CoinBadge components"
```

---

## Task 6: PinMarker

**Files:**
- Create: `mockup/src/components/PinMarker.tsx`
- Modify: `mockup/src/App.tsx` (smoke test)

- [ ] **Step 6.1: `mockup/src/components/PinMarker.tsx`**

map.md의 색상 단계 + 크기 공식 `32 + min(count/3, 32)` 그대로.

```tsx
type Bg = 'bg-surface' | 'bg-primary' | 'bg-accentPink' | 'bg-accentRed';

function bgForCount(count: number): { bg: Bg; textColor: string } {
  if (count <= 9) return { bg: 'bg-surface', textColor: 'text-outline' };
  if (count <= 29) return { bg: 'bg-primary', textColor: 'text-outline' };
  if (count <= 69) return { bg: 'bg-accentPink', textColor: 'text-outline' };
  return { bg: 'bg-accentRed', textColor: 'text-surface' };
}

function sizeForCount(count: number): number {
  return 32 + Math.min(count / 3, 32);
}

export type PinMarkerProps = {
  count: number;
  name: string;
  position: { x: number; y: number }; // % within parent (relative)
  onClick?: () => void;
};

export default function PinMarker({ count, name, position, onClick }: PinMarkerProps) {
  const { bg, textColor } = bgForCount(count);
  const size = sizeForCount(count);

  return (
    <button
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div
        className={`${bg} ${textColor} border-[2.5px] border-outline rounded-pill shadow-sticker-sm flex items-center justify-center font-mono font-bold`}
        style={{ width: size, height: size, fontSize: Math.max(11, size * 0.32) }}
      >
        {count}
      </div>
      <div className="bg-surface border-[1.5px] border-outline rounded-pill px-2 py-0.5 text-[11px] font-semibold text-outline whitespace-nowrap">
        {name}
      </div>
    </button>
  );
}
```

- [ ] **Step 6.2: `mockup/src/App.tsx` smoke test 갱신**

부모 컨테이너에 4개 핀을 배치해 크기·색 단계 비교.

```tsx
import PinMarker from './components/PinMarker';

export default function App() {
  return (
    <div className="min-h-screen bg-cream p-8 font-sans">
      <div className="relative w-[600px] h-[400px] bg-surfaceMuted border-[2.5px] border-outline rounded-lg">
        <PinMarker count={3}  name="잠실"  position={{ x: 20, y: 30 }} />
        <PinMarker count={12} name="이태원" position={{ x: 45, y: 50 }} />
        <PinMarker count={45} name="신촌"  position={{ x: 70, y: 30 }} />
        <PinMarker count={88} name="강남"  position={{ x: 50, y: 80 }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6.3: 시각 확인 + 타입체크 + Commit**

핀 4개 색이 각자 다르고(흰/노랑/핑크/빨강), 크기도 인구순으로 점진 증가하는지 확인.

```bash
cd mockup && pnpm dev   # 시각 확인 후 종료
cd mockup && pnpm typecheck
git add mockup/src/components/PinMarker.tsx mockup/src/App.tsx
git commit -m "feat(mockup): add PinMarker with population-based color and size"
```

---

## Task 7: DeviceFrame + TabBar

**Files:**
- Create: `mockup/src/components/DeviceFrame.tsx`
- Create: `mockup/src/components/TabBar.tsx`
- Modify: `mockup/src/App.tsx` (smoke test)

- [ ] **Step 7.1: `mockup/src/components/DeviceFrame.tsx`**

390×844 컨테이너, radii 36, outline 2.5, sticker-lg 그림자. `label` prop으로 우상단에 작은 칩 표시. `onClick` prop은 storyboard 모드에서 디바이스를 클릭해 single device로 진입할 때 사용.

```tsx
import { ReactNode } from 'react';

export type DeviceFrameProps = {
  label?: string;
  onClick?: () => void;
  children: ReactNode;
};

export default function DeviceFrame({ label, onClick, children }: DeviceFrameProps) {
  return (
    <div
      className="relative bg-cream border-[2.5px] border-outline shadow-sticker-lg overflow-hidden"
      style={{ width: 390, height: 844, borderRadius: 36, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {label && (
        <div className="absolute top-3 right-3 z-50 bg-outline text-surface text-[11px] font-bold px-2 py-1 rounded-pill">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}
```

- [ ] **Step 7.2: `mockup/src/components/TabBar.tsx`**

하단 3탭. 활성 탭은 outline 진하고 라벨 굵음 + 위에 작은 노랑 점.

```tsx
import { MapPin, Bell, User } from 'lucide-react';

type TabKey = 'map' | 'activity' | 'my';

const TABS: { key: TabKey; label: string; Icon: typeof MapPin }[] = [
  { key: 'map', label: 'Map', Icon: MapPin },
  { key: 'activity', label: 'Activity', Icon: Bell },
  { key: 'my', label: 'My', Icon: User },
];

export type TabBarProps = {
  active: TabKey;
};

export default function TabBar({ active }: TabBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-surface border-t-[2.5px] border-outline flex">
      {TABS.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <div key={key} className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
            {isActive && (
              <div className="absolute top-1.5 w-1.5 h-1.5 bg-primary rounded-pill border border-outline" />
            )}
            <Icon size={22} color="#2A2A2A" strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] ${isActive ? 'font-bold text-outline' : 'font-medium text-textMuted'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 7.3: `mockup/src/App.tsx` smoke test 갱신**

DeviceFrame 안에 TabBar를 넣어 비례 확인.

```tsx
import DeviceFrame from './components/DeviceFrame';
import TabBar from './components/TabBar';

export default function App() {
  return (
    <div className="min-h-screen bg-surfaceMuted p-12 flex justify-center font-sans">
      <DeviceFrame label="Map" onClick={() => alert('clicked')}>
        <div className="p-6">
          <h1 className="text-[28px] font-extrabold text-outline">디바이스 프레임 테스트</h1>
          <p className="mt-2 text-textMuted">390 × 844 — 클릭하면 alert</p>
        </div>
        <TabBar active="map" />
      </DeviceFrame>
    </div>
  );
}
```

- [ ] **Step 7.4: 시각 확인 + 타입체크 + Commit**

```bash
cd mockup && pnpm dev   # 시각 확인
cd mockup && pnpm typecheck
git add mockup/src/components/DeviceFrame.tsx mockup/src/components/TabBar.tsx mockup/src/App.tsx
git commit -m "feat(mockup): add DeviceFrame and TabBar"
```

---

## Task 8: Mock 데이터 + 정적 지도 placeholder

**Files:**
- Create: `mockup/public/seoul-map.svg`
- Create: `mockup/src/data/regions.ts`
- Create: `mockup/src/data/companions.ts`

- [ ] **Step 8.1: `mockup/public/seoul-map.svg` (placeholder 지도)**

진짜 서울 지도 대신 키치 무드와 어울리는 추상 지도 SVG. 크림 배경 + 굵은 라인의 지역 경계 + 한강 모양 곡선. 본 RN 앱에서 카카오맵으로 대체될 예정이므로 정밀할 필요 없음.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
  <rect width="390" height="844" fill="#FFFCEB"/>
  <!-- subtle grid -->
  <g stroke="#F4F0E0" stroke-width="1">
    <path d="M0 100 L390 100 M0 200 L390 200 M0 300 L390 300 M0 400 L390 400 M0 500 L390 500 M0 600 L390 600 M0 700 L390 700"/>
    <path d="M50 0 L50 844 M130 0 L130 844 M210 0 L210 844 M290 0 L290 844 M370 0 L370 844"/>
  </g>
  <!-- 한강 -->
  <path d="M0 480 Q 100 440 200 470 T 390 460 L 390 510 Q 290 530 200 510 T 0 530 Z"
        fill="#B5E48C" stroke="#2A2A2A" stroke-width="2.5"/>
  <!-- 행정 경계 (단순화) -->
  <path d="M40 200 L150 180 L160 350 L80 380 Z" fill="none" stroke="#2A2A2A" stroke-width="1.5" stroke-dasharray="4 4"/>
  <path d="M180 150 L300 170 L310 340 L200 360 Z" fill="none" stroke="#2A2A2A" stroke-width="1.5" stroke-dasharray="4 4"/>
  <path d="M30 560 L160 580 L170 760 L40 740 Z" fill="none" stroke="#2A2A2A" stroke-width="1.5" stroke-dasharray="4 4"/>
  <path d="M200 580 L340 590 L340 770 L200 770 Z" fill="none" stroke="#2A2A2A" stroke-width="1.5" stroke-dasharray="4 4"/>
  <!-- 라벨 -->
  <text x="80" y="290" font-family="Pretendard, sans-serif" font-size="14" fill="#6B6B6B" font-weight="700">서북</text>
  <text x="240" y="270" font-family="Pretendard, sans-serif" font-size="14" fill="#6B6B6B" font-weight="700">서울 도심</text>
  <text x="80" y="680" font-family="Pretendard, sans-serif" font-size="14" fill="#6B6B6B" font-weight="700">서남</text>
  <text x="250" y="690" font-family="Pretendard, sans-serif" font-size="14" fill="#6B6B6B" font-weight="700">동남</text>
</svg>
```

- [ ] **Step 8.2: `mockup/src/data/regions.ts`**

좌표는 위 SVG 비율 기준으로 보정한 % 값 (대략 한강 위/아래에 자연스럽게 분산).

```ts
export type Region = {
  id: string;
  name: string;
  count: number;
  x: number; // % within map
  y: number;
};

export const regions: Region[] = [
  { id: 'gangnam',    name: '강남역 9번 출구', count: 55, x: 60, y: 68 },
  { id: 'hongdae',    name: '홍대입구역',     count: 28, x: 22, y: 38 },
  { id: 'itaewon',    name: '이태원역',       count: 12, x: 50, y: 56 },
  { id: 'myeongdong', name: '명동성당',       count: 8,  x: 52, y: 36 },
  { id: 'sinchon',    name: '신촌역',         count: 45, x: 30, y: 30 },
  { id: 'jongno',     name: '종로3가',        count: 18, x: 56, y: 26 },
  { id: 'jamsil',     name: '잠실역',         count: 3,  x: 78, y: 70 },
];
```

- [ ] **Step 8.3: `mockup/src/data/companions.ts`**

```ts
export type Companion = {
  id: number;
  nickname: string;
  age: number;
  gender: 'F' | 'M';
  intro: string;
  tags: string[];
  avatarBg: string; // Tailwind 색상 키 (StickerCard bg)
};

export const companions: Companion[] = [
  { id: 1, nickname: '여행토끼',  age: 24, gender: 'F', intro: '강남 맛집 같이 가실 분~',     tags: ['맛집', '카페'],            avatarBg: 'bg-accentPink' },
  { id: 2, nickname: '서울러버',  age: 26, gender: 'M', intro: '술 한잔 어떠세요?',           tags: ['술자리'],                  avatarBg: 'bg-primary' },
  { id: 3, nickname: 'mintchoco', age: 22, gender: 'F', intro: '액티비티 좋아하시면 콕!',     tags: ['액티비티', '맛집'],         avatarBg: 'bg-accentLime' },
  { id: 4, nickname: '제주촌놈',  age: 29, gender: 'M', intro: '서울 처음이라 가이드해주실 분', tags: ['관광', '맛집'],            avatarBg: 'bg-accentRed' },
  { id: 5, nickname: '월요병',    age: 25, gender: 'F', intro: '늦은 밤 산책할 사람?',         tags: ['산책'],                    avatarBg: 'bg-surface' },
];
```

- [ ] **Step 8.4: 타입체크 + Commit**

(시각 확인은 다음 task에서 MapScreen 합쳐서 한 번에)

```bash
cd mockup && pnpm typecheck
git add mockup/public/seoul-map.svg mockup/src/data/
git commit -m "feat(mockup): add mock regions, companions, and placeholder map SVG"
```

---

## Task 9: MapScreen

**Files:**
- Create: `mockup/src/screens/MapScreen.tsx`
- Modify: `mockup/src/App.tsx` (smoke test — DeviceFrame 안에 MapScreen 렌더)

- [ ] **Step 9.1: `mockup/src/screens/MapScreen.tsx`**

map.md 레이아웃대로:
- 헤더 (절대 배치, z-10): 좌 On-Trip 칩 + 우 Activity/My 칩
- 본문: 지도 SVG full-bleed
- 핀 7개 (regions 데이터 기반)
- 우하단: 내 위치 버튼 (StickerCard sm + crosshair 아이콘)
- 하단 fixed: "🚀 여행 왔어요" CTA + 그 아래 TabBar

```tsx
import { Bell, User, Crosshair, Rocket } from 'lucide-react';
import StickerCard from '../components/StickerCard';
import StickerButton from '../components/StickerButton';
import PinMarker from '../components/PinMarker';
import TabBar from '../components/TabBar';
import Chip from '../components/Chip';
import { regions } from '../data/regions';

export type MapScreenProps = {
  onPinTap?: (regionId: string) => void;
};

export default function MapScreen({ onPinTap }: MapScreenProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 헤더 */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between">
        <Chip bg="bg-primary"><span className="font-extrabold tracking-tight">On-Trip</span></Chip>
        <div className="flex gap-2">
          <StickerCard offset="xs" rounded="pill" className="w-9 h-9 flex items-center justify-center relative">
            <Bell size={18} color="#2A2A2A" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accentRed rounded-pill border-[1.5px] border-outline" />
          </StickerCard>
          <StickerCard offset="xs" rounded="pill" className="w-9 h-9 flex items-center justify-center">
            <User size={18} color="#2A2A2A" />
          </StickerCard>
        </div>
      </div>

      {/* 지도 */}
      <img src="/seoul-map.svg" alt="Seoul map placeholder" className="absolute inset-0 w-full h-full object-cover" />

      {/* 핀 (지도 아래 영역, 상단 헤더와 하단 CTA 사이) */}
      <div className="absolute inset-x-0" style={{ top: 80, bottom: 160 }}>
        <div className="relative w-full h-full">
          {regions.map((r) => (
            <PinMarker
              key={r.id}
              count={r.count}
              name={r.name}
              position={{ x: r.x, y: r.y }}
              onClick={() => onPinTap?.(r.id)}
            />
          ))}
        </div>
      </div>

      {/* 내 위치 버튼 */}
      <div className="absolute right-4 bottom-40 z-20">
        <StickerCard offset="sm" rounded="pill" className="w-12 h-12 flex items-center justify-center" pressable>
          <Crosshair size={20} color="#2A2A2A" strokeWidth={2.5} />
        </StickerCard>
      </div>

      {/* 메인 CTA */}
      <div className="absolute bottom-20 left-4 right-4 z-20">
        <StickerButton variant="primary" fullWidth>
          <span className="flex items-center gap-2"><Rocket size={20} /> 여행 왔어요</span>
        </StickerButton>
      </div>

      {/* TabBar */}
      <TabBar active="map" />
    </div>
  );
}
```

- [ ] **Step 9.2: `mockup/src/App.tsx` smoke test 갱신**

```tsx
import DeviceFrame from './components/DeviceFrame';
import MapScreen from './screens/MapScreen';

export default function App() {
  return (
    <div className="min-h-screen bg-surfaceMuted p-12 flex justify-center font-sans">
      <DeviceFrame label="Map">
        <MapScreen onPinTap={(id) => alert(`pin tapped: ${id}`)} />
      </DeviceFrame>
    </div>
  );
}
```

- [ ] **Step 9.3: 시각 확인**

`pnpm dev` → DeviceFrame 안에:
- 상단 좌측 노랑 "On-Trip" 칩, 우측 Bell(빨간 점)·User
- 지도 placeholder SVG (한강 라임색 줄무늬)
- 핀 7개 (강남이 가장 큼/빨강, 잠실이 가장 작음/흰색)
- 우하단 crosshair 버튼
- 하단 노랑 CTA "🚀 여행 왔어요" (Rocket lucide 아이콘)
- 하단 TabBar (Map 탭 활성 — 노랑 점 + 굵은 텍스트)

핀 클릭 시 alert.

- [ ] **Step 9.4: 타입체크 + Commit**

```bash
cd mockup && pnpm typecheck
git add mockup/src/screens/MapScreen.tsx mockup/src/App.tsx
git commit -m "feat(mockup): add MapScreen with pins and CTA"
```

---

## Task 10: RegionDetailScreen

**Files:**
- Create: `mockup/src/screens/RegionDetailScreen.tsx`
- Modify: `mockup/src/App.tsx` (smoke test — RegionDetail로 전환)

- [ ] **Step 10.1: `mockup/src/screens/RegionDetailScreen.tsx`**

```tsx
import { ArrowLeft } from 'lucide-react';
import StickerCard from '../components/StickerCard';
import StickerButton from '../components/StickerButton';
import Chip from '../components/Chip';
import { companions, Companion } from '../data/companions';
import { regions } from '../data/regions';

export type RegionDetailScreenProps = {
  regionId: string;
  onBack?: () => void;
  onPokeTap?: (companion: Companion) => void;
};

// 일행 id 해시 → -1 / 0 / +1 회전 (결정론적)
function rotateForId(id: number): -1 | 0 | 1 {
  const m = id % 3;
  return (m === 0 ? -1 : m === 1 ? 0 : 1) as -1 | 0 | 1;
}

export default function RegionDetailScreen({ regionId, onBack, onPokeTap }: RegionDetailScreenProps) {
  const region = regions.find((r) => r.id === regionId) ?? regions[0];

  return (
    <div className="relative w-full h-full bg-cream overflow-hidden flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-cream z-10 border-b-[1.5px] border-outline">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center" aria-label="뒤로">
          <ArrowLeft size={22} color="#2A2A2A" strokeWidth={2.5} />
        </button>
        <h1 className="flex-1 text-[20px] font-extrabold text-outline">{region.name}</h1>
        <Chip bg="bg-primary"><span className="font-mono">{region.count}명</span></Chip>
      </div>

      {/* 일행 카드 리스트 */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5 pb-32">
        {companions.map((c) => (
          <StickerCard
            key={c.id}
            offset="md"
            rotate={rotateForId(c.id)}
            rounded="lg"
            className="p-4"
            pressable
            onClick={() => onPokeTap?.(c)}
          >
            <div className="flex gap-3">
              <div className={`${c.avatarBg} w-16 h-16 rounded-lg border-[2.5px] border-outline flex items-center justify-center text-[24px] font-extrabold`}>
                {c.nickname[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-extrabold text-[16px] text-outline truncate">{c.nickname}</span>
                  <span className="text-[12px] font-mono text-textMuted">{c.age}·{c.gender}</span>
                </div>
                <p className="text-[14px] text-outline mt-1 leading-snug">{c.intro}</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {c.tags.map((t) => (
                    <Chip key={t} size="sm">{t}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </StickerCard>
        ))}
      </div>

      {/* 하단 fixed CTA */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-cream border-t-[1.5px] border-outline">
        <StickerButton
          variant="primary"
          fullWidth
          onClick={() => onPokeTap?.(companions[0])}
        >
          콕 보내기 (1코인)
        </StickerButton>
      </div>
    </div>
  );
}
```

- [ ] **Step 10.2: `mockup/src/App.tsx` smoke test 갱신**

이번엔 DeviceFrame 안에 RegionDetailScreen만 직접 렌더해 시각 확인.

```tsx
import DeviceFrame from './components/DeviceFrame';
import RegionDetailScreen from './screens/RegionDetailScreen';

export default function App() {
  return (
    <div className="min-h-screen bg-surfaceMuted p-12 flex justify-center font-sans">
      <DeviceFrame label="Region Detail">
        <RegionDetailScreen
          regionId="gangnam"
          onBack={() => alert('back')}
          onPokeTap={(c) => alert(`poke ${c.nickname}`)}
        />
      </DeviceFrame>
    </div>
  );
}
```

- [ ] **Step 10.3: 시각 확인**

- 헤더: 뒤로 화살표 + "강남역 9번 출구" + 노랑 칩 "55명"
- 5개 일행 카드, rotate가 ±1 또는 0으로 자연스럽게 변동
- 카드 누르면 alert
- 하단 노랑 CTA "콕 보내기 (1코인)" — 누르면 alert

스크롤이 카드 5개를 다 보여주는지 확인 (DeviceFrame 높이 844 안에서 카드 5개 + 헤더 + CTA가 들어감 → 부분 스크롤됨).

- [ ] **Step 10.4: 타입체크 + Commit**

```bash
cd mockup && pnpm typecheck
git add mockup/src/screens/RegionDetailScreen.tsx mockup/src/App.tsx
git commit -m "feat(mockup): add RegionDetailScreen with companion cards"
```

---

## Task 11: PokeModal

**Files:**
- Create: `mockup/src/screens/PokeModal.tsx`
- Modify: `mockup/src/App.tsx` (smoke test)

- [ ] **Step 11.1: `mockup/src/screens/PokeModal.tsx`**

`open` prop으로 외부 제어. 외부 스크림(40% black) 클릭 또는 X 버튼 또는 취소 버튼으로 닫힘. 슬라이드업은 CSS transition `translateY` 250ms ease-out.

```tsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import StickerButton from '../components/StickerButton';
import StickerInput from '../components/StickerInput';
import CoinBadge from '../components/CoinBadge';
import { Companion } from '../data/companions';

export type PokeModalProps = {
  open: boolean;
  target: Companion | null;
  coinBalance?: number;
  onClose: () => void;
  onSend: (message: string) => void;
};

export default function PokeModal({ open, target, coinBalance = 12, onClose, onSend }: PokeModalProps) {
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  // open 토글에 맞춰 mount 상태 — transition 트리거용
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
      setMessage('');
    }
  }, [open]);

  if (!open || !target) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-end"
      onClick={onClose}
      style={{
        backgroundColor: mounted ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)',
        transition: 'background-color 250ms ease-out',
      }}
    >
      <div
        className="w-full bg-cream border-t-[2.5px] border-x-[2.5px] border-outline shadow-sticker-lg"
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          transform: mounted ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 250ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 핸들 */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-pill bg-outline opacity-50" />
        </div>
        {/* X 버튼 */}
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center"
        >
          <X size={20} color="#2A2A2A" strokeWidth={2.5} />
        </button>

        <div className="px-5 pb-6 pt-2 flex flex-col gap-4">
          <h2 className="text-[24px] font-extrabold text-outline">
            {target.nickname}님에게 콕 보내기
          </h2>

          <div className="flex items-center gap-3">
            <CoinBadge count={coinBalance} size="md" />
            <span className="text-[14px] text-outline font-semibold">
              잔액 {coinBalance} · <span className="text-accentRed">1코인 차감</span>
            </span>
          </div>

          <StickerInput
            label="한 줄 메시지 (선택)"
            placeholder="여기서 만날래요?"
            value={message}
            onChange={setMessage}
          />

          <StickerButton variant="primary" fullWidth onClick={() => onSend(message)}>
            콕 발사
          </StickerButton>
          <StickerButton variant="ghost" fullWidth onClick={onClose}>
            취소
          </StickerButton>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 11.2: `mockup/src/App.tsx` smoke test 갱신**

```tsx
import { useState } from 'react';
import DeviceFrame from './components/DeviceFrame';
import RegionDetailScreen from './screens/RegionDetailScreen';
import PokeModal from './screens/PokeModal';
import { Companion } from './data/companions';

export default function App() {
  const [target, setTarget] = useState<Companion | null>(null);

  return (
    <div className="min-h-screen bg-surfaceMuted p-12 flex justify-center font-sans">
      <DeviceFrame label="Region Detail">
        <RegionDetailScreen
          regionId="gangnam"
          onBack={() => alert('back')}
          onPokeTap={(c) => setTarget(c)}
        />
        <PokeModal
          open={target !== null}
          target={target}
          onClose={() => setTarget(null)}
          onSend={(msg) => {
            alert(`콕 발사: ${msg || '(빈 메시지)'}`);
            setTarget(null);
          }}
        />
      </DeviceFrame>
    </div>
  );
}
```

- [ ] **Step 11.3: 시각 확인**

일행 카드 또는 하단 CTA 클릭 → 모달이 아래에서 슬라이드업 (~250ms) + 스크림이 페이드인. 외부 탭/X/취소로 닫기. "콕 발사" 시 alert + 닫힘. 메시지 입력 칸 포커스 시 보더가 빨강으로 변함.

- [ ] **Step 11.4: 타입체크 + Commit**

```bash
cd mockup && pnpm typecheck
git add mockup/src/screens/PokeModal.tsx mockup/src/App.tsx
git commit -m "feat(mockup): add PokeModal with slide-up animation"
```

---

## Task 12: App shell — Single Device 라우팅

**Files:**
- Modify: `mockup/src/App.tsx` (currentScreen 라우팅 + 모달 state 통합)

- [ ] **Step 12.1: `mockup/src/App.tsx`** — Single Device 모드만 우선 완성

이 task는 Storyboard 모드는 빼고 Single Device 모드만 완전 동작시킨다 (다음 task에서 Storyboard + 토글 추가).

```tsx
import { useState } from 'react';
import DeviceFrame from './components/DeviceFrame';
import MapScreen from './screens/MapScreen';
import RegionDetailScreen from './screens/RegionDetailScreen';
import PokeModal from './screens/PokeModal';
import { Companion } from './data/companions';

type Screen = 'map' | 'region-detail';

const SCREEN_LABELS: Record<Screen, string> = {
  map: 'Map',
  'region-detail': 'Region Detail',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('map');
  const [activeRegionId, setActiveRegionId] = useState<string>('gangnam');
  const [pokeTarget, setPokeTarget] = useState<Companion | null>(null);

  return (
    <div className="min-h-screen bg-surfaceMuted py-12 px-6 flex flex-col items-center font-sans gap-4">
      <h1 className="text-[20px] font-extrabold text-outline">On-Trip Mockup — Single Device</h1>

      <DeviceFrame label={SCREEN_LABELS[currentScreen]}>
        {currentScreen === 'map' && (
          <MapScreen
            onPinTap={(id) => {
              setActiveRegionId(id);
              setCurrentScreen('region-detail');
            }}
          />
        )}
        {currentScreen === 'region-detail' && (
          <RegionDetailScreen
            regionId={activeRegionId}
            onBack={() => setCurrentScreen('map')}
            onPokeTap={(c) => setPokeTarget(c)}
          />
        )}
        <PokeModal
          open={pokeTarget !== null}
          target={pokeTarget}
          onClose={() => setPokeTarget(null)}
          onSend={() => setPokeTarget(null)}
        />
      </DeviceFrame>
    </div>
  );
}
```

- [ ] **Step 12.2: 시각 확인**

전체 동선이 끊김 없이 동작:
1. Map에서 핀(예: 강남 빨강) 탭 → Region Detail로 전환
2. 헤더에 "강남역 9번 출구" 표시 + 일행 5명 표시
3. 일행 카드 또는 하단 CTA 탭 → PokeModal 슬라이드업
4. 콕 발사 또는 취소 → 모달 닫힘
5. Region Detail 헤더의 ← 뒤로 → Map으로 복귀

- [ ] **Step 12.3: 타입체크 + Commit**

```bash
cd mockup && pnpm typecheck
git add mockup/src/App.tsx
git commit -m "feat(mockup): wire Single Device routing across map → region-detail → poke modal"
```

---

## Task 13: App shell — Storyboard 뷰 + 토글

**Files:**
- Modify: `mockup/src/App.tsx` (viewMode state + Storyboard 렌더 + 토글)

- [ ] **Step 13.1: `mockup/src/App.tsx`** — viewMode 추가, 두 모드 모두 완성

Storyboard 모드는:
- 디바이스 3개 가로 정렬 (Map, Region Detail, Poke Modal 결과 상태)
- 사이에 화살표 + 라벨 ("핀 탭", "콕 탭")
- 각 디바이스 클릭 → Single Device 모드로 전환 + 해당 화면으로 진입

PokeModal은 디바이스 안에서만 떠야 하므로, 3번째 디바이스는 RegionDetail + PokeModal(open=true, target=companions[0])이 함께 렌더된 합성 상태로 표시.

```tsx
import { useState } from 'react';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';
import DeviceFrame from './components/DeviceFrame';
import MapScreen from './screens/MapScreen';
import RegionDetailScreen from './screens/RegionDetailScreen';
import PokeModal from './screens/PokeModal';
import StickerButton from './components/StickerButton';
import { Companion, companions } from './data/companions';

type ViewMode = 'storyboard' | 'single';
type Screen = 'map' | 'region-detail';

const SCREEN_LABELS: Record<Screen, string> = {
  map: 'Map',
  'region-detail': 'Region Detail',
};

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('storyboard');
  const [currentScreen, setCurrentScreen] = useState<Screen>('map');
  const [activeRegionId, setActiveRegionId] = useState<string>('gangnam');
  const [pokeTarget, setPokeTarget] = useState<Companion | null>(null);

  const goToSingle = (screen: Screen, options?: { regionId?: string; openPoke?: boolean }) => {
    if (options?.regionId) setActiveRegionId(options.regionId);
    setCurrentScreen(screen);
    setPokeTarget(options?.openPoke ? companions[0] : null);
    setViewMode('single');
  };

  return (
    <div className="min-h-screen bg-surfaceMuted py-10 px-6 flex flex-col items-center font-sans gap-6">
      {/* 상단 툴바 */}
      <div className="flex items-center gap-4 w-full max-w-7xl">
        <h1 className="text-[24px] font-extrabold text-outline">On-Trip Mockup</h1>
        <div className="flex-1" />
        {viewMode === 'storyboard' ? (
          <span className="text-[14px] text-textMuted">디바이스를 클릭하면 단일 모드로 진입합니다</span>
        ) : (
          <StickerButton
            variant="secondary"
            size="sm"
            onClick={() => setViewMode('storyboard')}
          >
            <span className="flex items-center gap-2"><ArrowLeftRight size={16} /> 스토리보드로</span>
          </StickerButton>
        )}
      </div>

      {viewMode === 'storyboard' ? (
        <Storyboard onDeviceTap={goToSingle} />
      ) : (
        <SingleDevice
          currentScreen={currentScreen}
          activeRegionId={activeRegionId}
          pokeTarget={pokeTarget}
          onPinTap={(id) => {
            setActiveRegionId(id);
            setCurrentScreen('region-detail');
          }}
          onBack={() => setCurrentScreen('map')}
          onPokeTap={(c) => setPokeTarget(c)}
          onPokeClose={() => setPokeTarget(null)}
          onPokeSend={() => setPokeTarget(null)}
          screenLabel={SCREEN_LABELS[currentScreen]}
        />
      )}
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 self-center px-2">
      <ArrowRight size={36} color="#2A2A2A" strokeWidth={3} />
      <div className="bg-primary border-[2px] border-outline rounded-pill px-2 py-0.5 text-[11px] font-bold text-outline shadow-sticker-xs whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

type StoryboardProps = {
  onDeviceTap: (
    screen: Screen,
    options?: { regionId?: string; openPoke?: boolean }
  ) => void;
};

function Storyboard({ onDeviceTap }: StoryboardProps) {
  // Storyboard에서는 디바이스 안의 인터랙션을 막아야 — 각 화면에 콜백을 noop로 줌.
  // 디바이스 자체 클릭으로 Single Device 진입.
  return (
    <div className="flex items-start gap-2">
      <DeviceFrame label="Map" onClick={() => onDeviceTap('map')}>
        <div className="pointer-events-none">
          <MapScreen />
        </div>
      </DeviceFrame>

      <FlowArrow label="핀 탭" />

      <DeviceFrame
        label="Region Detail"
        onClick={() => onDeviceTap('region-detail', { regionId: 'gangnam' })}
      >
        <div className="pointer-events-none">
          <RegionDetailScreen regionId="gangnam" />
        </div>
      </DeviceFrame>

      <FlowArrow label="콕 탭" />

      <DeviceFrame
        label="Poke Modal"
        onClick={() => onDeviceTap('region-detail', { regionId: 'gangnam', openPoke: true })}
      >
        <div className="pointer-events-none">
          <RegionDetailScreen regionId="gangnam" />
          <PokeModal
            open
            target={companions[0]}
            onClose={() => {}}
            onSend={() => {}}
          />
        </div>
      </DeviceFrame>
    </div>
  );
}

type SingleDeviceProps = {
  currentScreen: Screen;
  activeRegionId: string;
  pokeTarget: Companion | null;
  onPinTap: (id: string) => void;
  onBack: () => void;
  onPokeTap: (c: Companion) => void;
  onPokeClose: () => void;
  onPokeSend: (msg: string) => void;
  screenLabel: string;
};

function SingleDevice({
  currentScreen,
  activeRegionId,
  pokeTarget,
  onPinTap,
  onBack,
  onPokeTap,
  onPokeClose,
  onPokeSend,
  screenLabel,
}: SingleDeviceProps) {
  return (
    <DeviceFrame label={screenLabel}>
      {currentScreen === 'map' && <MapScreen onPinTap={onPinTap} />}
      {currentScreen === 'region-detail' && (
        <RegionDetailScreen
          regionId={activeRegionId}
          onBack={onBack}
          onPokeTap={onPokeTap}
        />
      )}
      <PokeModal
        open={pokeTarget !== null}
        target={pokeTarget}
        onClose={onPokeClose}
        onSend={onPokeSend}
      />
    </DeviceFrame>
  );
}
```

- [ ] **Step 13.2: 시각 확인**

- 진입 시 **Storyboard 모드**: 가로로 디바이스 3개 + 사이에 화살표·라벨. 데스크톱 폭 1280px+ 에서 가로 스크롤 없이 한눈에 보임 (3 × 390 + 2 × ~80 화살표 ≈ 1330; 좁은 모니터는 가로 스크롤 허용).
- 디바이스 영역 어딘가 클릭 시 → Single Device 모드 + 해당 화면으로 진입.
- Single Device에서 "스토리보드로" 버튼 → Storyboard 복귀.

`pointer-events-none`으로 Storyboard의 디바이스 내부 클릭은 화면 본체 인터랙션을 막고 디바이스 onClick만 발화시킴.

- [ ] **Step 13.3: 타입체크 + 빌드 검증 + Commit**

```bash
cd mockup && pnpm typecheck
cd mockup && pnpm build
```

Expected: 컴파일/빌드 모두 성공, `mockup/dist/` 생성.

```bash
git add mockup/src/App.tsx
git commit -m "feat(mockup): add storyboard view with flow arrows and toggle"
```

---

## Task 14: README + 최종 시각 검수

**Files:**
- Create: `mockup/README.md`

- [ ] **Step 14.1: `mockup/README.md`**

```markdown
# On-Trip Mockup — Web Preview

S1 본격 개발 전 디자인 톤·레이아웃·핵심 동선을 검수하기 위한 throwaway 웹 목업.

**스펙:** [`docs/superpowers/specs/2026-04-29-on-trip-mockup-web-preview-design.md`](../docs/superpowers/specs/2026-04-29-on-trip-mockup-web-preview-design.md)

## 실행

```bash
cd mockup
pnpm install      # or npm install
pnpm dev          # or npm run dev
```

브라우저: <http://localhost:5173>

## 두 가지 뷰 모드

- **Storyboard**: 디바이스 3개 가로 정렬, 디자인 흐름 한눈에 보기. 디바이스 클릭 시 Single Device로 진입.
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
```

- [ ] **Step 14.2: 최종 시각 검수**

`pnpm dev` 후 다음을 모두 확인:

- [ ] Storyboard에서 디바이스 3개가 가로 정렬되고 화살표·라벨이 보임
- [ ] 첫 번째 디바이스(Map): 헤더(On-Trip 칩 + Bell·User), 지도 placeholder, 핀 7개(인구순 색상/크기 변동), 내 위치 버튼, 노랑 CTA, TabBar
- [ ] 두 번째 디바이스(Region Detail): 헤더 + 일행 카드 5개(회전), 하단 CTA
- [ ] 세 번째 디바이스(Poke Modal): Region Detail 위에 모달이 떠 있는 상태 — 핸들·X·타이틀·CoinBadge·메시지 입력·콕 발사·취소
- [ ] 첫 번째 디바이스 클릭 → Single Device(Map)로 전환
- [ ] Map의 빨간 강남 핀 클릭 → Region Detail 화면으로 push
- [ ] 일행 카드 또는 하단 CTA 클릭 → 모달 슬라이드업
- [ ] 모달 외부 스크림 클릭 또는 X / 취소 → 모달 닫힘
- [ ] Region Detail의 ← 뒤로 → Map으로 복귀
- [ ] "스토리보드로" 버튼 → Storyboard 복귀
- [ ] 콘솔 에러 없음 (브라우저 DevTools)

- [ ] **Step 14.3: Commit**

```bash
git add mockup/README.md
git commit -m "docs(mockup): add README and complete preview"
```

---

## Self-Review (Plan 작성 후)

**1. 스펙 커버리지:**
- §2 범위: Map / Region Detail / Poke Modal 3개 화면 → Task 9, 10, 11 ✓
- §3 기술 스택: Vite/React/TS/Tailwind/lucide-react/Pretendard/JetBrains Mono → Task 1, 2 ✓
- §4 두 뷰 모드 + 디바이스 프레임 → Task 7, 12, 13 ✓
- §5 디자인 토큰 매핑 → Task 2 ✓
- §6 8개 컴포넌트 → Task 3-7 (StickerCard, Button, Input, Chip, CoinBadge, PinMarker, DeviceFrame, TabBar) ✓
- §7 페이지 구성 → Task 9, 10, 11 ✓
- §8 Mock 데이터 + seoul-map → Task 8 ✓
- §9 파일 구조 → 전체 task 분포 일치 ✓
- §10 실행 방법 → Task 14 README ✓
- §11 S1 분리 → Task 14 README + 본 plan 헤더 ✓
- §12 수정 패턴 예시 → Task 14 README ✓
- §13 성공 기준 → Task 14 최종 시각 검수 체크리스트 ✓

**2. 플레이스홀더 스캔:** "TBD"/"TODO"/"적절히"/"비슷하게" 없음. 모든 코드 단계가 완전한 코드 블록 포함.

**3. 타입 일관성:**
- `Region` 타입 (Task 8) → MapScreen의 `regions.map((r) => ...)` 일치 ✓
- `Companion` 타입 (Task 8) → RegionDetail / PokeModal `target: Companion` 일치 ✓
- `StickerCardProps.offset = 'xs' | 'sm' | 'md' | 'lg' | 'xl'` (Task 3) → StickerButton 내부 사용 (`offset = size === 'sm' ? 'sm' : 'md'`) ✓
- `MapScreen.onPinTap` (Task 9) → App.tsx Single Device의 `onPinTap={(id) => ...}` 일치 ✓
- `PokeModal` props `open / target / onClose / onSend` (Task 11) → App.tsx 호출부 일치 ✓
- `Screen = 'map' | 'region-detail'` (Task 12, 13) → 일관 ✓
- `TabKey = 'map' | 'activity' | 'my'` (Task 7) → MapScreen `<TabBar active="map" />` ✓
- `Chip.size?: 'sm' | 'md'` (Task 5) → RegionDetail에서 `<Chip size="sm">` 사용 ✓
- `CoinBadge.size?: 'sm' | 'md' | 'lg'` (Task 5) → PokeModal에서 `size="md"` 사용 ✓

이슈 없음.
