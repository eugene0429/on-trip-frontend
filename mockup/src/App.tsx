import DeviceFrame from './components/DeviceFrame';
import MapScreen from './screens/MapScreen';

export default function App() {
  return (
    <div className="min-h-screen bg-surfaceMuted p-12 flex justify-center font-sans">
      <DeviceFrame label="Map">
        <MapScreen onPinTap={(id) => alert(`pin tapped: ${id}`)} />
      </DeviceFrame>
    </div>
  );
}
