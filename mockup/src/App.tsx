import { useState } from 'react';
import StickerButton from './components/StickerButton';
import StickerInput from './components/StickerInput';

export default function App() {
  const [val, setVal] = useState('');
  return (
    <div className="min-h-screen bg-cream p-8 flex flex-col gap-4 max-w-md font-sans">
      <StickerButton variant="primary" fullWidth onClick={() => alert('primary')}>
        🚀 여행 왔어요
      </StickerButton>
      <StickerButton variant="secondary" fullWidth>보조 버튼</StickerButton>
      <StickerButton variant="danger" fullWidth>신고 / 차단</StickerButton>
      <StickerButton variant="ghost" fullWidth>고스트</StickerButton>
      <StickerButton variant="disabled" fullWidth>비활성</StickerButton>
      <StickerButton size="sm">인라인 sm</StickerButton>
      <StickerInput label="한 줄 메시지" placeholder="여기서 만날래요?" value={val} onChange={setVal} />
    </div>
  );
}
