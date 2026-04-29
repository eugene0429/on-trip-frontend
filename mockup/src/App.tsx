import PinMarker from './components/PinMarker';

export default function App() {
  return (
    <div className="min-h-screen bg-cream p-8 font-sans">
      <div className="relative w-[600px] h-[400px] bg-surfaceMuted border-[2.5px] border-outline rounded-lg">
        <PinMarker count={3}  name="잠실"  position={{ x: 20, y: 30 }} />
        <PinMarker count={12} name="이태원" position={{ x: 45, y: 50 }} />
        <PinMarker count={45} name="신촌"  position={{ x: 70, y: 30 }} />
        <PinMarker count={88} name="강남"  position={{ x: 50, y: 80 }} />
      </div>
    </div>
  );
}
