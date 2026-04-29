import DeviceFrame from './components/DeviceFrame';
import TabBar from './components/TabBar';

export default function App() {
  return (
    <div className="min-h-screen bg-surfaceMuted p-12 flex justify-center font-sans">
      <DeviceFrame label="Map" onClick={() => alert('clicked')}>
        <div className="p-6">
          <h1 className="text-[28px] font-extrabold text-outline">디바이스 프레임 테스트</h1>
          <p className="mt-2 text-textMuted">390 × 844 — 클릭하면 alert</p>
        </div>
        <TabBar active="map" />
      </DeviceFrame>
    </div>
  );
}
