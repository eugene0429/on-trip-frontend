import DeviceFrame from './components/DeviceFrame';
import RegionDetailScreen from './screens/RegionDetailScreen';

export default function App() {
  return (
    <div className="min-h-screen bg-surfaceMuted p-12 flex justify-center font-sans">
      <DeviceFrame label="Region Detail">
        <RegionDetailScreen
          regionId="gangnam"
          onBack={() => alert('back')}
          onPokeTap={(c) => alert(`poke ${c.nickname}`)}
        />
      </DeviceFrame>
    </div>
  );
}
