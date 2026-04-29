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
  position: { x: number; y: number };
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
