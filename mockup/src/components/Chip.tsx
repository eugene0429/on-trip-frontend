import { ReactNode } from 'react';

export type ChipProps = {
  bg?: string;
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
