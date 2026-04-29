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
  lg: 'h-14',
  md: 'h-12',
  sm: 'h-9',
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
