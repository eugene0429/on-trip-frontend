import StickerCard from './components/StickerCard';

export default function App() {
  return (
    <div className="min-h-screen bg-cream p-8 flex flex-wrap gap-8 font-sans">
      <StickerCard offset="sm" bg="bg-surface" className="p-4">
        <div className="font-bold">offset sm</div>
      </StickerCard>
      <StickerCard offset="md" bg="bg-primary" rotate={-1} className="p-4">
        <div className="font-bold">offset md, rotate -1</div>
      </StickerCard>
      <StickerCard offset="lg" bg="bg-accentPink" rotate={1} className="p-4">
        <div className="font-bold">offset lg, rotate +1</div>
      </StickerCard>
      <StickerCard offset="md" bg="bg-accentRed" pressable className="p-4">
        <div className="font-bold text-surface">pressable (눌러보기)</div>
      </StickerCard>
    </div>
  );
}
