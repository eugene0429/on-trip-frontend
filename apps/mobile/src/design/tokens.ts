/**
 * 키치 스티커 디자인 토큰 (RN).
 * 단일 출처: design-system/on-trip/MASTER.md
 * mockup/src/tokens.ts 와 값 동기화 — 변경 시 둘 다 업데이트.
 */

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

export type ColorKey = keyof typeof colors;

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

export type ShadowKey = keyof typeof shadowOffsets;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const typography = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '800' as const },
  title: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const },
  subtitle: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '500' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
  numeric: { fontSize: 14, lineHeight: 18, fontWeight: '500' as const, fontFamily: 'JetBrainsMono' },
} as const;

export const borderWidths = {
  /** 인터랙티브/주요 컨테이너 */
  normal: 2.5,
  /** 보조 컨테이너 */
  thin: 1.5,
  /** Chip (작은 칩) */
  chip: 2,
} as const;

/**
 * Hard-offset sticker shadow.
 * iOS: shadowRadius 0 으로 블러 없음. Android: 동일한 효과를 위해 별도 View 로
 * 그림자 박스를 직접 렌더해야 함 — StickerCard 컴포넌트에서 처리.
 */
export const shadow = {
  ios: (offset: number) => ({
    shadowColor: colors.outline,
    shadowOffset: { width: offset, height: offset },
    shadowOpacity: 1,
    shadowRadius: 0,
  }),
} as const;

export const animation = {
  press: { duration: 100 },
  modalIn: { duration: 250 },
  modalOut: { duration: 180 },
  pageTransition: { duration: 300 },
} as const;
