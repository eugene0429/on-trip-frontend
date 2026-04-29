import { MapPin, Bell, User } from 'lucide-react';

type TabKey = 'map' | 'activity' | 'my';

const TABS: { key: TabKey; label: string; Icon: typeof MapPin }[] = [
  { key: 'map', label: 'Map', Icon: MapPin },
  { key: 'activity', label: 'Activity', Icon: Bell },
  { key: 'my', label: 'My', Icon: User },
];

export type TabBarProps = {
  active: TabKey;
};

export default function TabBar({ active }: TabBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-surface border-t-[2.5px] border-outline flex">
      {TABS.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <div key={key} className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
            {isActive && (
              <div className="absolute top-1.5 w-1.5 h-1.5 bg-primary rounded-pill border border-outline" />
            )}
            <Icon size={22} color="#2A2A2A" strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] ${isActive ? 'font-bold text-outline' : 'font-medium text-textMuted'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
