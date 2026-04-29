import StickerCard from '../components/StickerCard';
import CompanionAvatar from '../components/CompanionAvatar';
import TabBar, { TabKey } from '../components/TabBar';
import { chatPreviews } from '../data/chats';

export type ChatListScreenProps = {
  onTab?: (key: TabKey) => void;
};

export default function ChatListScreen({ onTab }: ChatListScreenProps) {
  return (
    <div className="relative w-full h-full bg-cream overflow-hidden flex flex-col">
      <div className="px-4 pt-6 pb-3 border-b-[1.5px] border-outline">
        <h1 className="text-[24px] font-extrabold text-outline">채팅</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 pb-20">
        {chatPreviews.map((c) => (
          <StickerCard key={c.id} offset="sm" rounded="lg" pressable className="p-3">
            <div className="flex gap-3 items-center">
              <CompanionAvatar
                fallbackBg={c.avatarBg}
                fallbackLetter={c.nickname[0]}
                size={52}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-extrabold text-[15px] text-outline truncate">{c.nickname}</span>
                  <span className="text-[11px] font-mono text-textMuted shrink-0">{c.time}</span>
                </div>
                <p className="text-[13px] text-textMuted mt-0.5 truncate">{c.lastMessage}</p>
              </div>
              {c.unread && (
                <span className="bg-accentRed text-surface text-[11px] font-mono font-bold border-[2px] border-outline rounded-pill min-w-[22px] h-[22px] px-1.5 flex items-center justify-center">
                  {c.unread}
                </span>
              )}
            </div>
          </StickerCard>
        ))}
      </div>

      <TabBar active="chat" onTab={onTab} />
    </div>
  );
}
