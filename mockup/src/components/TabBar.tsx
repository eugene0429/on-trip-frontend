import { MessageCircle, Home, User } from 'lucide-react';

export type TabKey = 'chat' | 'home' | 'my';

const TABS: { key: TabKey; Icon: typeof Home; label: string }[] = [
  { key: 'chat', Icon: MessageCircle, label: '채팅' },
  { key: 'home', Icon: Home,          label: '홈' },
  { key: 'my',   Icon: User,          label: '마이' },
];

export type TabBarProps = {
  active: TabKey;
  onTab?: (key: TabKey) => void;
};

export default function TabBar({ active, onTab }: TabBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-surface border-t-[2.5px] border-outline flex">
      {TABS.map(({ key, Icon, label }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            onClick={() => onTab?.(key)}
            aria-label={label}
            className="flex-1 flex items-center justify-center relative"
          >
            {isActive && (
              <div className="absolute top-2 w-1.5 h-1.5 bg-primary rounded-pill border border-outline" />
            )}
            <Icon
              size={isActive ? 28 : 24}
              color="#2A2A2A"
              strokeWidth={isActive ? 2.75 : 2}
            />
          </button>
        );
      })}
    </div>
  );
}
