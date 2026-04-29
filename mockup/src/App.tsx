import { useState } from 'react';
import { ArrowRight, ArrowLeftRight } from 'lucide-react';
import DeviceFrame from './components/DeviceFrame';
import MapScreen from './screens/MapScreen';
import RegionDetailScreen from './screens/RegionDetailScreen';
import PokeModal from './screens/PokeModal';
import ChatListScreen from './screens/ChatListScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import StickerButton from './components/StickerButton';
import { TabKey } from './components/TabBar';
import { Companion, companions } from './data/companions';

type ViewMode = 'storyboard' | 'single';
type Screen = 'map' | 'region-detail' | 'chat-list' | 'my-profile';

const SCREEN_LABELS: Record<Screen, string> = {
  map: 'Map',
  'region-detail': 'Region Detail',
  'chat-list': 'Chat',
  'my-profile': 'My',
};

const TAB_TO_SCREEN: Record<TabKey, Screen> = {
  chat: 'chat-list',
  home: 'map',
  my: 'my-profile',
};

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('storyboard');
  const [currentScreen, setCurrentScreen] = useState<Screen>('map');
  const [activeRegionId, setActiveRegionId] = useState<string>('gangnam');
  const [pokeTarget, setPokeTarget] = useState<Companion | null>(null);

  const goToSingle = (screen: Screen, options?: { regionId?: string; openPoke?: boolean }) => {
    if (options?.regionId) setActiveRegionId(options.regionId);
    setCurrentScreen(screen);
    setPokeTarget(options?.openPoke ? companions[0] : null);
    setViewMode('single');
  };

  const handleTab = (key: TabKey) => {
    setCurrentScreen(TAB_TO_SCREEN[key]);
    setPokeTarget(null);
  };

  return (
    <div className="min-h-screen bg-surfaceMuted py-10 px-6 flex flex-col items-center font-sans gap-6">
      <div className="flex items-center gap-4 w-full max-w-7xl">
        <h1 className="text-[24px] font-extrabold text-outline">On-Trip Mockup</h1>
        <div className="flex-1" />
        {viewMode === 'storyboard' ? (
          <span className="text-[14px] text-textMuted">디바이스를 클릭하면 단일 모드로 진입합니다</span>
        ) : (
          <StickerButton
            variant="secondary"
            size="sm"
            onClick={() => setViewMode('storyboard')}
          >
            <span className="flex items-center gap-2"><ArrowLeftRight size={16} /> 스토리보드로</span>
          </StickerButton>
        )}
      </div>

      {viewMode === 'storyboard' ? (
        <Storyboard onDeviceTap={goToSingle} />
      ) : (
        <SingleDevice
          currentScreen={currentScreen}
          activeRegionId={activeRegionId}
          pokeTarget={pokeTarget}
          onPinTap={(id) => {
            setActiveRegionId(id);
            setCurrentScreen('region-detail');
          }}
          onBack={() => setCurrentScreen('map')}
          onPokeTap={(c) => setPokeTarget(c)}
          onPokeClose={() => setPokeTarget(null)}
          onPokeSend={() => setPokeTarget(null)}
          onTab={handleTab}
          screenLabel={SCREEN_LABELS[currentScreen]}
        />
      )}
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 self-center px-2">
      <ArrowRight size={36} color="#2A2A2A" strokeWidth={3} />
      <div className="bg-primary border-[2px] border-outline rounded-pill px-2 py-0.5 text-[11px] font-bold text-outline shadow-sticker-xs whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

type StoryboardProps = {
  onDeviceTap: (
    screen: Screen,
    options?: { regionId?: string; openPoke?: boolean }
  ) => void;
};

function Storyboard({ onDeviceTap }: StoryboardProps) {
  return (
    <div className="flex items-start gap-2">
      <DeviceFrame label="Map" onClick={() => onDeviceTap('map')}>
        <div className="pointer-events-none w-full h-full">
          <MapScreen />
        </div>
      </DeviceFrame>

      <FlowArrow label="핀 탭" />

      <DeviceFrame
        label="Region Detail"
        onClick={() => onDeviceTap('region-detail', { regionId: 'gangnam' })}
      >
        <div className="pointer-events-none w-full h-full">
          <RegionDetailScreen regionId="gangnam" />
        </div>
      </DeviceFrame>

      <FlowArrow label="콕 탭" />

      <DeviceFrame
        label="Poke Modal"
        onClick={() => onDeviceTap('region-detail', { regionId: 'gangnam', openPoke: true })}
      >
        <div className="pointer-events-none w-full h-full">
          <RegionDetailScreen regionId="gangnam" />
          <PokeModal
            open
            target={companions[0]}
            onClose={() => {}}
            onSend={() => {}}
          />
        </div>
      </DeviceFrame>
    </div>
  );
}

type SingleDeviceProps = {
  currentScreen: Screen;
  activeRegionId: string;
  pokeTarget: Companion | null;
  onPinTap: (id: string) => void;
  onBack: () => void;
  onPokeTap: (c: Companion) => void;
  onPokeClose: () => void;
  onPokeSend: (msg: string) => void;
  onTab: (key: TabKey) => void;
  screenLabel: string;
};

function SingleDevice({
  currentScreen,
  activeRegionId,
  pokeTarget,
  onPinTap,
  onBack,
  onPokeTap,
  onPokeClose,
  onPokeSend,
  onTab,
  screenLabel,
}: SingleDeviceProps) {
  return (
    <DeviceFrame label={screenLabel}>
      {currentScreen === 'map' && <MapScreen onPinTap={onPinTap} onTab={onTab} />}
      {currentScreen === 'region-detail' && (
        <RegionDetailScreen
          regionId={activeRegionId}
          onBack={onBack}
          onPokeTap={onPokeTap}
        />
      )}
      {currentScreen === 'chat-list' && <ChatListScreen onTab={onTab} />}
      {currentScreen === 'my-profile' && <MyProfileScreen onTab={onTab} />}
      <PokeModal
        open={pokeTarget !== null}
        target={pokeTarget}
        onClose={onPokeClose}
        onSend={onPokeSend}
      />
    </DeviceFrame>
  );
}
