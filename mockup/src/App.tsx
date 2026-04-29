import Chip from './components/Chip';
import CoinBadge from './components/CoinBadge';

export default function App() {
  return (
    <div className="min-h-screen bg-cream p-8 flex flex-col gap-6 font-sans">
      <div className="flex gap-2 flex-wrap">
        <Chip>맛집</Chip>
        <Chip bg="bg-primary">술자리</Chip>
        <Chip bg="bg-accentPink">액티비티</Chip>
        <Chip bg="bg-accentLime">관광</Chip>
        <Chip size="sm">sm</Chip>
      </div>
      <div className="flex gap-3 items-center">
        <CoinBadge count={3} size="sm" />
        <CoinBadge count={12} size="md" />
        <CoinBadge count={99} size="lg" />
      </div>
    </div>
  );
}
