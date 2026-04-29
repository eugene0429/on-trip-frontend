import { useState } from 'react';
import DeviceFrame from './components/DeviceFrame';
import RegionDetailScreen from './screens/RegionDetailScreen';
import PokeModal from './screens/PokeModal';
import { Companion } from './data/companions';

export default function App() {
  const [target, setTarget] = useState<Companion | null>(null);

  return (
    <div className="min-h-screen bg-surfaceMuted p-12 flex justify-center font-sans">
      <DeviceFrame label="Region Detail">
        <RegionDetailScreen
          regionId="gangnam"
          onBack={() => alert('back')}
          onPokeTap={(c) => setTarget(c)}
        />
        <PokeModal
          open={target !== null}
          target={target}
          onClose={() => setTarget(null)}
          onSend={(msg) => {
            alert(`콕 발사: ${msg || '(빈 메시지)'}`);
            setTarget(null);
          }}
        />
      </DeviceFrame>
    </div>
  );
}
