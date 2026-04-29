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

function rotateForId(id: number): -1 | 0 | 1 {
  const m = id % 3;
  return (m === 0 ? -1 : m === 1 ? 0 : 1) as -1 | 0 | 1;
}

export default function RegionDetailScreen({ regionId, onBack, onPokeTap }: RegionDetailScreenProps) {
  const region = regions.find((r) => r.id === regionId) ?? regions[0];

  return (
    <div className="relative w-full h-full bg-cream overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-cream z-10 border-b-[1.5px] border-outline">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center" aria-label="뒤로">
          <ArrowLeft size={22} color="#2A2A2A" strokeWidth={2.5} />
        </button>
        <h1 className="flex-1 text-[20px] font-extrabold text-outline">{region.name}</h1>
        <Chip bg="bg-primary"><span className="font-mono">{region.count}명</span></Chip>
      </div>

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
