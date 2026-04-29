import { ArrowLeft, Users, Hand, Calendar } from 'lucide-react';
import StickerCard from '../components/StickerCard';
import Chip from '../components/Chip';
import CompanionAvatar from '../components/CompanionAvatar';
import { companions, Companion } from '../data/companions';
import { regions } from '../data/regions';

const GENDER_BG: Record<Companion['genderMix'], string> = {
  남: 'bg-surface',
  여: 'bg-accentPink',
  혼성: 'bg-accentLime',
};

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

      <div className="px-4 pt-3 pb-1 flex items-center gap-1.5 text-[12px] text-textMuted">
        <Hand size={13} strokeWidth={2.25} />
        <span>카드를 탭하면 콕을 보낼 수 있어요</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-5 pb-6">
        {companions.map((c) => (
          <StickerCard
            key={c.id}
            offset="md"
            rotate={rotateForId(c.id)}
            rounded="lg"
            className="p-3.5"
            pressable
            onClick={() => onPokeTap?.(c)}
          >
            <div className="flex gap-3.5 items-stretch">
              <CompanionAvatar
                photoUrl={c.photoUrl}
                fallbackBg={c.avatarBg}
                fallbackLetter={c.nickname[0]}
                width={96}
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-extrabold text-[17px] text-outline truncate leading-tight">
                    {c.nickname}
                  </span>
                  <Chip size="sm" bg={GENDER_BG[c.genderMix]}>{c.genderMix}</Chip>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-mono">
                  <span className="inline-flex items-center gap-1 text-outline font-semibold">
                    <Users size={12} strokeWidth={2.5} />
                    {c.groupSize}명
                  </span>
                  <span className="text-outline opacity-30">·</span>
                  <span className="text-outline font-semibold">평균 {c.avgAge}세</span>
                </div>
                <p className="text-[13.5px] text-outline leading-snug line-clamp-2">
                  {c.intro}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t-[1.5px] border-dashed border-outline/30 flex items-center gap-2">
              <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
                {c.tags.map((t) => (
                  <Chip key={t} size="sm" bg="bg-surfaceMuted">{t}</Chip>
                ))}
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-[12px] font-mono font-semibold text-outline">
                <Calendar size={12} strokeWidth={2.25} />
                <span>{c.travelPeriod}</span>
              </div>
            </div>
          </StickerCard>
        ))}
      </div>
    </div>
  );
}
