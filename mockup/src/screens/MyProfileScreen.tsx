import { Settings, Flag, LogOut, ChevronRight } from 'lucide-react';
import StickerCard from '../components/StickerCard';
import CoinBadge from '../components/CoinBadge';
import Chip from '../components/Chip';
import TabBar, { TabKey } from '../components/TabBar';

export type MyProfileScreenProps = {
  onTab?: (key: TabKey) => void;
};

const MENU = [
  { key: 'settings', label: '설정',     Icon: Settings },
  { key: 'reports',  label: '신고 내역', Icon: Flag },
  { key: 'logout',   label: '로그아웃',   Icon: LogOut },
];

export default function MyProfileScreen({ onTab }: MyProfileScreenProps) {
  return (
    <div className="relative w-full h-full bg-cream overflow-hidden flex flex-col">
      <div className="px-4 pt-6 pb-3 border-b-[1.5px] border-outline">
        <h1 className="text-[24px] font-extrabold text-outline">마이</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 pb-20">
        <StickerCard offset="md" rounded="lg" className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accentPink w-16 h-16 rounded-lg border-[2.5px] border-outline flex items-center justify-center text-[26px] font-extrabold text-outline">
              나
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-[18px] text-outline">서울여행자</div>
              <div className="text-[12px] text-textMuted mt-0.5 font-mono">@onTrip_2026</div>
              <div className="flex gap-1.5 mt-1.5">
                <Chip size="sm" bg="bg-primary">콕 12회</Chip>
                <Chip size="sm" bg="bg-accentLime">매칭 4회</Chip>
              </div>
            </div>
          </div>
        </StickerCard>

        <StickerCard offset="md" rounded="lg" className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CoinBadge count={12} size="md" />
            <div>
              <div className="text-[12px] text-textMuted">내 코인 잔액</div>
              <div className="font-extrabold text-[20px] font-mono text-outline">12 코인</div>
            </div>
          </div>
          <Chip bg="bg-primary">충전</Chip>
        </StickerCard>

        {MENU.map(({ key, label, Icon }) => (
          <StickerCard key={key} offset="sm" rounded="md" pressable className="p-3">
            <div className="flex items-center gap-3">
              <Icon size={20} color="#2A2A2A" strokeWidth={2.25} />
              <span className="flex-1 font-bold text-[15px] text-outline">{label}</span>
              <ChevronRight size={18} color="#6B6B6B" />
            </div>
          </StickerCard>
        ))}
      </div>

      <TabBar active="my" onTab={onTab} />
    </div>
  );
}
