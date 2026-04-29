import { Bell, User, Crosshair, Rocket } from 'lucide-react';
import StickerCard from '../components/StickerCard';
import StickerButton from '../components/StickerButton';
import PinMarker from '../components/PinMarker';
import TabBar from '../components/TabBar';
import Chip from '../components/Chip';
import { regions } from '../data/regions';

export type MapScreenProps = {
  onPinTap?: (regionId: string) => void;
};

export default function MapScreen({ onPinTap }: MapScreenProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between">
        <Chip bg="bg-primary"><span className="font-extrabold tracking-tight">On-Trip</span></Chip>
        <div className="flex gap-2">
          <StickerCard offset="xs" rounded="pill" className="w-9 h-9 flex items-center justify-center relative">
            <Bell size={18} color="#2A2A2A" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accentRed rounded-pill border-[1.5px] border-outline" />
          </StickerCard>
          <StickerCard offset="xs" rounded="pill" className="w-9 h-9 flex items-center justify-center">
            <User size={18} color="#2A2A2A" />
          </StickerCard>
        </div>
      </div>

      <img src="/seoul-map.svg" alt="Seoul map placeholder" className="absolute inset-0 w-full h-full object-cover" />

      <div className="absolute inset-x-0" style={{ top: 80, bottom: 160 }}>
        <div className="relative w-full h-full">
          {regions.map((r) => (
            <PinMarker
              key={r.id}
              count={r.count}
              name={r.name}
              position={{ x: r.x, y: r.y }}
              onClick={() => onPinTap?.(r.id)}
            />
          ))}
        </div>
      </div>

      <div className="absolute right-4 bottom-40 z-20">
        <StickerCard offset="sm" rounded="pill" className="w-12 h-12 flex items-center justify-center" pressable>
          <Crosshair size={20} color="#2A2A2A" strokeWidth={2.5} />
        </StickerCard>
      </div>

      <div className="absolute bottom-20 left-4 right-4 z-20">
        <StickerButton variant="primary" fullWidth>
          <span className="flex items-center gap-2"><Rocket size={20} /> 여행 왔어요</span>
        </StickerButton>
      </div>

      <TabBar active="map" />
    </div>
  );
}
