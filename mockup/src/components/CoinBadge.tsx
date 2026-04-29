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
