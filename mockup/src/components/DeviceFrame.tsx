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
