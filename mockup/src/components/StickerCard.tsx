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

type Rounded = 'sm' | 'md' | 'lg' | 'xl' | 'pill';

const ROUNDED_CLASS: Record<Rounded, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  pill: 'rounded-pill',
};

export type StickerCardProps = {
  offset?: Offset;
  rotate?: Rotate;
  bg?: string;
  border?: 'normal' | 'thin';
  rounded?: Rounded;
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
  const roundedClass = ROUNDED_CLASS[rounded];
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
