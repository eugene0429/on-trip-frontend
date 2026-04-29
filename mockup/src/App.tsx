import { useState } from 'react';
import DeviceFrame from './components/DeviceFrame';
import MapScreen from './screens/MapScreen';
import RegionDetailScreen from './screens/RegionDetailScreen';
import PokeModal from './screens/PokeModal';
import { Companion } from './data/companions';

type Screen = 'map' | 'region-detail';

const SCREEN_LABELS: Record<Screen, string> = {
  map: 'Map',
  'region-detail': 'Region Detail',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('map');
  const [activeRegionId, setActiveRegionId] = useState<string>('gangnam');
  const [pokeTarget, setPokeTarget] = useState<Companion | null>(null);

  return (
    <div className="min-h-screen bg-surfaceMuted py-12 px-6 flex flex-col items-center font-sans gap-4">
      <h1 className="text-[20px] font-extrabold text-outline">On-Trip Mockup — Single Device</h1>

      <DeviceFrame label={SCREEN_LABELS[currentScreen]}>
        {currentScreen === 'map' && (
          <MapScreen
            onPinTap={(id) => {
              setActiveRegionId(id);
              setCurrentScreen('region-detail');
            }}
          />
        )}
        {currentScreen === 'region-detail' && (
          <RegionDetailScreen
            regionId={activeRegionId}
            onBack={() => setCurrentScreen('map')}
            onPokeTap={(c) => setPokeTarget(c)}
          />
        )}
        <PokeModal
          open={pokeTarget !== null}
          target={pokeTarget}
          onClose={() => setPokeTarget(null)}
          onSend={() => setPokeTarget(null)}
        />
      </DeviceFrame>
    </div>
  );
}
